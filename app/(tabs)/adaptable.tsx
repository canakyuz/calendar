import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Calendar, CalendarTabView } from '../../components/Calendar';

// Örnek görevler
const sampleTasks = [
  {
    id: '1',
    title: 'Toplantı 1',
    startTime: new Date(2025, 6, 7, 10, 0),
    endTime: new Date(2025, 6, 7, 11, 30),
    color: '#4285F4', // Mavi
    description: 'Proje planlama toplantısı',
    location: 'Toplantı Odası A',
  },
  {
    id: '5',
    title: 'İş Görüşmesi',
    startTime: new Date(2025, 6, 7, 14, 0),
    endTime: new Date(2025, 6, 7, 15, 0),
    color: '#0F9D58', // Yeşil
    location: 'Ofis 3. Kat',
  },
  {
    id: '6',
    title: 'Doktor Randevusu',
    startTime: new Date(2025, 6, 7, 8, 0),
    endTime: new Date(2025, 6, 7, 11, 30),
    color: '#F4B400', // Sarı
    description: 'Yıllık kontrol',
    location: 'Memorial Hastanesi',
  },
  {
    id: '2',
    title: 'Spor Antrenmanı',
    startTime: new Date(2025, 6, 2, 18, 0),
    endTime: new Date(2025, 6, 2, 19, 30),
    color: '#DB4437', // Kırmızı
    location: 'Fitness Salonu',
  },
  {
    id: '3',
    title: 'Aile Yemeği',
    startTime: new Date(2025, 6, 4, 20, 0),
    endTime: new Date(2025, 6, 4, 22, 0),
    color: '#673AB7', // Mor
    location: 'Restoran',
  },
  {
    id: '4',
    title: 'Alışveriş',
    startTime: new Date(2025, 6, 3, 14, 0),
    endTime: new Date(2025, 6, 3, 16, 0),
    color: '#FF9800', // Turuncu
    location: 'AVM',
  },
];

export default function AdaptableScreen() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 3)); // 3 Temmuz 2025
  
  // Tarih değiştiğinde
  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };
  
  // Göreve tıklandığında
  const handleTaskPress = (task: any) => {
    console.log('Task pressed:', task);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <CalendarTabView
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