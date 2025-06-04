import {View} from 'react-native';
import styles from '../../styles/style';
import SavingsGoalCard from '../../Components/SavingGoalCard';
import TransactionScreen from '../../Components/TransactionSummary';
import GreetingHeader from '../../Components/HomeHeader';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    return (
        <SafeAreaView style={{backgroundColor: '#6EB5FF'}}>
            <View>
                <GreetingHeader />
            </View>
            <View style={{backgroundColor: '#F1FFF3', borderRadius: 80, marginTop: 50, padding: 30, height: '100%', width: '100%'}}>
                <SavingsGoalCard />
                <TransactionScreen />
            </View>
        </SafeAreaView>
    );
}