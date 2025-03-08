# Expo Calendar

![Logo Görseli](./assets/docs/logo.png)

Expo ile oluşturulmuş, özelleştirilebilir ve kullanımı kolay bir takvim uygulaması.

![Banner Görseli](./assets/docs/banner.png)

## Kurulum

Paketi kurmak için aşağıdaki komutu kullanabilirsiniz:

```bash
npm install @canakyuz/expo-calendar
```

veya

```bash
yarn add @canakyuz/expo-calendar
```

## Kimlik Doğrulama ve Erişim

Bu özel bir pakettir. Yükleme yapabilmek için:

1. GitHub'da oturum açın.
2. Paket sahibinden erişim isteyin.
3. Aşağıdaki ayarları `.npmrc` dosyanıza ekleyin:

```
@canakyuz:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

## Kullanım

Takvim bileşenini projenize aşağıdaki gibi ekleyebilirsiniz:

```jsx
import { Calendar } from '@canakyuz/expo-calendar';

export default function App() {
  const handleDateSelect = (date) => {
    console.log('Seçilen tarih:', date);
  };

  return (
    <Calendar 
      onDateSelect={handleDateSelect}
      highlightedDates={['2023-10-15', '2023-10-20']}
      theme={{
        primaryColor: '#3498db',
        textColor: '#333333',
        selectedDayBackgroundColor: '#2980b9',
      }}
    />
  );
}
```

![Kod Örneği Görseli](./assets/docs/code-example.png)

### Basit Kullanım Örneği

```jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from '@canakyuz/expo-calendar';

export default function BasicCalendarScreen() {
  return (
    <View style={styles.container}>
      <Calendar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});
```

## Ekran Görüntüleri

Uygulamanın farklı modlarını gösteren ekran görüntüleri:

### Ay Görünümü
![Ay Görünümü](./assets/docs/month.png)

```jsx
import React from 'react';
import { View } from 'react-native';
import { Calendar } from '@canakyuz/expo-calendar';

export default function MonthViewExample() {
  return (
    <View style={{ flex: 1 }}>
      <Calendar 
        viewMode="month"
        initialDate="2023-10-01"
      />
    </View>
  );
}
```

### Hafta Görünümü
![Hafta Görünümü](./assets/docs/week-view.png)

```jsx
import React from 'react';
import { View } from 'react-native';
import { Calendar } from '@canakyuz/expo-calendar';

export default function WeekViewExample() {
  return (
    <View style={{ flex: 1 }}>
      <Calendar 
        viewMode="week" 
        initialDate="2023-10-10"
      />
    </View>
  );
}
```

### Gün Görünümü
![Gün Görünümü](./assets/docs/day-view.png)

```jsx
import React from 'react';
import { View } from 'react-native';
import { Calendar } from '@canakyuz/expo-calendar';

export default function DayViewExample() {
  return (
    <View style={{ flex: 1 }}>
      <Calendar 
        viewMode="day" 
        initialDate="2023-10-15"
      />
    </View>
  );
}
```

## Özellikler

### Tarih Seçme
![Tarih Seçme Özelliği](./assets/docs/date-selection.png)
Günleri tıklayarak seçebilirsiniz

```jsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Calendar } from '@canakyuz/expo-calendar';

export default function DateSelectionExample() {
  const [selectedDate, setSelectedDate] = useState(null);
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    console.log('Seçilen tarih:', date);
  };

  return (
    <View style={{ flex: 1 }}>
      <Calendar onDateSelect={handleDateSelect} />
      {selectedDate && (
        <Text style={{ padding: 16, textAlign: 'center' }}>
          Seçilen Tarih: {selectedDate}
        </Text>
      )}
    </View>
  );
}
```

### Özel Temalar
![Özel Temalar Özelliği](./assets/docs/custom-themes.png)
Görünümü projenize uygun olarak kişiselleştirebilirsiniz

```jsx
import React from 'react';
import { View } from 'react-native';
import { Calendar } from '@canakyuz/expo-calendar';

export default function CustomThemeExample() {
  // Koyu tema örneği
  const darkTheme = {
    primaryColor: '#2c3e50',
    textColor: '#ecf0f1',
    selectedDayBackgroundColor: '#e74c3c',
    dayTextColor: '#bdc3c7',
    todayTextColor: '#e74c3c',
    monthTitleColor: '#3498db',
    headerBackgroundColor: '#34495e',
    calendarBackground: '#2c3e50',
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#2c3e50' }}>
      <Calendar theme={darkTheme} />
    </View>
  );
}
```

### Etkinlik İşaretleme
![Etkinlik İşaretleme Özelliği](./assets/docs/event-marking.png)
Özel tarihleri vurgulayabilirsiniz

```jsx
import React from 'react';
import { View } from 'react-native';
import { Calendar } from '@canakyuz/expo-calendar';

export default function EventMarkingExample() {
  // Vurgulanacak tarihler ve özellikleri
  const markedDates = {
    '2023-10-15': { 
      marked: true,
      dotColor: '#e74c3c',
      textColor: '#fff',
      backgroundColor: '#3498db'
    },
    '2023-10-18': { 
      marked: true, 
      dotColor: '#2ecc71',
      textColor: '#fff'
    },
    '2023-10-20': { 
      marked: true, 
      dotColor: '#f39c12',
      textColor: '#000'
    },
  };

  return (
    <View style={{ flex: 1 }}>
      <Calendar 
        highlightedDates={markedDates}
      />
    </View>
  );
}
```

### Çoklu Görünüm
![Çoklu Görünüm Özelliği](./assets/docs/multiple-views.png)
Gün, hafta ve ay görünümleri arasında kolayca geçiş yapabilirsiniz

```jsx
import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Calendar } from '@canakyuz/expo-calendar';

