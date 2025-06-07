import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import {
    Ionicons,
    MaterialIcons,
    FontAwesome5,
    MaterialCommunityIcons,
    Entypo,
} from "@expo/vector-icons";
import {
    useFonts,
    Montserrat_700Bold,
    Montserrat_400Regular,
} from "@expo-google-fonts/montserrat";
import { useRouter } from "expo-router";
import AddCategoryModal from "@/src/Components/Add_more"; // adjust path as needed
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import mainStyles from "@/src/styles/mainStyle";

const categories = [
    {
        icon: <Ionicons name="restaurant-outline" size={36} color="#fff" />,
        label: "Ăn Uống",
    },
    {
        icon: <MaterialIcons name="directions-bus" size={36} color="#fff" />,
        label: "Di Chuyển",
    },
    {
        icon: <FontAwesome5 name="briefcase-medical" size={32} color="#fff" />,
        label: "Y Tế",
    },
    {
        icon: (
            <MaterialCommunityIcons
                name="shopping-outline"
                size={36}
                color="#fff"
            />
        ),
        label: "Mua Sắm",
    },
    {
        icon: <Ionicons name="home-outline" size={36} color="#fff" />,
        label: "Nơi Ở",
    },
    {
        icon: (
            <MaterialCommunityIcons
                name="gift-outline"
                size={36}
                color="#fff"
            />
        ),
        label: "Quà Tặng",
    },
    {
        icon: <FontAwesome5 name="piggy-bank" size={32} color="#fff" />,
        label: "Tiết Kiệm",
    },
    {
        icon: <MaterialIcons name="sports-esports" size={36} color="#fff" />,
        label: "Giải Trí",
    },
    { icon: <Entypo name="plus" size={36} color="#fff" />, label: "Thêm" },
];

export default function CategoriesScreen() {
    const [fontsLoaded] = useFonts({
        Montserrat_700Bold,
        Montserrat_400Regular,
    });

    const router = useRouter();
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [customCategories, setCustomCategories] = React.useState<
        { label: string }[]
    >([]);

    // Load custom categories on mount
    React.useEffect(() => {
        AsyncStorage.getItem("customCategories").then((data) => {
            if (data) setCustomCategories(JSON.parse(data));
        });
    }, []);

    // Save custom categories whenever they change
    React.useEffect(() => {
        AsyncStorage.setItem(
            "customCategories",
            JSON.stringify(customCategories)
        );
    }, [customCategories]);

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView style={mainStyles.container}>
            <View style={mainStyles.topSheet} />
            <View style={mainStyles.bottomeSheet}>
                <ScrollView contentContainerStyle={styles.grid}>
                    {categories.map((cat, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={styles.catBtn}
                            onPress={() => {
                                if (cat.label === "Ăn Uống") {
                                    router.push("../Foods");
                                }
                                if (cat.label === "Di Chuyển") {
                                    router.push("../Transport");
                                }
                                if (cat.label === "Y Tế") {
                                    router.push("../Med");
                                }
                                if (cat.label === "Mua Sắm") {
                                    router.push("../Groceries");
                                }
                                if (cat.label === "Nơi Ở") {
                                    router.push("../Rent");
                                }
                                if (cat.label === "Quà Tặng") {
                                    router.push("../Gift");
                                }
                                if (cat.label === "Tiết Kiệm") {
                                    router.push("../Saving");
                                }
                                if (cat.label === "Giải Trí") {
                                    router.push("../Entertain");
                                }
                                if (cat.label === "Thêm") {
                                    setShowAddModal(true);
                                }
                                // Add more navigation for other categories if needed
                            }}>
                            {cat.icon}
                            <Text style={styles.catLabel}>{cat.label}</Text>
                        </TouchableOpacity>
                    ))}
                    {/* Render custom categories */}
                    {customCategories.map((cat, idx) => (
                        <View
                            key={`custom-${idx}`}
                            style={{ position: "relative" }}>
                            <TouchableOpacity
                                style={styles.catBtn}
                                onPress={() =>
                                    router.push({
                                        pathname: "../CustomCategory",
                                        params: { name: cat.label },
                                    })
                                }>
                                <Ionicons
                                    name="pricetag-outline"
                                    size={36}
                                    color="#fff"
                                />
                                <Text style={styles.catLabel}>{cat.label}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() => {
                                    setCustomCategories(
                                        customCategories.filter(
                                            (_, i) => i !== idx
                                        )
                                    );
                                }}>
                                <Ionicons
                                    name="close-circle"
                                    size={22}
                                    color="#f44"
                                />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <AddCategoryModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={(name) => {
                    setCustomCategories([...customCategories, { label: name }]);
                    setShowAddModal(false);
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#6EB5FF", position: "relative" },
    topBackground: {
        width: "100%",
        height: 100,
        backgroundColor: "#6EB5FF",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    backBtn: { padding: 4 },
    userBtn: { padding: 4 },
    header: {
        color: "#fff",
        fontSize: 20,
        fontFamily: "Montserrat_700Bold",
        fontWeight: "bold",
        textAlign: "center",
        flex: 1,
    },
    contentBox: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        paddingVertical: 40,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        position: "absolute",
        top: 120,
        left: 0,
        right: 0,
        bottom: 0,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 16,
    },
    catBtn: {
        width: 90,
        height: 90,
        backgroundColor: "#7EC6FF",
        borderRadius: 20,
        margin: 8,
        alignItems: "center",
        justifyContent: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
    },
    catLabel: {
        color: "#222",
        fontSize: 14,
        marginTop: 8,
        fontFamily: "Montserrat_400Regular",
        textAlign: "center",
    },
    deleteBtn: {
        position: "absolute",
        top: -8,
        right: -8,
        zIndex: 1,
    },
});
