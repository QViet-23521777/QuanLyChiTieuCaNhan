import {View} from 'react-native';
import styles from '../../styles/mainStyle';
import SavingsGoalCard from '../../Components/SavingGoalCard';
import TransactionScreen from '../../Components/TransactionSummary';
import GreetingHeader from '../../Components/HomeHeader';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import mainStyles from '@/src/styles/mainStyle';

export default function HomeScreen() {
    return (
        <SafeAreaView style={mainStyles.container}>
            <SafeAreaView style={[mainStyles.topSheet, {padding: 24}]}>
                <GreetingHeader />
            </SafeAreaView>
            <View style={mainStyles.bottomeSheet}>
                <SavingsGoalCard />
                <TransactionScreen />
            </View>
        </SafeAreaView>
    );
}