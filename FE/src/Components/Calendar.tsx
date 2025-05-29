import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const MONTHS = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

export default function CalendarPicker({
  mode,
  selectedDate,
  selectedMonth,
  selectedYear,
  onDateChange,
  onMonthChange,
  onYearChange,
  style,
}) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={style}>
      <TouchableOpacity onPress={() => setShowPicker(true)} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginRight: 8 }}>
          {mode === 'month'
            ? `${MONTHS[selectedMonth]} ${selectedYear}`
            : `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`}
        </Text>
        <Ionicons name="calendar-outline" size={22} color="#7EC6FF" />
      </TouchableOpacity>
      {mode === 'day' && showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) onDateChange(date);
          }}
        />
      )}
      {mode === 'month' && (
        <Modal visible={showPicker} transparent animationType="fade">
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.15)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              backgroundColor: '#fff',
              borderRadius: 24,
              padding: 24,
              width: '80%',
              alignItems: 'center',
              elevation: 8,
              maxHeight: 400,
            }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16, color: '#222' }}>Chọn Tháng/Năm</Text>
              <ScrollView>
                {MONTHS.map((label, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 12,
                      marginBottom: 6,
                      alignItems: 'center',
                      backgroundColor: idx === selectedMonth ? '#D6EAF8' : undefined,
                    }}
                    onPress={() => onMonthChange(idx)}
                  >
                    <Text style={{
                      fontSize: 16,
                      color: idx === selectedMonth ? '#007AFF' : '#222',
                      fontWeight: idx === selectedMonth ? 'bold' : 'normal',
                    }}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={{ flexDirection: 'row', marginTop: 12, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity
                  style={{ padding: 6, marginHorizontal: 10 }}
                  onPress={() => onYearChange(selectedYear - 1)}
                >
                  <Ionicons name="chevron-back" size={20} color="#7EC6FF" />
                </TouchableOpacity>
                <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#222', marginHorizontal: 6 }}>{selectedYear}</Text>
                <TouchableOpacity
                  style={{ padding: 6, marginHorizontal: 10 }}
                  onPress={() => onYearChange(selectedYear + 1)}
                >
                  <Ionicons name="chevron-forward" size={20} color="#7EC6FF" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{
                  marginTop: 18,
                  paddingVertical: 8,
                  paddingHorizontal: 24,
                  backgroundColor: '#7EC6FF',
                  borderRadius: 14,
                }}
                onPress={() => setShowPicker(false)}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Xong</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}