import {Slot, Stack, Tabs} from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const RootLayout = () => {
    return (
        <SafeAreaProvider>
            <Stack>
                <Stack.Screen name='index' options={{ headerShown: false }} />
                <Stack.Screen name='(home)' options={{ headerShown: false }} />
                <Stack.Screen name='notification' options={{ headerShown: false }} />
            </Stack>
        </SafeAreaProvider>
    )
}

export default RootLayout;