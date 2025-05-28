// src/screens/SettingsScreen.tsx
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';

const SettingsScreen: React.FC = () => (
  <SafeAreaView style={styles.container}>
    <Text style={styles.text}>설정 화면</Text>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text:      { fontSize: 18, color: '#666' },
});

export default SettingsScreen;
