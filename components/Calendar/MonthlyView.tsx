import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MonthlyViewProps, Task } from './types';

// Haftanın günleri - Türkçe kısa
const DAYS_OF_WEEK = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

const MonthlyView: React.FC<MonthlyViewProps> = ({
  date,
  tasks = [],
  onTaskPress,
  onDatePress,
}) => {
  // Ayın günlerini oluştur
  const getMonthDays = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Ayın ilk günü
    const firstDay = new Date(year, month, 1);
    // İlk günün haftanın kaçıncı günü olduğunu bul (0: Pazar)
    const firstDayOfWeek = firstDay.getDay();
    
    // Pazartesi başlangıçlı ayarı
    const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Matris formatındaki takvim için günler
    const days = [];
    // İlk satırı oluştur ve önceki aydan günler varsa ekle
    const firstRow = [];
    
    // Boş günler (önceki ayın günleri)
    for (let i = 0; i < offset; i++) {
      firstRow.push(null);
    }
    
    // Ayın günleri
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let currentDay = 1;
    
    // İlk satırı tamamla
    while (firstRow.length < 7 && currentDay <= daysInMonth) {
      firstRow.push(new Date(year, month, currentDay++));
    }
    
    days.push(firstRow);
    
    // Kalan satırları oluştur
    while (currentDay <= daysInMonth) {
      const row = [];
      for (let i = 0; i < 7 && currentDay <= daysInMonth; i++) {
        row.push(new Date(year, month, currentDay++));
      }
      // Satırı 7 güne tamamla
      while (row.length < 7) {
        row.push(null);
      }
      days.push(row);
    }
    
    return days;
  };
  
  // Verilen tarihte görevleri bul
  const getTasksForDate = (day: Date | null) => {
    if (!day) return [];
    
    return tasks.filter(task => {
      const taskDate = new Date(task.startTime);
      return (
        taskDate.getDate() === day.getDate() &&
        taskDate.getMonth() === day.getMonth() &&
        taskDate.getFullYear() === day.getFullYear()
      );
    });
  };
  
  // Takvim günlerini oluştur
  const renderCalendar = () => {
    const days = getMonthDays();
    
    return (
      <View style={styles.calendar}>
        {/* Haftanın günleri başlığı */}
        <View style={styles.weekdayHeader}>
          {DAYS_OF_WEEK.map((day, index) => (
            <View key={index} style={styles.weekdayCell}>
              <Text style={styles.weekdayText}>{day}</Text>
            </View>
          ))}
        </View>
        
        {/* Takvim günleri */}
        <View style={styles.daysContainer}>
          {days.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.weekRow}>
              {week.map((day, dayIndex) => {
                if (!day) {
                  // Boş gün (önceki veya sonraki aydan)
                  return <View key={dayIndex} style={styles.dayCell} />;
                }
                
                const isToday = day.toDateString() === new Date().toDateString();
                const isSelected = day.toDateString() === date.toDateString();
                const dayTasks = getTasksForDate(day);
                
                return (
                  <TouchableOpacity
                    key={dayIndex}
                    style={[
                      styles.dayCell,
                      isToday && styles.todayCell,
                      isSelected && styles.selectedCell,
                    ]}
                    onPress={() => onDatePress && onDatePress(day)}
                  >
                    <Text style={[
                      styles.dayNumber,
                      isToday && styles.todayNumber,
                    ]}>
                      {day.getDate()}
                    </Text>
                    
                    {/* Görevleri göster */}
                    <View style={styles.tasksContainer}>
                      {dayTasks.slice(0, 3).map((task) => (
                        <TouchableOpacity
                          key={task.id}
                          style={[
                            styles.taskItem,
                            { borderLeftColor: task.color || '#f78536' }
                          ]}
                          onPress={() => onTaskPress && onTaskPress(task)}
                        >
                          <Text style={styles.taskText} numberOfLines={1}>
                            {task.title}
                          </Text>
                        </TouchableOpacity>
                      ))}
                      
                      {dayTasks.length > 3 && (
                        <Text style={styles.moreTasksText}>+{dayTasks.length - 3} more</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      {renderCalendar()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  calendar: {
    flex: 1,
    padding: 8,
  },
  weekdayHeader: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  daysContainer: {
    flex: 1,
  },
  weekRow: {
    flexDirection: 'row',
    height: 100, // Her günün yüksekliği
    marginBottom: 8,
  },
  dayCell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#f0f0f0',
    padding: 6,
    backgroundColor: '#fff',
    borderRadius: 4,
    margin: 1,
  },
  todayCell: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#000',
  },
  selectedCell: {
    backgroundColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  dayNumber: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
    color: '#333',
  },
  todayNumber: {
    fontWeight: 'bold',
    color: '#000',
  },
  tasksContainer: {
    flex: 1,
  },
  taskItem: {
    backgroundColor: '#fff',
    borderLeftWidth: 3,
    padding: 4,
    marginBottom: 3,
    borderRadius: 3,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  taskText: {
    fontSize: 10,
    color: '#333',
    fontWeight: '500',
  },
  moreTasksText: {
    fontSize: 9,
    color: '#777',
    textAlign: 'right',
    marginTop: 2,
    fontStyle: 'italic',
  },
});

export default MonthlyView; 