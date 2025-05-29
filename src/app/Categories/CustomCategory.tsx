import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Outline from '../../Components/Outline';
import CalendarPicker from '../../Components/Calendar';

export default function CustomCategoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const categoryName = params.name || 'Danh mục';

  // Dummy data for demonstration
  const [expenses] = useState([
    {
      id: 1,
      name: 'Chi tiêu mẫu',
      time: '12:00',
      date: '1',
      month: '5',
      year: '2025',
      amount: 12345,
    },
  ]);

  const [mode, setMode] = useState<'day' | 'month'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const filteredExpenses = expenses.filter(exp => {
    if (mode === 'day') {
      return (
        parseInt(exp.date) === selectedDate.getDate() &&
        parseInt(exp.month) === selectedDate.getMonth() + 1 &&
        parseInt(exp.year) === selectedDate.getFullYear()
      );
    } else {
      return (
        parseInt(exp.month) === selectedMonth + 1 &&
        parseInt(exp.year) === selectedYear
      );
    }
  });

  return (
    <Outline>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <TouchableOpacity style={{ padding: 4 }} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#7EC6FF" />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#222', flex: 1, textAlign: 'center' }}>
          {categoryName}
        </Text>
        <View style={{ flex: 1 }} />
      </View>
      <View style={styles.timeRow}>
        <TouchableOpacity
          style={[styles.timeToggle, mode === 'month' && styles.timeToggleActive]}
          onPress={() => setMode('month')}
        >
          <Text style={[styles.timeToggleText, mode === 'month' && styles.timeToggleTextActive]}>
            Theo tháng
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeToggle, mode === 'day' && styles.timeToggleActive]}
          onPress={() => setMode('day')}
        >
          <Text style={[styles.timeToggleText, mode === 'day' && styles.timeToggleTextActive]}>
            Theo ngày
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.monthRow}>
        <CalendarPicker
          mode={mode}
          selectedDate={selectedDate}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onDateChange={setSelectedDate}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          style={{}}
        />
      </View>
      <ScrollView>
        {filteredExpenses.length === 0 && (
          <Text style={{ textAlign: 'center', color: '#888', marginTop: 24 }}>Không có dữ liệu</Text>
        )}
        {filteredExpenses.map(exp => (
          <View key={exp.id} style={styles.expenseRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="pricetag-outline" size={28} color="#fff" />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.expenseName}>{exp.name}</Text>
              <Text style={styles.expenseTime}>
                {exp.time} - {exp.date}/{exp.month}
              </Text>
            </View>
            <Text style={styles.expenseAmount}>
              {exp.amount.toLocaleString('vi-VN')}
            </Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push(`/Categories/AddExpense?defaultCategory=${encodeURIComponent(categoryName as string)}`)}
      >
        <Text style={styles.addBtnText}>Thêm Khoản Chi</Text>
      </TouchableOpacity>
    </Outline>
  );
}

const styles = StyleSheet.create({
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 8,
  },
  timeToggle: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: '#D6EAF8',
  },
  timeToggleActive: {
    backgroundColor: '#7EC6FF',
  },
  timeToggleText: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: 15,
  },
  timeToggleTextActive: {
    color: '#fff',
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginHorizontal: 8,
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F1FF',
    borderRadius: 18,
    marginBottom: 12,
    padding: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7EC6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  expenseTime: {
    fontSize: 13,
    color: '#7EC6FF',
  },
  expenseAmount: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#F00',
    marginLeft: 8,
  },
  addBtn: {
    backgroundColor: '#7EC6FF',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
    alignSelf: 'center',
    width: 180,
  },
  addBtnText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
});