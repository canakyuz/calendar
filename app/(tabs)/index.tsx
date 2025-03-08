// 1. Uyarlanabilir eekrana yonelik takvim ekran verisi navbar daki seçimler ile değişecek.

import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Text, TouchableOpacity, Dimensions, Modal, Alert } from 'react-native';
import { CalendarHeader } from '../../components/Calendar';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// FontAwesome simge tiplerini tanımlama
type FontAwesomeIconName = 'calendar' | 'check-circle' | 'arrow-up' | 'arrow-down' | 'minus' | 'chart-bar' | string;

// Örnek görevler
const sampleTasks = [
  {
    id: '1',
    title: 'Task 1',
    startTime: new Date(2025, 6, 7, 10, 0),
    endTime: new Date(2025, 6, 7, 11, 30),
    color: '#4285F4', // Mavi
    description: 'Task 1 açıklaması',
  },
  {
    id: '5',
    title: 'Task 5',
    startTime: new Date(2025, 6, 7, 14, 0),
    endTime: new Date(2025, 6, 7, 15, 0),
    color: '#0F9D58', // Yeşil
  },
  {
    id: '6',
    title: 'Task 6',
    startTime: new Date(2025, 6, 7, 8, 0),
    endTime: new Date(2025, 6, 7, 11, 30),
    color: '#F4B400', // Sarı
  },
  {
    id: '2',
    title: 'Task 2',
    startTime: new Date(2025, 6, 2, 12, 0),
    endTime: new Date(2025, 6, 2, 13, 30),
    color: '#DB4437', // Kırmızı
  },
];

// Veri tipleri
interface ChartDataItem {
  label: string;
  value: number;
  color: string;
}

// Örnek grafik verileri (gerçekte API'den gelecek)
const getBarData = (date: Date): ChartDataItem[] => {
  // Gün bazında farklı veriler döndür
  const day = date.getDate();
  return [
    { label: 'Kategori 1', value: 25 + day, color: '#4285F4' },
    { label: 'Kategori 2', value: 18 + (day % 5), color: '#DB4437' },
    { label: 'Kategori 3', value: 30 - (day % 8), color: '#F4B400' },
    { label: 'Kategori 4', value: 15 + (day % 10), color: '#0F9D58' },
  ];
};

interface LineDataItem {
  label: string;
  value: number;
}

const getLineData = (date: Date): LineDataItem[] => {
  // Seçilen günün haftası için veri oluştur
  const currentDay = date.getDay();
  const dayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
  
  return Array(7).fill(0).map((_, index) => {
    const dayOffset = index - currentDay;
    const value = 20 + Math.floor(Math.random() * 60);
    
    return {
      label: dayNames[(index + 7) % 7],
      value: value
    };
  });
};

const getPieData = (date: Date): ChartDataItem[] => {
  // Gün bazında farklı veriler döndür
  const day = date.getDate();
  return [
    { label: 'Kategori A', value: 35 + day, color: '#4285F4' },
    { label: 'Kategori B', value: 25 + (day % 7), color: '#DB4437' },
    { label: 'Kategori C', value: 20 - (day % 5), color: '#F4B400' },
    { label: 'Kategori D', value: 15 + (day % 3), color: '#0F9D58' },
  ];
};

// Bileşen prop tipleri
interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: FontAwesomeIconName;
  iconColor: string;
  change?: number;
  changeLabel?: string;
  backgroundColor?: string;
}

interface SimpleBarChartProps {
  title: string;
  data: ChartDataItem[];
}

