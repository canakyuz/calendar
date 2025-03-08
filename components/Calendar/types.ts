export interface Task {
  id: string;
  title: string;
  startTime: string | Date;
  endTime: string | Date;
  color?: string;
  description?: string;
  location?: string;
  isAllDay?: boolean;
}

export interface ThemeProps {
  backgroundColor?: string;
  textColor?: string;
  headerBackgroundColor?: string;
  headerTextColor?: string;
  selectedDayColor?: string;
  todayColor?: string;
  taskDefaultColor?: string;
  dayTextColor?: string;
  dayBackgroundColor?: string;
  selectedDayTextColor?: string;
}

export interface DailyViewProps {
  date: Date;
  tasks?: Task[];
  onTaskPress?: (task: Task) => void;
  onDatePress?: (date: Date) => void;
  hourRange?: { start: number; end: number };
  theme?: ThemeProps;
}

export interface WeeklyViewProps {
  date: Date;
  tasks?: Task[];
  onTaskPress?: (task: Task) => void;
  onDatePress?: (date: Date) => void;
  hourRange?: { start: number; end: number };
  theme?: ThemeProps;
}

export interface MonthlyViewProps {
  date: Date;
  tasks?: Task[];
  onTaskPress?: (task: Task) => void;
  onDatePress?: (date: Date) => void;
  theme?: ThemeProps;
}

export interface YearlyViewProps {
  date: Date;
  tasks?: Task[];
  onMonthPress?: (date: Date) => void;
  theme?: ThemeProps;
}

export interface CalendarHeaderProps {
  date: Date;
  onPrevious?: (newDate?: Date) => void;
  onNext?: (newDate?: Date) => void;
  onDatePress?: (date: Date) => void;
  title?: string;
  onTitlePress?: () => void;
  theme?: ThemeProps;
  
  // Sol ve sağ taraftaki özelleştirilebilir içerikler için yeni alanlar
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  
  // Sol ve sağ taraflar için özel işlevler
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

export interface DateSelectorProps {
  date: Date;
  onDateChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  theme?: ThemeProps;
}

export interface CalendarProps {
  date: Date;
  tasks?: Task[];
  onTaskPress?: (task: Task) => void;
  onDatePress?: (date: Date) => void;
  view?: 'daily' | 'weekly' | 'monthly' | 'agenda';
  theme?: ThemeProps;
  
  logoSource?: any;
  notificationIcon?: React.ReactNode;
  renderLogo?: () => React.ReactNode;
  renderNotification?: () => React.ReactNode;
  renderHeader?: () => React.ReactNode;
  hideNotification?: boolean;
  hideLogo?: boolean;
  
  minimalMode?: boolean;
  renderDayContent?: (date: Date, events: Task[]) => React.ReactNode;
  showHeader?: boolean;
  showNavigation?: boolean;
  compact?: boolean;
  
  // Üst bilgi alanları
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

export interface CalendarTabViewProps {
  date: Date;
  tasks?: Task[];
  onTaskPress?: (task: Task) => void;
  onDatePress?: (date: Date) => void;
  theme?: ThemeProps;
} 