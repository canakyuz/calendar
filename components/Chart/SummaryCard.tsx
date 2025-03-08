import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon?: string;
  iconColor?: string;
  change?: number;
  changeLabel?: string;
  backgroundColor?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon = 'chart-bar',
  iconColor = '#4285F4',
  change,
  changeLabel,
  backgroundColor = '#fff',
}) => {
  // Değişim yönü
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.iconContainer}>
        <FontAwesome name={icon as any} size={24} color={iconColor} />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
        
        {change !== undefined && (
          <View style={styles.changeContainer}>
            <FontAwesome 
              name={isPositive ? 'arrow-up' : isNegative ? 'arrow-down' : 'minus'} 
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
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
});

export default SummaryCard; 