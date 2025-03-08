import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text } from 'react-native';
import { registerRootComponent } from 'expo';
import NavbarCalendarViewFixed from './components/Calendar/NavbarCalendarViewFixed';

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };
  
  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };
  
  const handleDayPress = (date: Date) => {
    console.log("Seçilen tarih:", date);
    setCurrentDate(date);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Expo Takvim</Text>
      <View style={styles.calendarWrapper}>
        <NavbarCalendarViewFixed 
          date={currentDate}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onDayPress={handleDayPress}
          selectedDate={currentDate}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  calendarWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});

// Ana bileşen kaydı
registerRootComponent(App); 