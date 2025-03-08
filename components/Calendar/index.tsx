// Temel takvim bileşenlerini dışa aktaran index dosyası
import Calendar from './Calendar';
import NavbarCalendarViewFixed from './NavbarCalendarViewFixed';
import CalendarHeader from './CalendarHeader';
import DailyView from './DailyView';
import WeeklyView from './WeeklyView';
import MonthlyView from './MonthlyView';
import * as Types from './types';

// Hata veren bileşenleri kullanmaktan kaçınalım
export {
  Calendar,
  NavbarCalendarViewFixed as NavbarCalendarView, // Güvenli versiyon kullan
  CalendarHeader,
  DailyView,
  WeeklyView,
  MonthlyView,
  Types
};

export default Calendar; 