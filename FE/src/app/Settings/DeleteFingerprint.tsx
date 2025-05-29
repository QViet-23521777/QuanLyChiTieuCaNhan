import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SettingTemplate from '../../Components/SettingTemplate';
import { useRouter } from 'expo-router';

export default function DeleteFingerprintScreen() {
  const router = useRouter();

  const handleDelete = () => {
    // Xử lý xoá dấu vân tay ở đây
    Alert.alert('Đã xoá dấu vân tay!');
    router.back();
  };

  return (
    <SettingTemplate title="Dấu vân tay thứ 1" style={{}}>
      <View style={styles.container}>
        <View style={styles.fingerprintCircle}>
          <MaterialCommunityIcons name="fingerprint" size={80} color="#fff" />
        </View>
        <Text style={styles.title}>Dấu vân tay thứ 1</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Xoá</Text>
        </TouchableOpacity>
      </View>
    </SettingTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 32,
    flex: 1,
  },
  fingerprintCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#6EB5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
    color: '#000',
    marginBottom: 28,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#D6EAF8',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 60,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButtonText: {
    color: '#000',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
  },
});