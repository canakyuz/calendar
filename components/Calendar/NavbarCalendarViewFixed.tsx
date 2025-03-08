import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { CalendarHeaderProps } from './types';

// Ayları formatlama
const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 
  'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 
  'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

// Haftanın günleri
const DAYS_OF_WEEK = ['Pt', 'Sa', 'Çr', 'Pr', 'Cu', 'Ct', 'Pz'];

interface NavbarCalendarViewProps extends CalendarHeaderProps {
  onDayPress?: (date: Date) => void;
  selectedDate?: Date;
}

const NavbarCalendarViewFixed: React.FC<NavbarCalendarViewProps> = ({
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
  
  // Haftalık gösterim için günleri grupla
  const getWeeks = () => {
    const days = getDaysInMonth();
    const weeks = [];
    
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    
    return weeks;
  };
  
  const weeks = getWeeks();
  const today = new Date();
  const selected = selectedDate || date;
  
  return (
    <View style={[
      styles.container, 
      theme.backgroundColor && { backgroundColor: theme.backgroundColor }
    ]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => onPrevious && onPrevious()}
        >
          <Text style={{fontSize: 16}}>◀</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>
          {MONTHS[date.getMonth()]} {date.getFullYear()}
        </Text>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => onNext && onNext()}
        >
          <Text style={{fontSize: 16}}>▶</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.weekdayHeader}>
        {DAYS_OF_WEEK.map((day, index) => (
          <Text 
            key={index} 
            style={[
              styles.weekdayText, 
              (index === 5 || index === 6) && styles.weekendText
            ]}
          >
            {day}
          </Text>
        ))}
      </View>
      
      <ScrollView style={styles.calendarContainer}>
        {weeks.map((week, weekIndex) => (
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

export default NavbarCalendarViewFixed; 