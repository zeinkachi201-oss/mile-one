import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  TextInput, Modal, Alert, ActivityIndicator, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api, Club } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../constants/theme';

export default function Clubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  async function load() {
    try { setClubs(await api.clubs.list()); } catch {}
    setLoading(false);
  }

  async function createClub() {
    if (!name) return Alert.alert('Error', 'Club name is required');
    try {
      await api.clubs.create({ name, description, location });
      setShowCreate(false);
      setName(''); setDescription(''); setLocation('');
      load();
    } catch (e: any) { Alert.alert('Error', e.message); }
  }

  async function joinClub(id: string) {
    try { await api.clubs.join(id); load(); } catch (e: any) { Alert.alert('Error', e.message); }
  }

  async function leaveClub(id: string) {
    Alert.alert('Leave club?', 'You can rejoin any time.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Leave', style: 'destructive', onPress: async () => { try { await api.clubs.leave(id); load(); } catch {} } },
    ]);
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return <View style={s.center}><ActivityIndicator color={colors.brand} size="large" /></View>;
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.headerRow}>
        <Text style={s.header}>Clubs</Text>
        <TouchableOpacity style={s.createBtn} onPress={() => setShowCreate(true)}>
          <Text style={s.createBtnText}>+ New Club</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={clubs}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ListEmptyComponent={
          <View style={s.emptyWrap}>
            <Text style={s.emptyIcon}>👟</Text>
            <Text style={s.emptyTitle}>No clubs yet</Text>
            <Text style={s.emptySub}>Create the first one!</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isOwner = item.owner_id === user?.id;
          return (
            <View style={s.card}>
              <View style={s.clubAvatar}>
                <Text style={s.clubAvatarText}>{item.name[0].toUpperCase()}</Text>
              </View>
              <View style={s.clubInfo}>
                <Text style={s.clubName}>{item.name}</Text>
                {item.location ? <Text style={s.clubMeta}>📍 {item.location}</Text> : null}
                <Text style={s.clubMeta}>{item.member_count || 0} members</Text>
                {item.description ? <Text style={s.clubDesc} numberOfLines={1}>{item.description}</Text> : null}
              </View>
              <View style={s.cardActions}>
                <TouchableOpacity style={s.chatBtn} onPress={() => router.push(`/chat/club/${item.id}` as any)}>
                  <Text style={s.chatBtnText}>Chat</Text>
                </TouchableOpacity>
                {!isOwner && (
                  <TouchableOpacity style={s.leaveBtn} onPress={() => leaveClub(item.id)}>
                    <Text style={s.leaveBtnText}>Leave</Text>
                  </TouchableOpacity>
                )}
                {isOwner && (
                  <View style={s.ownerBadge}><Text style={s.ownerBadgeText}>Owner</Text></View>
                )}
              </View>
            </View>
          );
        }}
      />

      <Modal visible={showCreate} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>New Club</Text>
            <TextInput style={s.input} placeholder="Club name *" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} />
            <TextInput
              style={[s.input, { height: 80 }]}
              placeholder="Description (optional)"
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <TextInput
              style={s.input}
              placeholder="City or neighborhood (optional)"
              placeholderTextColor={colors.textMuted}
              value={location}
              onChangeText={setLocation}
            />
            <TouchableOpacity style={s.button} onPress={createClub}>
              <Text style={s.buttonText}>Create Club</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowCreate(false)} style={s.cancelBtn}>
              <Text style={s.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  header: { fontSize: 28, fontWeight: '800', color: colors.text },
  createBtn: { backgroundColor: colors.brand, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20 },
  createBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  clubAvatar: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  clubAvatarText: { color: '#fff', fontWeight: '800', fontSize: 20 },
  clubInfo: { flex: 1 },
  clubName: { fontWeight: '700', fontSize: 16, color: colors.text },
  clubMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  clubDesc: { color: '#64748B', fontSize: 13, marginTop: 3 },
  cardActions: { alignItems: 'flex-end', gap: 6 },
  chatBtn: { backgroundColor: '#ECFDF5', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  chatBtnText: { color: colors.accent, fontWeight: '700', fontSize: 13 },
  leaveBtn: { backgroundColor: colors.bg, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  leaveBtnText: { color: colors.textMuted, fontWeight: '600', fontSize: 13 },
  ownerBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  ownerBadgeText: { color: colors.brand, fontWeight: '700', fontSize: 12 },
  emptyWrap: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  emptySub: { color: colors.textMuted, marginTop: 6, fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 22, fontWeight: '800', marginBottom: 16, color: colors.text },
  input: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bg, borderRadius: 12, padding: 14, marginBottom: 12, fontSize: 16 },
  button: { backgroundColor: colors.brand, borderRadius: 12, padding: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancelBtn: { alignItems: 'center', marginTop: 14 },
  cancelText: { color: colors.textMuted, fontSize: 16 },
});
