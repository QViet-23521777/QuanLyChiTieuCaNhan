import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';

const iconMap = {
  bell: <Ionicons name="notifications-outline" size={20} color="#5B61F4" />,
  star: <MaterialIcons name="stars" size={20} color="#5B61F4" />,
  transaction: <Entypo name="price-tag" size={20} color="#5B61F4" />,
  arrow: <Ionicons name="arrow-down-outline" size={20} color="#5B61F4" />,
};

const NotificationItem = ({ icon = 'bell', title, message, time, subInfo, highlightColor }) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.icon}>{iconMap[icon]}</View>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          {subInfo ? (
            <Text style={[styles.subInfo, { color: highlightColor || '#F00' }]}>{subInfo}</Text>
          ) : null}
        </View>
      </View>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DCE1FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  left: {
    flexDirection: 'row',
    gap: 10,
    flex: 1,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E1E6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    fontWeight: 'bold',
    color: '#222',
  },
  message: {
    fontSize: 13,
    color: '#555',
  },
  subInfo: {
    fontSize: 13,
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: '#1A57DB',
  },
});
