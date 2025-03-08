import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { DateSelectorProps } from './types';
import * as Icons from '@expo/vector-icons';

// Ayları formatlama
const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 
  'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 
  'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const DateSelector: React.FC<DateSelectorProps> = ({
  date,
  onDateChange,
  minimumDate,
  maximumDate,
  theme = {},
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempDate, setTempDate] = useState(new Date(date));
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');
  
  // Tarihi formatla
  const formatDate = (date: Date) => {
    return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  };
  
  // Modal'ı aç
  const openModal = () => {
    setTempDate(new Date(date));
    setModalVisible(true);
  };
  
  // Modal'ı kapat
  const closeModal = () => {
    setModalVisible(false);
  };
  
  // Tarihi onayla ve modal'ı kapat
  const confirmDate = () => {
    onDateChange(tempDate);
    closeModal();
  };
  
  // Günleri render et
  const renderDays = () => {
    const days = [];
    const year = tempDate.getFullYear();
    const month = tempDate.getMonth();
    
    // Ayın ilk günü
    const firstDay = new Date(year, month, 1);
    
    // Haftanın günü (0: Pazar, 1: Pazartesi, ..., 6: Cumartesi)
    let firstDayOfWeek = firstDay.getDay();
    // Pazartesi'yi haftanın ilk günü olarak ayarla (0: Pazartesi)
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Ayın gün sayısı
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Önceki ayın günleri
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      const day = prevMonthDays - firstDayOfWeek + i + 1;
      const prevDate = new Date(year, month - 1, day);
      
      days.push(
        <TouchableOpacity 
          key={`prev-${i}`}
          style={[
            styles.dayButton,
            styles.otherMonthDay,
            minimumDate && prevDate < minimumDate && styles.disabledDay
          ]}
          onPress={() => {
            if (minimumDate && prevDate < minimumDate) return;
            const newDate = new Date(tempDate);
            newDate.setMonth(month - 1);
            newDate.setDate(day);
            setTempDate(newDate);
          }}
          disabled={minimumDate ? prevDate < minimumDate : false}
        >
          <Text style={[
            styles.dayText,
            styles.otherMonthText,
            minimumDate && prevDate < minimumDate && styles.disabledText
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }
    
    // Bu ayın günleri
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const isToday = 
        currentDate.getDate() === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();
      
      const isSelected = 
        currentDate.getDate() === tempDate.getDate() &&
        currentDate.getMonth() === tempDate.getMonth() &&
        currentDate.getFullYear() === tempDate.getFullYear();
      
      days.push(
        <TouchableOpacity 
          key={`current-${i}`}
          style={[
            styles.dayButton,
            isToday && styles.todayButton,
            isSelected && styles.selectedDayButton,
            theme.selectedDayColor && isSelected && { backgroundColor: theme.selectedDayColor },
            minimumDate && currentDate < minimumDate && styles.disabledDay,
            maximumDate && currentDate > maximumDate && styles.disabledDay,
          ]}
          onPress={() => {
            if (
              (minimumDate && currentDate < minimumDate) ||
              (maximumDate && currentDate > maximumDate)
            ) return;
            
            const newDate = new Date(tempDate);
            newDate.setDate(i);
            setTempDate(newDate);
          }}
          disabled={
            (minimumDate ? currentDate < minimumDate : false) ||
            (maximumDate ? currentDate > maximumDate : false)
          }
        >
          <Text style={[
            styles.dayText,
            isToday && styles.todayText,
            isSelected && styles.selectedDayText,
            theme.selectedDayTextColor && isSelected && { color: theme.selectedDayTextColor },
            minimumDate && currentDate < minimumDate && styles.disabledText,
            maximumDate && currentDate > maximumDate && styles.disabledText,
          ]}>
            {i}
          </Text>
        </TouchableOpacity>
      );
    }
    
    // Sonraki ayın günleri
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        const nextDate = new Date(year, month + 1, i);
        
        days.push(
          <TouchableOpacity 
            key={`next-${i}`}
            style={[
              styles.dayButton,
              styles.otherMonthDay,
              maximumDate && nextDate > maximumDate && styles.disabledDay
            ]}
            onPress={() => {
              if (maximumDate && nextDate > maximumDate) return;
              const newDate = new Date(tempDate);
              newDate.setMonth(month + 1);
              newDate.setDate(i);
              setTempDate(newDate);
            }}
            disabled={maximumDate ? nextDate > maximumDate : false}
          >
            <Text style={[
              styles.dayText,
              styles.otherMonthText,
              maximumDate && nextDate > maximumDate && styles.disabledText
            ]}>
              {i}
            </Text>
          </TouchableOpacity>
        );
      }
    }
    
    return days;
  };
  
  // Ayları render et
  const renderMonths = () => {
    const months = [];
    
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(tempDate.getFullYear(), i, 1);
      const isCurrentMonth = i === tempDate.getMonth();
      
      months.push(
        <TouchableOpacity 
          key={i}
          style={[
            styles.monthButton,
            isCurrentMonth && styles.selectedMonthButton,
            theme.selectedDayColor && isCurrentMonth && { backgroundColor: theme.selectedDayColor },
            minimumDate && monthDate < minimumDate && styles.disabledDay,
            maximumDate && new Date(tempDate.getFullYear(), i + 1, 0) > maximumDate && styles.disabledDay,
          ]}
          onPress={() => {
            const newDate = new Date(tempDate);
            newDate.setMonth(i);
            setTempDate(newDate);
            setView('days');
          }}
          disabled={
            (minimumDate && monthDate < minimumDate) ||
            (maximumDate && new Date(tempDate.getFullYear(), i + 1, 0) > maximumDate)
          }
        >
          <Text style={[
            styles.monthText,
            isCurrentMonth && styles.selectedMonthText,
            theme.selectedDayTextColor && isCurrentMonth && { color: theme.selectedDayTextColor },
            minimumDate && monthDate < minimumDate && styles.disabledText,
            maximumDate && new Date(tempDate.getFullYear(), i + 1, 0) > maximumDate && styles.disabledText,
          ]}>
            {MONTHS[i]}
          </Text>
        </TouchableOpacity>
      );
    }
    
    return months;
  };
  
  // Yılları render et
  const renderYears = () => {
    const years = [];
    const currentYear = tempDate.getFullYear();
    const startYear = currentYear - 5;
    const endYear = currentYear + 5;
    
    for (let i = startYear; i <= endYear; i++) {
      const isCurrentYear = i === currentYear;
      const yearDate = new Date(i, 0, 1);
      
      years.push(
        <TouchableOpacity 
          key={i}
          style={[
            styles.yearButton,
            isCurrentYear && styles.selectedYearButton,
            theme.selectedDayColor && isCurrentYear && { backgroundColor: theme.selectedDayColor },
            minimumDate && yearDate < minimumDate && styles.disabledDay,
            maximumDate && new Date(i, 11, 31) > maximumDate && styles.disabledDay,
          ]}
          onPress={() => {
            const newDate = new Date(tempDate);
            newDate.setFullYear(i);
            setTempDate(newDate);
            setView('months');
          }}
          disabled={
            (minimumDate && yearDate < minimumDate) ||
            (maximumDate && new Date(i, 11, 31) > maximumDate)
          }
        >
          <Text style={[
            styles.yearText,
            isCurrentYear && styles.selectedYearText,
            theme.selectedDayTextColor && isCurrentYear && { color: theme.selectedDayTextColor },
            minimumDate && yearDate < minimumDate && styles.disabledText,
            maximumDate && new Date(i, 11, 31) > maximumDate && styles.disabledText,
          ]}>
            {i}
          </Text>
        </TouchableOpacity>
      );
    }
    
    return years;
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, theme.backgroundColor && { backgroundColor: theme.backgroundColor }]} 
        onPress={openModal}
      >
        <Text style={styles.buttonText}>{formatDate(date)}</Text>
        <Icons.AntDesign name="calendar" size={16} color="#666" />
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <View 
            style={[
              styles.modalContent,
              theme.backgroundColor && { backgroundColor: theme.backgroundColor }
            ]}
            // Modal içeriğine tıklama
            onTouchStart={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity style={styles.titleButton} onPress={() => setView('years')}>
                <Text style={styles.modalTitle}>
                  {view === 'days' 
                    ? `${MONTHS[tempDate.getMonth()]} ${tempDate.getFullYear()}`
                    : view === 'months'
                      ? `${tempDate.getFullYear()}`
                      : 'Yıl Seçimi'
                  }
                </Text>
              </TouchableOpacity>
                
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Icons.AntDesign name="close" size={16} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.calendarView}>
              {view === 'days' && (
                <>
                  <View style={styles.weekdayHeader}>
                    {['Pt', 'Sa', 'Çr', 'Pr', 'Cu', 'Ct', 'Pz'].map((day, index) => (
                      <Text key={index} style={styles.weekdayText}>
                        {day}
                      </Text>
                    ))}
                  </View>
                  
                  <View style={styles.daysContainer}>
                    {renderDays()}
                  </View>
                </>
              )}
              
              {view === 'months' && (
                <View style={styles.monthsContainer}>
                  {renderMonths()}
                </View>
              )}
              
              {view === 'years' && (
                <View style={styles.yearsContainer}>
                  {renderYears()}
                </View>
              )}
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[
                  styles.confirmButton,
                  theme.selectedDayColor && { backgroundColor: theme.selectedDayColor }
                ]} 
                onPress={confirmDate}
              >
                <Text style={[
                  styles.confirmButtonText,
                  theme.selectedDayTextColor && { color: theme.selectedDayTextColor }
                ]}>
                  Onayla
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '80%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 15,
  },
  titleButton: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  calendarView: {
    padding: 10,
  },
  weekdayHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    color: '#666',
    fontWeight: 'bold',
    fontSize: 12,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayButton: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  otherMonthDay: {
    opacity: 0.5,
  },
  otherMonthText: {
    color: '#999',
  },
  todayButton: {
    backgroundColor: '#f0f0f0',
  },
  todayText: {
    fontWeight: 'bold',
  },
  selectedDayButton: {
    backgroundColor: '#007bff',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledDay: {
    opacity: 0.3,
  },
  disabledText: {
    color: '#ccc',
  },
  monthsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  monthButton: {
    width: '30%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: '1.66%',
  },
  monthText: {
    fontSize: 14,
    color: '#333',
  },
  selectedMonthButton: {
    backgroundColor: '#007bff',
  },
  selectedMonthText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  yearsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  yearButton: {
    width: '30%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: '1.66%',
  },
  yearText: {
    fontSize: 14,
    color: '#333',
  },
  selectedYearButton: {
    backgroundColor: '#007bff',
  },
  selectedYearText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 15,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default DateSelector; 