import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { useFonts, Montserrat_700Bold, Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Categories from Categories.tsx
const categories = [
  { icon: <Ionicons name="restaurant-outline" size={28} color="#7EC6FF" />, label: 'Ăn Uống' },
  { icon: <MaterialIcons name="directions-bus" size={28} color="#7EC6FF" />, label: 'Di Chuyển' },
  { icon: <FontAwesome5 name="briefcase-medical" size={24} color="#7EC6FF" />, label: 'Y Tế' },
  { icon: <MaterialCommunityIcons name="shopping-outline" size={28} color="#7EC6FF" />, label: 'Mua Sắm' },
  { icon: <Ionicons name="home-outline" size={28} color="#7EC6FF" />, label: 'Nơi Ở' },
  { icon: <MaterialCommunityIcons name="gift-outline" size={28} color="#7EC6FF" />, label: 'Quà Tặng' },
  { icon: <FontAwesome5 name="piggy-bank" size={24} color="#7EC6FF" />, label: 'Tiết Kiệm' },
  { icon: <MaterialIcons name="sports-esports" size={28} color="#7EC6FF" />, label: 'Giải Trí' },
];

export default function AddExpenseScreen() {
  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_400Regular,
  });

  const router = useRouter();
  const params = useLocalSearchParams();

  const [categoryModal, setCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expenseName, setExpenseName] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [expenseAmount, setExpenseAmount] = useState('');
  const [note, setNote] = useState('');

  // Auto-select category if passed from params
  useEffect(() => {
    if (params?.defaultCategory) {
      const found = categories.find(c => c.label === params.defaultCategory);
      if (found) setSelectedCategory(found);
    }
  }, [params]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <View style={styles.topBackground}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.header}>Thêm Khoản Chi</Text>
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.formBox}>
        <Text style={styles.label}>Ngày</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder=""
            placeholderTextColor="#A0AFC0"
            value={expenseDate.toLocaleDateString()}
            editable={false}
          />
          <TouchableOpacity style={styles.iconBtn} onPress={() => setExpenseDate(new Date())}>
            <Ionicons name="calendar-outline" size={22} color="#7EC6FF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Danh Mục</Text>
        <TouchableOpacity style={styles.inputRow} onPress={() => setCategoryModal(true)}>
          <Text style={[styles.input, { color: selectedCategory ? '#222' : '#A0AFC0' }]}>
            {selectedCategory ? selectedCategory.label : 'Chọn danh mục'}
          </Text>
          <Ionicons name="chevron-down" size={22} color="#7EC6FF" style={{ marginRight: 10 }} />
        </TouchableOpacity>
        <Text style={styles.label}>Chi Phí</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder=""
            placeholderTextColor="#A0AFC0"
            keyboardType="numeric"
            value={expenseAmount}
            onChangeText={setExpenseAmount}
          />
        </View>
        <Text style={styles.label}>Đề Mục</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder=""
            placeholderTextColor="#A0AFC0"
            value={expenseName}
            onChangeText={setExpenseName}
          />
        </View>
        <Text style={styles.label}>Ghi Chú</Text>
        <View style={[styles.inputRow, styles.noteInputRow]}>
          <TextInput
            style={[styles.input, styles.noteInput]}
            placeholder=""
            placeholderTextColor="#A0AFC0"
            multiline
            value={note}
            onChangeText={setNote}
          />
        </View>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() => {
            // Demo: Back End functionality here (e.g., save expense)
            if (selectedCategory?.label === 'Ăn Uống') {
              router.replace('/Categories/Foods');
            } else {
              router.back();
            }
          }}
        >
          <Text style={styles.saveBtnText}>Lưu</Text>
        </TouchableOpacity>
      </View>

      {/* Category Modal */}
      <Modal visible={categoryModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Chọn Danh Mục</Text>
            <ScrollView contentContainerStyle={styles.modalGrid}>
              {categories.map((cat, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.modalCatBtn}
                  onPress={() => {
                    setSelectedCategory(cat);
                    setCategoryModal(false);
                  }}
                >
                  {cat.icon}
                  <Text style={styles.modalCatLabel}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setCategoryModal(false)}>
              <Text style={styles.closeBtnText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#7EC6FF' },
  topBackground: {
    width: '100%',
    height: 100,
    backgroundColor: '#7EC6FF',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: { padding: 4 },
  header: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  formBox: {
    flex: 1,
    backgroundColor: '#F4FFFA',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginTop: -12,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  label: {
    fontFamily: 'Montserrat_700Bold',
    color: '#222',
    fontSize: 15,
    marginBottom: 6,
    marginTop: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D6EAF8',
    borderRadius: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  noteInputRow: {
    minHeight: 80,
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    color: '#222',
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  iconBtn: {
    padding: 4,
    marginRight: 4,
  },
  noteInput: {
    minHeight: 60,
    textAlignVertical: 'top',
    paddingTop: 0,
    paddingBottom: 0,
  },
  saveBtn: {
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  saveBtnText: {
    color: '#fff',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    elevation: 8,
  },
  modalTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    marginBottom: 16,
    color: '#222',
  },
  modalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  modalCatBtn: {
    width: 80,
    height: 80,
    backgroundColor: '#D6EAF8',
    borderRadius: 16,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCatLabel: {
    color: '#222',
    fontSize: 13,
    marginTop: 6,
    fontFamily: 'Montserrat_400Regular',
    textAlign: 'center',
  },
  closeBtn: {
    marginTop: 18,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: '#7EC6FF',
    borderRadius: 14,
  },
  closeBtnText: {
    color: '#fff',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
  },
});