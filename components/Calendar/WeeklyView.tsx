import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { WeeklyViewProps, Task } from './types';
import { FontAwesome } from '@expo/vector-icons';

const HOUR_HEIGHT = 60; // Saat yüksekliği
const TIME_LABEL_WIDTH = 60; // Zaman etiketi genişliği
const DAYS_OF_WEEK = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

const WeeklyView: React.FC<WeeklyViewProps> = ({
  date,
  tasks = [],
  onTaskPress,
  onDatePress,
  hourRange = { start: 7, end: 19 },
  theme = {},
}) => {
  // ScrollView referansları
  const verticalScrollViewRef = useRef<ScrollView>(null);
  const headerScrollViewRef = useRef<ScrollView>(null);
  const contentScrollViewRef = useRef<ScrollView>(null);
  
  // Kaydırma senkronizasyonu için durum
  const [isHeaderScrolling, setIsHeaderScrolling] = useState(false);
  const [isContentScrolling, setIsContentScrolling] = useState(false);
  
  // Bileşen mount edildiğinde iş saatlerine (9:00) kaydır
  useEffect(() => {
    if (verticalScrollViewRef.current) {
      // İş saatlerine otomatik kaydırma yapalım
      const businessHour = 9; // 09:00 AM
      const currentHour = new Date().getHours();
      
      // Eğer business hour aralıktaysa oraya, değilse görünür aralığa kaydır
      const scrollToHour = hourRange.start <= businessHour && businessHour <= hourRange.end
        ? businessHour
        : hourRange.start;
        
      // Pozisyonu hesapla ve kaydır
      const yOffset = (scrollToHour - hourRange.start) * HOUR_HEIGHT;
      setTimeout(() => {
        verticalScrollViewRef.current?.scrollTo({ y: yOffset, animated: true });
      }, 300);
    }
  }, [hourRange]);

  // Haftanın başlangıç ve bitiş tarihlerini bul
  const getWeekDays = () => {
    const currentDate = new Date(date);
    const day = currentDate.getDay(); // 0 = Pazar, 1 = Pazartesi...
    
    // Haftanın ilk günü (Pazartesi) için tarihi ayarla
    const firstDayOfWeek = new Date(currentDate);
    const mondayOffset = day === 0 ? -6 : 1 - day; // Pazar için -6, diğer günler için 1-day
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
  
  // Saati 24 saat formatında formatla (daha minimal)
  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}`;
  };
  
  // Verilen gün ve saate göre görevleri getir
  const getTasksForDayAndHour = (day: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.startTime);
      return (
        taskDate.getDate() === day.getDate() &&
        taskDate.getMonth() === day.getMonth() &&
        taskDate.getFullYear() === day.getFullYear()
      );
    });
  };
  
  // Zaman çizgisini oluştur
  const renderTimeline = () => {
    const hours = [];
    for (let i = hourRange.start; i <= hourRange.end; i++) {
      hours.push(
        <View key={i} style={styles.hourRow}>
          <View style={styles.timeLabel}>
            <Text style={styles.hourText}>{formatHour(i)}</Text>
          </View>
        </View>
      );
    }
    return hours;
  };
  
  // Şu anki zamanı gösteren çizgi
  const renderCurrentTimeLine = (day: Date) => {
    const now = new Date();
    
    // Eğer gün bugün değilse gösterme
    if (day.getDate() !== now.getDate() || 
        day.getMonth() !== now.getMonth() || 
        day.getFullYear() !== now.getFullYear()) {
      return null;
    }
    
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Eğer şu anki saat görünüm aralığı dışındaysa gösterme
    if (currentHour < hourRange.start || currentHour > hourRange.end) {
      return null;
    }
    
    // Pozisyonu hesapla
    const top = (currentHour - hourRange.start + currentMinute / 60) * HOUR_HEIGHT;
    
    return (
      <View style={[styles.currentTimeLine, { top }]}>
        <View style={styles.currentTimeCircle} />
        <View style={styles.currentTimeLineBar} />
      </View>
    );
  };
  
  // Başlık kaydırıldığında içerik de kaydırılsın
  const handleHeaderScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    if (isContentScrolling) return; // İçerik kaydırılıyorsa işlem yapma, döngüyü engelle
    
    setIsHeaderScrolling(true);
    const x = event.nativeEvent.contentOffset.x;
    
    if (contentScrollViewRef.current) {
      contentScrollViewRef.current.scrollTo({ x, animated: false });
    }
    
    // Kısa süre sonra işareti kaldır
    setTimeout(() => {
      setIsHeaderScrolling(false);
    }, 50);
  };
  
  // İçerik kaydırıldığında başlık da kaydırılsın
  const handleContentScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    if (isHeaderScrolling) return; // Başlık kaydırılıyorsa işlem yapma, döngüyü engelle
    
    setIsContentScrolling(true);
    const x = event.nativeEvent.contentOffset.x;
    
    if (headerScrollViewRef.current) {
      headerScrollViewRef.current.scrollTo({ x, animated: false });
    }
    
    // Kısa süre sonra işareti kaldır
    setTimeout(() => {
      setIsContentScrolling(false);
    }, 50);
  };
  
  // Haftalık görünümü oluştur
  const renderWeekView = () => {
    const allWeekDays = getWeekDays();
    const today = new Date();
    
    return (
      <View style={styles.weekContainer}>
        {/* Haftanın günleri başlığı */}
        <View style={styles.daysHeader}>
          <View style={styles.timeHeaderSpacer} />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            ref={headerScrollViewRef}
            onScroll={handleHeaderScroll}
            scrollEventThrottle={16}
          >
            {allWeekDays.map((day, index) => {
              const isToday = day.toDateString() === today.toDateString();
              const isSelected = day.toDateString() === date.toDateString();
              
              const dayName = DAYS_OF_WEEK[day.getDay() === 0 ? 6 : day.getDay() - 1]; // 0 = Pazar
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayHeader,
                    isToday && styles.todayHeader,
                    isSelected && styles.selectedDayHeader,
                  ]}
                  onPress={() => onDatePress && onDatePress(day)}
                >
                  <Text style={[
                    styles.dayName,
                    isSelected && styles.selectedDayText
                  ]}>
                    {dayName}
                  </Text>
                  <Text style={[
                    styles.dayNumber,
                    isToday && styles.todayText,
                    isSelected && styles.selectedDayText
                  ]}>
                    {day.getDate()}
                  </Text>
                  {isToday && <View style={styles.todayIndicator} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        
        {/* Zaman ve görevler grid */}
        <ScrollView 
          ref={verticalScrollViewRef}
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.timelineContainer}>
            {/* Zaman etiketleri */}
            <View style={styles.timeLabelsContainer}>
              {renderTimeline()}
            </View>
            
            {/* Günlük kolonlar */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              ref={contentScrollViewRef}
              onScroll={handleContentScroll}
              scrollEventThrottle={16}
            >
              <View style={styles.daysContainer}>
                {allWeekDays.map((day, dayIndex) => {
                  const dayTasks = getTasksForDayAndHour(day);
                  const isToday = day.toDateString() === today.toDateString();
                  
                  return (
                    <View key={dayIndex} style={styles.dayColumn}>
                      {/* Saat çizgileri */}
                      {Array.from({length: hourRange.end - hourRange.start + 1}).map((_, hourIndex) => (
                        <View 
                          key={hourIndex} 
                          style={[
                            styles.hourCell,
                            isToday && hourIndex === 0 && styles.todayFirstHourCell
                          ]} 
                        />
                      ))}
                      
                      {/* Görevler */}
                      {dayTasks.map((task, taskIndex) => {
                        const startTime = new Date(task.startTime);
                        const endTime = new Date(task.endTime);
                        
                        const startHour = startTime.getHours() + startTime.getMinutes() / 60;
                        const endHour = endTime.getHours() + endTime.getMinutes() / 60;
                        
                        // Görevler aralık dışındaysa gösterme
                        if (startHour > hourRange.end || endHour < hourRange.start) {
                          return null;
                        }
                        
                        // Başlangıç ve bitiş saati aralıkta olacak şekilde ayarla
                        const clampedStartHour = Math.max(startHour, hourRange.start);
                        const clampedEndHour = Math.min(endHour, hourRange.end);
                        
                        // Görevin pozisyonunu ve boyutunu hesapla
                        const top = (clampedStartHour - hourRange.start) * HOUR_HEIGHT;
                        const height = (clampedEndHour - clampedStartHour) * HOUR_HEIGHT;
                        
                        // Görevin başlangıç ve bitiş saatleri
                        const taskStartStr = `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`;
                        
                        // Görev 1 saatten uzunsa başlangıç-bitiş, değilse sadece başlangıç göster
                        const taskTimeStr = height > HOUR_HEIGHT / 2 
                          ? `${taskStartStr}-${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`
                          : taskStartStr;
                        
                        return (
                          <TouchableOpacity
                            key={`${task.id}-${taskIndex}`}
                            style={[
                              styles.taskItem,
                              {
                                top,
                                height: Math.max(height, 22), // Minimum yükseklik azaltıldı
                                borderLeftColor: task.color || theme.taskDefaultColor || '#000',
                              }
                            ]}
                            onPress={() => onTaskPress && onTaskPress(task)}
                          >
                            <Text style={styles.taskTitle} numberOfLines={1}>
                              {task.title}
                            </Text>
                            {/* Görev çok kısa değilse zamanı göster */}
                            {height > 25 && (
                              <Text style={styles.taskTime}>
                                {taskTimeStr}
                              </Text>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                      
                      {/* Şu anki zaman çizgisi */}
                      {renderCurrentTimeLine(day)}
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  };
  
  // Takvim görünümünü oluştur
  return renderWeekView();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  weekContainer: {
    flex: 1,
  },
  viewControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  viewModeButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#f8f8f8',
  },
  dayCountControls: {
    flexDirection: 'row',
  },
  dayCountButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginLeft: 8,
    backgroundColor: '#f8f8f8',
  },
  activeDayCountButton: {
    backgroundColor: '#eee',
    borderWidth: 0.5,
    borderColor: '#ddd',
  },
  viewButtonText: {
    fontSize: 10,
    color: '#555',
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  weekNavButton: {
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  daysHeader: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
  },
  timeHeaderSpacer: {
    width: TIME_LABEL_WIDTH,
    borderRightWidth: 0.5,
    borderRightColor: '#f5f5f5',
  },
  dayHeader: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  todayHeader: {
    backgroundColor: '#fafafa',
  },
  selectedDayHeader: {
    backgroundColor: '#f7f7f7',
  },
  dayName: {
    fontSize: 10,
    color: '#888',
    fontWeight: '400',
    marginBottom: 2,
  },
  selectedDayText: {
    color: '#000',
    fontWeight: 'bold',
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  todayText: {
    color: '#000',
    fontWeight: 'bold',
  },
  todayIndicator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#000',
    marginTop: 2,
  },
  scrollContainer: {
    flex: 1,
  },
  timelineContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  timeLabelsContainer: {
    width: TIME_LABEL_WIDTH,
    borderRightWidth: 0.5,
    borderRightColor: '#f5f5f5',
    backgroundColor: '#fff',
  },
  hourRow: {
    height: HOUR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f8f8f8',
  },
  timeLabel: {
    paddingRight: 8,
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: HOUR_HEIGHT,
  },
  hourText: {
    fontSize: 10,
    color: '#bbb',
    fontWeight: '400',
  },
  daysContainer: {
    flexDirection: 'row',
  },
  dayColumn: {
    width: 80,
    position: 'relative',
    borderRightWidth: 0.25,
    borderRightColor: '#f5f5f5',
  },
  hourCell: {
    height: HOUR_HEIGHT,
    borderBottomWidth: 0.25,
    borderBottomColor: '#f9f9f9',
  },
  todayFirstHourCell: {
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
  },
  taskItem: {
    position: 'absolute',
    left: 1,
    right: 1,
    borderRadius: 2,
    backgroundColor: '#fff',
    padding: 3,
    borderLeftWidth: 2,
    marginHorizontal: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
    zIndex: 1,
  },
  taskItemCompressed: {
    padding: 2,
    borderLeftWidth: 1.5,
  },
  taskTitle: {
    fontWeight: '500',
    fontSize: 10,
    marginBottom: 1,
    color: '#444',
  },
  taskTitleCompressed: {
    fontSize: 9,
    marginBottom: 0,
  },
  taskTime: {
    fontSize: 8,
    color: '#999',
  },
  currentTimeLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  currentTimeCircle: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#ff5252',
    marginLeft: -2.5,
  },
  currentTimeLineBar: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#ff5252',
  },
});

export default WeeklyView; 