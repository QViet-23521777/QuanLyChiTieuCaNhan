import {Slot, Stack, Tabs} from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NotificationButton from "@/src/Components/NotificationButton";
import ProfileButton from "@/src/Components/ProfileButton";

const RootLayout = () => {
    return (
        <SafeAreaProvider>
            <Stack
                screenOptions={{
                    headerTransparent: true,
                    // headerLeft: () => <ProfileButton />,
                    headerRight: () => <NotificationButton />,
                    headerTitleAlign: 'center',
                }}>
                <Stack.Screen name='index' options={{ headerShown: false }} />
                <Stack.Screen name='(home)' options={{ headerShown: false }} />
                <Stack.Screen name='notification' options={{ headerShown: true, title: 'Notification' }} />
                <Stack.Screen name='search' options={{ headerShown: true, title: 'Search' }} />
                <Stack.Screen name='calendar' options={{ headerShown: true, title: 'Calendar' }} />
                <Stack.Screen name='transfer' options={{ headerShown: true, title: 'Transfer' }} />
            </Stack>
        </SafeAreaProvider>
    )
}

export default RootLayout;