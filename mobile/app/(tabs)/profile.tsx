import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, SafeAreaView, Alert, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api, Run } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../constants/theme';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api.runs.my().then(setRuns).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading || !user) {
    return <View style={s.center}><ActivityIndicator color={colors.brand} size="large" /></View>;
  }

  const validRuns = runs.filter((r) => r.pace && r.pace > 0);
  const avgPace = validRuns.length
    ? (validRuns.reduce((a, r) => a + (r.pace || 0), 0) / validRuns.length).toFixed(1)
    : '--';

  return (
    <SafeAreaView style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.heroCard}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{user.name[0].toUpperCase()}</Text>
          </View>
          <Text style={s.name}>{user.name}</Text>
          {user.bio ? <Text style={s.bio}>{user.bio}</Text> : null}
        </View>

        <TouchableOpacity style={s.proBanner} onPress={() => router.push('/pro' as any)}>
          <View>
            <Text style={s.proBannerTitle}>⚡ Mile One Pro</Text>
            <Text style={s.proBannerSub}>Unlock advanced analytics & unlimited clubs</Text>
          </View>
          <Text style={s.proBannerCta}>See plans →</Text>
        </TouchableOpacity>

        <View style={s.statsRow}>
          {[
            { value: Number(user.total_distance || 0).toFixed(1), label: 'Total km' },
            { value: String(runs.length), label: 'Runs' },
            { value: avgPace, label: 'Avg min/km' },
          ].map((stat) => (
            <View key={stat.label} style={s.stat}>
              <Text style={s.statValue}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Recent Runs</Text>
          {runs.length === 0 ? (
            <Text style={s.empty}>No runs yet — start one!</Text>
          ) : (
            runs.slice(0, 8).map((r) => (
              <View key={r.id} style={s.runRow}>
                <View>
                  <Text style={s.runTitle}>{r.title}</Text>
                  <Text style={s.runDate}>
                    {new Date(r.started_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Text>
                </View>
                <Text style={s.runDist}>{r.distance?.toFixed(2)} km</Text>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity
          style={s.logoutBtn}
          onPress={() => Alert.alert('Log out?', '', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log out', style: 'destructive', onPress: logout },
          ])}
        >
          <Text style={s.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
  heroCard: { alignItems: 'center', padding: 28, backgroundColor: colors.night },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 38 },
  name: { fontSize: 24, fontWeight: '800', color: '#fff' },
  bio: { color: '#94A3B8', marginTop: 4, textAlign: 'center', fontSize: 14 },
  proBanner: { backgroundColor: colors.pro, marginHorizontal: 16, marginTop: 14, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  proBannerTitle: { color: '#fff', fontWeight: '800', fontSize: 15 },
  proBannerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  proBannerCta: { color: '#fff', fontWeight: '700', fontSize: 13 },
  statsRow: { flexDirection: 'row', backgroundColor: colors.card, marginHorizontal: 16, marginTop: 12, borderRadius: 16, padding: 18, justifyContent: 'space-around', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.brand },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  section: { backgroundColor: colors.card, margin: 16, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12, color: colors.text },
  runRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.border },
  runTitle: { fontWeight: '600', color: colors.text, fontSize: 14 },
  runDate: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  runDist: { fontWeight: '700', color: colors.brand, fontSize: 14 },
  empty: { color: colors.textMuted, textAlign: 'center', paddingVertical: 20, fontSize: 14 },
  logoutBtn: { margin: 16, borderWidth: 1, borderColor: '#FCA5A5', borderRadius: 14, padding: 16, alignItems: 'center' },
  logoutText: { color: '#EF4444', fontWeight: '700', fontSize: 16 },
});
