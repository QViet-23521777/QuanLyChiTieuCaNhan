import React from 'react';
import { View, ImageBackground, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');
const bgImage = require('../../assets/images/onboarding2.jpg');

export default function Onboarding2() {
  const handleStart = () => {
    router.replace('/login');
  };

  return (
    <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <Text style={{ fontFamily: 'Montserrat', fontSize: 32, color: '#fff', fontWeight: 'bold', marginBottom: 430, marginLeft: 50, marginRight: 50, textAlign: 'center' }}>
          Giúp bạn kiểm soát thu chi một cách hiệu quả hơn
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>Bắt Đầu</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width,
    height,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 60,
  },
  button: {
    marginBottom: 80,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 40,
    elevation: 2,
  },
  buttonText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
});