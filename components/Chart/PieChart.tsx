import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PieChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
  title: string;
}

const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
  // Veri yoksa mesaj göster
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Veri bulunamadı</Text>
        </View>
      </View>
    );
  }

  // Toplam değeri hesapla
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Başlangıç açısı
  let startAngle = 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.chartWrapper}>
        <View style={styles.pieContainer}>
          {data.map((item, index) => {
            // Dilim açısını hesapla
            const angle = (item.value / total) * 360;
            // Mevcut dilimin stil objesi
            const pieSegment = {
              transform: [{ rotate: `${startAngle}deg` }],
              backgroundColor: item.color,
              zIndex: data.length - index,
            };
            
            // Başlangıç açısını güncelle
            startAngle += angle;
            
            return (
              <View key={index} style={[styles.pieSegment, pieSegment]}>
                <View 
                  style={[
                    styles.pieSegmentInner, 
                    { transform: [{ rotate: `${angle}deg` }] }
                  ]} 
                />
              </View>
            );
          })}
        </View>
      </View>
      
      {/* Gösterge */}
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendLabel}>{item.label}</Text>
            <Text style={styles.legendValue}>
              {((item.value / total) * 100).toFixed(1)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  pieContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    position: 'relative',
  },
  pieSegment: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  pieSegmentInner: {
    position: 'absolute',
    width: '200%',
    height: '200%',
    left: 0,
    top: 0,
    backgroundColor: 'transparent',
  },
  legendContainer: {
    marginTop: 16,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
});

export default PieChart; 