import {
    View,
    TouchableOpacity,
    Text,
    FlatList,
    StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import TransactionItem from "@/src/Components/TransactionItem";
import TransactionSummary from "@/src/Components/TransactionSummary";
import { SafeAreaView } from "react-native-safe-area-context";
import mainStyles from "@/src/styles/mainStyle";

const filters = ["Thu", "Chi"];

const datas = {
    Thu: [
        { title: "Mua Sắm", time: "10:00 - 3/6", amount: 100000 },
        { title: "Nơi Ở", time: "8:00 - 3/6", amount: 3250000 },
    ],
    Chi: [
        { title: "Thu Nhập", time: "10:00 - 30/5", amount: 5000000 },
        { title: "Mua Sắm", time: "16:00 - 1/6", amount: 450000 },
    ],
};

const TransferScreen = () => {
    const [selectedFilter, setSelectedFilter] = useState("Thu");

    return (
        <SafeAreaView style={mainStyles.container}>
            <SafeAreaView style={[mainStyles.topSheet, { padding: 0 }]}>
                <View
                    style={{
                        backgroundColor: "white",
                        alignItems: "center",
                        padding: 20,
                        borderRadius: 10,
                        margin: 10,
                    }}>
                    <Text>Tổng ví</Text>
                    <Text>5000000</Text>
                </View>
                <View style={styles.filterRow}>
                    {filters.map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            onPress={() => setSelectedFilter(filter)}
                            style={[
                                styles.filterButton,
                                selectedFilter === filter &&
                                    styles.filterButtonActive,
                            ]}>
                            <Text
                                style={[
                                    styles.filterText,
                                    selectedFilter === filter &&
                                        styles.filterTextActive,
                                ]}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </SafeAreaView>
            <View style={mainStyles.bottomeSheet}>
                <FlatList
                    data={datas[selectedFilter]}
                    renderItem={({ item }) => (
                        <TransactionItem
                            title={item.title}
                            time={item.time}
                            amount={item.amount}
                        />
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

export default TransferScreen;

const styles = StyleSheet.create({
    filterRow: {
        flexDirection: "row",
        backgroundColor: "#D6F0FF",
        borderRadius: 25,
        padding: 4,
        justifyContent: "space-around",
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    filterButtonActive: {
        backgroundColor: "#6DBDFF",
    },
    filterText: {
        color: "#000",
        fontWeight: "500",
    },
});
