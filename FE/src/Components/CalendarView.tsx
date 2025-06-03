// src/components/CalendarComponent.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment'; // Cần cài đặt: npm install moment

const CalendarComponent = ({ onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment());

  const startOfMonth = currentMonth.clone().startOf('month').startOf('week');
  const endOfMonth = currentMonth.clone().endOf('month').endOf('week');

  const days = [];
  let day = startOfMonth.clone();

  while (day.isSameOrBefore(endOfMonth, 'day')) {
    days.push(day.clone());
    day.add(1, 'day');
  }

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentMonth(currentMonth.clone().subtract(1, 'month'))}>
          <Text style={styles.navText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Tháng {currentMonth.format('M')} {currentMonth.format('YYYY')}</Text>
        <TouchableOpacity onPress={() => setCurrentMonth(currentMonth.clone().add(1, 'month'))}>
          <Text style={styles.navText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDaysOfWeek = () => {
    const daysOfWeek = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
    return (
      <View style={styles.daysOfWeekContainer}>
        {daysOfWeek.map((dayName, index) => (
          <Text key={index} style={styles.dayOfWeekText}>{dayName}</Text>
        ))}
      </View>
    );
  };

  const renderDays = () => {
    return (
      <View style={styles.daysContainer}>
        {days.map((d, index) => {
          const isToday = d.isSame(moment(), 'day');
          const isSelected = d.isSame(selectedDate, 'day');
          const isCurrentMonth = d.isSame(currentMonth, 'month');
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                isToday && styles.todayCell,
                isSelected && styles.selectedCell,
                !isCurrentMonth && styles.outsideMonthCell,
              ]}
              onPress={() => {
                setSelectedDate(d);
                onSelectDate(d.format('YYYY-MM-DD'));
              }}
            >
              <Text style={[
                styles.dayText,
                isSelected && styles.selectedText,
                !isCurrentMonth && styles.outsideMonthText,
              ]}>
                {d.format('D')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  useEffect(() => {
    onSelectDate(selectedDate.format('YYYY-MM-DD')); // Call onSelectDate initially
  }, []);


  return (
    <View style={styles.calendarContainer}>
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderDays()}
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  navText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF', // Example color
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayOfWeekText: {
    fontSize: 12,
    color: '#666',
    width: '14%', // Approximately 1/7th
    textAlign: 'center',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1, // Make it square
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  todayCell: {
    // backgroundColor: '#E0F7FA', // Light blue for today
    borderRadius: 5,
  },
  selectedCell: {
    backgroundColor: '#007AFF', // Blue for selected date
    borderRadius: 5,
  },
  outsideMonthCell: {
    opacity: 0.4, // Dim days outside the current month
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  outsideMonthText: {
    color: '#999',
  },
});

export default CalendarComponent;