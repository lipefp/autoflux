import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoArea}>
        <View style={styles.logoCircle}>
          <Ionicons name="car-sport" size={72} color={colors.accent} />
        </View>
        <Text style={styles.logoText}>AutoFlux</Text>
        <Text style={styles.tagline}>Autopeças na palma da mão</Text>
      </View>

      <View style={styles.buttonsArea}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => router.push('/login?role=client')}
        >
          <Ionicons name="person-outline" size={20} color={colors.white} style={styles.btnIcon} />
          <Text style={styles.btnPrimaryText}>Sou cliente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => router.push('/login?role=store')}
        >
          <Ionicons name="storefront-outline" size={20} color={colors.accent} style={styles.btnIcon} />
          <Text style={styles.btnSecondaryText}>Sou lojista</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.linkText}>Já tenho conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'space-between',
    paddingBottom: 48,
  },
  logoArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(244,128,26,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 8,
    fontWeight: '400',
  },
  buttonsArea: {
    paddingHorizontal: 32,
    gap: 14,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIcon: { marginRight: 8 },
  btnPrimaryText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  btnSecondary: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingVertical: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  btnSecondaryText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '700',
  },
  linkText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
});
