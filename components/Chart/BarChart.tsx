import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

interface BarChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
  title: string;
  maxValue?: number;
}

const BarChart: React.FC<BarChartProps> = ({ data, title, maxValue }) => {
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
        {data.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label} numberOfLines={1}>{item.label}</Text>
            </View>
            <View style={styles.barWrapper}>
              <View 
                style={[
                  styles.bar, 
                  { 
                    width: `${(item.value / calculatedMaxValue) * 100}%`,
                    backgroundColor: item.color 
                  }
                ]} 
              />
              <Text style={styles.value}>{item.value}</Text>
            </View>
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
  chartContainer: {
    marginTop: 8,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelContainer: {
    width: 80,
    marginRight: 8,
  },
  label: {
    fontSize: 12,
    color: '#666',
  },
  barWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
  },
  bar: {
    height: 20,
    borderRadius: 4,
  },
  value: {
    marginLeft: 8,
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

export default BarChart; 