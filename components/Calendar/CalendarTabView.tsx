import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { CalendarTabViewProps } from './types';
import DailyView from './DailyView';
import WeeklyView from './WeeklyView';
import MonthlyView from './MonthlyView';
import CalendarHeader from './CalendarHeader';

const CalendarTabView: React.FC<CalendarTabViewProps> = ({
  date,
  tasks = [],
  onTaskPress,
  onDatePress,
  theme = {},
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date(date));
  
  // Tab animasyonu için ref oluştur
  const animatedValue = useRef(new Animated.Value(1)).current;
  const screenWidth = Dimensions.get('window').width;
  
  // Sekme değiştiğinde animasyon yap
  const changeTab = (tab: 'daily' | 'weekly' | 'monthly') => {
    // Önce içeriği gizle
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true
    }).start(() => {
      // Sekmeyi değiştir
      setActiveTab(tab);
      // Sonra içeriği göster
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true
      }).start();
    });
  };
  
  // Bir önceki güne/haftaya/aya git
  const handlePrevious = (newDate?: Date) => {
    // Eğer tarih değeri geliyorsa onu kullan, gelmiyorsa hesapla
    const dateToUse = newDate || (() => {
      const calculatedDate = new Date(currentDate);
      
      if (activeTab === 'daily') {
        calculatedDate.setDate(currentDate.getDate() - 1);
      } else if (activeTab === 'weekly') {
        calculatedDate.setDate(currentDate.getDate() - 7);
      } else if (activeTab === 'monthly') {
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
      
      if (activeTab === 'daily') {
        calculatedDate.setDate(currentDate.getDate() + 1);
      } else if (activeTab === 'weekly') {
        calculatedDate.setDate(currentDate.getDate() + 7);
      } else if (activeTab === 'monthly') {
        calculatedDate.setMonth(currentDate.getMonth() + 1);
      }
      
      return calculatedDate;
    })();
    
    setCurrentDate(dateToUse);
    onDatePress && onDatePress(dateToUse);
  };
  
  // Tarih değiştiğinde
  const handleDatePress = (date: Date) => {
    console.log('Tab view - Date pressed:', date); // Debug için log ekledim
    setCurrentDate(date);
    
    // Kullanıcı tarafından seçilen günü bildirme
    onDatePress && onDatePress(date);
  };
  
  return (
    <View style={styles.container}>
      {/* Başlık */}
      <CalendarHeader
        date={currentDate}
        onPrevious={handlePrevious}
        onNext={handleNext}
        theme={theme}
      />
      
      {/* Sekmeler */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'daily' && styles.activeTabButton,
          ]}
          onPress={() => changeTab('daily')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'daily' && styles.activeTabText,
          ]}>
            Günlük
          </Text>
          {activeTab === 'daily' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'weekly' && styles.activeTabButton,
          ]}
          onPress={() => changeTab('weekly')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'weekly' && styles.activeTabText,
          ]}>
            Haftalık
          </Text>
          {activeTab === 'weekly' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'monthly' && styles.activeTabButton,
          ]}
          onPress={() => changeTab('monthly')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'monthly' && styles.activeTabText,
          ]}>
            Aylık
          </Text>
          {activeTab === 'monthly' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>
      
      {/* Takvim İçeriği */}
      <Animated.View 
        style={[
          styles.contentContainer,
          { 
            opacity: animatedValue,
            transform: [{ 
              translateX: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })
            }]
          }
        ]}
      >
        {activeTab === 'daily' && (
          <DailyView
            date={currentDate}
            tasks={tasks}
            onTaskPress={onTaskPress}
            onDatePress={handleDatePress}
            theme={theme}
          />
        )}
        
        {activeTab === 'weekly' && (
          <WeeklyView
            date={currentDate}
            tasks={tasks}
            onTaskPress={onTaskPress}
            onDatePress={handleDatePress}
            theme={theme}
          />
        )}
        
        {activeTab === 'monthly' && (
          <MonthlyView
            date={currentDate}
            tasks={tasks}
            onTaskPress={onTaskPress}
            onDatePress={handleDatePress}
            theme={theme}
          />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F2',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 6,
    padding: 2,
    elevation: 1,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    position: 'relative',
    marginHorizontal: 1,
  },
  activeTabButton: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  tabText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4285F4',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 12,
    height: 2,
    backgroundColor: '#4285F4',
    borderRadius: 1,
  },
  contentContainer: {
    flex: 1,
    marginTop: 4,
  },
});

export default CalendarTabView; 