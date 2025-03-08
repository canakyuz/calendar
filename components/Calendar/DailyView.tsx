import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { DailyViewProps, Task } from './types';

const HOUR_HEIGHT = 60; // Saat bölmelerinin yüksekliği
const TIME_LABEL_WIDTH = 60; // Zaman etiketlerinin genişliği

const DailyView: React.FC<DailyViewProps> = ({
  date,
  tasks = [],
  onTaskPress,
  onDatePress,
  hourRange = { start: 0, end: 23 },
  theme = {},
}) => {
  // ScrollView referansı
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Bileşen mount edildiğinde iş saatlerine (9:00) kaydır
  useEffect(() => {
    if (scrollViewRef.current) {
      // Şu anki saate otomatik kaydırma yapalım (gündüz saatleri civarı)
      const businessHour = 9; // 09:00 AM
      const currentHour = new Date().getHours();
      
      // Eğer business hour aralıktaysa oraya, değilse görünür aralığa kaydır
      const scrollToHour = hourRange.start <= businessHour && businessHour <= hourRange.end
        ? businessHour
        : hourRange.start;
        
      // Pozisyonu hesapla ve kaydır
      const yOffset = (scrollToHour - hourRange.start) * HOUR_HEIGHT;
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: yOffset, animated: true });
      }, 300);
    }
  }, [hourRange]);

  // Saati 24 saat formatında formatla
  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };
  
  // Verilen günün görevlerini getir
  const renderTasks = () => {
    // Seçilen tarihten görevleri filtrele
    const dayTasks = tasks.filter(task => {
      const taskDate = new Date(task.startTime);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
    
    return dayTasks.map((task, index) => {
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
      const taskStartStr = `${startTime.getHours()}:${startTime.getMinutes().toString().padStart(2, '0')}`;
      const taskEndStr = `${endTime.getHours()}:${endTime.getMinutes().toString().padStart(2, '0')}`;
      
      return (
        <TouchableOpacity
          key={task.id}
          style={[
            styles.taskItem,
            {
              top,
              height: Math.max(height, 30), // Minimum yükseklik
              borderLeftColor: task.color || theme.taskDefaultColor || '#f78536',
            },
          ]}
          onPress={() => onTaskPress && onTaskPress(task)}
        >
          <Text style={styles.taskTitle} numberOfLines={1}>
            {task.title}
          </Text>
          <Text style={styles.taskTime}>
            {taskStartStr} - {taskEndStr}
          </Text>
        </TouchableOpacity>
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
          <View style={styles.hourLine} />
        </View>
      );
    }
    return hours;
  };
  
  // Şu anki zamanı gösteren çizgi
  const renderCurrentTimeLine = () => {
    const now = new Date();
    
    // Eğer seçilen gün bugün değilse gösterme
    if (date.getDate() !== now.getDate() || 
        date.getMonth() !== now.getMonth() || 
        date.getFullYear() !== now.getFullYear()) {
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
  
  return (
    <ScrollView 
      ref={scrollViewRef}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.timeline}>
        <View style={styles.timelineContent}>
          {renderTimeline()}
        </View>
        <View style={styles.tasksContainer}>
          {renderTasks()}
          {renderCurrentTimeLine()}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 50,
  },
  timeline: {
    flexDirection: 'row',
    flex: 1,
  },
  timelineContent: {
    flexDirection: 'column',
  },
  hourRow: {
    flexDirection: 'row',
    height: HOUR_HEIGHT,
    alignItems: 'flex-start',
  },
  timeLabel: {
    width: TIME_LABEL_WIDTH,
    paddingRight: 10,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingTop: 8,
    height: HOUR_HEIGHT,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  hourText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '500',
  },
  hourLine: {
    position: 'absolute',
    right: 0,
    left: TIME_LABEL_WIDTH,
    height: 1,
    backgroundColor: '#f5f5f5',
    top: 0,
    width: Dimensions.get('window').width - TIME_LABEL_WIDTH,
  },
  tasksContainer: {
    position: 'absolute',
    left: TIME_LABEL_WIDTH,
    right: 0,
    top: 0,
    bottom: 0,
    paddingLeft: 8,
  },
  taskItem: {
    position: 'absolute',
    left: 4,
    right: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    padding: 8,
    borderLeftWidth: 3,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 1,
  },
  taskTitle: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  taskTime: {
    fontSize: 12,
    color: '#888',
  },
  currentTimeLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  currentTimeCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff0000',
    marginLeft: -4,
  },
  currentTimeLineBar: {
    flex: 1,
    height: 2,
    backgroundColor: '#ff0000',
  },
});

export default DailyView; 