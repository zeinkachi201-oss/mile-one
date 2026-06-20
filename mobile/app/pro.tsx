import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  ScrollView, Alert, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../constants/theme';

const PLANS = [
  { id: 'monthly', label: 'Monthly', price: '$4.99', per: '/month', sub: 'Billed monthly', badge: null },
  { id: 'yearly', label: 'Yearly', price: '$39.99', per: '/year', sub: 'Just $3.33/month', badge: 'BEST VALUE' },
];

const PERKS = [
  { icon: '📊', title: 'Advanced Analytics', desc: 'Pace zones, weekly summaries, elevation charts' },
  { icon: '👥', title: 'Unlimited Clubs', desc: 'Join & create as many clubs as you want' },
  { icon: '⚡', title: 'Live Club Leaderboard', desc: 'Weekly distance rankings inside your club' },
  { icon: '📍', title: 'Route Export', desc: 'Export GPX files for Garmin, Strava & more' },
  { icon: '✅', title: 'Pro Badge', desc: 'Stand out on your profile and in club chats' },
  { icon: '🔔', title: 'Priority Support', desc: 'Get help faster, always' },
];

export default function Pro() {
  const [selected, setSelected] = useState('yearly');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleSubscribe() {
    setLoading(true);
    // TODO: integrate RevenueCat — Purchases.purchaseProduct(selected === 'yearly' ? 'mile_one_pro_yearly' : 'mile_one_pro_monthly')
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Coming soon!', 'In-app purchases will be live when the app is published to the App Store and Play Store.');
    }, 800);
  }

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={s.hero}>
          <TouchableOpacity style={s.closeBtn} onPress={() => router.back()}>
            <Text style={s.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={s.heroIcon}>⚡</Text>
          <Text style={s.heroTitle}>Mile One Pro</Text>
          <Text style={s.heroSub}>Run further. Connect deeper. Track smarter.</Text>
        </View>

        <View style={s.plans}>
          {PLANS.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[s.planCard, selected === plan.id && s.planCardActive]}
              onPress={() => setSelected(plan.id)}
              activeOpacity={0.8}
            >
              {plan.badge && (
                <View style={s.badge}>
                  <Text style={s.badgeText}>{plan.badge}</Text>
                </View>
              )}
              <View style={[s.radio, selected === plan.id && s.radioActive]}>
                {selected === plan.id && <View style={s.radioInner} />}
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={[s.planLabel, selected === plan.id && { color: colors.brand }]}>{plan.label}</Text>
                <Text style={s.planSub}>{plan.sub}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[s.planPrice, selected === plan.id && { color: colors.brand }]}>{plan.price}</Text>
                <Text style={s.planPer}>{plan.per}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.perksSection}>
          <Text style={s.perksTitle}>Everything included</Text>
          {PERKS.map((p) => (
            <View key={p.title} style={s.perkRow}>
              <Text style={s.perkIcon}>{p.icon}</Text>
              <View style={s.perkText}>
                <Text style={s.perkTitle}>{p.title}</Text>
                <Text style={s.perkDesc}>{p.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[s.cta, loading && { opacity: 0.7 }]}
          onPress={handleSubscribe}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={s.ctaText}>{loading ? 'Processing...' : `Start Pro — ${PLANS.find(p => p.id === selected)?.price}${PLANS.find(p => p.id === selected)?.per}`}</Text>
        </TouchableOpacity>

        <Text style={s.legal}>
          Cancel any time. Subscriptions renew automatically unless cancelled at least 24 hours before the end of the billing period.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.night },
  hero: { alignItems: 'center', paddingTop: 20, paddingBottom: 32, paddingHorizontal: 24 },
  closeBtn: { position: 'absolute', top: 20, right: 24, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  closeText: { color: '#94A3B8', fontSize: 18, fontWeight: '600' },
  heroIcon: { fontSize: 52, marginBottom: 12 },
  heroTitle: { fontSize: 32, fontWeight: '800', color: '#fff', textAlign: 'center' },
  heroSub: { fontSize: 16, color: '#94A3B8', textAlign: 'center', marginTop: 8, lineHeight: 22 },
  plans: { paddingHorizontal: 16, gap: 10, marginBottom: 8 },
  planCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  planCardActive: { borderColor: colors.brand, backgroundColor: '#1E293B' },
  badge: { position: 'absolute', top: -10, right: 14, backgroundColor: colors.pro, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  badgeText: { color: '#fff', fontWeight: '800', fontSize: 10 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#475569', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: colors.brand },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.brand },
  planLabel: { fontWeight: '700', fontSize: 16, color: '#E2E8F0' },
  planSub: { color: '#64748B', fontSize: 12, marginTop: 2 },
  planPrice: { fontWeight: '800', fontSize: 20, color: '#E2E8F0' },
  planPer: { color: '#64748B', fontSize: 12 },
  perksSection: { marginHorizontal: 16, marginTop: 24 },
  perksTitle: { fontSize: 18, fontWeight: '700', color: '#E2E8F0', marginBottom: 16 },
  perkRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 18 },
  perkIcon: { fontSize: 24, marginRight: 14, marginTop: 2 },
  perkText: { flex: 1 },
  perkTitle: { fontWeight: '700', fontSize: 15, color: '#E2E8F0' },
  perkDesc: { color: '#64748B', fontSize: 13, marginTop: 2 },
  cta: { backgroundColor: colors.brand, marginHorizontal: 16, marginTop: 28, borderRadius: 16, padding: 18, alignItems: 'center' },
  ctaText: { color: '#fff', fontWeight: '800', fontSize: 17 },
  legal: { color: '#475569', fontSize: 11, textAlign: 'center', marginHorizontal: 24, marginTop: 16, lineHeight: 16 },
});
