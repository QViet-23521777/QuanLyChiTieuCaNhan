import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styleIndex from './index';

export default function ProfileScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('Tên');
  const [modalVisible, setModalVisible] = useState(false);

  // Load username from AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem('profile_username').then(name => {
      if (name) setUsername(name);
    });
  }, []);

  // Đăng xuất: Xoá dữ liệu và chuyển về màn hình đăng nhập
  const handleLogout = async () => {
    await AsyncStorage.clear();
    setModalVisible(false);
    router.replace('/'); // hoặc router.push('/login') nếu có màn login
  };

  return (
    <View style={styleProfile.container}>
      <View style={styleProfile.topBackground}>
        <Text style={styleProfile.header}>Thông Tin</Text>
        <TouchableOpacity style={styleProfile.bellBtn}>
          <Ionicons name="notifications-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styleProfile.avatarContainer}>
        <View style={styleProfile.avatarWrapper}>
          <Image
            source={require('@/assets/images/logo app.png')}
            style={styleProfile.avatar}
            resizeMode="cover"
          />
        </View>
        <Text style={styleProfile.name}>{username}</Text>
      </View>
      <View style={[styleProfile.menuItem, {alignItems: 'flex-start'}]}>
        <TouchableOpacity
          style={styleProfile.menuItem}
          onPress={() => router.push('../ProfileSetting')}
        >
          <View style={styleProfile.menuIcon}>
            <Ionicons name="person-outline" size={24} color="#fff" />
          </View>
          <Text style={styleProfile.menuText}>Thông Tin Cá Nhân</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styleProfile.menuItem} onPress={() => router.push('../Security')}>
          <View style={styleProfile.menuIcon}>
            <MaterialIcons name="security" size={24} color="#fff" />
          </View>
          <Text style={styleProfile.menuText}>Bảo Mật</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styleProfile.menuItem} onPress={() => router.push('../Settings')}>
          <View style={styleProfile.menuIcon}>
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </View>
          <Text style={styleProfile.menuText}>Cài Đặt</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styleProfile.menuItem} onPress={() => setModalVisible(true)}>
          <View style={styleProfile.menuIcon}>
            <FontAwesome5 name="sign-out-alt" size={20} color="#fff" />
          </View>
          <Text style={styleProfile.menuText}>Đăng Xuất</Text>
        </TouchableOpacity>
        {/* Modal xác nhận Đăng Xuất */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styleProfile.modalOverlay}>
            <View style={styleProfile.modalBox}>
              <Text style={styleProfile.modalTitle}>Đăng Xuất</Text>
              <Text style={styleProfile.modalQuestion}>Bạn chắc chắn muốn đăng xuất?</Text>
              <Text style={styleProfile.modalDesc}>
                Bạn sẽ cần đăng nhập lại để sử dụng ứng dụng.
              </Text>
              <TouchableOpacity style={styleProfile.modalDeleteButton} onPress={handleLogout}>
                <Text style={styleProfile.modalDeleteButtonText}>Đăng Xuất</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styleProfile.modalCancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styleProfile.modalCancelButtonText}>Huỷ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styleProfile = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6EB5FF' },
  topBackground: {
    height: 100,
    backgroundColor: '#6EB5FF',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 0,
    position: 'relative',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    marginTop: 40,
    fontFamily: 'Montserrat_700Bold',
  },
  bellBtn: {
    position: 'absolute',
    top: 48,
    right: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
    zIndex: 2,
  },
  avatarWrapper: {
    width: 105,
    height: 105,
    borderRadius: 55,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 0,
    textAlign: 'center',
  },
  menu: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flex: 1,
    paddingTop: 56,
    paddingHorizontal: 24,
    marginTop: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4DB6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  menuText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  // Modal styleProfile
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