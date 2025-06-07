import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import mainStyles from "@/src/styles/mainStyle";

const mockData = [
    {
        id: 1,
        type: "Chi",
        category: "Mua Sắm",
        date: "2025-05-20",
        time: "17:00",
        amount: 500000,
    },
    {
        id: 2,
        type: "Thu",
        category: "Thu Nhập",
        date: "2025-04-30",
        time: "18:27",
        amount: 7500000,
    },
];

export default function SearchScreen() {
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [reportType, setReportType] = useState("Chi");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [filteredData, setFilteredData] = useState([]);

    const handleSearch = () => {
        const dateStr = selectedDate.toISOString().split("T")[0];
        const results = mockData.filter(
            (item) =>
                item.type === reportType &&
                item.date === dateStr &&
                item.category.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredData(results);
    };

    return (
        <SafeAreaView style={mainStyles.container}>
            <SafeAreaView style={[mainStyles.topSheet, { padding: 16}]}>
                <TextInput
                    style={styles.input}
                    placeholder="Search..."
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </SafeAreaView>
            <View style={mainStyles.bottomeSheet}>
                <Text style={styles.label}>Loại</Text>
                <TextInput
                    style={styles.dropdown}
                    placeholder="Select the category"
                    value={selectedCategory}
                    onChangeText={setSelectedCategory}
                />

                <Text style={styles.label}>Ngày</Text>
                <TouchableOpacity
                    style={styles.datePicker}
                    onPress={() => setShowDatePicker(true)}>
                    <Text>{selectedDate.toLocaleDateString("vi-VN")}</Text>
                    <Ionicons name="calendar" size={20} color="#333" />
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                            setShowDatePicker(false);
                            if (date) setSelectedDate(date);
                        }}
                    />
                )}

                <Text style={styles.label}>Báo Cáo</Text>
                <View style={styles.radioGroup}>
                    {["Thu", "Chi"].map((type) => (
                        <TouchableOpacity
                            key={type}
                            onPress={() => setReportType(type)}
                            style={styles.radioButton}>
                            <View
                                style={[
                                    styles.radioCircle,
                                    reportType === type && styles.radioSelected,
                                ]}
                            />
                            <Text style={styles.radioText}>{type}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.searchBtn}
                    onPress={handleSearch}>
                    <Text style={styles.searchText}>Search</Text>
                </TouchableOpacity>

                {filteredData.length > 0 && (
                    <FlatList
                        data={filteredData}
                        keyExtractor={(item) => item.id.toString()}
                        style={styles.resultList}
                        renderItem={({ item }) => (
                            <View style={styles.resultItem}>
                                <View style={styles.iconBox}>
                                    <Ionicons
                                        name="cart"
                                        size={20}
                                        color="#fff"
                                    />
                                </View>
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemTitle}>
                                        {item.category}
                                    </Text>
                                    <Text style={styles.itemTime}>
                                        {item.time} -{" "}
                                        {new Date(item.date).toLocaleDateString(
                                            "vi-VN"
                                        )}
                                    </Text>
                                </View>
                                <Text
                                    style={[
                                        styles.amount,
                                        item.type === "Chi"
                                            ? styles.red
                                            : styles.blue,
                                    ]}>
                                    {item.amount.toLocaleString("vi-VN")}
                                </Text>
                            </View>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f4fff8" },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10,
    },
    input: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 12,
        marginBottom: 10,
    },
    label: { fontWeight: "bold", marginTop: 10 },
    dropdown: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 12,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    datePicker: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#e5e9ff",
        padding: 10,
        borderRadius: 12,
        marginBottom: 10,
    },
    radioGroup: { flexDirection: "row", marginVertical: 10 },
    radioButton: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
    },
    radioCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#555",
        marginRight: 6,
    },
    radioSelected: { backgroundColor: "#4c8cf5" },
    radioText: { fontSize: 14 },
    searchBtn: {
        backgroundColor: "#a9b9f9",
        padding: 12,
        borderRadius: 20,
        alignItems: "center",
        marginTop: 10,
    },
    searchText: { fontWeight: "bold", color: "#fff" },
    resultList: { marginTop: 20 },
    resultItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#eef5ff",
        padding: 12,
        marginVertical: 6,
        borderRadius: 16,
    },
    iconBox: {
        backgroundColor: "#4a90e2",
        padding: 10,
        borderRadius: 12,
        marginRight: 12,
    },
    itemInfo: { flex: 1 },
    itemTitle: { fontWeight: "bold" },
    itemTime: { fontSize: 12, color: "#666" },
    amount: { fontWeight: "bold", fontSize: 16 },
    red: { color: "red" },
    blue: { color: "blue" },
});
