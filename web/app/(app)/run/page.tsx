'use client';
import { useState, useEffect, useRef } from 'react';
import { api, RoutePoint } from '../../../lib/api';
import { getSocket } from '../../../lib/socket';

function formatTime(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function calcDistance(pts: RoutePoint[]) {
  if (pts.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const R = 6371;
    const dLat = ((pts[i].lat - pts[i - 1].lat) * Math.PI) / 180;
    const dLng = ((pts[i].lng - pts[i - 1].lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((pts[i - 1].lat * Math.PI) / 180) *
        Math.cos((pts[i].lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    total += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  return total;
}

export default function RunPage() {
  const [running, setRunning] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const [route, setRoute] = useState<RoutePoint[]>([]);
  const [distance, setDistance] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const watchId = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawRoute();
  }, [route]);

  function drawRoute() {
    const canvas = canvasRef.current;
    if (!canvas || route.length < 2) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const lats = route.map((p) => p.lat);
    const lngs = route.map((p) => p.lng);
    const minLat = Math.min(...lats), maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
    const pad = 20;
    const w = canvas.width - pad * 2;
    const h = canvas.height - pad * 2;

    const toX = (lng: number) =>
      maxLng === minLng ? canvas.width / 2 : pad + ((lng - minLng) / (maxLng - minLng)) * w;
    const toY = (lat: number) =>
      maxLat === minLat ? canvas.height / 2 : pad + ((maxLat - lat) / (maxLat - minLat)) * h;

    const grad = ctx.createLinearGradient(toX(route[0].lng), toY(route[0].lat), toX(route[route.length-1].lng), toY(route[route.length-1].lat));
    grad.addColorStop(0, '#6366F1');
    grad.addColorStop(1, '#10B981');

    ctx.beginPath();
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    route.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(toX(pt.lng), toY(pt.lat));
      else ctx.lineTo(toX(pt.lng), toY(pt.lat));
    });
    ctx.stroke();

    const last = route[route.length - 1];
    ctx.beginPath();
    ctx.fillStyle = '#10B981';
    ctx.arc(toX(last.lng), toY(last.lat), 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  async function startRun() {
    setError('');
    setSaved(false);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    try {
      const run = await api.runs.start({});
      setRunId(run.id);
      setRoute([]);
      setDistance(0);
      setElapsed(0);
      setRunning(true);

      timer.current = setInterval(() => setElapsed((e) => e + 1), 1000);

      watchId.current = navigator.geolocation.watchPosition(
        (pos) => {
          const pt: RoutePoint = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            timestamp: pos.timestamp,
          };
          setRoute((prev) => {
            const next = [...prev, pt];
            setDistance(calcDistance(next));
            return next;
          });
          getSocket()?.emit('location_update', { runId: run.id, lat: pt.lat, lng: pt.lng });
        },
        (err) => setError('Location error: ' + err.message),
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function stopRun() {
    if (!runId) return;
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    if (timer.current) clearInterval(timer.current);
    setRunning(false);
    try {
      await api.runs.end(runId, { distance, duration: elapsed, route });
      setSaved(true);
    } catch (e: any) {
      setError('Error saving run: ' + e.message);
    }
    setRunId(null);
  }

  useEffect(() => {
    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const pace = distance > 0 ? elapsed / 60 / distance : 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Track Run</h1>
        <p className="text-gray-400 text-sm mt-1">Live GPS tracking with your club</p>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl px-4 py-3 mb-4 font-medium text-sm">
          Run saved! {distance.toFixed(2)} km in {formatTime(elapsed)}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-500 rounded-xl px-4 py-3 mb-4 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Distance', value: `${distance.toFixed(2)} km` },
          { label: 'Time', value: formatTime(elapsed) },
          { label: 'Pace', value: distance > 0 ? `${pace.toFixed(1)} min/km` : '--' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
            <p className={`text-2xl font-extrabold ${running ? 'text-brand' : 'text-gray-400'}`}>{s.value}</p>
            <p className="text-gray-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-6 relative">
        <canvas
          ref={canvasRef}
          width={700}
          height={320}
          className="w-full"
          style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}
        />
        {route.length < 2 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm pointer-events-none">
            {running ? 'Waiting for GPS signal...' : 'Route will appear here'}
          </div>
        )}
      </div>

      <button
        onClick={running ? stopRun : startRun}
        className={`w-full py-4 rounded-2xl text-white font-extrabold text-lg transition ${
          running ? 'bg-red-500 hover:bg-red-600' : 'bg-brand hover:bg-indigo-700'
        }`}
      >
        {running ? 'End Run' : 'Start Run'}
      </button>

      <div className="mt-4 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${running ? 'bg-accent animate-pulse' : 'bg-gray-300'}`} />
        <p className="text-sm text-gray-400">{running ? 'Tracking your run live' : 'Ready to run'}</p>
      </div>
    </div>
  );
}
