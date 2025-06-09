import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SettingTemplate from '@/src/Components/SettingTemplate';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import mainStyles from '@/src/styles/mainStyle';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DeleteAccountScreen() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const savedPassword = await AsyncStorage.getItem('user_password');
    if (password !== savedPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không đúng!');
      return;
    }
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    setModalVisible(false);
    await AsyncStorage.clear();
    Alert.alert('Tài khoản đã được xoá vĩnh viễn!');
    router.replace('/');
  };

  return (
    <SafeAreaView style={mainStyles.container}>
      <SafeAreaView style={[mainStyles.topSheet, { padding: 0 }]} />
      <View style={mainStyles.bottomeSheet}>

      <View style={styles.container}>
        <Text style={styles.question}>Bạn có chắc muốn xoá tài khoản?</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            • Hành động này sẽ xoá vĩnh viễn toàn bộ dữ liệu của bạn và bạn sẽ không thể khôi phục. Vui lòng lưu ý những điều sau trước khi tiếp tục:
          </Text>
          <Text style={styles.infoText}>
            • Tài khoản sẽ bị xoá, bao gồm cả các giao dịch liên quan bị xoá.
          </Text>
          <Text style={styles.infoText}>
            • Bạn sẽ không thể truy cập vào tài khoản hoặc bất kỳ thông tin liên quan nào.
          </Text>
          <Text style={styles.infoText}>
            • Hành động này không thể hoàn tác.
          </Text>
        </View>
        <Text style={styles.label}>Nhập mật khẩu để xác nhận</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder="●●●●●●●●"
            placeholderTextColor="#7a8fa6"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye' : 'eye-off'}
              size={22}
              color="#7a8fa6"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Đồng ý</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>
      </View>
      {/* Modal xác nhận xoá tài khoản */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Xoá Tài Khoản</Text>
            <Text style={styles.modalQuestion}>Bạn Đã Chắc Chắn Xoá Tài Khoản?</Text>
            <Text style={styles.modalDesc}>
              Bằng việc xoá tài khoản của bạn, bạn đồng ý rằng bạn đã hiểu rõ hậu quả của hành động này và đồng ý xoá vĩnh viễn tài khoản cùng toàn bộ dữ liệu liên quan.
            </Text>
            <TouchableOpacity style={styles.modalDeleteButton} onPress={confirmDelete}>
              <Text style={styles.modalDeleteButtonText}>Xoá</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelButtonText}>Huỷ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    alignItems: 'center',
    flex: 1,
  },
  question: {
    fontSize: 15,
    fontFamily: 'Montserrat_700Bold',
    color: '#145A5A',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#D6EAF8',
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    width: '100%',
  },
  infoText: {
    fontSize: 13,
    color: '#222',
    fontFamily: 'Montserrat_400Regular',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#222',
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 6,
    alignSelf: 'flex-start',
    marginLeft: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D6EAF8',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 2,
    marginBottom: 18,
    width: '100%',
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#222',
    fontFamily: 'Montserrat_700Bold',
    paddingVertical: 10,
    letterSpacing: 4,
  },
  deleteButton: {
    backgroundColor: '#7EC6FF',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    width: 220,
  },
  deleteButtonText: {
    color: '#000',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#D6EAF8',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    width: 220,
  },
  cancelButtonText: {
    color: '#145A5A',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 22,
    width: 300,
    alignItems: 'center',
    elevation: 6,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: 'Montserrat_700Bold',
    color: '#145A5A',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalQuestion: {
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 13,
    color: '#222',
    fontFamily: 'Montserrat_400Regular',
    marginBottom: 18,
    textAlign: 'center',
  },
  modalDeleteButton: {
    backgroundColor: '#7EC6FF',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    width: 160,
    marginBottom: 10,
  },
  modalDeleteButtonText: {
    color: '#000',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
  },
  modalCancelButton: {
    backgroundColor: '#D6EAF8',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    width: 160,
  },
  modalCancelButtonText: {
    color: '#145A5A',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
  },
});