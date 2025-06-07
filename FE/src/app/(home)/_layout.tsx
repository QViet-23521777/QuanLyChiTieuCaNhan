import React from "react";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import NotificationButton from "@/src/Components/NotificationButton";
import ProfileButton from "@/src/Components/ProfileButton";

const HomeLayout = () => {
    return (
        <SafeAreaProvider>
            <Tabs
                screenOptions={{
                    headerShown: true,
                    headerTransparent: true,
                    headerLeft: () => <ProfileButton />,
                    headerRight: () => <NotificationButton />,
                    headerTitleAlign: "center",
                }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Home",
                        headerTitle: "Chào Pendragon",
                        headerTitleStyle: {
                            fontSize: 20,
                            fontWeight: "bold",
                            color: "#fff",
                        },
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons
                                name="home"
                                size={28}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="statistics"
                    options={{
                        title: "Statistics",
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons
                                name="chart-box-outline"
                                size={28}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="balance"
                    options={{
                        title: "Balance",
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons
                                name="bank-transfer"
                                size={28}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="categories"
                    options={{
                        title: "Categories",
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons
                                name="layers-outline"
                                size={28}
                                color={color}
                            />
                        ),
                    }}
                />
                {/* <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Profile",
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons
                                name="account-box-outline"
                                size={28}
                                color={color}
                            />
                        ),
                    }}
                /> */}
            </Tabs>
        </SafeAreaProvider>
    );
};

export default HomeLayout;
