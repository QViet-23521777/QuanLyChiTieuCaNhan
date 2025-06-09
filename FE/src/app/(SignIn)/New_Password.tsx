import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfirmPage from '../../Components/ConfirmPage';
import { SafeAreaView } from 'react-native-safe-area-context';
import mainStyles from '@/src/styles/mainStyle';

export default function NewPasswordScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [confirmStatus, setConfirmStatus] = useState<'success' | 'fail' | 'loading' | null>(null);

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const handleChangePassword = async () => {
    if (!password || !rePassword) {
      setConfirmStatus('fail');
      setTimeout(() => setConfirmStatus(null), 1500);
      return;
    }
    if (password !== rePassword) {
      setConfirmStatus('fail');
      setTimeout(() => setConfirmStatus(null), 1500);
      return;
    }
    setConfirmStatus('loading');
    try {
      await AsyncStorage.setItem('user_password', password);
      setTimeout(() => {
        setConfirmStatus('success');
        setTimeout(() => setConfirmStatus(null), 1200);
      }, 1200);
    } catch (e) {
      setConfirmStatus('fail');
      setTimeout(() => setConfirmStatus(null), 1500);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  if (confirmStatus) {
    return (
      <ConfirmPage
        status={confirmStatus === 'loading' ? 'loading' : confirmStatus}
        message={
          confirmStatus === 'success'
            ? 'Đổi mật khẩu thành công'
            : confirmStatus === 'fail'
            ? 'Không thể đổi mật khẩu'
            : undefined
        }
      />
    );
  }

  return (
    <SafeAreaView style={mainStyles.container}>
      <SafeAreaView style={[mainStyles.topSheet, {padding: 0}]}/>
      <View style={mainStyles.bottomeSheet}>
        <Text style={styles.label}>Nhập mật khẩu mới</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="••••••••"
            placeholderTextColor="#A0AFC0"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#A0AFC0" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Nhập lại mật khẩu mới</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="••••••••"
            placeholderTextColor="#A0AFC0"
            secureTextEntry={!showRePassword}
            value={rePassword}
            onChangeText={setRePassword}
          />
          <TouchableOpacity onPress={() => setShowRePassword(v => !v)}>
            <Ionicons name={showRePassword ? "eye-off-outline" : "eye-outline"} size={24} color="#A0AFC0" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.changeBtn} onPress={handleChangePassword}>
          <Text style={styles.changeBtnText}>Đổi mật khẩu</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#7EC6FF', alignItems: 'center' },
  topBackground: {
    width: '100%',
    height: 100,
    backgroundColor: '#7EC6FF',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 12,
  },
  header: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: 40 },
  formContainer: {
    backgroundColor: '#F4FFFA',
    borderRadius: 32,
    width: '100%',
    height: '100%',
    padding: 24,
    alignItems: 'center',
    marginTop: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  label: { alignSelf: 'flex-start', color: '#222', fontWeight: 'bold', marginTop: 16, marginBottom: 4 },
  input: {
    backgroundColor: '#D6EAF8',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    width: '100%',
    marginBottom: 8,
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  changeBtn: {
    backgroundColor: '#3887FE',
    borderRadius: 32,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 32,
    width: '100%',
    alignItems: 'center',
  },
  changeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
});