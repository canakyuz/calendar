import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { CalendarProps } from './types';
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
  
  // Tarih değiştiğinde
  const handleDatePress = (date: Date) => {
    console.log('Date pressed:', date); // Debug için log ekledim
    setCurrentDate(date);
    
    // Tarih seçildiğinde haftalık veya aylık görünüme geçiş işlemi burada olabilir
    // Eğer isterseniz, sadece tarih değiştir ama görünümü değiştirme
    
    // Kullanıcıya seçilen günle ilgili bilgi iletilir
    onDatePress && onDatePress(date);
  };
  
  // Görünüm oluştur
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
      case 'weekly':
        return (
          <WeeklyView
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
  
  return (
    <View style={[
      styles.container,
      theme.backgroundColor && { backgroundColor: theme.backgroundColor }
    ]}>
      <CalendarHeader
        date={currentDate}
        onPrevious={handlePrevious}
        onNext={handleNext}
        theme={theme}
      />
      
      <View style={styles.calendarContainer}>
        {renderCalendarView()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  calendarContainer: {
    flex: 1,
  },
});

export default Calendar; 