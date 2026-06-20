import { useState } from 'react';
import {
  Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, View, StatusBar,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../constants/theme';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const signup = useAuthStore((s) => s.signup);

  async function handleSignup() {
    if (!name || !email || !password) return Alert.alert('Error', 'Fill in all fields');
    setLoading(true);
    try {
      await signup(name, email, password);
    } catch (e: any) {
      Alert.alert('Sign up failed', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.logoWrap}>
        <Text style={styles.logo}>Mile One</Text>
        <Text style={styles.tagline}>Start your running journey</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor={colors.textMuted}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.textMuted}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.textMuted}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Get Started Free</Text>}
      </TouchableOpacity>
      <Link href="/(auth)/login" style={styles.link}>
        Already running? <Text style={styles.linkBold}>Log in</Text>
      </Link>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  logoWrap: { alignItems: 'center', marginBottom: 48 },
  logo: { fontSize: 40, fontWeight: '800', color: colors.brand },
  tagline: { fontSize: 15, color: colors.textMuted, marginTop: 4 },
  input: {
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bg,
    borderRadius: 14, padding: 16, marginBottom: 12, fontSize: 16, color: colors.text,
  },
  button: { backgroundColor: colors.brand, borderRadius: 14, padding: 17, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { marginTop: 24, textAlign: 'center', color: colors.textMuted, fontSize: 14 },
  linkBold: { color: colors.brand, fontWeight: '700' },
});
