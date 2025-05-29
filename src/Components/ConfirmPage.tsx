import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ConfirmPageProps = {
  status: 'success' | 'fail' | 'loading';
  message?: string;
};

export default function ConfirmPage({ status, message }: ConfirmPageProps) {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status === 'loading') {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.stopAnimation();
    }
  }, [status]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  let icon = null;
  let iconColor = '#fff';
  if (status === 'success') {
    icon = <Ionicons name="checkmark" size={60} color="#fff" />;
    iconColor = '#4CD964';
  } else if (status === 'fail') {
    icon = <Ionicons name="close" size={60} color="#fff" />;
    iconColor = '#FF3B30';
  }

  return (
    <View style={styles.container}>
      <View style={styles.centered}>
        {status === 'loading' ? (
          <Animated.View style={[styles.circle, { borderColor: '#fff', transform: [{ rotate: spin }] }]}>
            <View style={styles.innerCircle} />
          </Animated.View>
        ) : (
          <View style={[styles.circle, { borderColor: iconColor, backgroundColor: iconColor }]}>
            {icon}
          </View>
        )}
        <Text style={styles.text}>
          {message ||
            (status === 'success'
              ? 'Thành công'
              : status === 'fail'
              ? 'Không thể thay đổi'
              : 'Đang xử lý...')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6EB5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  innerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'transparent',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    marginTop: 8,
    textAlign: 'center',
  },
});