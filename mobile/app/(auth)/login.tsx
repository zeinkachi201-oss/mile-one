import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../constants/theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);

  async function handleLogin() {
    if (!email || !password) return Alert.alert('Error', 'Fill in all fields');
    setLoading(true);
    try {
      await login(email, password);
    } catch (e: any) {
      Alert.alert('Login failed', e.message);
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
        <Text style={styles.tagline}>Keep Moving Together</Text>
      </View>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log In</Text>}
      </TouchableOpacity>
      <Link href="/(auth)/signup" style={styles.link}>
        New here? <Text style={styles.linkBold}>Create account</Text>
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
