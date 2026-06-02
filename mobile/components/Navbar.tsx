import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';

interface NavbarProps {
  title?: string;
  showBack?: boolean;
  rightIcon?: ReactNode;
}

export default function Navbar({ title, showBack, rightIcon }: NavbarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack ? (
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        ) : null}
        {!title ? (
          <Text style={styles.logo}>
            Auto<Text style={styles.logoAccent}>Flux</Text>
          </Text>
        ) : null}
      </View>

      {title ? <Text style={styles.title}>{title}</Text> : <View />}

      <View style={styles.right}>{rightIcon ?? <View style={styles.placeholder} />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingTop: 48,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: { marginRight: 8 },
  backIcon: { color: colors.white, fontSize: 22, fontWeight: '600' },
  logo: { fontSize: 22, fontWeight: '800', color: colors.white },
  logoAccent: { color: colors.accent },
  title: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  right: { flex: 1, alignItems: 'flex-end' },
  placeholder: { width: 24 },
});
