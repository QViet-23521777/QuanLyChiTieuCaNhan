import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import {
    useFonts,
    Montserrat_400Regular,
    Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import { SafeAreaView } from "react-native-safe-area-context";
import mainStyles from "@/src/styles/mainStyle";

export default function CreateAccountScreen() {
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);

    let [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_700Bold,
    });

    if (!fontsLoaded) {
        return null; // or <AppLoading />
    }
    return (
        <SafeAreaView style={mainStyles.container}>
            <SafeAreaView style={[mainStyles.topSheet, { padding: 0 }]} />
            <View style={mainStyles.bottomeSheet}>
                <ScrollView
                    contentContainerStyle={{ alignItems: "center" }}
                    showsVerticalScrollIndicator={false}>
                    <Text style={styles.label}>Tên đầy đủ</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="example@example.com"
                        placeholderTextColor="#A0AFC0"
                    />
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="example@example.com"
                        placeholderTextColor="#A0AFC0"
                    />
                    <Text style={styles.label}>Số điện thoại</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="123 456 789"
                        placeholderTextColor="#A0AFC0"
                        keyboardType="phone-pad"
                    />
                    <Text style={styles.label}>Ngày sinh</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="DD / MM / YYYY"
                        placeholderTextColor="#A0AFC0"
                    />
                    <Text style={styles.label}>Mật khẩu</Text>
                    <View style={styles.passwordRow}>
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder="••••••••"
                            placeholderTextColor="#A0AFC0"
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword((v) => !v)}>
                            <Ionicons
                                name={
                                    showPassword
                                        ? "eye-off-outline"
                                        : "eye-outline"
                                }
                                size={24}
                                color="#A0AFC0"
                                style={{ marginLeft: 8 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.label}>Nhập lại mật khẩu</Text>
                    <View style={styles.passwordRow}>
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder="••••••••"
                            placeholderTextColor="#A0AFC0"
                            secureTextEntry={!showRePassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowRePassword((v) => !v)}>
                            <Ionicons
                                name={
                                    showRePassword
                                        ? "eye-off-outline"
                                        : "eye-outline"
                                }
                                size={24}
                                color="#A0AFC0"
                                style={{ marginLeft: 8 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.terms}>
                        Bằng việc tiếp tục, bạn chấp nhận{"\n"}
                        <Text style={styles.termsLink}>
                            Điều khoản sử dụng
                        </Text>{" "}
                        và{" "}
                        <Text style={styles.termsLink}>
                            Chính sách quyền riêng tư
                        </Text>
                        .
                    </Text>
                    <TouchableOpacity style={styles.registerBtn}>
                        <Text style={styles.registerBtnText}>Đăng Kí</Text>
                    </TouchableOpacity>
                    <View style={styles.bottomRow}>
                        <Text style={styles.bottomText}>Đã có tài khoản? </Text>
                        <Link href="/" style={styles.loginLink}>
                            Đăng nhập
                        </Link>
                    </View>
                </ScrollView>
            </View>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#97A2FF", alignItems: "center" },
    topBackground: {
        width: "100%",
        height: 100,
        backgroundColor: "#97A2FF",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 12,
    },
    header: { color: "#fff", fontSize: 24, fontWeight: "bold", marginTop: 40 },
    formContainer: {
        backgroundColor: "#fff",
        borderRadius: 40,
        width: "100%",
        height: "100%",
        padding: 24,
        alignItems: "center",
        marginTop: 24,
    },
    label: {
        alignSelf: "flex-start",
        color: "#222",
        fontWeight: "bold",
        marginTop: 12,
        marginBottom: 4,
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
    passwordRow: { flexDirection: "row", alignItems: "center", width: "100%" },
    terms: {
        color: "#222",
        fontSize: 13,
        textAlign: "center",
        marginVertical: 10,
    },
    termsLink: { color: "#4A90E2", textDecorationLine: "underline" },
    registerBtn: {
        backgroundColor: "#B9CFFF",
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 32,
        marginTop: 8,
        marginBottom: 8,
        width: "100%",
        alignItems: "center",
    },
    registerBtnText: { color: "#222", fontWeight: "bold", fontSize: 18 },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
    },
    bottomText: { color: "#222", fontSize: 15 },
    loginLink: {
        color: "#4A90E2",
        fontWeight: "bold",
        fontSize: 15,
        textDecorationLine: "underline",
    },
});
