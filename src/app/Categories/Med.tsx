import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useFonts, Montserrat_700Bold, Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import { useRouter } from 'expo-router';
import Outline from '../../Components/Outline';
import CalendarPicker from '../../Components/Calendar';

const initialExpenses = [
  {
    id: 1,
    name: 'Long Châu',
    time: '14:00',
    date: '11',
    month: '3',
    year: '2025',
    amount: 1,
  },
  // Add more dummy data if needed
];

export default function GroceriesScreen() {
  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_400Regular,
  });

  const [expenses] = useState(initialExpenses);
  const router = useRouter();

  // Time picker state
  const [mode, setMode] = useState<'day' | 'month'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  if (!fontsLoaded) return null;

  // Filter expenses
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
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/Categories/Categories')}>
          <Ionicons name="arrow-back" size={24} color="#7EC6FF" />
        </TouchableOpacity>
        <Text style={styles.header}>Y Tế</Text>
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
              <FontAwesome5 name="briefcase-medical" size={28} color="#fff" />
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
        onPress={() => router.push('/Categories/AddExpense?defaultCategory=Y%20Tế')}
      >
        <Text style={styles.addBtnText}>Thêm Khoản Chi</Text>
      </TouchableOpacity>
    </Outline>
  );
}

const styles = StyleSheet.create({
  backBtn: { padding: 4 },
  header: {
    color: '#222',
    fontSize: 22,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
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
    fontFamily: 'Montserrat_700Bold',
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    color: '#222',
  },
  expenseTime: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: '#7EC6FF',
  },
  expenseAmount: {
    fontFamily: 'Montserrat_700Bold',
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
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
  },
});