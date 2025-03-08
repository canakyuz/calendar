import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { CalendarHeaderProps } from './types';
import { FontAwesome } from '@expo/vector-icons';

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
    
    // Her durumda Gün Ay formatı
    return `${currentDate.getDate()} ${MONTHS[currentDate.getMonth()]}`;
  }, [title]);
  
  // Dışarıdan gelen tarih değiştiğinde, seçili tarihi ve başlığı güncelle
  useEffect(() => {
    setSelectedDateInWeek(new Date(date));
    setCurrentTitle(getFormattedTitle(date));
  }, [date, getFormattedTitle]);
  
  // Haftanın günlerini ve tarihlerini oluştur
  const getWeekDays = () => {
    // Mevcut tarihin bulunduğu haftanın ilk gününü (Pazartesi) bul
    const currentDate = new Date(date);
    const day = currentDate.getDay(); // 0: Pazar, 1: Pazartesi...
    
    // Pazartesi'yi haftanın ilk günü olarak ayarla
    const firstDayOfWeek = new Date(currentDate);
    const mondayOffset = day === 0 ? -6 : 1 - day; // Pazar ise -6, diğer günler için 1-gün
    firstDayOfWeek.setDate(currentDate.getDate() + mondayOffset);
    
    // Haftanın günlerini oluştur
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(firstDayOfWeek);
      weekDay.setDate(firstDayOfWeek.getDate() + i);
      weekDays.push(weekDay);
    }
    
    return weekDays;
  };
  
  const weekDays = getWeekDays();

  // Haftalık görünümü aç/kapat
  const toggleWeekView = () => {
    setWeekViewVisible(!weekViewVisible);
  };
  
  // Üst butonlar için gezinme fonksiyonları
  const handleTopPrevious = () => {
    if (weekViewVisible) {
      // Haftalık görünüm açıkken, bir hafta geriye git
      const newDate = new Date(date);
      newDate.setDate(date.getDate() - 7);
      if (onPrevious) onPrevious(newDate);
    } else {
      // Haftalık görünüm kapalıyken, bir gün geriye git
      const newDate = new Date(date);
      newDate.setDate(date.getDate() - 1);
      if (onPrevious) onPrevious(newDate);
    }
  };

  const handleTopNext = () => {
    if (weekViewVisible) {
      // Haftalık görünüm açıkken, bir ay ileriye git
      const newDate = new Date(date);
      newDate.setMonth(date.getMonth() + 1);
      if (onNext) onNext(newDate);
    } else {
      // Haftalık görünüm kapalıyken, bir gün ileriye git
      const newDate = new Date(date);
      newDate.setDate(date.getDate() + 1);
      if (onNext) onNext(newDate);
    }
  };

  // Haftalık görünümdeki alt butonlar için gezinme fonksiyonları
  const handleWeekPrevious = () => {
    // Bir hafta geriye git
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - 7); // Tam bir hafta geriye git
    if (onPrevious) {
      // Haftanın başlangıç gününe göre ayarla
      const day = newDate.getDay(); // 0: Pazar, 1: Pazartesi, ...
      const mondayOffset = day === 0 ? -6 : 1 - day; // Pazarsa -6, diğer günler için 1-gün
      newDate.setDate(newDate.getDate() + mondayOffset); // Haftanın başlangıcına ayarla
      onPrevious(newDate);
    }
  };

  const handleWeekNext = () => {
    // Bir hafta ileriye git
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 7); // Tam bir hafta ileriye git
    if (onNext) {
      // Haftanın başlangıç gününe göre ayarla
      const day = newDate.getDay(); // 0: Pazar, 1: Pazartesi, ...
      const mondayOffset = day === 0 ? -6 : 1 - day; // Pazarsa -6, diğer günler için 1-gün
      newDate.setDate(newDate.getDate() + mondayOffset); // Haftanın başlangıcına ayarla
      onNext(newDate);
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Üst kısım: Logo, Ay/Yıl seçimi ve Bildirimler */}
      <View style={styles.topBar}>
        {/* Sol bölüm - Özelleştirilebilir */}
        <TouchableOpacity 
          style={styles.logoContainer}
          onPress={onLeftPress}
        >
          {leftContent ? (
            leftContent
          ) : (
            <View style={styles.logo}>
              <Text style={styles.logoText}>K</Text>
            </View>
          )}
        </TouchableOpacity>
        
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
            <FontAwesome name="chevron-left" size={16} color="#000" />
          </TouchableOpacity>
          
          <Text style={styles.monthYearText}>{currentTitle}</Text>
          
          <TouchableOpacity 
            style={styles.arrowButton} 
            onPress={handleTopNext}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome name="chevron-right" size={16} color="#000" />
          </TouchableOpacity>
        </TouchableOpacity>
        
        {/* Sağ bölüm - Özelleştirilebilir */}
        <TouchableOpacity 
          style={styles.notificationsButton}
          onPress={onRightPress}
        >
          {rightContent ? (
            rightContent
          ) : (
            <>
              <FontAwesome name="envelope-o" size={20} color="#000" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>3</Text>
              </View>
            </>
          )}
        </TouchableOpacity>
      </View>
      
      {/* Alt kısım: Günlük gezinme - Görünürlüğü toggle edilebilen, 7 gün kompakt görünüm */}
      {weekViewVisible && (
        <View style={styles.daySelector}>
          <TouchableOpacity 
            style={styles.dayArrow}
            onPress={handleWeekPrevious}
          >
            <FontAwesome name="chevron-left" size={16} color="#000" />
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
            <FontAwesome name="chevron-right" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      )}
      
      {/* Gölge çizgisi */}
      <View style={styles.shadowLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  logoContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
  },
  logoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    transform: [{ rotate: '-45deg' }],
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
  notificationsButton: {
    width: 40,
    alignItems: 'flex-end',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF5252',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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