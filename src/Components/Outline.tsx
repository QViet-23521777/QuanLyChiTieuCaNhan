import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Outline({ children }) {
  return (
    <View style={styles.container}>
      <View style={styles.topBackground} />
      <View style={styles.contentBox}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#7EC6FF' },
  topBackground: {
    width: '100%',
    height: 100,
    backgroundColor: '#7EC6FF',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  contentBox: {
    flex: 1,
    backgroundColor: '#F4FFFA',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginTop: -12,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
});