# Expo Calendar NPM Paketi

## İçindekiler

- [Kurulum](#kurulum)
- [Paket Yapısı](#paket-yapısı)
- [Kullanım](#kullanım)
  - [Temel Kullanım](#temel-kullanım)
  - [İleri Düzey Kullanım](#i̇leri-düzey-kullanım)
- [Özelleştirme](#özelleştirme)
- [Bileşenler ve API](#bileşenler-ve-api)
  - [Calendar](#calendar)
  - [DateSelector](#dateselector)
  - [DailyView](#dailyview)
  - [WeeklyView](#weeklyview)
  - [MonthlyView](#monthlyview)
  - [CalendarHeader](#calendarheader)
  - [CalendarTabView](#calendartabview)
- [Tema Özelleştirme](#tema-özelleştirme)
- [Örnek Uygulamalar](#örnek-uygulamalar)
- [Sürüm Notları](#sürüm-notları)

## Kurulum

```bash
# NPM ile kurulum
npm install expo-calendar-component

# veya Yarn ile kurulum
yarn add expo-calendar-component
```

### Bağımlılıklar

Bu paket, aşağıdaki peer bağımlılıkları gerektirir:

```json
{
  "peerDependencies": {
    "react": ">=16.8.0",
    "react-native": ">=0.60.0",
    "expo": ">=44.0.0",
    "@expo/vector-icons": "^13.0.0"
  }
}
```

## Paket Yapısı

```
expo-calendar-component/
├── lib/                         # Derlenen JavaScript dosyaları
├── src/                         # Kaynak kodları
│   ├── core/                    # Çekirdek modüller
│   │   ├── CalendarContext.tsx  # Takvim Context API'si
│   │   ├── useCalendarState.tsx # Takvim durum yönetimi hook'u
│   │   ├── useNavigationState.tsx # Navigasyon hook'u
│   │   └── types.ts             # Ortak tip tanımları
│   ├── ui/                      # UI bileşenleri
│   │   ├── CalendarCell.tsx     # Hücre bileşeni
│   │   ├── TaskItem.tsx         # Görev öğesi bileşeni
│   │   ├── TimeLabel.tsx        # Zaman etiketi bileşeni
│   │   ├── NavigationButton.tsx # Gezinme düğmeleri
│   │   └── CurrentTimeLine.tsx  # Anlık zaman çizgisi
│   ├── views/                   # Görünüm bileşenleri
│   │   ├── DailyView.tsx        # Günlük görünüm
│   │   ├── WeeklyView.tsx       # Haftalık görünüm
│   │   ├── MonthlyView.tsx      # Aylık görünüm
│   │   └── YearlyView.tsx       # Yıllık görünüm
│   ├── Calendar.tsx             # Ana takvim bileşeni
│   ├── CalendarHeader.tsx       # Takvim başlığı
│   ├── CalendarTabView.tsx      # Sekme görünümü
│   ├── DateSelector.tsx         # Tarih seçici
│   └── index.ts                 # Dışa aktarım noktası
├── examples/                    # Örnek uygulamalar
├── package.json                 # Paket bilgileri
├── tsconfig.json                # TypeScript yapılandırması
├── README.md                    # Proje açıklaması
└── LICENSE                      # Lisans bilgisi
```

## Kullanım

### Temel Kullanım

```jsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { Calendar } from 'expo-calendar-component';

export default function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Ekip Toplantısı',
      startTime: new Date(2023, 4, 10, 10, 0),
      endTime: new Date(2023, 4, 10, 11, 30),
      color: '#4285F4',
    },
  ]);

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        date={selectedDate}
        tasks={tasks}
        onDatePress={setSelectedDate}
        onTaskPress={(task) => console.log('Seçilen görev:', task)}
      />
    </View>
  );
}
```

### İleri Düzey Kullanım

```jsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { 
  CalendarProvider, 
  Calendar, 
  DateSelector,
  useCalendar 
} from 'expo-calendar-component';

// Özel bir görev bileşeni
const TaskDetail = () => {
  const { tasks, date } = useCalendar();
  
  return (
    <View>
      {/* Görev detaylarını göster */}
    </View>
  );
};

export default function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Ekip Toplantısı',
      startTime: new Date(2023, 4, 10, 10, 0),
      endTime: new Date(2023, 4, 10, 11, 30),
      color: '#4285F4',
    },
  ]);

  const tema = {
    backgroundColor: '#fff',
    selectedDayColor: '#4285F4',
    selectedDayTextColor: '#fff',
    taskDefaultColor: '#f78536'
  };

  return (
    <CalendarProvider 
      initialDate={selectedDate}
      tasks={tasks}
      theme={tema}
    >
      <View style={{ flex: 1 }}>
        <DateSelector 
          date={selectedDate}
          onDateChange={setSelectedDate}
        />
        <Calendar
          view="weekly"
          showHeader={true}
          onTaskPress={(task) => console.log('Seçilen görev:', task)}
        />
        <TaskDetail />
      </View>
    </CalendarProvider>
  );
}
```

## Özelleştirme

`expo-calendar-component` kapsamlı özelleştirme seçenekleri sunar:

1. **Tema Sistemi**: Tüm bileşenlerin renk ve stillerini değiştirin
2. **Özel Render Fonksiyonları**: Görevleri ve günleri kendi tarzınızda gösterin
3. **Görünüm Modları**: Günlük, haftalık, aylık ve minimal modlar arasında geçiş yapın
4. **Dil Desteği**: Gün ve ay isimlerini istediğiniz dile çevirin

## Bileşenler ve API

### Calendar

Ana takvim bileşeni, tüm takvim görünümlerini tek bir arayüzde birleştirir.

| Prop Adı | Tipi | Varsayılan | Açıklama |
|----------|------|------------|----------|
| date | Date | Gerekli | Başlangıç tarihi |
| tasks | Task[] | [] | Gösterilecek görevler |
| onTaskPress | (task: Task) => void | undefined | Göreve tıklandığında çağrılan fonksiyon |
| onDatePress | (date: Date) => void | undefined | Tarihe tıklandığında çağrılan fonksiyon |
| view | 'daily' \| 'weekly' \| 'monthly' \| 'agenda' | 'weekly' | Başlangıç görünüm türü |
| theme | ThemeProps | {} | Renk ve stil özelleştirmeleri |
| minimalMode | boolean | false | Minimal mod (daha kompakt görünüm) |
| renderDayContent | (date: Date, events: Task[]) => React.ReactNode | undefined | Özel gün içeriği render fonksiyonu |
| showHeader | boolean | true | Başlığı göster |
| showNavigation | boolean | true | Gezinme kontrollerini göster |
| compact | boolean | false | Kompakt görünüm |
| leftContent | React.ReactNode | undefined | Sol taraftaki özel içerik |
| rightContent | React.ReactNode | undefined | Sağ taraftaki özel içerik |
| onLeftPress | () => void | undefined | Sol içeriğe tıklandığında çağrılan fonksiyon |
| onRightPress | () => void | undefined | Sağ içeriğe tıklandığında çağrılan fonksiyon |
| renderCustomView | (view: string) => React.ReactNode | undefined | Özel görünüm render fonksiyonu |
| swipeEnabled | boolean | true | Kaydırma ile görünüm değiştirme |
| hourRange | { start: number; end: number } | undefined | Tüm görünümler için ortak saat aralığı |

### DateSelector

Kullanıcıların tarih seçmesini sağlayan bir modal bileşeni.

| Prop Adı | Tipi | Varsayılan | Açıklama |
|----------|------|------------|----------|
| date | Date | Gerekli | Seçilen tarih |
| onDateChange | (date: Date) => void | Gerekli | Tarih değiştiğinde çağrılan fonksiyon |
| minimumDate | Date | undefined | Seçilebilecek minimum tarih |
| maximumDate | Date | undefined | Seçilebilecek maksimum tarih |
| theme | ThemeProps | {} | Renk ve stil özelleştirmeleri |
| format | string | 'DD MM YYYY' | Tarih formatı |
| renderCustomHeader | () => React.ReactNode | undefined | Özel başlık render fonksiyonu |
| weekdayLabels | string[] | ['Pt', 'Sa', 'Çr', 'Pr', 'Cu', 'Ct', 'Pz'] | Özel hafta günü etiketleri |
| monthLabels | string[] | ['Ocak', ...] | Özel ay etiketleri |
| startFrom | 'monday' \| 'sunday' | 'monday' | Haftanın başlangıç günü |

### DailyView

Günlük görünüm bileşeni, belirli bir günün saat bazında takvim görünümünü sağlar.

| Prop Adı | Tipi | Varsayılan | Açıklama |
|----------|------|------------|----------|
| date | Date | Gerekli | Gösterilecek tarih |
| tasks | Task[] | [] | Gösterilecek görevler |
| onTaskPress | (task: Task) => void | undefined | Göreve tıklandığında çağrılan fonksiyon |
| onDatePress | (date: Date) => void | undefined | Tarihe tıklandığında çağrılan fonksiyon |
| hourRange | { start: number; end: number } | { start: 0, end: 23 } | Gösterilecek saat aralığı |
| theme | ThemeProps | {} | Renk ve stil özelleştirmeleri |
| hourHeight | number | 60 | Saat bloğunun piksel yüksekliği |
| showCurrentTime | boolean | true | Şu anki zamanı gösteren çizgi |
| renderTask | (task: Task) => React.ReactNode | undefined | Özel görev render fonksiyonu |
| renderHour | (hour: number) => React.ReactNode | undefined | Özel saat render fonksiyonu |
| autoScroll | boolean | true | İş saatlerine otomatik kaydırma |

### WeeklyView

Haftalık görünüm bileşeni, bir haftayı yatay sütunlar halinde gösterir.

| Prop Adı | Tipi | Varsayılan | Açıklama |
|----------|------|------------|----------|
| date | Date | Gerekli | Gösterilecek hafta için referans tarih |
| tasks | Task[] | [] | Gösterilecek görevler |
| onTaskPress | (task: Task) => void | undefined | Göreve tıklandığında çağrılan fonksiyon |
| onDatePress | (date: Date) => void | undefined | Tarihe tıklandığında çağrılan fonksiyon |
| hourRange | { start: number; end: number } | { start: 7, end: 19 } | Gösterilecek saat aralığı |
| theme | ThemeProps | {} | Renk ve stil özelleştirmeleri |
| dayLabelFormat | string | 'ddd' | Gün etiketi formatı |
| showWeekends | boolean | true | Hafta sonlarını göster |
| startFrom | 'monday' \| 'sunday' | 'monday' | Haftanın başlangıç günü |
| headerHeight | number | 50 | Başlık yüksekliği |
| showAllDayEvents | boolean | true | Tüm gün etkinliklerini göster |
| timeFormat | '12h' \| '24h' | '24h' | Zaman formatı |

### MonthlyView

Aylık görünüm bileşeni, klasik bir aylık takvim görünümü sunar.

| Prop Adı | Tipi | Varsayılan | Açıklama |
|----------|------|------------|----------|
| date | Date | Gerekli | Gösterilecek ay için referans tarih |
| tasks | Task[] | [] | Gösterilecek görevler |
| onTaskPress | (task: Task) => void | undefined | Göreve tıklandığında çağrılan fonksiyon |
| onDatePress | (date: Date) => void | undefined | Tarihe tıklandığında çağrılan fonksiyon |
| theme | ThemeProps | {} | Renk ve stil özelleştirmeleri |
| showWeekNumbers | boolean | false | Hafta numaralarını göster |
| maxEventsPerDay | number | 3 | Gün başına gösterilecek maks etkinlik sayısı |
| weekdayLabels | string[] | ['Pzt', 'Sal', ...] | Özel hafta günü etiketleri |
| highlightToday | boolean | true | Bugünü vurgula |
| showAdjacentMonths | boolean | true | Komşu aylardan günleri göster |
| startFrom | 'monday' \| 'sunday' | 'monday' | Haftanın başlangıç günü |
| cellHeight | number | 100 | Gün hücresinin piksel yüksekliği |

### CalendarHeader

Takvim başlık bileşeni, takvim görünümlerinin üstünde yer alır.

| Prop Adı | Tipi | Varsayılan | Açıklama |
|----------|------|------------|----------|
| date | Date | Gerekli | Gösterilecek tarih |
| onPrevious | (newDate?: Date) => void | undefined | Önceki döneme geçiş fonksiyonu |
| onNext | (newDate?: Date) => void | undefined | Sonraki döneme geçiş fonksiyonu |
| onDatePress | (date: Date) => void | undefined | Tarihe tıklandığında çağrılan fonksiyon |
| title | string | undefined | Özel başlık metni |
| onTitlePress | () => void | undefined | Başlığa tıklandığında çağrılan fonksiyon |
| theme | ThemeProps | {} | Renk ve stil özelleştirmeleri |
| leftContent | React.ReactNode | undefined | Sol taraftaki özel içerik |
| rightContent | React.ReactNode | undefined | Sağ taraftaki özel içerik |
| onLeftPress | () => void | undefined | Sol içeriğe tıklandığında çağrılan fonksiyon |
| onRightPress | () => void | undefined | Sağ içeriğe tıklandığında çağrılan fonksiyon |
| formatTitle | (date: Date) => string | undefined | Başlık formatı fonksiyonu |
| showWeekDays | boolean | true | Hafta günlerini göster |
| weekViewEnabled | boolean | true | Haftalık görünüm değiştirme düğmesini göster |

### CalendarTabView

Takvim sekme bileşeni, farklı takvim görünümleri arasında geçiş yapmanızı sağlar.

| Prop Adı | Tipi | Varsayılan | Açıklama |
|----------|------|------------|----------|
| date | Date | Gerekli | Gösterilecek tarih |
| tasks | Task[] | [] | Gösterilecek görevler |
| onTaskPress | (task: Task) => void | undefined | Göreve tıklandığında çağrılan fonksiyon |
| onDatePress | (date: Date) => void | undefined | Tarihe tıklandığında çağrılan fonksiyon |
| theme | ThemeProps | {} | Renk ve stil özelleştirmeleri |
| initialTab | 'daily' \| 'weekly' \| 'monthly' | 'weekly' | Başlangıç sekmesi |
| tabLabels | { daily?: string; weekly?: string; monthly?: string } | { daily: 'Günlük', weekly: 'Haftalık', monthly: 'Aylık' } | Sekme etiketleri |
| showAnimations | boolean | true | Sekme değişim animasyonlarını göster |
| onChange | (tab: string) => void | undefined | Sekme değiştiğinde çağrılan fonksiyon |
| disabledTabs | string[] | [] | Devre dışı bırakılacak sekmeler |
| verticalTabs | boolean | false | Sekmeleri dikey göster |
| headerPosition | 'top' \| 'bottom' | 'top' | Sekme başlığı pozisyonu |

## Tema Özelleştirme

Paket, bileşenlerin görsel özelliklerini değiştirmenizi sağlayan kapsamlı bir tema API'si sunar:

```jsx
const tema = {
  // Genel renkler
  backgroundColor: '#ffffff',
  textColor: '#333333',
  
  // Başlık alanı
  headerBackgroundColor: '#f8f9fa',
  headerTextColor: '#4285F4',
  
  // Gün hücreleri
  dayBackgroundColor: '#ffffff',
  dayTextColor: '#333333',
  selectedDayColor: '#4285F4',
  selectedDayTextColor: '#ffffff',
  todayColor: '#e8f0fe',
  
  // Görevler
  taskDefaultColor: '#f78536',
};

// CalendarProvider ile tüm bileşenlere temayı uygulama
<CalendarProvider theme={tema}>
  {/* ... */}
</CalendarProvider>

// veya tek bir bileşene tema uygulama
<Calendar theme={tema} />
```

## Örnek Uygulamalar

Paket, farklı kullanım senaryolarını gösteren örnek uygulamalar içerir:

- **BasicCalendar**: Temel takvim kullanımı
- **CustomTheme**: Özel tema uygulaması
- **TaskManager**: Tam kapsamlı görev yönetimi uygulaması
- **MinimalCalendar**: Minimal modda takvim kullanımı

Örnekleri çalıştırmak için:

```bash
# Örnek uygulamaları klonla
git clone https://github.com/username/expo-calendar-component.git

# Örnek dizinine git
cd expo-calendar-component/examples/TaskManager

# Bağımlılıkları yükle
npm install

# Uygulamayı başlat
npx expo start
```

## Sürüm Notları

### v1.0.0
- İlk kararlı sürüm
- Günlük, haftalık ve aylık görünümler
- Tema sistemi 
- Context API

### v0.9.0 (Beta)
- Ön sürüm
- Temel işlevsellik test aşamasında 