import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

export default function SecurityPinScreen() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, idx: number) => {
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[idx] = text;
      setOtp(newOtp);
      if (text && idx < 5) {
        inputs.current[idx + 1]?.focus();
      }
      if (!text && idx > 0) {
        inputs.current[idx - 1]?.focus();
      }
    }
  };
    let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    });

    if (!fontsLoaded) {
    return null; // or <AppLoading />
    }
  return (
    <View style={styles.container}>
      <View style={styles.topBackground}>
        <Text style={styles.header}>Mã Bảo Mật</Text>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Nhập Mã OTP:</Text>
        <View style={styles.otpRow}>
          {otp.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={ref => (inputs.current[idx] = ref)}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={text => handleChange(text, idx)}
              textAlign="center"
              autoFocus={idx === 0}
            />
          ))}
        </View>
        <Link href="/New_Password" asChild>
        <TouchableOpacity style={styles.confirmBtn}>
          <Text style={styles.confirmBtnText}>Xác nhận</Text>
        </TouchableOpacity>
        </Link>
        <TouchableOpacity style={styles.resendBtn}>
          <Text style={styles.resendBtnText}>Gửi lại</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>Hoặc đăng nhập bằng</Text>
        <View style={styles.socialRow}>
          <FontAwesome name="facebook-official" size={32} color="#4A90E2" style={{ marginHorizontal: 12 }} />
          <FontAwesome name="google" size={32} color="#4A90E2" style={{ marginHorizontal: 12 }} />
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Không có tài khoản? </Text>
          <Link href="/Create_Account" style={styles.registerLink}>Đăng kí</Link>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#97A2FF', alignItems: 'center' },
  topBackground: {
    width: '100%',
    height: 100,
    backgroundColor: '#97A2FF',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 12,
  },
  header: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 40 },
  formContainer: {
    backgroundColor: '#F4FFFA',
    borderRadius: 40,
    width: '100%',
    height: '100%',
    padding: 24,
    alignItems: 'center',
    marginTop: 32,
  },
  label: { color: '#000', fontWeight: 'bold', fontSize: 20, alignSelf: 'center', marginBottom: 32, fontFamily: 'Montserrat_700Bold', marginTop: 64 },
  otpRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  otpInput: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#97A2FF',
    marginHorizontal: 6,
    fontSize: 20,
    backgroundColor: '#fff',
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    marginBottom: 36,
  },
  confirmBtn: {
    backgroundColor: '#7EA6FF',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 8,
    marginBottom: 8,
    width: '100%',
    alignItems: 'center',
  },
  confirmBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  resendBtn: {
    backgroundColor: '#D6EAF8',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  resendBtnText: { color: '#000', fontWeight: 'bold', fontSize: 18, fontFamily: 'Montserrat' },
  orText: { color: '#000', marginTop: 72, marginBottom: 8, fontWeight: 'bold', fontSize: 15, fontFamily: 'Montserrat' },
  socialRow: { flexDirection: 'row', justifyContent: 'center', width: '100%' },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  bottomText: { color: '#000', fontSize: 15, fontFamily: 'Montserrat' },
  registerLink: { color: '#4A90E2', fontWeight: 'bold', fontSize: 15, textDecorationLine: 'underline', fontFamily: 'Montserrat' },
});