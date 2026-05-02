import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface HabitItemProps {
  name: string;
  isCompleted: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export const HabitItem: React.FC<HabitItemProps> = ({ name, isCompleted, onToggle }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(isCompleted ? 1.05 : 1) }
      ],
    };
  });

  const checkStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(isCompleted ? 1 : 0),
      transform: [{ scale: withSpring(isCompleted ? 1 : 0.5) }]
    };
  });

  return (
    <Pressable onPress={onToggle} style={styles.container}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <View style={styles.textContainer}>
          <Text style={[styles.name, isCompleted && styles.completedText]}>{name}</Text>
        </View>
        <View style={[styles.checkbox, isCompleted && styles.checkboxActive]}>
          <Animated.View style={checkStyle}>
            <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
          </Animated.View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F9F9F9',
    borderCurve: 'continuous',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  completedText: {
    color: '#A0A0A0',
    textDecorationLine: 'line-through',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
});
