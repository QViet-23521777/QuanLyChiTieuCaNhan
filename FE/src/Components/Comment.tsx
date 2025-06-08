import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Comment = () => {
  return (
    <View style={styles.container}>
      <View style={styles.circle} />
      <View >
        <Text style={styles.name}>Nguyen Van A</Text>
        <Text>First comment</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fff4', // màu nền giống ảnh
    padding: 10,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25, // tạo hình tròn
    backgroundColor: '#66B2FF', // màu xanh dương
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    color: '#111827', // màu chữ giống ảnh
    fontWeight: '500',
  },
});

export default Comment;
