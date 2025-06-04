import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import SettingTemplate from '@/src/Components/SettingTemplate';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SettingTemplate title="Cài Đặt" style={{}}>
      <TouchableOpacity style={styles.row} onPress={() => router.push('/Settings/NotiSetting')}>
        <View style={styles.iconCircle}>
          <Ionicons name="notifications-outline" size={22} color="#6EB5FF" />
        </View>
        <Text style={styles.rowText}>Cài Đặt Thông Báo</Text>
        <Ionicons name="chevron-forward" size={22} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.row} onPress={() => router.push('/Settings/ChangePassword')}>
        <View style={styles.iconCircle}>
          <Ionicons name="lock-closed-outline" size={22} color="#6EB5FF" />
        </View>
        <Text style={styles.rowText}>Cài Đặt Mật Khẩu</Text>
        <Ionicons name="chevron-forward" size={22} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.row} onPress={() => router.push('/Settings/DeleteAccount')}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="account-remove-outline" size={22} color="#6EB5FF" />
        </View>
        <Text style={styles.rowText}>Xoá Tài Khoản</Text>
        <Ionicons name="chevron-forward" size={22} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.row} onPress={() => router.push('/Settings/AISettings')}>
        <View style={styles.iconCircle}>
          <Ionicons name="chatbubble-ellipses-outline" size={22} color="#6EB5FF" />
        </View>
        <Text style={styles.rowText}>AI ChatBot</Text>
        <Ionicons name="chevron-forward" size={22} color="#000" />
      </TouchableOpacity>
    </SettingTemplate>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E3F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rowText: {
    flex: 1,
    fontSize: 15,
    color: '#145A5A',
    fontFamily: 'Montserrat_700Bold',
  },
});

