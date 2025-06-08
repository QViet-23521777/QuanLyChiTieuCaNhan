import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import {
    useFonts,
    Montserrat_400Regular,
    Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import mainStyles from "@/src/styles/mainStyle";

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig'; // đúng theo đường dẫn bạn tạo
import { router } from 'expo-router'; // nếu bạn dùng expo-router


export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
  try {
    setError('');
    await signInWithEmailAndPassword(auth, email, password);
    router.replace('/(home)'); // Chuyển sang màn hình chính sau khi đăng nhập
  } catch (err: any) {
    if (err.code === 'auth/user-not-found') {
      setError('Tài khoản không tồn tại');
    } else if (err.code === 'auth/wrong-password') {
      setError('Mật khẩu không đúng');
    } else {
      setError('Đăng nhập thất bại');
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
        <View style={mainStyles.container}>
            <View style={mainStyles.topSheet}>
                <Text style={mainStyles.title}>Đăng Nhập</Text>
            </View>
            <View style={mainStyles.bottomeSheet}>
                <Text style={styles.label}>Tên đăng nhập hoặc email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="example@example.com"
                    placeholderTextColor="#A0AFC0"
                    onChangeText={setEmail}
                />
                <Text style={styles.label}>Mật khẩu</Text>
                <View style={styles.passwordRow}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="••••••••"
                        placeholderTextColor="#A0AFC0"
                        secureTextEntry={!showPassword}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword((v) => !v)}>
                        <Ionicons
                            name={
                                showPassword ? "eye-off-outline" : "eye-outline"
                            }
                            size={24}
                            color="#A0AFC0"
                            style={{ marginLeft: 8 }}
                        />
                    </TouchableOpacity>
                </View>

                {error ? <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text> : null}

                <TouchableOpacity style={styles.fingerprintRow}>
                    <Ionicons
                        name="finger-print-outline"
                        size={32}
                        color="#4A90E2"
                    />
                    <Text style={styles.fingerprintText}>
                        Đăng nhập bằng{" "}
                        <Text style={styles.fingerprintTextBlue}>
                            vân tay
                        </Text>
                    </Text>
                </TouchableOpacity>
                {/* <Link href="/(home)" asChild> */}
                    <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                        <Text style={styles.loginBtnText}>Đăng Nhập</Text>
                    </TouchableOpacity>
                {/* </Link> */}
                <Link href="/Forgot_Password" asChild>
                    <TouchableOpacity>
                        <Text style={styles.forgot}>Quên mật khẩu?</Text>
                    </TouchableOpacity>
                </Link>
                <Text style={styles.orText}>Chưa có tài khoản?</Text>
                <Link href="/Create_Account" asChild>
                    <TouchableOpacity style={styles.registerBtn}>
                        <Text style={styles.registerBtnText}>Đăng Kí</Text>
                    </TouchableOpacity>
                </Link>
                <Text style={styles.orText}>Hoặc đăng nhập bằng</Text>
                <View style={styles.socialRow}>
                    <FontAwesome
                        name="facebook-official"
                        size={32}
                        color="#4A90E2"
                        style={{ marginHorizontal: 12 }}
                    />
                    <FontAwesome
                        name="google"
                        size={32}
                        color="#4A90E2"
                        style={{ marginHorizontal: 12 }}
                    />
                </View>
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#6EB5FF", alignItems: "center" },
    topBackground: {
        width: "100%",
        height: 100,
        backgroundColor: "#6EB5FF",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 12,
        fontFamily: "Montserrat",
        fontWeight: "bold",
    },
    header: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 40,
        fontFamily: "Montserrat",
    },
    formContainer: {
        backgroundColor: "#fff",
        borderRadius: 60,
        width: "100%",
        height: "100%",
        padding: 30,
        alignItems: "center",
        marginTop: 32,
        fontFamily: "Montserrat",
        fontWeight: "bold",
    },
    label: {
        alignSelf: "flex-start",
        color: "#000",
        fontWeight: "medium",
        marginTop: 12,
        marginBottom: 4,
        fontFamily: "Montserrat_400Regular",
        fontSize: 15,
    },
    input: {
        backgroundColor: "#D6EAF8",
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        width: "100%",
        marginBottom: 8,
    },
    passwordRow: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        fontFamily: "Poppins",
    },
    fingerprintRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginVertical: 16,
        alignSelf: "flex-start",
    },
    fingerprintText: {
        marginLeft: 8,
        color: "#000",
        fontSize: 15,
        fontFamily: "Montserrat_400Regular",
        fontWeight: "semibold",
    },
    fingerprintTextBlue: {
        color: "#2C7FFF",
        fontFamily: "Montserrat_400Regular",
        fontWeight: "bold",
        fontSize: 16,
    },
    loginBtn: {
        backgroundColor: "#3887FE",
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 32,
        marginTop: 8,
        marginBottom: 8,
        width: "100%",
        alignItems: "center",
        fontFamily: "Montserrat_700Bold",
        fontWeight: "bold",
    },
    loginBtnText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
        fontFamily: "Montserrat_700Bold",
    },
    forgot: { color: "#222", marginVertical: 8, fontWeight: "500" },
    registerBtn: {
        backgroundColor: "#D6EAF8",
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 32,
        marginTop: 8,
        marginBottom: 8,
        width: "100%",
        alignItems: "center",
        fontFamily: "Montserrat_700Bold",
        fontWeight: "bold",
    },
    registerBtnText: {
        color: "#222",
        fontWeight: "bold",
        fontSize: 18,
        fontFamily: "Montserrat_700Bold",
    },
    orText: {
        color: "#222",
        marginTop: 32,
        marginBottom: 8,
        fontWeight: "500",
        fontFamily: "Montserrat_700Bold",
        fontSize: 16,
    },
    socialRow: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
    },
});
