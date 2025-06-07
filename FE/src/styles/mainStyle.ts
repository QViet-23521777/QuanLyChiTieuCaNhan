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

const mainStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#6EB5FF"},
    topSheet: {
        width: "100%",
        // height: 100,
        // backgroundColor: "#6EB5FF",
        // alignItems: "center",
        justifyContent: "center",
        padding: 48,
        fontFamily: "Montserrat",
        fontWeight: "bold",
    },
    bottomeSheet: {
        backgroundColor: "#fff",
        borderRadius: 60,
        width: "100%",
        height: "100%",
        padding: 30,
        // alignItems: "center",
        // marginTop: 32,
        fontFamily: "Montserrat",
        fontWeight: "bold",
    },
    title: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 40,
        fontFamily: "Montserrat",
    },
});

export default mainStyles;
