import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { requestPermissions } from '../utils/notifications';
import { format } from 'date-fns';

interface AddHabitSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (id: number | null, name: string, reminderTime: string | null) => void;
  initialHabit?: { id: number; name: string; reminderTime: string | null } | null;
}

export const AddHabitSheet: React.FC<AddHabitSheetProps> = ({ isVisible, onClose, onSave, initialHabit }) => {
  const [name, setName] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());

  useEffect(() => {
    if (isVisible) {
      if (initialHabit) {
        setName(initialHabit.name);
        if (initialHabit.reminderTime) {
          setReminderEnabled(true);
          const [hours, minutes] = initialHabit.reminderTime.split(':').map(Number);
          const d = new Date();
          d.setHours(hours, minutes, 0, 0);
          setReminderTime(d);
        } else {
          setReminderEnabled(false);
          const d = new Date();
          d.setHours(8, 0, 0, 0);
          setReminderTime(d);
        }
      } else {
        setName('');
        setReminderEnabled(false);
        const d = new Date();
        d.setHours(8, 0, 0, 0);
        setReminderTime(d);
      }
    }
  }, [isVisible, initialHabit]);

  const handleSave = async () => {
    if (!name.trim()) return;
    
    let finalReminderTime = null;
    if (reminderEnabled) {
      const hasPermission = await requestPermissions();
      if (hasPermission) {
        finalReminderTime = format(reminderTime, 'HH:mm');
      }
    }

    onSave(initialHabit ? initialHabit.id : null, name, finalReminderTime);
    onClose();
  };

  const onTimeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setReminderTime(selectedDate);
    }
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
            <Text style={styles.title}>{initialHabit ? 'Edit Habit' : 'New Habit'}</Text>
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

            <View style={styles.reminderRow}>
              <Text style={styles.label}>Enable Reminder</Text>
              <Switch
                value={reminderEnabled}
                onValueChange={setReminderEnabled}
                trackColor={{ false: '#D0D0D0', true: '#000000' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {reminderEnabled && (
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={reminderTime}
                  mode="time"
                  display="spinner"
                  onChange={onTimeChange}
                  textColor="#000000"
                />
              </View>
            )}

            <TouchableOpacity 
              style={[styles.saveButton, !name.trim() && styles.saveButtonDisabled]} 
              onPress={handleSave}
              disabled={!name.trim()}
            >
              <Text style={styles.saveButtonText}>{initialHabit ? 'Save Changes' : 'Add Habit'}</Text>
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
    marginBottom: 8,
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  pickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    overflow: 'hidden',
  },
  saveButton: {
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonDisabled: {
    backgroundColor: '#D0D0D0',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
