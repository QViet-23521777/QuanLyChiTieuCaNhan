import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SettingTemplate from "@/src/Components/SettingTemplate";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import mainStyles from "@/src/styles/mainStyle";

export default function AddFingerprintScreen() {
    return (
        <SafeAreaView style={mainStyles.container}>
            <SafeAreaView style={[mainStyles.topSheet, { padding: 0 }]} />
            <View style={[mainStyles.bottomeSheet, { alignItems: "center" }]}>
                <View style={styles.fingerprintCircle}>
                    <MaterialCommunityIcons
                        name="fingerprint"
                        size={80}
                        color="#6EB5FF"
                    />
                </View>
                <Text style={styles.title}>Sử Dụng Vân Tay Để Đăng Nhập</Text>
                <Text style={styles.desc}>
                    Bạn có thể sử dụng dấu vân tay để đăng nhập nhanh chóng và
                    bảo mật hơn. Hãy đảm bảo rằng bạn đã thêm ít nhất một dấu
                    vân tay vào thiết bị của mình.
                </Text>
                <TouchableOpacity
                    style={styles.useButton}
                    onPress={() => router.back()}>
                    <Text style={styles.useButtonText}>Sử Dụng</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginTop: 24,
        flex: 1,
    },
    fingerprintCircle: {
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: "#E3F3FF",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 28,
    },
    title: {
        fontSize: 17,
        fontFamily: "Montserrat_700Bold",
        color: "#145A5A",
        marginBottom: 8,
        textAlign: "center",
    },
    desc: {
        fontSize: 13,
        color: "#222",
        textAlign: "center",
        marginBottom: 32,
        fontFamily: "Montserrat_400Regular",
        paddingHorizontal: 12,
    },
    useButton: {
        backgroundColor: "#D6EAF8",
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 60,
        alignItems: "center",
        marginTop: 8,
    },
    useButtonText: {
        color: "#000",
        fontFamily: "Montserrat_700Bold",
        fontSize: 16,
    },
});
