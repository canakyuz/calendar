import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { DateSelectorProps } from './types';
import { FontAwesome } from '@expo/vector-icons';

// Ayları formatlama
const MONTHS = [
  'January', 'February', 'March', 'April', 
  'May', 'June', 'July', 'August', 
  'September', 'October', 'November', 'December'
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
    setView('days');
  };
  
  // Modal'ı kapat
  const closeModal = () => {
    setModalVisible(false);
  };
  
  // Tarihi onayla
  const confirmDate = () => {
    onDateChange(tempDate);
    closeModal();
  };
  
  // Günleri oluştur
  const renderDays = () => {
    const year = tempDate.getFullYear();
    const month = tempDate.getMonth();
    
    // Ayın ilk günü
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();
    
    // Ayın gün sayısı
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Günleri oluştur
    const days = [];
    const daysArray = [];
    
    // Önceki ayın günleri
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Bu ayın günleri
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    // 7'şerli grupla
    for (let i = 0; i < days.length; i += 7) {
      daysArray.push(days.slice(i, i + 7));
    }
    
    return (
      <View style={styles.daysContainer}>
        {/* Haftanın günleri */}
        <View style={styles.weekdayHeader}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, index) => (
            <Text key={index} style={styles.weekdayText}>{day}</Text>
          ))}
        </View>
        
        {/* Günler */}
        {daysArray.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((day, dayIndex) => {
              if (day === null) {
                return <View key={dayIndex} style={styles.emptyDay} />;
              }
              
              const dayDate = new Date(year, month, day);
              const isToday = dayDate.toDateString() === new Date().toDateString();
              const isSelected = dayDate.toDateString() === tempDate.toDateString();
              
              // Minimum ve maximum tarih kontrolü
              const isDisabled = 
                (minimumDate && dayDate < minimumDate) || 
                (maximumDate && dayDate > maximumDate);
              
              return (
                <TouchableOpacity
                  key={dayIndex}
                  style={[
                    styles.dayButton,
                    isToday && styles.todayButton,
                    isSelected && styles.selectedDayButton,
                    isDisabled && styles.disabledDay,
                  ]}
                  onPress={() => {
                    if (!isDisabled) {
                      setTempDate(dayDate);
                    }
                  }}
                  disabled={isDisabled}
                >
                  <Text style={[
                    styles.dayText,
                    isToday && styles.todayText,
                    isSelected && styles.selectedDayText,
                    isDisabled && styles.disabledText,
                  ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };
  
  // Ayları oluştur
  const renderMonths = () => {
    return (
      <View style={styles.monthsContainer}>
        {MONTHS.map((month, index) => {
          const monthDate = new Date(tempDate.getFullYear(), index, 1);
          const isCurrentMonth = index === new Date().getMonth() && tempDate.getFullYear() === new Date().getFullYear();
          const isSelected = index === tempDate.getMonth();
          
          // Minimum ve maximum tarih kontrolü
          const isDisabled = 
            (minimumDate && monthDate < new Date(minimumDate.getFullYear(), minimumDate.getMonth(), 1)) || 
            (maximumDate && monthDate > new Date(maximumDate.getFullYear(), maximumDate.getMonth(), 1));
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.monthButton,
                isCurrentMonth && styles.currentMonthButton,
                isSelected && styles.selectedMonthButton,
                isDisabled && styles.disabledMonth,
              ]}
              onPress={() => {
                if (!isDisabled) {
                  setTempDate(new Date(tempDate.getFullYear(), index, tempDate.getDate()));
                  setView('days');
                }
              }}
              disabled={isDisabled}
            >
              <Text style={[
                styles.monthText,
                isCurrentMonth && styles.currentMonthText,
                isSelected && styles.selectedMonthText,
                isDisabled && styles.disabledText,
              ]}>
                {month}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  
  // Yılları oluştur
  const renderYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    // Önceki 10 yıl ve sonraki 10 yıl
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(i);
    }
    
    return (
      <View style={styles.yearsContainer}>
        {years.map((year, index) => {
          const isCurrentYear = year === currentYear;
          const isSelected = year === tempDate.getFullYear();
          
          // Minimum ve maximum tarih kontrolü
          const isDisabled = 
            (minimumDate && year < minimumDate.getFullYear()) || 
            (maximumDate && year > maximumDate.getFullYear());
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.yearButton,
                isCurrentYear && styles.currentYearButton,
                isSelected && styles.selectedYearButton,
                isDisabled && styles.disabledYear,
              ]}
              onPress={() => {
                if (!isDisabled) {
                  setTempDate(new Date(year, tempDate.getMonth(), tempDate.getDate()));
                  setView('months');
                }
              }}
              disabled={isDisabled}
            >
              <Text style={[
                styles.yearText,
                isCurrentYear && styles.currentYearText,
                isSelected && styles.selectedYearText,
                isDisabled && styles.disabledText,
              ]}>
                {year}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={openModal}
      >
        <Text style={styles.buttonText}>{formatDate(date)}</Text>
        <FontAwesome name="calendar" size={16} color="#666" />
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={closeModal}
        >
          <View 
            style={[
              styles.modalContent,
              theme.backgroundColor && { backgroundColor: theme.backgroundColor }
            ]}
          >
            {/* Başlık */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setView('years')}>
                <Text style={styles.yearTitle}>{tempDate.getFullYear()}</Text>
              </TouchableOpacity>
              
              {view === 'days' && (
                <TouchableOpacity onPress={() => setView('months')}>
                  <Text style={styles.monthTitle}>{MONTHS[tempDate.getMonth()]}</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <FontAwesome name="times" size={16} color="#666" />
              </TouchableOpacity>
            </View>
            
            {/* İçerik */}
            <View style={styles.modalBody}>
              {view === 'days' && renderDays()}
              {view === 'months' && renderMonths()}
              {view === 'years' && renderYears()}
            </View>
            
            {/* Alt butonlar */}
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.confirmButton} onPress={confirmDate}>
                <Text style={styles.confirmButtonText}>Tamam</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  yearTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
  },
  confirmButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007bff',
    borderRadius: 4,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  daysContainer: {
    width: '100%',
  },
  weekdayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekdayText: {
    width: 36,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  todayButton: {
    backgroundColor: '#f0f0f0',
  },
  selectedDayButton: {
    backgroundColor: '#007bff',
  },
  disabledDay: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  todayText: {
    fontWeight: 'bold',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#999',
  },
  emptyDay: {
    width: 36,
    height: 36,
  },
  monthsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  monthButton: {
    width: '30%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderRadius: 4,
  },
  currentMonthButton: {
    backgroundColor: '#f0f0f0',
  },
  selectedMonthButton: {
    backgroundColor: '#007bff',
  },
  disabledMonth: {
    opacity: 0.3,
  },
  monthText: {
    fontSize: 14,
    color: '#333',
  },
  currentMonthText: {
    fontWeight: 'bold',
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
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderRadius: 4,
  },
  currentYearButton: {
    backgroundColor: '#f0f0f0',
  },
  selectedYearButton: {
    backgroundColor: '#007bff',
  },
  disabledYear: {
    opacity: 0.3,
  },
  yearText: {
    fontSize: 14,
    color: '#333',
  },
  currentYearText: {
    fontWeight: 'bold',
  },
  selectedYearText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DateSelector; 