import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SavingsGoalCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.circle}>
          <Ionicons name="cash-outline" size={24} color="white" />
        </View>
        <Text style={styles.goalText}>Mục Tiêu{"\n"}Tiết Kiệm</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.rightSection}>
        <View style={styles.row}>
          <Text style={styles.label}>Thu nhập tháng trước</Text>
          <Text style={styles.amount}>7,500,000</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <Text style={styles.label}>Chi tiêu tháng trước</Text>
          <Text style={styles.amount}>3,750,000</Text>
        </View>
      </View>
    </View>
  );
};

export default SavingsGoalCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#6DBDFF',
    borderRadius: 80,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 5,
    borderColor: 'black',
    backgroundColor: '#91D2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  goalText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: 'white',
    marginHorizontal: 10,
  },
  rightSection: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    marginBottom: 8,
  },
  label: {
    color: 'white',
    fontSize: 14,
  },
  amount: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: 'white',
    marginVertical: 4,
  },
});
