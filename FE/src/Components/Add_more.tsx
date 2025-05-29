import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function AddCategoryModal({ visible, onClose, onSave }) {
  const [categoryName, setCategoryName] = useState('');

  const handleSave = () => {
    if (categoryName.trim()) {
      onSave(categoryName.trim());
      setCategoryName('');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Mục Mới</Text>
          <TextInput
            style={styles.input}
            placeholder="Tên danh mục..."
            value={categoryName}
            onChangeText={setCategoryName}
          />
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Lưu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Huỷ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: 280,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#145A5A',
    marginBottom: 18,
  },
  input: {
    width: '100%',
    backgroundColor: '#E3F1FF',
    borderRadius: 16,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: '#7EC6FF',
    borderRadius: 16,
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelBtn: {
    backgroundColor: '#D6EAF8',
    borderRadius: 16,
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  cancelText: {
    color: '#145A5A',
    fontSize: 16,
  },
});