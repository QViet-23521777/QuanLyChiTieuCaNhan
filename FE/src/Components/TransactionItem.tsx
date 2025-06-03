import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const iconMap = {
  'Thu Nhập': <Ionicons name="cash-outline" size={24} color="white" />,
  'Mua Sắm': <MaterialCommunityIcons name="shopping-outline" size={24} color="white" />,
  'Nơi Ở': <FontAwesome5 name="key" size={20} color="white" />,
};

const backgroundMap = {
  'Thu Nhập': '#90CDF4',
  'Mua Sắm': '#42A5F5',
  'Nơi Ở': '#2196F3',
};

const TransactionItem = ({ title, time, amount }) => {
  const isIncome = title === 'Thu Nhập';

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={[styles.iconWrapper, { backgroundColor: backgroundMap[title] || '#6DBDFF' }]}>
          {iconMap[title]}
        </View>
        <View style={styles.textInfo}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
      <Text style={[styles.amount, { color: isIncome ? '#007AFF' : 'red' }]}>
        {amount.toLocaleString()}
      </Text>
    </View>
  );
};

export default TransactionItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#E0E0E0',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textInfo: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  time: {
    fontSize: 14,
    color: '#007AFF',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
