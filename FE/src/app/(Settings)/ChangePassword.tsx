import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SettingTemplate from '@/src/Components/SettingTemplate';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = async () => {
    const savedPassword = await AsyncStorage.getItem('user_password');
    if (savedPassword && currentPassword !== savedPassword) {
      Alert.alert('Lỗi', 'Mật khẩu hiện tại không đúng!');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Nhập lại mật khẩu mới không khớp!');
      return;
    }
    await AsyncStorage.setItem('user_password', newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    Alert.alert('Thành công', 'Đổi mật khẩu thành công!');
  };

  return (
    <SettingTemplate title="Thay Đổi Mật Khẩu" style={{}}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Mật Khẩu Hiện Tại</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={!showCurrent}
            placeholder="●●●●●●●●"
            placeholderTextColor="#7a8fa6"
          />
          <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
            <Ionicons
              name={showCurrent ? 'eye' : 'eye-off'}
              size={22}
              color="#7a8fa6"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Mật Khẩu Mới</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNew}
            placeholder="●●●●●●●●"
            placeholderTextColor="#7a8fa6"
          />
          <TouchableOpacity onPress={() => setShowNew(!showNew)}>
            <Ionicons
              name={showNew ? 'eye' : 'eye-off'}
              size={22}
              color="#7a8fa6"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nhập Lại Mật Khẩu Mới</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirm}
            placeholder="●●●●●●●●"
            placeholderTextColor="#7a8fa6"
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <Ionicons
              name={showConfirm ? 'eye' : 'eye-off'}
              size={22}
              color="#7a8fa6"
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Đổi Mật Khẩu</Text>
      </TouchableOpacity>
    </SettingTemplate>
  );
}

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    color: '#222',
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D6EAF8',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 2,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#222',
    fontFamily: 'Montserrat_700Bold',
    paddingVertical: 10,
    letterSpacing: 4,
  },
  button: {
    backgroundColor: '#7EC6FF',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 8,
    alignSelf: 'center',
    width: 220,
  },
  buttonText: {
    color: '#000',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
  },
});