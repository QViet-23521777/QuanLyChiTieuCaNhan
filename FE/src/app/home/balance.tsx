import {View, Text, StyleSheet, FlatList} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import SavingsGoalCard from '@/src/Components/SavingGoalCard';
import TransactionScreen from '@/src/Components/TransactionSummary';
import TransactionItem from '@/src/Components/TransactionItem';

const data = [
    { title: 'Mua Sắm', time: '10:00 - 3/6', amount: 100000 },
    { title: 'Nơi Ở', time: '8:00 - 3/6', amount: 3250000 },
]

const BalanceScreen = ({ username = 'Pendragon', wallet = 5000000, expense = 3750000,  }) => {
    return(
        <View style={{backgroundColor: '#6EB5FF'}}>
            <View>
                <View style={styles.summaryRow}>
                    <View style={styles.block}>
                    <View style={styles.labelRow}>
                        <MaterialCommunityIcons name="wallet-outline" size={16} color="#fff" />
                        <Text style={styles.label}>Tổng Ví</Text>
                    </View>
                    <Text style={styles.amount}>{wallet.toLocaleString()}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.block}>
                    <View style={styles.labelRow}>
                        <Ionicons name="trending-down-outline" size={16} color="#fff" />
                        <Text style={styles.label}>Tổng Chi</Text>
                    </View>
                    <Text style={styles.amount}>{expense.toLocaleString()}</Text>
                    </View>
                </View>
                <SavingsGoalCard />
            </View>
            <View style={{backgroundColor: '#F1FFF3', borderRadius: 80, marginTop: 50, padding: 30, height: '100%', width: '100%'}}>
                <Text>Thu chi</Text>
                <FlatList
                    data = {data}
                    renderItem={({ item }) => (
                        <TransactionItem
                            title = {item.title}
                            time = {item.time}
                            amount = {item.amount}/>
                    )}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    alignItems: 'center',
  },
  block: {
    alignItems: 'center',
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  divider: {
    width: 1,
    backgroundColor: '#fff',
    height: '100%',
    marginHorizontal: 10,
  },
})

export default BalanceScreen;