import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useHabits } from '../../hooks/useHabits';
import { HabitItem } from '../../components/HabitItem';
import { AddHabitSheet } from '../../components/AddHabitSheet';

const TodayScreen = () => {
  const { habits, todayCompletions, loading, addHabit, editHabit, toggleHabit, deleteHabit } = useHabits();
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [editingHabit, setEditingHabit] = useState<{ id: number; name: string; reminderTime: string | null } | null>(null);

  const handleSave = (id: number | null, name: string, reminderTime: string | null) => {
    if (id) {
      editHabit(id, name, reminderTime);
    } else {
      addHabit(name, reminderTime);
    }
  };

  const openEdit = (habit: { id: number; name: string; reminder_time: string | null }) => {
    setEditingHabit({ id: habit.id, name: habit.name, reminderTime: habit.reminder_time });
    setIsAddVisible(true);
  };

  const handleClose = () => {
    setIsAddVisible(false);
    // Slight delay to allow modal close animation before clearing state
    setTimeout(() => setEditingHabit(null), 300);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Today</Text>
            <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => setIsAddVisible(true)}
          >
            <MaterialCommunityIcons name="plus" size={28} color="#000000" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.habitsSection}>
            {habits.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No habits for today.</Text>
                <TouchableOpacity style={styles.emptyButton} onPress={() => setIsAddVisible(true)}>
                  <Text style={styles.emptyButtonText}>Create your first habit</Text>
                </TouchableOpacity>
              </View>
            ) : (
              habits.map((habit) => (
                <HabitItem
                  key={habit.id}
                  name={habit.name}
                  isCompleted={todayCompletions.includes(habit.id)}
                  onToggle={() => toggleHabit(habit.id)}
                  onDelete={() => deleteHabit(habit.id)}
                  onLongPress={() => openEdit(habit)}
                />
              ))
            )}
          </View>
        </ScrollView>

        <AddHabitSheet
          isVisible={isAddVisible}
          onClose={handleClose}
          onSave={handleSave}
          initialHabit={editingHabit}
        />
      </View>
    </SafeAreaView>
  );
};

export default TodayScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
    color: '#000000',
  },
  dateText: {
    fontSize: 16,
    color: '#A0A0A0',
    fontWeight: '600',
    marginTop: 2,
  },
  addButton: {
    padding: 10,
    borderRadius: 16,
    backgroundColor: '#F7F7F7',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  habitsSection: {
    marginTop: 8,
  },
  emptyState: {
    marginTop: 100,
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#A0A0A0',
    textAlign: 'center',
    fontWeight: '500',
  },
  emptyButton: {
    marginTop: 20,
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
