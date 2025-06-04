import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import SavingsGoalCard from '@/src/Components/SavingGoalCard';
import TransactionScreen from '@/src/Components/TransactionSummary';
import TransactionItem from '@/src/Components/TransactionItem';
import { Link } from 'expo-router';

const data = {
  Thu: [
    { title: 'Mua Sắm', time: '10:00 - 3/6', amount: 100000 },
    { title: 'Nơi Ở', time: '8:00 - 3/6', amount: 3250000 },
  ],
  Chi: [
    { title: 'Thu Nhập', time: '10:00 - 30/5', amount: 5000000 },
    { title: 'Mua Sắm', time: '16:00 - 1/6', amount: 450000 },
  ],
};

const BalanceScreen = ({ username = 'Pendragon', wallet = 5000000, expense = 3750000, navigation  }) => {
    return(
        <View style={{backgroundColor: '#6EB5FF'}}>
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20}}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text>Phân Tích</Text>
                <Ionicons name="notifications-outline" size={24} color="#fff" />
              </View>
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
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <View style={styles.income}>
                    <MaterialCommunityIcons name="arrow-top-right-bold-box" size={16} color='green'/>
                    <Text>Thu</Text>
                    <Text>7500000</Text>
                  </View>
                  <View style={styles.income}>
                    <MaterialCommunityIcons name="arrow-bottom-right-bold-box" size={16} color='red'/>
                    <Text>Chi</Text>
                    <Text>3750000</Text>
                  </View>
                </View>
            </View>
            <View style={{backgroundColor: '#F1FFF3', borderRadius: 80, marginTop: 30, padding: 30, height: '100%', width: '100%'}}>
                <View style={{flexDirection: 'row'}}>
                  <Text>Thu chi</Text>
                  <Link href="/transfer">See all</Link>
                </View>
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
  income: {
    backgroundColor: '#F1FFF3', padding: 20, borderRadius: 20, flex: 1, marginRight: 20, marginLeft: 20, alignContent: 'center', justifyContent: 'space-between', alignItems: 'center'
  },
})

export default BalanceScreen;