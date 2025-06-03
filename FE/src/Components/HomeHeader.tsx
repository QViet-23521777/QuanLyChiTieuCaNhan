import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const GreetingHeader = ({ username = 'Pendragon', wallet = 5000000, expense = 3750000,  }) => {
  return (
    <View style={styles.container}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greeting}>Chào {username}</Text>
          <Text style={styles.subGreeting}>Buổi sáng vui vẻ</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Summary row */}
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
    </View>
  );
};

export default GreetingHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#6DBDFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  subGreeting: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
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
});
