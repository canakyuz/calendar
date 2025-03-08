import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from './types';

interface TaskItemProps {
  task: Task;
  onPress?: (task: Task) => void;
  style?: any;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onPress, style }) => {
  // Saat formatı
  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes}`;
  };
  
  // Başlangıç ve bitiş saatlerini al
  const startTime = task.startTime instanceof Date 
    ? task.startTime 
    : new Date(task.startTime);
  
  const endTime = task.endTime instanceof Date 
    ? task.endTime 
    : new Date(task.endTime);
  
  // Zaman aralığı metni
  const timeRangeText = task.isAllDay 
    ? 'Tüm gün' 
    : `${formatTime(startTime)} - ${formatTime(endTime)}`;
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderLeftColor: task.color || '#f78536' },
        style
      ]}
      onPress={() => onPress && onPress(task)}
    >
      <Text style={styles.title} numberOfLines={1}>{task.title}</Text>
      <Text style={styles.time}>{timeRangeText}</Text>
      
      {task.location && (
        <Text style={styles.location} numberOfLines={1}>
          {task.location}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff9f0',
    borderLeftWidth: 3,
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default TaskItem; 