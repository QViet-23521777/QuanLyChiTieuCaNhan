import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { SafeAreaView } from 'react-native-safe-area-context';
import mainStyles from '@/src/styles/mainStyle';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    let [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_700Bold,
    });

    if (!fontsLoaded) {
    return null; // or <AppLoading />
    }
  return (
    <SafeAreaView style={mainStyles.container}>
      <View style={mainStyles.topSheet}/>
      <View style={mainStyles.bottomeSheet}>
        <Text style={styles.title}>Thay đổi mật khẩu</Text>
        <Text style={styles.desc}>Mật khẩu cần có:</Text>
        <Text style={styles.bullet}>• Tối thiểu 8 kí tự,</Text>
        <Text style={styles.bullet}>• Ít nhất 1 chữ cái viết hoa, 1 số, 1 kí tự đặc biệt.</Text>
        <Text style={[styles.label, { marginTop: 64}]}>Nhập email:</Text>
        <TextInput
          style={styles.input}
          placeholder="example@example.com"
          placeholderTextColor="#A0AFC0"
          value={email}
          onChangeText={setEmail}
        />
        <Link href="/Security_Pin" asChild>
        <TouchableOpacity style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>Bước tiếp theo</Text>
        </TouchableOpacity>
        </Link>
        {/* <Text style={styles.orText}>Hoặc đăng nhập bằng</Text>
        <View style={styles.socialRow}>
          <FontAwesome name="facebook-official" size={32} color="#4A90E2" style={{ marginHorizontal: 12 }} />
          <FontAwesome name="google" size={32} color="#4A90E2" style={{ marginHorizontal: 12 }} />
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Không có tài khoản? </Text>
          <Link href="/Create_Account" style={styles.registerLink}>Đăng kí</Link>
        </View> */}
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6EB5FF', alignItems: 'center' },
  topBackground: {
    width: '100%',
    height: 100,
    backgroundColor: '#6EB5FF',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 12,
  },
  header: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 40, fontFamily: 'Montserrat' },
  formContainer: {
    backgroundColor: '#F4FFFA',
    borderRadius: 40,
    width: '100%',
    height: '100%',
    padding: 24,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: { color: '#222', fontWeight: 'bold', fontSize: 18, alignSelf: 'flex-start', marginBottom: 8, marginTop: 16, fontFamily: 'Montserrat' },
  desc: { color: '#222', fontSize: 15, alignSelf: 'flex-start', fontFamily: 'Montserrat' },
  bullet: { color: '#222', fontSize: 15, alignSelf: 'flex-start', marginLeft: 8, fontFamily: 'Montserrat' },
  label: { alignSelf: 'flex-start', color: '#000', fontWeight: 'medium', marginTop: 12, marginBottom: 4, fontFamily: 'Montserrat' },
  input: {
    backgroundColor: '#D6EAF8',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    width: '100%',
    marginBottom: 16,
  },
  nextBtn: {
    backgroundColor: '#3887FE',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 8,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  nextBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  orText: { color: '#222', marginTop: 48, marginBottom: 8, fontWeight: 'bold', fontSize: 15, fontFamily: 'Montserrat' },
  socialRow: { flexDirection: 'row', justifyContent: 'center', width: '100%' },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  bottomText: { color: '#222', fontSize: 15 },
  registerLink: { color: '#4A90E2', fontWeight: 'bold', fontSize: 15, textDecorationLine: 'underline' },
});