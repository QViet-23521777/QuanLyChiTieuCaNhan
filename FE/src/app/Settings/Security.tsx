import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SettingTemplate from '../../Components/SettingTemplate';
import { router } from 'expo-router';

export default function SecurityScreen() {
  return (
    <SettingTemplate title="Bảo Mật" style={{}}>

      <TouchableOpacity style={styles.row} onPress={() => router.push('/Settings/Fingerprint')}>
        <Text style={styles.rowText}>Bảo Mật Dấu Vân Tay</Text>
        <Ionicons name="chevron-forward" size={22} color="#000" />
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity style={styles.row} onPress={() => router.push('/Settings/TermOfService')}>
        <Text style={styles.rowText}>Điều Khoản Sử Dụng</Text>
        <Ionicons name="chevron-forward" size={22} color="#000" />
      </TouchableOpacity>
      <View style={styles.divider} />
    </SettingTemplate>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  rowText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Montserrat_700Bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#D6EAF8',
    width: '100%',
  },
});