import { useEffect, useState, useRef } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api, Message, User } from '../../../services/api';
import { getSocket } from '../../../services/socket';
import { useAuthStore } from '../../../store/authStore';
import { colors } from '../../../constants/theme';

export default function DMChat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [other, setOther] = useState<User | null>(null);
  const [input, setInput] = useState('');
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    api.messages.dm(id).then(setMessages).catch(() => {});
    api.users.get(id).then(setOther).catch(() => {});

    const socket = getSocket();
    socket?.on('new_dm', (msg: Message) => {
      if (msg.sender_id === id || msg.dm_user_id === id) {
        setMessages((prev) => [...prev, msg]);
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
      }
    });

    return () => { socket?.off('new_dm'); };
  }, [id]);

  function send() {
    if (!input.trim()) return;
    const content = input.trim();
    setInput('');
    getSocket()?.emit('send_dm', { toUserId: id, content });
    api.messages.sendDm(id, content).catch(() => {});
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <View style={s.headerAvatar}>
          <Text style={s.headerAvatarText}>{other?.name?.[0]?.toUpperCase() ?? '?'}</Text>
        </View>
        <View>
          <Text style={s.title}>{other?.name || 'Direct Message'}</Text>
          {other?.bio ? <Text style={s.subtitle}>{other.bio}</Text> : null}
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          contentContainerStyle={{ padding: 12 }}
          ListEmptyComponent={<Text style={s.empty}>Start the conversation!</Text>}
          renderItem={({ item }) => {
            const mine = item.sender_id === user?.id;
            return (
              <View style={[s.bubbleWrap, mine ? s.mineWrap : s.theirsWrap]}>
                <View style={[s.bubble, mine ? s.mine : s.theirs]}>
                  <Text style={[s.bubbleText, mine && s.mineText]}>{item.content}</Text>
                </View>
              </View>
            );
          }}
        />
        <View style={s.inputRow}>
          <TextInput
            style={s.input}
            value={input}
            onChangeText={setInput}
            placeholder={`Message ${other?.name || ''}...`}
            placeholderTextColor={colors.textMuted}
            returnKeyType="send"
            onSubmitEditing={send}
          />
          <TouchableOpacity style={[s.sendBtn, !input.trim() && { opacity: 0.4 }]} onPress={send} disabled={!input.trim()}>
            <Text style={s.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { fontSize: 24, marginRight: 12, color: colors.brand },
  headerAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  headerAvatarText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  title: { fontSize: 16, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  bubbleWrap: { marginBottom: 8 },
  mineWrap: { alignItems: 'flex-end' },
  theirsWrap: { alignItems: 'flex-start' },
  bubble: { maxWidth: '80%', borderRadius: 16, padding: 11 },
  mine: { backgroundColor: colors.brand, borderBottomRightRadius: 4 },
  theirs: { backgroundColor: colors.card, borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 15, color: colors.text },
  mineText: { color: '#fff' },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: 60, fontSize: 15 },
  inputRow: { flexDirection: 'row', padding: 12, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border },
  input: { flex: 1, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bg, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, marginRight: 8, color: colors.text },
  sendBtn: { backgroundColor: colors.brand, borderRadius: 22, paddingHorizontal: 18, justifyContent: 'center' },
  sendText: { color: '#fff', fontWeight: '700' },
});
