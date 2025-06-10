import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    useFonts,
    Montserrat_700Bold,
    Montserrat_400Regular,
} from "@expo-google-fonts/montserrat";
import { useRouter } from "expo-router";
import Outline from "@/src/Components/Outline";
import CalendarPicker from "@/src/Components/Calendar";
import { Transaction, User } from "@/models/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    getTransactionsByCategory,
    getTransactionsByUserId,
} from "@/QuanLyTaiChinh-backend/transactionServices";
import { getCategoryByName } from "@/QuanLyTaiChinh-backend/categoryServices";
import TransactionItem from "@/src/Components/TransactionItem";
import { SafeAreaView } from "react-native-safe-area-context";
import mainStyles from "@/src/styles/mainStyle";
const initialExpenses = [
    {
        id: 1,
        name: "Disney",
        time: "14:00",
        date: "11",
        month: "3",
        year: "2025",
        amount: 1,
    },
    // Add more dummy data if needed
];

export default function GroceriesScreen() {
    const [fontsLoaded] = useFonts({
        Montserrat_700Bold,
        Montserrat_400Regular,
    });

    const [expenses] = useState(initialExpenses);
    const router = useRouter();

    // Time picker state
    const [mode, setMode] = useState<"day" | "month">("month");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch userId from AsyncStorage
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const id = await AsyncStorage.getItem("userId");
                console.log("Fetched userId:", id);
                setUserId(id);
            } catch (error) {
                console.error("Error fetching userId:", error);
            }
        };
        fetchUserId();
    }, []);

    // Fetch transactions when userId is available
    useEffect(() => {
        const fetchTransactions = async () => {
            if (userId) {
                try {
                    setLoading(true);
                    console.log(
                        "Starting to fetch transactions for userId:",
                        userId
                    );

                    const cat = await getCategoryByName("Ăn Uống");
                    console.log("Category response:", cat);

                    if (!cat || cat.length === 0) {
                        console.log("No category found with name 'Ăn uống'");
                        setTransactions([]);
                        return;
                    }

                    const category = cat[0];
                    console.log("Found category:", category);

                    // Kiểm tra các thuộc tính có thể có của category
                    const categoryId = category.id || category.id;
                    console.log("Category ID:", categoryId);

                    if (!categoryId) {
                        console.log(
                            "Category ID is undefined. Category object:",
                            category
                        );
                        console.log("Available keys:", Object.keys(category));
                        setTransactions([]);
                        return;
                    }

                    console.log("Using category ID:", categoryId);
                    const trans = await getTransactionsByCategory(categoryId);

                    if (!trans || trans.length === 0) {
                        console.log(
                            "No transactions found for category 'Ăn uống'"
                        );
                        setTransactions([]);
                        return;
                    }

                    setTransactions(trans);
                    console.log(
                        "Fetched transactions for category:",
                        trans.length
                    );
                } catch (error) {
                    console.error("Error fetching transactions:", error);
                    //console.error('Error details:', e.message);
                    setTransactions([]);
                } finally {
                    setLoading(false);
                }
            } else {
                console.log("No userId available");
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [userId]);
    if (!fontsLoaded) return null;

    // Filter expenses
    const filteredExpenses = expenses.filter((exp) => {
        if (mode === "day") {
            return (
                parseInt(exp.date) === selectedDate.getDate() &&
                parseInt(exp.month) === selectedDate.getMonth() + 1 &&
                parseInt(exp.year) === selectedDate.getFullYear()
            );
        } else {
            return (
                parseInt(exp.month) === selectedMonth + 1 &&
                parseInt(exp.year) === selectedYear
            );
        }
    });

    return (
        <SafeAreaView style={mainStyles.container}>
            <SafeAreaView style={[mainStyles.topSheet, { padding: 0 }]} />
            <View style={mainStyles.bottomeSheet}>
                <FlatList
                    data={transactions}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                        const date = item.date.toDate();

                        const formatted =
                            date.toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                            }) +
                            " - " +
                            date.toLocaleDateString("vi-VN");

                        return (
                            <TransactionItem
                                title={item.decription}
                                time={formatted}
                                amount={item.amount}
                            />
                        );
                    }}
                    contentContainerStyle={{ paddingTop: 10 }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    backBtn: { padding: 4 },
    header: {
        color: "#222",
        fontSize: 22,
        fontFamily: "Montserrat_700Bold",
        fontWeight: "bold",
        textAlign: "center",
        flex: 1,
    },
    timeRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
        gap: 8,
    },
    timeToggle: {
        paddingVertical: 6,
        paddingHorizontal: 18,
        borderRadius: 16,
        backgroundColor: "#D6EAF8",
    },
    timeToggleActive: {
        backgroundColor: "#7EC6FF",
    },
    timeToggleText: {
        fontFamily: "Montserrat_700Bold",
        color: "#222",
        fontSize: 15,
    },
    timeToggleTextActive: {
        color: "#fff",
    },
    monthRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
        marginHorizontal: 8,
    },
    expenseRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E3F1FF",
        borderRadius: 18,
        marginBottom: 12,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#7EC6FF",
        alignItems: "center",
        justifyContent: "center",
    },
    expenseName: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 15,
        color: "#222",
    },
    expenseTime: {
        fontFamily: "Montserrat_400Regular",
        fontSize: 13,
        color: "#7EC6FF",
    },
    expenseAmount: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 16,
        color: "#F00",
        marginLeft: 8,
    },
    addBtn: {
        backgroundColor: "#7EC6FF",
        borderRadius: 20,
        paddingVertical: 10,
        alignItems: "center",
        marginTop: 16,
        marginBottom: 8,
        alignSelf: "center",
        width: 180,
    },
    addBtnText: {
        color: "#222",
        fontFamily: "Montserrat_700Bold",
        fontSize: 16,
    },
});