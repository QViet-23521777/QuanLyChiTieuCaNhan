import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import SettingTemplate from '@/src/Components/SettingTemplate';

export default function AISettingsScreen() {
  const [noti, setNoti] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [chatbot, setChatbot] = useState(true);
  const [reminder, setReminder] = useState(false);
  const [transactionUpdate, setTransactionUpdate] = useState(false);
  const [budgetNoti, setBudgetNoti] = useState(false);
  const [lowBalance, setLowBalance] = useState(false);

  return (
    <SettingTemplate title="AI ChatBot" style={{}}>
      <View style={styles.row}>
        <Text style={styles.label}>Thông báo</Text>
        <Switch
          value={noti}
          onValueChange={setNoti}
          trackColor={{ false: '#D6EAF8', true: '#7EC6FF' }}
          thumbColor="#fff"
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Phân tích</Text>
        <Switch
          value={analytics}
          onValueChange={setAnalytics}
          trackColor={{ false: '#D6EAF8', true: '#7EC6FF' }}
          thumbColor="#fff"
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>ChatBot</Text>
        <Switch
          value={chatbot}
          onValueChange={setChatbot}
          trackColor={{ false: '#D6EAF8', true: '#7EC6FF' }}
          thumbColor="#fff"
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Nhắc nhở chi tiêu</Text>
        <Switch
          value={reminder}
          onValueChange={setReminder}
          trackColor={{ false: '#D6EAF8', true: '#7EC6FF' }}
          thumbColor="#fff"
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Cập Nhật Giao Dịch</Text>
        <Switch
          value={transactionUpdate}
          onValueChange={setTransactionUpdate}
          trackColor={{ false: '#D6EAF8', true: '#7EC6FF' }}
          thumbColor="#fff"
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Thông Báo Ngân Sách</Text>
        <Switch
          value={budgetNoti}
          onValueChange={setBudgetNoti}
          trackColor={{ false: '#D6EAF8', true: '#7EC6FF' }}
          thumbColor="#fff"
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Cảnh Báo Số Dư Thấp</Text>
        <Switch
          value={lowBalance}
          onValueChange={setLowBalance}
          trackColor={{ false: '#D6EAF8', true: '#7EC6FF' }}
          thumbColor="#fff"
        />
      </View>
    </SettingTemplate>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  label: {
    fontSize: 15,
    color: '#222',
    fontFamily: 'Montserrat_700Bold',
  },
});