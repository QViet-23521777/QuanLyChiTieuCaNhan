import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import SettingTemplate from '../../Components/SettingTemplate';
import { router } from 'expo-router';

export default function FingerprintScreen() {
  return (
    <SettingTemplate title="Bảo Mật Vân Tay" style={{}}>
      <TouchableOpacity style={styles.row} onPress={() => router.push('/Settings/AddFingerprint')}>
        <View style={styles.iconCircle}>
          <Ionicons name="add" size={28} color="#6EB5FF" />
        </View>
        <Text style={styles.rowText}>Thêm Dấu Vân Tay</Text>
        <Ionicons name="chevron-forward" size={22} color="#000" />
      </TouchableOpacity>
    </SettingTemplate>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 18,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E3F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rowText: {
    flex: 1,
    fontSize: 15,
    color: '#000',
    fontFamily: 'Montserrat_700Bold',
  },
});