import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { TaskItem, CalendarHeader } from '../../components/Calendar';
import { FontAwesome } from '@expo/vector-icons';
import { Task } from '../../components/Calendar/types';

// Örnek görevler
const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Task 1',
    startTime: new Date(2025, 2, 1, 10, 0),
    endTime: new Date(2025, 2, 1, 11, 30),
    color: '#4285F4', // Mavi
    description: 'Task 1 açıklaması',
  },
  {
    id: '5',
    title: 'Task 5',
    startTime: new Date(2025, 2, 1, 14, 0),
    endTime: new Date(2025, 2, 1, 15, 0),
    color: '#0F9D58', // Yeşil
  },
  {
    id: '6',
    title: 'Task 6',
    startTime: new Date(2025, 2, 1, 8, 0),
    endTime: new Date(2025, 2, 1, 11, 30),
    color: '#F4B400', // Sarı
  },
  {
    id: '2',
    title: 'Task 2',
    startTime: new Date(2025, 2, 8, 12, 0),
    endTime: new Date(2025, 2, 8, 13, 30),
    color: '#DB4437', // Kırmızı
  },
];

interface GroupedTask {
  date: Date;
  tasks: Task[];
}

// Görevleri tarihe göre grupla
const groupTasksByDate = (tasks: Task[]): GroupedTask[] => {
  const groupedTasks: Record<string, Task[]> = {};
  
  tasks.forEach(task => {
    const startTime = task.startTime instanceof Date 
      ? task.startTime 
      : new Date(task.startTime);
    
    const dateKey = startTime.toDateString();
    
    if (!groupedTasks[dateKey]) {
      groupedTasks[dateKey] = [];
    }
    
    groupedTasks[dateKey].push(task);
  });
  
  // Grupları tarih sırasına göre sırala
  return Object.keys(groupedTasks)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .map(dateKey => ({
      date: new Date(dateKey),
      tasks: groupedTasks[dateKey],
    }));
};

export default function AgendaScreen() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 1)); // 1 Mart 2025
  const [groupedTasks, setGroupedTasks] = useState<GroupedTask[]>(groupTasksByDate(sampleTasks));
  
  // Tarih değiştiğinde
  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };
  
  // Göreve tıklandığında
  const handleTaskPress = (task: Task) => {
    console.log('Task pressed:', task);
  };
  
  // Bir önceki aya git
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };
  
  // Bir sonraki aya git
  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };
  
  // Tarihi formatla
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('tr-TR', options);
  };
  
  // İçerik oluştur
  const renderItem = ({ item }: { item: GroupedTask }) => {
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.dateHeader}>
          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        </View>
        
        <View style={styles.tasksContainer}>
          {item.tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onPress={handleTaskPress}
            />
          ))}
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <CalendarHeader
        date={currentDate}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onDatePress={handleDateChange}
      />
      
      <FlatList
        data={groupedTasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.date.toISOString()}
        contentContainerStyle={styles.listContainer}
      />
      
      <TouchableOpacity style={styles.addButton}>
        <FontAwesome name="plus" size={20} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  dateHeader: {
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  tasksContainer: {
    marginLeft: 8,
  },
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});