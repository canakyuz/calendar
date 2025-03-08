// Ana takvim bileşeninin ve alt bileşenlerin TypeScript tanımlamaları
import {
  Task,
  ThemeProps,
  CalendarProps,
  DailyViewProps,
  WeeklyViewProps,
  MonthlyViewProps,
  CalendarHeaderProps,
  DateSelectorProps,
  CalendarTabViewProps
} from './types';
import React from 'react';

// Tip tanımlamalarını dışa aktar
export {
  Task,
  ThemeProps,
  CalendarProps,
  DailyViewProps,
  WeeklyViewProps,
  MonthlyViewProps,
  CalendarHeaderProps,
  DateSelectorProps,
  CalendarTabViewProps
};

// Bileşenlerin tanımlamaları
export declare const Calendar: React.FC<CalendarProps>;
export declare const DailyView: React.FC<DailyViewProps>;
export declare const WeeklyView: React.FC<WeeklyViewProps>;
export declare const MonthlyView: React.FC<MonthlyViewProps>;
export declare const DateSelector: React.FC<DateSelectorProps>;
export declare const CalendarHeader: React.FC<CalendarHeaderProps>;
export declare const CalendarTabView: React.FC<CalendarTabViewProps>;
export declare const NavbarCalendarView: React.FC<any>;
export declare const TaskItem: React.FC<{task: Task, onPress?: (task: Task) => void}>;

// Varsayılan Calendar bileşeni
export default Calendar; 