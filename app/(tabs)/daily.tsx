import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Calendar, DailyView, CalendarHeader } from '../../components/Calendar';

// Örnek görevler
const sampleTasks = [
  {
    id: '1',
    title: 'Task 1',
    startTime: new Date(2025, 6, 3, 10, 0),
    endTime: new Date(2025, 6, 3, 11, 30),
    color: '#4285F4', // Mavi
    description: 'Task 1 açıklaması',
  },
  {
    id: '5',
    title: 'Task 5',
    startTime: new Date(2025, 6, 3, 14, 0),
    endTime: new Date(2025, 6, 3, 15, 0),
    color: '#0F9D58', // Yeşil
  },
  {
    id: '6',
    title: 'Task 6',
    startTime: new Date(2025, 6, 3, 12, 0),
    endTime: new Date(2025, 6, 3, 11, 30),
    color: '#F4B400', // Sarı
  },
];

export default function DailyScreen() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 3)); // 3 Temmuz 2025
  
  // Tarih değiştiğinde
  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };
  
  // Göreve tıklandığında
  const handleTaskPress = (task: any) => {
    console.log('Task pressed:', task);
  };
  
  // Bir önceki güne git
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };
  
  // Bir sonraki güne git
  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <CalendarHeader
        date={currentDate}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onDatePress={handleDateChange}
      />
      
      <DailyView
        date={currentDate}
        tasks={sampleTasks}
        onDatePress={handleDateChange}
        onTaskPress={handleTaskPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});