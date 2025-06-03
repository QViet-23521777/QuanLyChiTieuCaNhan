import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const tabs = ['Ngày', 'Tuần', 'Tháng', 'Năm'];

const AnalyticsScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('Tháng');

  const chartData = {
    labels: ['Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'CN'],
    datasets: [
      {
        data: [1000000, 750000, 200000, 0, 500000, 1250000, 300000],
        color: () => '#2F80ED',
        strokeWidth: 2,
      },
      {
        data: [500000, 0, 250000, 100000, 400000, 700000, 180000],
        color: () => '#EB5757',
        strokeWidth: 2,
      },
    ],
    legend: ['Thu Nhập', 'Chi Tiêu'],
  };

  return (
        <View style={{backgroundColor: '#6EB5FF'}}>
            <View>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Phân Tích</Text>
                    <Ionicons name="notifications-outline" size={24} color="#fff" />
                </View>
                <View style={styles.summaryBox}>
                    <View style={styles.circle}>
                        <Ionicons name="wallet-outline" size={24} color="#fff" />
                        <Text style={styles.circleText}>Mục Tiêu{'\n'}Tiết Kiệm</Text>
                    </View>
                <View style={styles.summaryText}>
                    <Text>Thu nhập tháng trước</Text>
                    <Text style={styles.income}>7,500,000</Text>
                    <View style={styles.divider} />
                        <Text>Chi tiêu tháng trước</Text>
                        <Text style={styles.expense}>3,750,000</Text>
                    </View>
                </View>
            </View>
            
            <View style={{backgroundColor: '#F1FFF3', borderRadius: 80, marginTop: 30, padding: 30, height: '100%', width: '100%'}}>
                <View style={styles.tabs}>
                    {tabs.map(tab => (
                        <TouchableOpacity
                            key={tab}
                            style={[
                            styles.tab,
                            selectedTab === tab && styles.tabSelected
                        ]}
                        onPress={() => setSelectedTab(tab)}>
                        <Text style={selectedTab === tab ? styles.tabTextSelected : styles.tabText}>
                            {tab}
                        </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.incomeExpense}>
                    <Text style={styles.incomeLabel}>
                        <Ionicons name="arrow-up-outline" size={16} color="#2F80ED" /> Income
                    </Text>
                    <Text style={styles.expenseLabel}>
                        <Ionicons name="arrow-down-outline" size={16} color="#EB5757" /> Expense
                    </Text>
                </View>

                <View style={styles.chartContainer}>
                {/* Header của biểu đồ */}
                <View style={styles.chartHeader}>
                    <Text style={styles.chartTitle}>Thu & Chi</Text>
                    <View style={styles.chartButtons}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="search" size={18} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="calendar-clear-outline" size={18} color="#000" />
                    </TouchableOpacity>
                    </View>
                </View>

                {/* Biểu đồ */}
                <LineChart
                    data={chartData}
                    width={screenWidth - 32}
                    height={220}
                    chartConfig={{
                    backgroundGradientFrom: '#EAF3FF',
                    backgroundGradientTo: '#EAF3FF',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                    labelColor: () => '#2C3E50',
                    propsForDots: {
                        r: "4",
                        strokeWidth: "2",
                        stroke: "#fff"
                    }
                    }}
                    bezier
                    style={styles.chartStyle}
                />
                </View>
            </View>
        </View>
    );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    backgroundColor: '#69A7FF',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryBox: {
    backgroundColor: '#69A7FF',
    margin: 16,
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    backgroundColor: '#0D65D9',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  circleText: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
  },
  summaryText: {
    flex: 1,
  },
  income: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  expense: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#fff',
    marginVertical: 4,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    marginHorizontal: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#EAEFFF',
  },
  tabSelected: {
    backgroundColor: '#4F91FF',
  },
  tabText: {
    color: '#2F80ED',
  },
  tabTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  incomeExpense: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  incomeLabel: {
    color: '#2F80ED',
    fontWeight: 'bold',
  },
  expenseLabel: {
    color: '#EB5757',
    fontWeight: 'bold',
  },
  chartContainer: {
  backgroundColor: '#EAF3FF',
  margin: 16,
  borderRadius: 24,
  padding: 16,
  paddingBottom: 0,
},
chartHeader: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
marginBottom: 12,
},
chartTitle: {
fontSize: 16,
fontWeight: 'bold',
color: '#2C3E50',
},
chartButtons: {
flexDirection: 'row',
gap: 8,
},
iconButton: {
backgroundColor: '#BFDFFF',
borderRadius: 12,
padding: 6,
},
chartStyle: {
borderRadius: 20,
}

});