export default function IndexScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Tarih değiştiğinde
  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };
  
  // Seçilen güne göre özet bilgileri oluştur
  const getTotalEvents = () => {
    const day = currentDate.getDate();
    return day % 5 + 3;
  };
  
  const getCompletionRate = () => {
    const day = currentDate.getDate();
    return 75 + (day % 15);
  };
  
  const getChangeRate = () => {
    const day = currentDate.getDate();
    return day % 2 === 0 ? 5.2 : -3.8;
  };
  
  // Basit kart bileşeni
  const SummaryCard: React.FC<SummaryCardProps> = ({
    title,
    value,
    icon,
    iconColor,
    change,
    changeLabel,
    backgroundColor = '#fff',
  }) => {
    const isPositive = change && change > 0;
    const isNegative = change && change < 0;
    
    return (
      <View style={[styles.cardContainer, { backgroundColor }]}>
        <View style={styles.iconContainer}>
          <FontAwesome name={icon as any} size={24} color={iconColor} />
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardValue}>{value}</Text>
          
          {change !== undefined && (
            <View style={styles.changeContainer}>
              <FontAwesome 
                name={(isPositive ? 'arrow-up' : isNegative ? 'arrow-down' : 'minus') as any} 
                size={12} 
                color={isPositive ? '#34A853' : isNegative ? '#EA4335' : '#888'} 
                style={styles.changeIcon} 
              />
              <Text 
                style={[
                  styles.changeText, 
                  isPositive ? styles.positiveChange : isNegative ? styles.negativeChange : {}
                ]}
              >
                {Math.abs(change).toFixed(1)}% {changeLabel || ''}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };
  
  // Basit bar chart bileşeni
  const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ title, data }) => {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>{title}</Text>
        <View style={styles.barChartContent}>
          {data.map((item, index) => (
            <View key={index} style={styles.barChartItem}>
              <Text style={styles.barChartLabel}>{item.label}</Text>
              <View style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      width: `${(item.value / 100) * 100}%`,
                      backgroundColor: item.color 
                    }
                  ]} 
                />
                <Text style={styles.barValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };
  
  // Sonraki güne geçmek için
  const handleNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setCurrentDate(nextDay);
  };

  // Önceki güne geçmek için
  const handlePreviousDay = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setCurrentDate(prevDay);
  };
  
  const handleSettingsPress = () => {
    Alert.alert('Ayarlar', 'Ayarlar sayfası açılacak');
    // Burada ayarlar sayfasına yönlendirme veya işlem yapılabilir
  };
  
  const handleNotificationsPress = () => {
    setIsModalVisible(true);
    // Burada bildirimler gösterilebilir
  };
  
  // Özel sol içerik (Ayarlar butonu)
  const CustomLeftContent = (
    <View style={styles.iconContainer}>
      <FontAwesome name="cog" size={22} color="#333" />
    </View>
  );
  
  // Özel sağ içerik (Bildirimler butonu)
  const CustomRightContent = (
    <View style={styles.notificationContainer}>
      <FontAwesome name="bell" size={22} color="#333" />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>5</Text>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Takvim Başlığı */}
      <View style={styles.calendarContainer}>
        <CalendarHeader
          date={currentDate}
          onPrevious={handlePreviousDay}
          onNext={handleNextDay}
          onDatePress={handleDateChange}
          leftContent={CustomLeftContent}
          rightContent={CustomRightContent}
          onLeftPress={handleSettingsPress}
          onRightPress={handleNotificationsPress}
          theme={{
            headerBackgroundColor: '#fff',
            headerTextColor: '#333',
            selectedDayColor: '#4285F4',
          }}
        />
      </View>
      
      {/* İçerik */}
      <ScrollView style={styles.content}>
        <Text style={styles.dateHeader}>
          {currentDate.toLocaleDateString('tr-TR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
        
        {/* Özet Kartlar */}
        <View style={styles.summaryContainer}>
          <SummaryCard
            title="Toplam Etkinlik"
            value={getTotalEvents()}
            icon="calendar"
            iconColor="#4285F4"
            change={getChangeRate()}
            changeLabel="önceki güne göre"
          />
          
          <SummaryCard
            title="Tamamlanma Oranı"
            value={`%${getCompletionRate()}`}
            icon="check-circle"
            iconColor="#0F9D58"
            change={getChangeRate() * 1.5}
            changeLabel="önceki güne göre"
          />
        </View>
        
        {/* Grafikler */}
        <SimpleBarChart 
          title="Günlük Kategori Dağılımı" 
          data={getBarData(currentDate)} 
        />
        
        {/* Pie Chart (Basit görsel temsil) */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Kategori Dağılımı</Text>
          <View style={styles.pieContainer}>
            {getPieData(currentDate).map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                <Text style={styles.legendLabel}>{item.label}</Text>
                <Text style={styles.legendValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      
      {/* Bildirimler Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bildirimler</Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
              >
                <FontAwesome name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.notificationList}>
              <View style={styles.notificationItem}>
                <Text style={styles.notificationTitle}>Yeni toplantı</Text>
                <Text style={styles.notificationTime}>2 saat önce</Text>
                <Text style={styles.notificationDesc}>Pazartesi 14:00'da proje toplantısı</Text>
              </View>
              
              <View style={styles.notificationItem}>
                <Text style={styles.notificationTitle}>Hatırlatıcı</Text>
                <Text style={styles.notificationTime}>Dün</Text>
                <Text style={styles.notificationDesc}>Rapor teslim tarihi yarın</Text>
              </View>
              
              <View style={styles.notificationItem}>
                <Text style={styles.notificationTitle}>Görev tamamlandı</Text>
                <Text style={styles.notificationTime}>2 gün önce</Text>
                <Text style={styles.notificationDesc}>"Sunum Hazırla" görevi tamamlandı</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    width: '48%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeIcon: {
    marginRight: 4,
  },
  changeText: {
    fontSize: 12,
    color: '#888',
  },
  positiveChange: {
    color: '#34A853',
  },
  negativeChange: {
    color: '#EA4335',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  barChartContent: {
    marginTop: 8,
  },
  barChartItem: {
    marginBottom: 12,
  },
  barChartLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  barWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
  },
  bar: {
    height: 20,
    borderRadius: 4,
  },
  barValue: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  pieContainer: {
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendLabel: {
    flex: 1,
    fontSize: 12,
    color: '#666',
  },
  legendValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF5252',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '60%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationList: {
    maxHeight: 400,
  },
  notificationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  notificationDesc: {
    fontSize: 14,
  },
});

