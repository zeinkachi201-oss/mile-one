import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api, DMConversation, Club } from '../../services/api';
import { colors } from '../../constants/theme';

export default function Messages() {
  const [dms, setDms] = useState<DMConversation[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [tab, setTab] = useState<'clubs' | 'dms'>('clubs');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    Promise.all([api.messages.dmList(), api.clubs.list()])
      .then(([d, c]) => { setDms(d); setClubs(c); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <View style={s.center}><ActivityIndicator color={colors.brand} size="large" /></View>;
  }

  return (
    <SafeAreaView style={s.container}>
      <Text style={s.header}>Messages</Text>

      <View style={s.tabRow}>
        {(['clubs', 'dms'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[s.tab, tab === t && s.activeTab]}
            onPress={() => setTab(t)}
          >
            <Text style={[s.tabText, tab === t && s.activeTabText]}>
              {t === 'clubs' ? '👥 Clubs' : '💬 Direct'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'clubs' ? (
        <FlatList
          data={clubs}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ListEmptyComponent={<Text style={s.empty}>Join a club to start chatting</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity style={s.row} onPress={() => router.push(`/chat/club/${item.id}` as any)}>
              <View style={s.avatar}>
                <Text style={s.avatarText}>{item.name[0].toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.rowName}>{item.name}</Text>
                <Text style={s.rowSub}>Tap to open group chat</Text>
              </View>
              <Text style={s.chevron}>›</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={dms}
          keyExtractor={(d) => d.other_user}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ListEmptyComponent={<Text style={s.empty}>No direct messages yet</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity style={s.row} onPress={() => router.push(`/chat/dm/${item.other_user}` as any)}>
              <View style={[s.avatar, s.dmAvatar]}>
                <Text style={s.avatarText}>{item.other_name[0].toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.rowName}>{item.other_name}</Text>
                {item.last_message ? <Text style={s.rowSub} numberOfLines={1}>{item.last_message}</Text> : null}
              </View>
              <Text style={s.chevron}>›</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
  header: { fontSize: 28, fontWeight: '800', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, color: colors.text },
  tabRow: { flexDirection: 'row', backgroundColor: '#E2E8F0', marginHorizontal: 16, borderRadius: 12, padding: 4, marginBottom: 12 },
  tab: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  tabText: { color: colors.textMuted, fontWeight: '600', fontSize: 14 },
  activeTabText: { color: colors.brand },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 14, padding: 14, marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  avatar: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  dmAvatar: { borderRadius: 22 },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  rowName: { fontWeight: '700', fontSize: 15, color: colors.text },
  rowSub: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  chevron: { color: colors.textMuted, fontSize: 20, fontWeight: '300' },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: 60, fontSize: 16 },
});
