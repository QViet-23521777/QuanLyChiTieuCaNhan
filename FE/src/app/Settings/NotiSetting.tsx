import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import SettingTemplate from '../../Components/SettingTemplate';

export default function NotiSettingScreen() {
  const [general, setGeneral] = useState(true);
  const [sound, setSound] = useState(false);
  const [vibrate, setVibrate] = useState(true);

  return (
    <SettingTemplate title="Cài Đặt Thông Báo" style={{}}>
      <View style={styles.row}>
        <Text style={styles.label}>Thông Báo Chung</Text>
        <Switch
          value={general}
          onValueChange={setGeneral}
          trackColor={{ false: '#D6EAF8', true: '#7EC6FF' }}
          thumbColor={general ? '#fff' : '#fff'}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Âm Báo</Text>
        <Switch
          value={sound}
          onValueChange={setSound}
          trackColor={{ false: '#D6EAF8', true: '#7EC6FF' }}
          thumbColor={sound ? '#fff' : '#fff'}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Rung</Text>
        <Switch
          value={vibrate}
          onValueChange={setVibrate}
          trackColor={{ false: '#D6EAF8', true: '#7EC6FF' }}
          thumbColor={vibrate ? '#fff' : '#fff'}
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