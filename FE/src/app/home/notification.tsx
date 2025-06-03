import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import NotificationItem from '../../Components/NotificationItem';
import { Ionicons } from '@expo/vector-icons';

const NotificationScreen = ({ navigation }) => {
  return (
    <View style={{backgroundColor: '#6EB5FF'}}>
        <View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Thông Báo</Text>
        </View>
        <View style={{backgroundColor: '#F1FFF3', borderRadius: 80, marginTop: 50, padding: 30, height: '100%', width: '100%'}}>
            <ScrollView style={styles.content}>
                <Text style={styles.sectionTitle}>Hôm nay</Text>
                <NotificationItem
                    icon="bell"
                    title="Nhắc nhở"
                    message="bla bla"
                    time="17:00 - 21/5"
                />
                <NotificationItem
                icon="star"
                title="Cập nhật mới"
                message="bla bla"
                time="17:00 - 21/5"
                />

                <Text style={styles.sectionTitle}>Hôm qua</Text>
                <NotificationItem
                icon="transaction"
                title="Giao dịch"
                message="bla bla"
                subInfo="Mua sắm | 500,000"
                time="17:00 - 20/5"
                />
                <NotificationItem
                icon="bell"
                title="Thông báo!"
                message="bla bla"
                time="17:00 - 20/5"
                />

                <Text style={styles.sectionTitle}>Trước đó</Text>
                <NotificationItem
                icon="arrow"
                title="Bản ghi thu chi"
                message="bla bla"
                time="17:00 - 13/5"
                />
                <NotificationItem
                icon="transaction"
                title="Giao Dịch"
                message="bla bla"
                subInfo="Nơi ở | 3,250,000"
                time="17:00 - 13/5"
                />
            </ScrollView>
        </View>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#B9C9FF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
  },
});