export default function MultipleViewsExample() {
  const [currentView, setCurrentView] = useState('month');

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button 
          title="Gün" 
          onPress={() => setCurrentView('day')} 
          color={currentView === 'day' ? '#3498db' : '#bdc3c7'}
        />
        <Button 
          title="Hafta" 
          onPress={() => setCurrentView('week')} 
          color={currentView === 'week' ? '#3498db' : '#bdc3c7'}
        />
        <Button 
          title="Ay" 
          onPress={() => setCurrentView('month')} 
          color={currentView === 'month' ? '#3498db' : '#bdc3c7'}
        />
      </View>
      
      <Calendar viewMode={currentView} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
```

### Expo ile Tam Uyumlu
![Expo Uyumluluğu](./assets/docs/expo-compatibility.png)
Expo tabanlı projelerde sorunsuz çalışır

```jsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Calendar } from '@canakyuz/expo-calendar';

export default function ExpoCompatibilityExample() {
  return (
    <SafeAreaProvider>
      <Calendar />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
```

## Özelleştirilebilir Parametreler

| Parametre | Tip | Varsayılan | Açıklama |
|-----------|-----|------------|----------|
| onDateSelect | Function | - | Bir tarih seçildiğinde çağrılacak fonksiyon |
| highlightedDates | Array/Object | [] | Vurgulanacak tarihlerin dizisi (YYYY-MM-DD formatında) |
| theme | Object | - | Takvim görünümünü özelleştirmek için tema nesnesi |
| initialDate | String | Today | Takvimin açılış tarihi |
| viewMode | String | 'month' | Görünüm modu ('day', 'week', 'month') |

![Parametreler Görseli](./assets/docs/parameters-example.png)

```jsx
import React from 'react';
import { View } from 'react-native';
import { Calendar } from '@canakyuz/expo-calendar';

export default function ParametersExample() {
  // Tüm parametrelerin kullanım örneği
  return (
    <View style={{ flex: 1 }}>
      <Calendar 
        onDateSelect={(date) => console.log('Seçilen tarih:', date)}
        highlightedDates={{
          '2023-10-15': { marked: true, dotColor: 'red' },
          '2023-10-20': { marked: true, dotColor: 'blue' }
        }}
        theme={{
          primaryColor: '#3498db',
          textColor: '#333333',
          selectedDayBackgroundColor: '#2980b9',
          todayTextColor: '#e74c3c',
          arrowColor: '#2c3e50'
        }}
        initialDate="2023-10-01"
        viewMode="month"
        enableSwipe={true}
        hideExtraDays={false}
        showWeekNumbers={true}
        firstDay={1} // Pazartesi
      />
    </View>
  );
}
```

## Geliştirme

Yerel geliştirme için:

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm start
```

![Geliştirme Ortamı](./assets/docs/development-environment.png)

### Katkı Sağlama

Projeye katkı sağlamak istiyorsanız:

```bash
# Repoyu klonlayın 
git clone https://github.com/kullanıcıadınız/expo-calendar.git

# Proje dizinine gidin
cd expo-calendar

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm start

# Değişikliklerinizi bir branch'te yapın
git checkout -b yeni-ozellik

# Değişikliklerinizi commit edin
git commit -m "Yeni özellik: ..."

# Branch'inizi push edin
git push origin yeni-ozellik
```

## Topluluk & Destek

![Topluluk Görseli](./assets/docs/community.png)

Sorularınız için GitHub Issues veya aşağıdaki iletişim kanallarını kullanabilirsiniz:

- [GitHub Issues](https://github.com/kullanıcıadınız/expo-calendar/issues)
- [Twitter](https://twitter.com/kullanıcıadınız)
- [Discord Kanalımız](https://discord.gg/expo-calendar)

### Topluluk Örneği

Topluluğa soru sormak için:

```jsx
// GitHub issue örneği:
/**
 * Başlık: Takvim bileşeninde özel etkinlik ekleme
 * 
 * Merhaba,
 * 
 * Takvim bileşenine özel etkinlikler eklemek istiyorum.
 * Örneğin, belirli bir tarihe tıklandığında o güne özel etkinlik
 * detaylarını göstermek istiyorum. Bunu nasıl yapabilirim?
 * 
 * Teşekkürler!
 */

// Kod örneği:
import React, { useState } from 'react';
import { View, Modal, Text, Button } from 'react-native';
import { Calendar } from '@canakyuz/expo-calendar';

export default function EventExample() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Örnek etkinlikler
  const events = {
    '2023-10-15': [
      { title: 'Toplantı', time: '10:00' },
      { title: 'Öğle Yemeği', time: '13:00' }
    ],
    '2023-10-20': [
      { title: 'Doktor Randevusu', time: '14:30' }
    ]
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (events[date]) {
      setModalVisible(true);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Calendar 
        onDateSelect={handleDateSelect}
        highlightedDates={Object.keys(events).reduce((obj, date) => {
          obj[date] = { marked: true, dotColor: 'blue' };
          return obj;
        }, {})}
      />
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              {selectedDate} Etkinlikleri
            </Text>
            
            {selectedDate && events[selectedDate]?.map((event, index) => (
              <View key={index} style={{ marginBottom: 5 }}>
                <Text>{event.time} - {event.title}</Text>
              </View>
            ))}
            
            <Button title="Kapat" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
```

## Lisans

Bu proje 0BSD lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakın. 