import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

interface LineChartProps {
  data: {
    label: string;
    value: number;
  }[];
  title: string;
  color?: string;
  maxValue?: number;
}

const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  title, 
  color = '#4285F4', 
  maxValue 
}) => {
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

  // Maksimum değeri belirle
  const calculatedMaxValue = maxValue || Math.max(...data.map(item => item.value)) * 1.2;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.chartContainer}>
        {/* Grid çizgileri */}
        <View style={styles.gridContainer}>
          {[0, 25, 50, 75, 100].map((tick, index) => (
            <View key={index} style={[styles.gridLine, { top: `${tick}%` }]} />
          ))}
        </View>
        
        {/* Veri noktaları */}
        <View style={styles.pointsContainer}>
          {data.map((item, index) => {
            const leftPercent = (index / (data.length - 1)) * 100;
            const topPercent = 100 - (item.value / calculatedMaxValue) * 100;
            
            return (
              <View 
                key={index} 
                style={[
                  styles.dataPoint, 
                  { 
                    backgroundColor: color,
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`
                  }
                ]}
              >
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipText}>{item.value}</Text>
                </View>
              </View>
            );
          })}
        </View>
        
        {/* X ekseni etiketleri */}
        <View style={styles.labelsContainer}>
          {data.map((item, index) => (
            <Text 
              key={index} 
              style={[
                styles.label, 
                { left: `${(index / (data.length - 1)) * 100}%` }
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          ))}
        </View>
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
  chartContainer: {
    height: 200,
    marginTop: 8,
    marginBottom: 24,
    position: 'relative',
  },
  gridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  pointsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dataPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: -4,
    marginTop: -4,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 4,
    borderRadius: 4,
    top: -24,
    left: '50%',
    transform: [{ translateX: -20 }],
    opacity: 0,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 10,
  },
  labelsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -24,
    height: 20,
  },
  label: {
    position: 'absolute',
    transform: [{ translateX: -20 }],
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    width: 40,
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

export default LineChart; 