import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import mainStyles from "@/src/styles/mainStyle";
import SavingGoalCard from "@/src/Components/SavingGoalCard";

const screenWidth = Dimensions.get("window").width;

const tabs = ["Ngày", "Tuần", "Tháng", "Năm"];

const AnalyticsScreen = () => {
    const [selectedTab, setSelectedTab] = useState("Tháng");

    const chartData = {
        labels: ["Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy", "CN"],
        datasets: [
            {
                data: [1000000, 750000, 200000, 0, 500000, 1250000, 300000],
                color: () => "#2F80ED",
                strokeWidth: 2,
            },
            {
                data: [500000, 0, 250000, 100000, 400000, 700000, 180000],
                color: () => "#EB5757",
                strokeWidth: 2,
            },
        ],
        legend: ["Thu Nhập", "Chi Tiêu"],
    };

    return (
        <SafeAreaView style={mainStyles.container}>
            <SafeAreaView style={[mainStyles.topSheet, { padding: 24 }]}>
                <SavingGoalCard />
            </SafeAreaView>

            <View style={mainStyles.bottomeSheet}>
                <View style={styles.tabs}>
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[
                                styles.tab,
                                selectedTab === tab && styles.tabSelected,
                            ]}
                            onPress={() => setSelectedTab(tab)}>
                            <Text
                                style={
                                    selectedTab === tab
                                        ? styles.tabTextSelected
                                        : styles.tabText
                                }>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.incomeExpense}>
                    <Text style={styles.incomeLabel}>
                        <Ionicons
                            name="arrow-up-outline"
                            size={16}
                            color="#2F80ED"
                        />{" "}
                        Income
                    </Text>
                    <Text style={styles.expenseLabel}>
                        <Ionicons
                            name="arrow-down-outline"
                            size={16}
                            color="#EB5757"
                        />{" "}
                        Expense
                    </Text>
                </View>

                <View style={styles.chartContainer}>
                    {/* Header của biểu đồ */}
                    <View style={styles.chartHeader}>
                        <Text style={styles.chartTitle}>Thu & Chi</Text>
                        <View style={styles.chartButtons}>
                            <Link href="/search" asChild>
                                <TouchableOpacity style={styles.iconButton}>
                                    <Ionicons
                                        name="search"
                                        size={18}
                                        color="#000"
                                    />
                                </TouchableOpacity>
                            </Link>
                            <Link href="/calendar" asChild>
                                <TouchableOpacity style={styles.iconButton}>
                                    <Ionicons
                                        name="calendar-clear-outline"
                                        size={18}
                                        color="#000"
                                    />
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>

                    {/* Biểu đồ */}
                    <LineChart
                        data={chartData}
                        width={screenWidth - 32}
                        height={220}
                        chartConfig={{
                            backgroundGradientFrom: "#EAF3FF",
                            backgroundGradientTo: "#EAF3FF",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                            labelColor: () => "#2C3E50",
                            propsForDots: {
                                r: "4",
                                strokeWidth: "2",
                                stroke: "#fff",
                            },
                        }}
                        bezier
                        style={styles.chartStyle}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: "row",
        backgroundColor: "#69A7FF",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    summaryBox: {
        backgroundColor: "#69A7FF",
        margin: 16,
        padding: 16,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    circle: {
        backgroundColor: "#0D65D9",
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    circleText: {
        color: "#fff",
        fontSize: 10,
        textAlign: "center",
    },
    summaryText: {
        flex: 1,
    },
    income: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#000",
    },
    expense: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#000",
    },
    divider: {
        height: 1,
        backgroundColor: "#fff",
        marginVertical: 4,
    },
    tabs: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 12,
        marginHorizontal: 16,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: "#EAEFFF",
    },
    tabSelected: {
        backgroundColor: "#4F91FF",
    },
    tabText: {
        color: "#2F80ED",
    },
    tabTextSelected: {
        color: "#fff",
        fontWeight: "bold",
    },
    incomeExpense: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 12,
    },
    incomeLabel: {
        color: "#2F80ED",
        fontWeight: "bold",
    },
    expenseLabel: {
        color: "#EB5757",
        fontWeight: "bold",
    },
    chartContainer: {
        backgroundColor: "#EAF3FF",
        // margin: 16,
        borderRadius: 24,
        // padding: 16,
        paddingBottom: 0,
    },
    chartHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2C3E50",
    },
    chartButtons: {
        flexDirection: "row",
        gap: 8,
    },
    iconButton: {
        backgroundColor: "#BFDFFF",
        borderRadius: 12,
        padding: 6,
    },
    chartStyle: {
        borderRadius: 20,
    },
});
