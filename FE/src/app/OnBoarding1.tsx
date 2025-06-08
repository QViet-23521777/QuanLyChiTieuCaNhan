import React from 'react';
import { View, ImageBackground, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');
const bgImage = require('../../assets/images/onboarding1.jpg');

export default function Onboarding1() {
  const handleNext = () => {
    router.replace('/OnBoarding2');
  };

  return (
    <ImageBackground source={bgImage} style={styles.background} resizeMode="stretch">
      <View style={styles.overlay}>
        <Text style={{ fontFamily: 'Montserrat', fontSize: 32, color: '#fff', fontWeight: 'bold', marginBottom: 430, marginLeft: 40, marginRight: 40, textAlign: 'center' }}>
                  Chào mừng bạn đến với ứng dụng quản lý chi tiêu!
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Tiếp Theo</Text>
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