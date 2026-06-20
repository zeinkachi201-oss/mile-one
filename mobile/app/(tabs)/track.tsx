import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { api, RoutePoint } from '../../services/api';
import { getSocket } from '../../services/socket';
import { colors } from '../../constants/theme';

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
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos((pts[i-1].lat * Math.PI) / 180) * Math.cos((pts[i].lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    total += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  return total;
}

export default function Track() {
  const [running, setRunning] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const [route, setRoute] = useState<RoutePoint[]>([]);
  const [distance, setDistance] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const locationSub = useRef<Location.LocationSubscription | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const mapRef = useRef<MapView>(null);

  async function startRun() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Location permission is required to track runs');
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
      locationSub.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 5 },
        (loc) => {
          const pt: RoutePoint = { lat: loc.coords.latitude, lng: loc.coords.longitude, timestamp: loc.timestamp };
          setRoute((prev) => { const next = [...prev, pt]; setDistance(calcDistance(next)); return next; });
          getSocket()?.emit('location_update', { runId: run.id, lat: pt.lat, lng: pt.lng });
          mapRef.current?.animateToRegion({ latitude: loc.coords.latitude, longitude: loc.coords.longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 });
        }
      );
    } catch (e: any) { Alert.alert('Error', e.message); }
  }

  async function stopRun() {
    if (!runId) return;
    locationSub.current?.remove();
    if (timer.current) clearInterval(timer.current);
    setRunning(false);
    try {
      await api.runs.end(runId, { distance, duration: elapsed, route });
      Alert.alert('Run saved!', `${distance.toFixed(2)} km in ${formatTime(elapsed)}`);
    } catch (e: any) { Alert.alert('Error saving run', e.message); }
    setRunId(null);
  }

  useEffect(() => () => {
    locationSub.current?.remove();
    if (timer.current) clearInterval(timer.current);
  }, []);

  const pace = distance > 0 ? elapsed / 60 / distance : 0;

  return (
    <SafeAreaView style={s.container}>
      <MapView
        ref={mapRef}
        style={s.map}
        showsUserLocation
        followsUserLocation={running}
        initialRegion={{ latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
      >
        {route.length > 1 && (
          <Polyline
            coordinates={route.map((p) => ({ latitude: p.lat, longitude: p.lng }))}
            strokeColor={colors.brand}
            strokeWidth={4}
          />
        )}
      </MapView>

      <View style={s.statsPanel}>
        {[
          { value: distance.toFixed(2), label: 'km' },
          { value: formatTime(elapsed), label: 'time' },
          { value: distance > 0 ? pace.toFixed(1) : '--', label: 'min/km' },
        ].map((stat) => (
          <View key={stat.label} style={s.stat}>
            <Text style={[s.statValue, running && { color: colors.brand }]}>{stat.value}</Text>
            <Text style={s.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {running && (
        <View style={s.liveRow}>
          <View style={s.liveDot} />
          <Text style={s.liveText}>Tracking live</Text>
        </View>
      )}

      <TouchableOpacity
        style={[s.runBtn, running ? s.stopBtn : s.startBtn]}
        onPress={running ? stopRun : startRun}
      >
        <Text style={s.runBtnText}>{running ? 'End Run' : 'Start Run'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  map: { flex: 1 },
  statsPanel: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 16, justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: colors.border },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 26, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2, fontWeight: '600' },
  liveRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 6, backgroundColor: '#ECFDF5' },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent, marginRight: 6 },
  liveText: { fontSize: 12, fontWeight: '700', color: colors.accent },
  runBtn: { margin: 16, borderRadius: 16, padding: 18, alignItems: 'center' },
  startBtn: { backgroundColor: colors.brand },
  stopBtn: { backgroundColor: '#EF4444' },
  runBtnText: { color: '#fff', fontWeight: '800', fontSize: 18 },
});
