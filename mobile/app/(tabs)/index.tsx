import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  RefreshControl, SafeAreaView, TouchableOpacity, TextInput,
} from 'react-native';
import { api, Post, Club } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../constants/theme';

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [content, setContent] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [posting, setPosting] = useState(false);
  const user = useAuthStore((s) => s.user);

  async function load() {
    try {
      const clubList = await api.clubs.list();
      setClubs(clubList);
      if (!selectedClub && clubList.length > 0) setSelectedClub(clubList[0].id);
      const allPosts = await Promise.all(clubList.map((c) => api.clubs.posts(c.id)));
      setPosts(
        allPosts.flat().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      );
    } catch {}
    setLoading(false);
    setRefreshing(false);
  }

  async function post() {
    if (!content.trim() || !selectedClub) return;
    setPosting(true);
    try {
      await api.clubs.post(selectedClub, content);
      setContent('');
      load();
    } catch {}
    setPosting(false);
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return <View style={s.center}><ActivityIndicator color={colors.brand} size="large" /></View>;
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.topBar}>
        <Text style={s.logo}>Mile One</Text>
        <View style={s.livePill}>
          <View style={s.liveDot} />
          <Text style={s.liveText}>Live</Text>
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.brand} />
        }
        ListHeaderComponent={
          clubs.length > 0 ? (
            <View style={s.composer}>
              <TextInput
                style={s.composerInput}
                placeholder="Share a run update..."
                placeholderTextColor={colors.textMuted}
                value={content}
                onChangeText={setContent}
                multiline
              />
              <TouchableOpacity
                style={[s.postBtn, (!content.trim() || posting) && { opacity: 0.4 }]}
                onPress={post}
                disabled={!content.trim() || posting}
              >
                <Text style={s.postBtnText}>{posting ? '...' : 'Post'}</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={s.emptyWrap}>
            <Text style={s.emptyIcon}>🏃</Text>
            <Text style={s.emptyTitle}>Your feed is empty</Text>
            <Text style={s.emptySub}>Join a club to see activity here</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.cardHeader}>
              <View style={s.avatar}>
                <Text style={s.avatarText}>{item.user_name?.[0]?.toUpperCase()}</Text>
              </View>
              <View>
                <Text style={s.userName}>{item.user_name}</Text>
                <Text style={s.time}>
                  {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </View>
            </View>
            <Text style={s.content}>{item.content}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  logo: { fontSize: 26, fontWeight: '800', color: colors.brand },
  livePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent, marginRight: 5 },
  liveText: { fontSize: 12, fontWeight: '700', color: colors.accent },
  composer: { backgroundColor: colors.card, borderRadius: 16, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  composerInput: { fontSize: 15, color: colors.text, minHeight: 60 },
  postBtn: { backgroundColor: colors.brand, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 9, alignSelf: 'flex-end', marginTop: 8 },
  postBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  userName: { fontWeight: '700', fontSize: 15, color: colors.text },
  time: { color: colors.textMuted, fontSize: 12, marginTop: 1 },
  content: { fontSize: 15, lineHeight: 22, color: '#334155' },
  emptyWrap: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  emptySub: { color: colors.textMuted, marginTop: 6, fontSize: 14 },
});
