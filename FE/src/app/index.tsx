import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });
  if (!fontsLoaded) {
    return null; // or <AppLoading />
  }
  return (
    <View style={styleIndex.container}>
      <View style={styleIndex.topBackground}>
        <Text style={styleIndex.header}>Đăng Nhập</Text>
      </View>
      <View style={styleIndex.formContainer}>
        <Text style={styleIndex.label}>Tên đăng nhập hoặc email</Text>
        <TextInput
          style={styleIndex.input}
          placeholder="example@example.com"
          placeholderTextColor="#A0AFC0"
        />
        <Text style={styleIndex.label}>Mật khẩu</Text>
        <View style={styleIndex.passwordRow}>
          <TextInput
            style={[styleIndex.input, { flex: 1 }]}
            placeholder="••••••••"
            placeholderTextColor="#A0AFC0"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#A0AFC0" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styleIndex.fingerprintRow}>
          <Ionicons name="finger-print-outline" size={32} color="#4A90E2" />
          <Text style={styleIndex.fingerprintText}>
            Đăng nhập bằng <Text style={styleIndex.fingerprintTextBlue}>vân tay</Text>
          </Text>
        </TouchableOpacity>
        <Link href="/home" asChild>
        {/* <Link href="/home/notification" asChild> */}
        {/* <Link href="/home/statistics" asChild> */}
        {/* <Link href='/home/search' asChild> */}
        {/* <Link href='/home/calendar' asChild> */}
        {/* <Link href="/home/balance" asChild> */}
        {/* <Link href="/Categories/Categories" asChild> */}
        {/* <Link href="/Settings/Profile" asChild> */}
          <TouchableOpacity style={styleIndex.loginBtn}>
            <Text style={styleIndex.loginBtnText}>Đăng Nhập</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/Forgot_Password" asChild>
          <TouchableOpacity>
            <Text style={styleIndex.forgot}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </Link>
        <Text style={styleIndex.orText}>Chưa có tài khoản?</Text>
        <Link href="/Create_Account" asChild>
          <TouchableOpacity style={styleIndex.registerBtn}>
            <Text style={styleIndex.registerBtnText}>Đăng Kí</Text>
          </TouchableOpacity>
        </Link>
        <Text style={styleIndex.orText}>Hoặc đăng nhập bằng</Text>
        <View style={styleIndex.socialRow}>
          <FontAwesome name="facebook-official" size={32} color="#4A90E2" style={{ marginHorizontal: 12 }} />
          <FontAwesome name="google" size={32} color="#4A90E2" style={{ marginHorizontal: 12 }} />
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

 export const styleIndex = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6EB5FF', alignItems: 'center' },
  topBackground: {
    width: '100%',
    height: 100,
    backgroundColor: '#6EB5FF',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 12,
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
  },
  header: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 40, fontFamily: 'Montserrat', },  
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 60,
    width: '100%',
    height: '100%',
    padding: 30,
    alignItems: 'center',
    marginTop: 32,
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
  },
  label: { alignSelf: 'flex-start', color: '#000', fontWeight: 'medium', marginTop: 12, marginBottom: 4, fontFamily: 'Montserrat_400Regular', fontSize: 15 },
  input: {
    backgroundColor: '#D6EAF8',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    width: '100%',
    marginBottom: 8,
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center', width: '100%', fontFamily: 'Poppins' },
  fingerprintRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginVertical: 16, alignSelf: 'flex-start' },
  fingerprintText: { marginLeft: 8, color: '#000', fontSize: 15, fontFamily: 'Montserrat_400Regular', fontWeight: 'semibold' },
  fingerprintTextBlue: { color: '#2C7FFF', fontFamily: 'Montserrat_400Regular', fontWeight: 'bold', fontSize: 16 },
  loginBtn: {
    backgroundColor: '#3887FE',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 8,
    marginBottom: 8,
    width: '100%',
    alignItems: 'center',
    fontFamily: 'Montserrat_700Bold',
    fontWeight: 'bold',
  },
  loginBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18, fontFamily: 'Montserrat_700Bold', },
  forgot: { color: '#222', marginVertical: 8, fontWeight: '500' },
  registerBtn: {
    backgroundColor: '#D6EAF8',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 8,
    marginBottom: 8,
    width: '100%',
    alignItems: 'center',
    fontFamily: 'Montserrat_700Bold',
    fontWeight: 'bold',
  },
  registerBtnText: { color: '#222', fontWeight: 'bold', fontSize: 18, fontFamily: 'Montserrat_700Bold' },
  orText: { color: '#222', marginTop: 32, marginBottom: 8, fontWeight: '500', fontFamily: 'Montserrat_700Bold', fontSize: 16 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', width: '100%' },
});