import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import TransactionItem from './TransactionItem'; // Reuse từ phần trước

const filters = ['Ngày', 'Tuần', 'Tháng'];

const allData = {
  Ngày: [
    { title: 'Mua Sắm', time: '10:00 - 3/6', amount: 100000 },
    { title: 'Nơi Ở', time: '8:00 - 3/6', amount: 3250000 },
  ],
  Tuần: [
    { title: 'Thu Nhập', time: '10:00 - 30/5', amount: 5000000 },
    { title: 'Mua Sắm', time: '16:00 - 1/6', amount: 450000 },
  ],
  Tháng: [
    { title: 'Thu Nhập', time: '18:27 - 30/4', amount: 7500000 },
    { title: 'Mua Sắm', time: '17:00 - 20/5', amount: 500000 },
    { title: 'Nơi Ở', time: '8:30 - 13/5', amount: 3250000 },
  ],
};

const TransactionScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('Tháng');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterRow}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setSelectedFilter(filter)}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={allData[selectedFilter]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TransactionItem
            title={item.title}
            time={item.time}
            amount={item.amount}
          />
        )}
        contentContainerStyle={{ paddingTop: 10 }}
      />
    </SafeAreaView>
  );
};

export default TransactionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8FFF0',
    padding: 16,
  },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#D6F0FF',
    borderRadius: 25,
    padding: 4,
    justifyContent: 'space-around',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  filterButtonActive: {
    backgroundColor: '#6DBDFF',
  },
  filterText: {
    color: '#000',
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
});
