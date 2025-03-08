import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { View, Text, Pressable, useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs>
      <Tabs.Screen 
        name="adaptable" 
        options={{
          title: 'Uyarlanabilir',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen 
        name="monthly" 
        options={{
          title: 'Aylık',
          tabBarIcon: ({ color }) => <FontAwesome name="calendar" size={24} color={color} />,
        }}
      />
      <Tabs.Screen 
        name="weekly" 
        options={{
          title: 'Haftalık',
          tabBarIcon: ({ color }) => <FontAwesome name="calendar-o" size={24} color={color} />,
        }}
      />
      <Tabs.Screen 
        name="daily" 
        options={{
          title: 'Günlük',
          tabBarIcon: ({ color }) => <FontAwesome name="list" size={24} color={color} />,
        }}
      />
      <Tabs.Screen 
        name="agenda" 
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
