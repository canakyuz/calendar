import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { CalendarHeaderProps } from './types';
import { FontAwesome } from '@expo/vector-icons';

// Ayları formatlama
const MONTHS = [
  'January', 'February', 'March', 'April', 
  'May', 'June', 'July', 'August', 
  'September', 'October', 'November', 'December'
];

// Haftanın günleri
const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface NavbarCalendarViewProps extends CalendarHeaderProps {
  onDayPress?: (date: Date) => void;
  selectedDate?: Date;
}

const NavbarCalendarView: React.FC<NavbarCalendarViewProps> = ({
  date,
  onPrevious,
  onNext,
  onDayPress,
  selectedDate,
  theme = {},
}) => {
  // Ayın günlerini oluştur
  const getDaysInMonth = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Ayın ilk günü
    const firstDay = new Date(year, month, 1);
    // İlk günün haftanın kaçıncı günü olduğunu bul (0: Pazar)
    let firstDayOfWeek = firstDay.getDay();
    // Pazartesi'yi haftanın ilk günü olarak ayarla (0: Pazartesi)
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Ayın gün sayısı
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Günleri oluştur
    const days = [];
    
    // Önceki ayın günleri
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({
        day: prevMonthDays - firstDayOfWeek + i + 1,
        month: month - 1,
        year,
        isCurrentMonth: false,
      });
    }
    
    // Bu ayın günleri
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month,
        year,
        isCurrentMonth: true,
      });
    }
    
    // Sonraki ayın günleri
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        days.push({
          day: i,
          month: month + 1,
          year,
          isCurrentMonth: false,
        });
      }
    }
    
    return days;
  };
  
  // Günleri haftalara böl
  const getWeeks = () => {
    const days = getDaysInMonth();
    const weeks = [];
    
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    
    return weeks;
  };
  
  // Bugünün tarihi
  const today = new Date();
  
  // Seçili tarih veya bugün
  const selected = selectedDate || today;
  
  return (
    <View style={styles.container}>
      {/* Başlık */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={onPrevious}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FontAwesome name="chevron-left" size={16} color="#000" />
        </TouchableOpacity>
        
        <Text style={styles.title}>
          {MONTHS[date.getMonth()]} {date.getFullYear()}
        </Text>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={onNext}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FontAwesome name="chevron-right" size={16} color="#000" />
        </TouchableOpacity>
      </View>
      
      {/* Haftanın günleri */}
      <View style={styles.weekdayHeader}>
        {DAYS_OF_WEEK.map((day, index) => (
          <Text key={index} style={[
            styles.weekdayText,
            (index === 5 || index === 6) && styles.weekendText
          ]}>
            {day}
          </Text>
        ))}
      </View>
      
      {/* Takvim */}
      <ScrollView style={styles.calendarContainer}>
        {getWeeks().map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((dayInfo, dayIndex) => {
              const dayDate = new Date(dayInfo.year, dayInfo.month, dayInfo.day);
              const isToday = 
                dayDate.getDate() === today.getDate() &&
                dayDate.getMonth() === today.getMonth() &&
                dayDate.getFullYear() === today.getFullYear();
              
              const isSelected = 
                dayDate.getDate() === selected.getDate() &&
                dayDate.getMonth() === selected.getMonth() &&
                dayDate.getFullYear() === selected.getFullYear();
              
              const isWeekend = dayIndex === 5 || dayIndex === 6;
              
              return (
                <TouchableOpacity
                  key={dayIndex}
                  style={[
                    styles.dayButton,
                    !dayInfo.isCurrentMonth && styles.otherMonthDay,
                    isToday && styles.todayButton,
                    isSelected && styles.selectedDayButton,
                  ]}
                  onPress={() => onDayPress && onDayPress(dayDate)}
                >
                  <Text style={[
                    styles.dayText,
                    !dayInfo.isCurrentMonth && styles.otherMonthText,
                    isWeekend && styles.weekendText,
                    isToday && styles.todayText,
                    isSelected && styles.selectedDayText,
                  ]}>
                    {dayInfo.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  button: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  weekdayHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
  },
  weekendText: {
    color: '#f78536',
  },
  calendarContainer: {
    maxHeight: 240,
  },
  weekRow: {
    flexDirection: 'row',
    height: 40,
  },
  dayButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otherMonthDay: {
    opacity: 0.4,
  },
  todayButton: {
    backgroundColor: '#f8f8f8',
  },
  selectedDayButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  otherMonthText: {
    color: '#999',
  },
  todayText: {
    fontWeight: 'bold',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NavbarCalendarView; 