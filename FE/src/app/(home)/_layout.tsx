import React, {use, useEffect, useState} from "react";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import NotificationButton from "@/src/Components/NotificationButton";
import ProfileButton from "@/src/Components/ProfileButton";
import GroupButton from "@/src/Components/GroupButton";
import { useUser } from '../../../UserContext';
import { User } from '../../../models/types';
import { getUserById } from '../../../QuanLyTaiChinh-backend/userServices'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeLayout = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const fetchUserId = async () => {
            const id = await AsyncStorage.getItem('userId');
            console.log('Fetched userId:', id); // Thêm dòng này
            setUserId(id);
        };
        fetchUserId();
    }, []);
    useEffect(() => {
        const fetchUser = async () => {
            if (userId) {
                const userData = await getUserById(userId);
                console.log('Fetched user:', userData); // Thêm dòng này
                setUser(userData);
            }
        };
        fetchUser();
    }, [userId]);
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
                        headerTitle: "Chào " + (user?.name || "123"),
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
                <Tabs.Screen
                    name="social"
                    options={{
                        title: "Social",
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons
                                name="account-group-outline"
                                size={28}
                                color={color}
                            />
                        ),
                        headerRight: () => <GroupButton />,
                    }}
                />
            </Tabs>
        </SafeAreaProvider>
    );
};

export default HomeLayout;
