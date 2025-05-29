import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileSettingScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [darkTheme, setDarkTheme] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);

  // Load settings on mount
  useEffect(() => {
    (async () => {
      const savedUsername = await AsyncStorage.getItem('profile_username');
      const savedEmail = await AsyncStorage.getItem('profile_email');
      const savedDarkTheme = await AsyncStorage.getItem('profile_darkTheme');
      const savedPush = await AsyncStorage.getItem('profile_pushNotifications');
      if (savedUsername) setUsername(savedUsername);
      if (savedEmail) setEmail(savedEmail);
      if (savedDarkTheme) setDarkTheme(savedDarkTheme === 'true');
      if (savedPush) setPushNotifications(savedPush === 'true');
    })();
  }, []);

  // Save settings
  const handleSave = async () => {
    await AsyncStorage.setItem('profile_username', username);
    await AsyncStorage.setItem('profile_email', email);
    await AsyncStorage.setItem('profile_darkTheme', darkTheme.toString());
    await AsyncStorage.setItem('profile_pushNotifications', pushNotifications.toString());
    Alert.alert('Thành công', 'Đã lưu thông tin!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBackground}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.header}>Điều Chỉnh Thông Tin</Text>
      </View>
      <View style={styles.avatarContainer}>
        <View style={styles.avatarWrapper}>
          <Image
            source={require('../../../assets/logo app.png')}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.name}>{username}</Text>
      </View>
      <View style={styles.contentBox}>
        <Text style={styles.sectionTitle}>Thông Tin Tài Khoản</Text>
        <Text style={styles.label}>Tên Đăng Nhập</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder=""
          placeholderTextColor="#222"
        />
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder=""
          placeholderTextColor="#222"
        />
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Chế độ tối</Text>
          <Switch
            value={darkTheme}
            onValueChange={setDarkTheme}
            trackColor={{ false: "#D6EAF8", true: "#6EB5FF" }}
            thumbColor={darkTheme ? "#fff" : "#fff"}
          />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Thông báo đẩy</Text>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: "#D6EAF8", true: "#6EB5FF" }}
            thumbColor={pushNotifications ? "#fff" : "#fff"}
          />
        </View>
        <TouchableOpacity style={styles.updateBtn} onPress={handleSave}>
          <Text style={styles.updateBtnText}>Cập Nhật</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6EB5FF' },
  topBackground: {
    height: 100,
    backgroundColor: '#6EB5FF',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    paddingBottom: 0,
  },
  backBtn: {
    position: 'absolute',
    top: 64,
    left: 24,
    zIndex: 2,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    marginTop: 40,
    fontFamily: 'Montserrat_700Bold',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 8,
    zIndex: 2,
  },
  avatarWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
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
    fontFamily: 'Montserrat_700Bold',
  },
  contentBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 24,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 18,
    fontFamily: 'Montserrat_700Bold',
  },
  label: {
    fontSize: 15,
    color: '#000',
    marginBottom: 6,
    fontFamily: 'Montserrat_700Bold',
  },
  input: {
    backgroundColor: '#D6EAF8',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#222',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 15,
    color: '#000',
    fontFamily: 'Montserrat_700Bold',
  },
  updateBtn: {
    backgroundColor: '#6EB5FF',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
    alignSelf: 'center',
    width: 200,
  },
  updateBtnText: {
    color: '#fff',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 20,
  },
});