import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, use } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import SavingsGoalCard from "@/src/Components/SavingGoalCard";
import TransactionScreen from "@/src/Components/TransactionSummary";
import TransactionItem from "@/src/Components/TransactionItem";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import mainStyles from "@/src/styles/mainStyle";
import GreetingHeader from "@/src/Components/HomeHeader";
import { User, Transaction } from "@/models/types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  getTotalExpense, getTotalIncome, getTransactionsByUserId} from '@/QuanLyTaiChinh-backend/transactionServices'; 
const data = {
    Thu: [
        { title: "Mua Sắm", time: "10:00 - 3/6", amount: 100000 },
        { title: "Nơi Ở", time: "8:00 - 3/6", amount: 3250000 },
    ],
    Chi: [
        { title: "Thu Nhập", time: "10:00 - 30/5", amount: 5000000 },
        { title: "Mua Sắm", time: "16:00 - 1/6", amount: 450000 },
    ],
};

const BalanceScreen = ({
    username = "Pendragon",
    wallet = 5000000,
    expense = 3750000,
}) => {
    const [userId, setUserId] = useState<string | null>(null);
      const [user, setUser] = useState<User | null>(null);
      const [totalIncome, setTotalIncome] = useState<string>('0');
      const [totalExpense, setTotalExpense] = useState<string>('0');
    const [transactions, setTransactions] = useState<Transaction[] | null>([]); // Thay any bằng kiểu dữ liệu thực tế của bạn
      
      useEffect(() => {
        const fetchUserId = async () => {
            const id = await AsyncStorage.getItem('userId');
            console.log('Fetched userId:', id); // Thêm dòng này
            setUserId(id);
        };
        fetchUserId();
    }, []);
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const income = await getTotalIncome(userId);
          const i = income.toString();
          const expense = await getTotalExpense(userId);
          const e = expense.toString();
          setTotalIncome(i);
          setTotalExpense(e);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  }, [userId]);
  useEffect(() => {
        const fetchTransactions = async () => {
            if (userId) {
                try {
                    const trans: Transaction[] = await getTransactionsByUserId(userId);
                    console.log('Fetched transactions:');
                    setTransactions(trans); 
                }
                catch (error) {
                    console.error('Error fetching transactions:', error);
                }
            }
        };
        fetchTransactions();
    }, [userId]);
    return (
        <SafeAreaView style={mainStyles.container}>
            <SafeAreaView style={[mainStyles.topSheet, { padding: 0 }]}>
                <GreetingHeader />
                <SavingsGoalCard />
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}>
                    <View style={styles.income}>
                        <MaterialCommunityIcons
                            name="arrow-top-right-bold-box"
                            size={16}
                            color="green"
                        />
                        <Text>Thu</Text>
                        <Text>{totalIncome}</Text>
                    </View>
                    <View style={styles.income}>
                        <MaterialCommunityIcons
                            name="arrow-bottom-right-bold-box"
                            size={16}
                            color="red"
                        />
                        <Text>Chi</Text>
                        <Text>{totalExpense}</Text>
                    </View>
                </View>
            </SafeAreaView>
            <View style={mainStyles.bottomeSheet}>
                <View style={{ flexDirection: "row" }}>
                    <Text style={{ flex: 1 }}>Thu chi</Text>
                    <Link href="/transfer" style={{ flex: 1, textAlign: 'right' }}>See all</Link>
                </View>
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
};

const styles = StyleSheet.create({
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
        alignItems: "center",
    },
    block: {
        alignItems: "center",
        flex: 1,
    },
    labelRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    label: {
        color: "#fff",
        marginLeft: 4,
        fontSize: 14,
    },
    amount: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    divider: {
        width: 1,
        backgroundColor: "#fff",
        height: "100%",
        marginHorizontal: 10,
    },
    income: {
        backgroundColor: "#F1FFF3",
        padding: 20,
        borderRadius: 20,
        flex: 1,
        marginRight: 20,
        marginLeft: 20,
        alignContent: "center",
        justifyContent: "space-between",
        alignItems: "center",
    },
});

export default BalanceScreen;
