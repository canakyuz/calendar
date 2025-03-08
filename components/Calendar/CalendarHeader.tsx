import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { CalendarHeaderProps } from './types';
import * as Icons from '@expo/vector-icons';

// Ekran genişliğini al
const { width } = Dimensions.get('window');

// Ayları formatlama
const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 
  'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 
  'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

// İngilizce ay adları
const MONTHS_EN = [
  'January', 'February', 'March', 'April', 
  'May', 'June', 'July', 'August', 
  'September', 'October', 'November', 'December'
];

// Haftanın günleri - kısa
const DAYS_SHORT = ['PZT', 'SAL', 'ÇAR', 'PER', 'CUM', 'CMT', 'PAZ'];

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  date,
  onPrevious,
  onNext,
  onTitlePress,
  onDatePress,
  title,
  theme = {},
  leftContent,
  rightContent,
  onLeftPress,
  onRightPress,
}) => {
  // Haftalık görünümün açılıp kapanma durumu - varsayılan olarak kapalı
  const [weekViewVisible, setWeekViewVisible] = useState(false);
  
  const [selectedDateInWeek, setSelectedDateInWeek] = useState(new Date(date));
  
  // Başlık için state ekleyelim
  const [currentTitle, setCurrentTitle] = useState('');
  
  // Başlık oluşturma fonksiyonu
  const getFormattedTitle = useCallback((currentDate: Date) => {
    if (title) return title;
    
    const month = MONTHS[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    return `${month} ${year}`;
  }, [title]);
  
  // Tarih değiştiğinde başlığı güncelle
  useEffect(() => {
    setCurrentTitle(getFormattedTitle(date));
  }, [date, getFormattedTitle]);
  
  // Haftalık görünüm için gün hesaplamaları
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  
  // Haftalık görünüm için tarihleri hesapla
  const getWeekDays = () => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Pazartesi'den başla
    
    const monday = new Date(d.setDate(diff));
    
    // Pazartesiden başlayarak 7 gün oluştur
    const days = [];
    for (let i = 0; i < 7; i++) {
      const newDay = new Date(monday);
      newDay.setDate(monday.getDate() + i);
      days.push(newDay);
    }
    
    return days;
  };
  
  // Tarihi güncelleştir ve haftalık günleri güncelle
  useEffect(() => {
    setWeekDays(getWeekDays());
  }, [date]);
  
  // Haftalık görünümü aç/kapat
  const toggleWeekView = () => {
    setWeekViewVisible(!weekViewVisible);
  };
  
  // Önceki ay/hafta
  const handleTopPrevious = () => {
    if (onPrevious) {
      const newDate = new Date(date);
      
      // Geri git
      newDate.setMonth(newDate.getMonth() - 1);
      
      // Ana uygulamaya bildir
      onPrevious(newDate);
    }
  };
  
  // Sonraki ay/hafta
  const handleTopNext = () => {
    if (onNext) {
      const newDate = new Date(date);
      
      // İleri git
      newDate.setMonth(newDate.getMonth() + 1);
      
      // Ana uygulamaya bildir
      onNext(newDate);
    }
  };
  
  // Haftalık görünümde önceki hafta
  const handleWeekPrevious = () => {
    if (onPrevious) {
      const newDate = new Date(date);
      
      // 7 gün geriye git
      newDate.setDate(newDate.getDate() - 7);
      
      // Ana uygulamaya bildir
      onPrevious(newDate);
    }
  };
  
  // Haftalık görünümde sonraki hafta
  const handleWeekNext = () => {
    if (onNext) {
      const newDate = new Date(date);
      
      // 7 gün ileriye git
      newDate.setDate(newDate.getDate() + 7);
      
      // Ana uygulamaya bildir
      onNext(newDate);
    }
  };
  
  return (
    <View style={[styles.container, theme && theme.backgroundColor ? { backgroundColor: theme.backgroundColor } : null]}>
      <View style={styles.topRow}>
        {/* Sol içerik alanı */}
        <View style={styles.sideContainer}>
          {leftContent && (
            <TouchableOpacity onPress={onLeftPress}>
              {leftContent}
            </TouchableOpacity>
          )}
        </View>
        
        {/* Gün Ay Seçimi - Tıklandığında haftalık görünümü aç/kapat */}
        <TouchableOpacity 
          style={styles.monthYearSelector} 
          onPress={toggleWeekView}
        >
          <TouchableOpacity 
            style={styles.arrowButton} 
            onPress={handleTopPrevious}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icons.FontAwesome name="chevron-left" size={16} color="#000" />
          </TouchableOpacity>
          
          <Text style={styles.monthYearText}>{currentTitle}</Text>
          
          <TouchableOpacity 
            style={styles.arrowButton} 
            onPress={handleTopNext}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icons.FontAwesome name="chevron-right" size={16} color="#000" />
          </TouchableOpacity>
        </TouchableOpacity>
        
        {/* Sağ içerik alanı */}
        <View style={styles.sideContainer}>
          {rightContent && (
            <TouchableOpacity onPress={onRightPress}>
              {rightContent}
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Alt kısım: Günlük gezinme - Görünürlüğü toggle edilebilen, 7 gün kompakt görünüm */}
      {weekViewVisible && (
        <View style={styles.daySelector}>
          <TouchableOpacity 
            style={styles.dayArrow}
            onPress={handleWeekPrevious}
          >
            <Icons.FontAwesome name="chevron-left" size={16} color="#000" />
          </TouchableOpacity>
          
          <View style={styles.daysContainer}>
            {weekDays.map((day, index) => {
              const isToday = day.toDateString() === new Date().toDateString();
              const isSelected = day.toDateString() === selectedDateInWeek.toDateString();
              const isWeekend = index >= 5; // 5: Cumartesi, 6: Pazar
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayItem,
                    isSelected && styles.selectedDay,
                  ]}
                  onPress={() => {
                    if (onDatePress) {
                      // Önce seçilen tarihi güncelle
                      setSelectedDateInWeek(day);
                      // Sonra ana uygulamaya bildir
                      onDatePress(day);
                    }
                  }}
                >
                  <Text style={[
                    styles.dayName,
                    isWeekend && styles.weekendText,
                    isSelected && !isWeekend && styles.selectedDayText,
                  ]}>
                    {DAYS_SHORT[index]}
                  </Text>
                  <Text style={[
                    styles.dayNumber,
                    isSelected && styles.selectedDayText,
                  ]}>
                    {day.getDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          
          <TouchableOpacity 
            style={styles.dayArrow}
            onPress={handleWeekNext}
          >
            <Icons.FontAwesome name="chevron-right" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      )}
      
      {/* Alt çizgi - Görsel ayrıştırıcı */}
      <View style={styles.shadowLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  sideContainer: {
    width: 40,
    justifyContent: 'center',
  },
  monthYearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  arrowButton: {
    padding: 5,
  },
  daySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 5,
    marginBottom: 3,
  },
  dayArrow: {
    paddingHorizontal: 5,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
  },
  daysContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  dayItem: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    paddingVertical: 3,
  },
  selectedDay: {
    backgroundColor: '#000',
    borderRadius: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  dayName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 2,
  },
  weekendText: {
    color: '#FF5252',
  },
  dayNumber: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  selectedDayText: {
    color: '#fff',
  },
  shadowLine: {
    height: 1,
    backgroundColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default CalendarHeader; 