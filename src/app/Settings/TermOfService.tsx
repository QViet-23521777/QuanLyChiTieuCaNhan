import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SettingTemplate from '../../Components/SettingTemplate';
import { router } from 'expo-router';
export default function TermOfServiceScreen() {
  const [checked, setChecked] = useState(false);

  return (
    <SettingTemplate title="Điều Khoản Sử Dụng" style={{}}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setChecked(!checked)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={checked ? 'checkbox-outline' : 'square-outline'}
            size={24}
            color="#145A5A"
          />
          <Text style={styles.checkboxLabel}>Tôi đồng ý với điều khoản trên</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} 
          style={[
            styles.button,
            { backgroundColor: checked ? '#7EC6FF' : '#D6EAF8' },
          ]}
          disabled={!checked}
        >
          <Text style={styles.buttonText}>Chấp nhận</Text>
        </TouchableOpacity>
      </View>
    </SettingTemplate>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 340,
    marginBottom: 28,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 15,
    color: '#222',
    fontFamily: 'Montserrat_400Regular',
  },
  button: {
    alignSelf: 'center',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 48,
    alignItems: 'center',
    marginTop: 0,
  },
  buttonText: {
    color: '#000',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
  },
});