import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#97A2FF', position: 'relative' },
  topBackground: {
    width: '100%',
    height: 100,
    backgroundColor: '#6EB5FF',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  header: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 40, fontFamily: 'Montserrat', },  
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 60,
    width: '100%',
    height: '100%',
    padding: 30,
    alignItems: 'center',
    marginTop: 32,
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
  },
  label: { alignSelf: 'flex-start', color: '#000', fontWeight: 'medium', marginTop: 12, marginBottom: 4, fontFamily: 'Montserrat_400Regular', fontSize: 15 },
  input: {
    backgroundColor: '#D6EAF8',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    width: '100%',
    marginBottom: 8,
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center', width: '100%', fontFamily: 'Poppins' },
  fingerprintRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginVertical: 16, alignSelf: 'flex-start' },
  fingerprintText: { marginLeft: 8, color: '#000', fontSize: 15, fontFamily: 'Montserrat_400Regular', fontWeight: 'semibold' },
  fingerprintTextBlue: { color: '#2C7FFF', fontFamily: 'Montserrat_400Regular', fontWeight: 'bold', fontSize: 16 },
  loginBtn: {
    backgroundColor: '#3887FE',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 8,
    marginBottom: 8,
    width: '100%',
    alignItems: 'center',
    fontFamily: 'Montserrat_700Bold',
    fontWeight: 'bold',
  },
  loginBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18, fontFamily: 'Montserrat_700Bold', },
  forgot: { color: '#222', marginVertical: 8, fontWeight: '500' },
  registerBtn: {
    backgroundColor: '#D6EAF8',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 8,
    marginBottom: 8,
    width: '100%',
    alignItems: 'center',
    fontFamily: 'Montserrat_700Bold',
    fontWeight: 'bold',
  },
  registerBtnText: { color: '#222', fontWeight: 'bold', fontSize: 18, fontFamily: 'Montserrat_700Bold' },
  orText: { color: '#222', marginTop: 32, marginBottom: 8, fontWeight: '500', fontFamily: 'Montserrat_700Bold', fontSize: 16 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', width: '100%' },
  userBtn: { padding: 4 },
});

export default styles