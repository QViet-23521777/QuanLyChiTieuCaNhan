import React from "react";
import { View, Text, StyleSheet } from "react-native";

const UserItem = () => {
    return (
        <View style={styles.container}>
            <View style={styles.circle} />
            <Text style={styles.name}>Nguyen Van A</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "transparent", // màu nền giống ảnh
        padding: 10,
    },
    circle: {
        width: 50,
        height: 50,
        borderRadius: 25, // tạo hình tròn
        backgroundColor: "#66B2FF", // màu xanh dương
        marginRight: 10,
    },
    name: {
        fontSize: 16,
        color: "#111827", // màu chữ giống ảnh
        fontWeight: "500",
    },
});

export default UserItem;
