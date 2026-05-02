import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#D0D0D0',
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          height: 80,
          paddingBottom: 20,
          backgroundColor: '#FFFFFF',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="calendar-check-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="chart-box-outline" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
