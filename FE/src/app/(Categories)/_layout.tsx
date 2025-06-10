import {Slot, Stack, Tabs} from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NotificationButton from "@/src/Components/NotificationButton";
import ProfileButton from "@/src/Components/ProfileButton";
import { UserProvider } from '@/UserContext';
import AddButton from '@/src/Components/AddButton';

const RootLayout = () => {
    return (
    <UserProvider>
        <Stack
            screenOptions={{
                headerTransparent: true,
                // headerLeft: () => <ProfileButton />,
                headerRight: () => <AddButton />,
                headerTitleAlign: 'center',
            }}>
            <Stack.Screen name='Foods' options={{ headerShown: true, title: 'Ăn uống' }} />
            <Stack.Screen name='Entertain' options={{ headerShown: true, title: 'Giải trí' }} />
            <Stack.Screen name='Gift' options={{ headerShown: true, title: 'Quà tặng' }} />
            <Stack.Screen name='Groceries' options={{ headerShown: true, title: 'Mua sắm' }} />
            <Stack.Screen name='Med' options={{ headerShown: true, title: 'Y tế' }} />
            <Stack.Screen name='Rent' options={{ headerShown: true, title: 'Nơi ở' }} />
            <Stack.Screen name='Transport' options={{ headerShown: true, title: 'Di chuyển' }} />
            <Stack.Screen name='Saving' options={{ headerShown: true, title: 'Tiết kiệm' }} />
        </Stack>
    </UserProvider>
    )
}

export default RootLayout;