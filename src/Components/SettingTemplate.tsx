import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SettingTemplate({ title = '', children, style }) {
  const router = useRouter();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.topBackground}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.header} numberOfLines={1}>{title}</Text>
          <View style={{ width: 26 }} /> 
        </View>
      </View>
      <View style={styles.contentBox}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6EB5FF' },
  topBackground: {
    height: 100,
    backgroundColor: '#6EB5FF',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'flex-end',
    paddingBottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 36,
  },
  backBtn: {
    width: 26,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  header: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Montserrat_700Bold',
    textAlign: 'center',
  },
  contentBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: 48,
    padding: 24,
  },
});