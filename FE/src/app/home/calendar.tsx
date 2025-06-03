// src/screens/CalendarScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native'; // Import TouchableOpacity
import { PieChart } from 'react-native-chart-kit';
import CalendarComponent from '../../Components/CalendarView';
import TransactionItem from '../../Components/TransactionItem'; // Không cần TabBar nữa
import { Ionicons } from '@expo/vector-icons';
// import { dummySpends, dummyCategories } from '../data/dummyData';

const screenWidth = Dimensions.get('window').width;

const CalendarScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(null); // 'YYYY-MM-DD' format
  const [activeTab, setActiveTab] = useState('spends'); // 'spends' or 'categories'

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
  };

//   const currentDaySpends = selectedDate ? dummySpends[selectedDate] : [];

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

//   const pieChartData = dummyCategories.map((category, index) => ({
//     name: category.name,
//     population: category.percentage,
//     color: ['#007AFF', '#5AC8FA', '#FFD43B', '#FF9500', '#FF2D55'][index % 5], // Example colors
//     legendFontColor: '#7F7F7F',
//     legendFontSize: 15,
//   }));

  return (
        <View style={{backgroundColor: '#6EB5FF'}}>
            <View>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Phân Tích</Text>
            </View>
            <View style={{backgroundColor: '#F1FFF3', borderRadius: 80, marginTop: 50, padding: 30, height: '100%', width: '100%'}}>
                <CalendarComponent onSelectDate={handleDateSelect} />

      {/* TabBar tích hợp trực tiếp */}
      <View style={styles.tabBarContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'spends' && styles.activeTabButton]}
          onPress={() => handleTabSelect('spends')}
        >
          <Text style={[styles.tabText, activeTab === 'spends' && styles.activeTabText]}>Spends</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'categories' && styles.activeTabButton]}
          onPress={() => handleTabSelect('categories')}
        >
          <Text style={[styles.tabText, activeTab === 'categories' && styles.activeTabText]}>Categories</Text>
        </TouchableOpacity>
      </View>
      {/* Kết thúc TabBar tích hợp */}

      {/* <ScrollView style={styles.contentContainer}>
        {activeTab === 'spends' ? (
          <View>
            {currentDaySpends && currentDaySpends.length > 0 ? (
              currentDaySpends.map((spend) => (
                <SpendItem
                  key={spend.id}
                  iconName={spend.icon}
                  title={spend.title}
                  timeRange={spend.time}
                  amount={spend.amount}
                />
              ))
            ) : (
              <Text style={styles.noDataText}>Không có chi tiêu nào cho ngày này.</Text>
            )}
          </View>
        ) : (
          <View style={styles.chartView}>
            {dummyCategories.length > 0 ? (
              <>
                <PieChart
                  data={pieChartData}
                  width={screenWidth - 40}
                  height={200}
                  chartConfig={chartConfig}
                  accessor={"population"}
                  backgroundColor={"transparent"}
                  paddingLeft={"15"}
                  center={[10, 0]}
                  absolute // To display absolute values if needed
                />
                <Text style={styles.chartLabel}>Biểu Đồ Ở Đây</Text>
              </>
            ) : (
              <Text style={styles.noDataText}>Không có dữ liệu danh mục chi tiêu.</Text>
            )}
          </View>
        )}
      </ScrollView> */}
            </View>
        </View>    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7', // Light gray background
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#69A7FF',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  // backButton: {
  //   marginRight: 10,
  // },
  // backButtonText: {
  //   fontSize: 24,
  //   color: '#007AFF',
  // },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    // marginLeft: 10, // Remove if back button is present
  },
  // Style cho TabBar tích hợp trực tiếp
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 25,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTabButton: {
    backgroundColor: '#007AFF', // Blue for active tab
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  // End Style cho TabBar tích hợp trực tiếp

  contentContainer: {
    flex: 1,
    marginTop: 20,
  },
  chartView: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  chartLabel: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  },
});

export default CalendarScreen;