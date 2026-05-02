import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { requestPermissions, scheduleHabitReminder } from '../utils/notifications';

interface AddHabitSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onAdd: (name: string, reminderTime: string | null) => void;
}

export const AddHabitSheet: React.FC<AddHabitSheetProps> = ({ isVisible, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [reminderTime, setReminderTime] = useState('08:00');

  const handleAdd = async () => {
    if (!name.trim()) return;
    
    const hasPermission = await requestPermissions();
    onAdd(name, hasPermission ? reminderTime : null);
    
    setName('');
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>New Habit</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>What do you want to start?</Text>
            <TextInput
              style={styles.input}
              placeholder="Habit name (e.g. Read, Exercise)"
              placeholderTextColor="#A0A0A0"
              value={name}
              onChangeText={setName}
              autoFocus
            />

            <Text style={styles.label}>Reminder Time</Text>
            <TextInput
              style={styles.input}
              placeholder="08:00"
              placeholderTextColor="#A0A0A0"
              value={reminderTime}
              onChangeText={setReminderTime}
            />

            <TouchableOpacity 
              style={[styles.addButton, !name.trim() && styles.addButtonDisabled]} 
              onPress={handleAdd}
              disabled={!name.trim()}
            >
              <Text style={styles.addButtonText}>Add Habit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: 400,
    borderCurve: 'continuous',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#707070',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    fontSize: 18,
    borderBottomWidth: 2,
    borderBottomColor: '#F0F0F0',
    paddingVertical: 12,
    color: '#000000',
  },
  addButton: {
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  addButtonDisabled: {
    backgroundColor: '#D0D0D0',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
