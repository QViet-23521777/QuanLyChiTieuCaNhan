import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import NotificationItem from "../Components/NotificationItem";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import mainStyles from "@/src/styles/mainStyle";

const NotificationScreen = ({}) => {
    return (
        <SafeAreaView style={{ backgroundColor: "#6EB5FF", flex: 1 }}>
            <SafeAreaView style={[mainStyles.topSheet, {padding: 0}]}/>
            <View style={[mainStyles.bottomeSheet]}>
                <ScrollView style={styles.content}>
                    <Text style={styles.sectionTitle}>Hôm nay</Text>
                    <NotificationItem
                        icon="bell"
                        title="Nhắc nhở"
                        message="bla bla"
                        time="17:00 - 21/5"
                    />
                    <NotificationItem
                        icon="star"
                        title="Cập nhật mới"
                        message="bla bla"
                        time="17:00 - 21/5"
                    />

                    <Text style={styles.sectionTitle}>Hôm qua</Text>
                    <NotificationItem
                        icon="transaction"
                        title="Giao dịch"
                        message="bla bla"
                        subInfo="Mua sắm | 500,000"
                        time="17:00 - 20/5"
                    />
                    <NotificationItem
                        icon="bell"
                        title="Thông báo!"
                        message="bla bla"
                        time="17:00 - 20/5"
                    />

                    <Text style={styles.sectionTitle}>Trước đó</Text>
                    <NotificationItem
                        icon="arrow"
                        title="Bản ghi thu chi"
                        message="bla bla"
                        time="17:00 - 13/5"
                    />
                    <NotificationItem
                        icon="transaction"
                        title="Giao Dịch"
                        message="bla bla"
                        subInfo="Nơi ở | 3,250,000"
                        time="17:00 - 13/5"
                    />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default NotificationScreen;

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        padding: 16,
        alignItems: "center",
        backgroundColor: "#B9C9FF",
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 12,
    },
    content: {
        padding: 16,
    },
    sectionTitle: {
        fontWeight: "bold",
        fontSize: 16,
        marginTop: 16,
        marginBottom: 8,
    },
});
