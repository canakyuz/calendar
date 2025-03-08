import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { CalendarProps, Task } from './types';
import DailyView from './DailyView';
import WeeklyView from './WeeklyView';
import MonthlyView from './MonthlyView';
import CalendarHeader from './CalendarHeader';

const Calendar: React.FC<CalendarProps> = ({
  date,
  tasks = [],
  onTaskPress,
  onDatePress,
  view = 'weekly',
  theme = {},
  
  // Minimal mod ve görünüm seçenekleri
  minimalMode = false,
  renderDayContent,
  showHeader = true,
  showNavigation = true,
  compact = false,

  // Üst bilgi için
  leftContent,
  rightContent,
  onLeftPress,
  onRightPress,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(date));
  const [currentView, setCurrentView] = useState(view);
  
  // Bir önceki güne/haftaya/aya git
  const handlePrevious = (newDate?: Date) => {
    // Eğer tarih değeri geliyorsa onu kullan, gelmiyorsa hesapla
    const dateToUse = newDate || (() => {
      const calculatedDate = new Date(currentDate);
      
      if (currentView === 'daily') {
        calculatedDate.setDate(currentDate.getDate() - 1);
      } else if (currentView === 'weekly') {
        calculatedDate.setDate(currentDate.getDate() - 7);
      } else if (currentView === 'monthly') {
        calculatedDate.setMonth(currentDate.getMonth() - 1);
      }
      
      return calculatedDate;
    })();
    
    setCurrentDate(dateToUse);
    onDatePress && onDatePress(dateToUse);
  };
  
  // Bir sonraki güne/haftaya/aya git
  const handleNext = (newDate?: Date) => {
    // Eğer tarih değeri geliyorsa onu kullan, gelmiyorsa hesapla
    const dateToUse = newDate || (() => {
      const calculatedDate = new Date(currentDate);
      
      if (currentView === 'daily') {
        calculatedDate.setDate(currentDate.getDate() + 1);
      } else if (currentView === 'weekly') {
        calculatedDate.setDate(currentDate.getDate() + 7);
      } else if (currentView === 'monthly') {
        calculatedDate.setMonth(currentDate.getMonth() + 1);
      }
      
      return calculatedDate;
    })();
    
    setCurrentDate(dateToUse);
    onDatePress && onDatePress(dateToUse);
  };
  
  // Seçilen tarihe git
  const handleDatePress = (date: Date) => {
    setCurrentDate(date);
    onDatePress && onDatePress(date);
  };
  
  // Minimal modda günlük gösterim
  const renderMinimalContent = () => {
    const tasksOnDate = tasks.filter(task => {
      const taskDate = new Date(task.startTime);
      return (
        taskDate.getDate() === currentDate.getDate() &&
        taskDate.getMonth() === currentDate.getMonth() &&
        taskDate.getFullYear() === currentDate.getFullYear()
      );
    });
    
    if (renderDayContent) {
      return renderDayContent(currentDate, tasksOnDate);
    }
    
    return (
      <View style={styles.minimalDayView}>
        {tasksOnDate.length > 0 ? (
          tasksOnDate.map((task, index) => (
            <TouchableOpacity 
              key={task.id || index} 
              style={[
                styles.taskItem,
                { backgroundColor: task.color || theme.taskDefaultColor || '#e1e1e1' }
              ]}
              onPress={() => onTaskPress && onTaskPress(task)}
            >
              <Text style={styles.taskTitle} numberOfLines={1}>
                {task.title}
              </Text>
              {!compact && (
                <Text style={styles.taskTime} numberOfLines={1}>
                  {task.isAllDay ? 'Tüm Gün' : 
                    `${new Date(task.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                     ${new Date(task.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  }
                </Text>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noTasks}>Bu gün için etkinlik yok</Text>
        )}
      </View>
    );
  };
  
  // Takvim görünümü render fonksiyonu
  const renderCalendarView = () => {
    switch (currentView) {
      case 'daily':
        return (
          <DailyView
            date={currentDate}
            tasks={tasks}
            onTaskPress={onTaskPress}
            onDatePress={handleDatePress}
            theme={theme}
          />
        );
      case 'monthly':
        return (
          <MonthlyView
            date={currentDate}
            tasks={tasks}
            onTaskPress={onTaskPress}
            onDatePress={handleDatePress}
            theme={theme}
          />
        );
      case 'weekly':
      default:
        return (
          <WeeklyView
            date={currentDate}
            tasks={tasks}
            onTaskPress={onTaskPress}
            onDatePress={handleDatePress}
            theme={theme}
          />
        );
    }
  };
  
  // Calendar içeriğini render et
  const renderContent = () => {
    if (minimalMode) {
      return (
        <View style={[
          styles.minimalContainer,
          compact && styles.compactContainer
        ]}>
          {showNavigation && (
            <View style={styles.navigation}>
              <TouchableOpacity onPress={() => handlePrevious()} style={styles.navButton}>
                <Text style={[
                  styles.navButtonText,
                  theme.textColor && { color: theme.textColor }
                ]}>
                  ◀
                </Text>
              </TouchableOpacity>
              
              <Text style={[
                styles.currentPeriod,
                theme.textColor && { color: theme.textColor }
              ]}>
                {currentView === 'daily' 
                  ? currentDate.toLocaleDateString() 
                  : currentView === 'weekly'
                    ? `${currentDate.toLocaleString('default', { month: 'long' })} Haftası`
                    : `${currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}`
                }
              </Text>
              
              <TouchableOpacity onPress={() => handleNext()} style={styles.navButton}>
                <Text style={[
                  styles.navButtonText,
                  theme.textColor && { color: theme.textColor }
                ]}>
                  ▶
                </Text>
              </TouchableOpacity>
            </View>
          )}
          
          {renderMinimalContent()}
        </View>
      );
    }
    
    return (
      <>
        {showHeader && (
          <CalendarHeader
            date={currentDate}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onDatePress={handleDatePress}
            theme={theme}
            leftContent={leftContent}
            rightContent={rightContent}
            onLeftPress={onLeftPress}
            onRightPress={onRightPress}
          />
        )}
        
        {renderCalendarView()}
      </>
    );
  };
  
  return (
    <View style={[
      styles.container,
      theme.backgroundColor && { backgroundColor: theme.backgroundColor }
    ]}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  minimalContainer: {
    flex: 1,
  },
  compactContainer: {
    height: 120,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  navButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    fontSize: 18,
    color: '#555',
  },
  currentPeriod: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  minimalDayView: {
    flex: 1,
    padding: 10,
  },
  taskItem: {
    padding: 10,
    marginBottom: 8,
    borderRadius: 4,
  },
  taskTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  taskTime: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.7,
  },
  noTasks: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});

export default Calendar; 