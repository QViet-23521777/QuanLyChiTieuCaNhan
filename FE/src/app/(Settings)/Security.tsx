import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SettingTemplate from "@/src/Components/SettingTemplate";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import mainStyles from "@/src/styles/mainStyle";

export default function SecurityScreen() {
    return (
        <SafeAreaView style={mainStyles.container}>
            <SafeAreaView style={[mainStyles.topSheet, {padding: 0}]}/>
            <View style={mainStyles.bottomeSheet}>
              <TouchableOpacity
                  style={styles.row}
                  onPress={() => router.push("/Fingerprint")}>
                  <Text style={styles.rowText}>Bảo Mật Dấu Vân Tay</Text>
                  <Ionicons name="chevron-forward" size={22} color="#000" />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity
                  style={styles.row}
                  onPress={() => router.push("/TermOfService")}>
                  <Text style={styles.rowText}>Điều Khoản Sử Dụng</Text>
                  <Ionicons name="chevron-forward" size={22} color="#000" />
              </TouchableOpacity>
              <View style={styles.divider} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 18,
    },
    rowText: {
        fontSize: 16,
        color: "#000",
        fontFamily: "Montserrat_700Bold",
    },
    divider: {
        height: 1,
        backgroundColor: "#D6EAF8",
        width: "100%",
    },
});
