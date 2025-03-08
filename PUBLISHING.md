# NPM Paket Yayınlama Talimatları

Bu döküman, `@canakyuz/expo-calendar` paketinin GitHub Packages'a nasıl yayınlanacağını açıklar.

## Ön Koşullar

1. GitHub hesabınızın olması gerekir
2. GitHub'dan bir kişisel erişim tokenı oluşturulmuş olmalıdır
3. GitHub Packages'a erişim izniniz olmalıdır

## GitHub Token Oluşturma

1. GitHub'a giriş yapın
2. Sağ üst köşedeki profil resminize tıklayın ve "Settings"i seçin
3. Sol taraftaki menüden "Developer settings"i seçin
4. "Personal access tokens" seçeneğini tıklayın
5. "Generate new token" butonuna tıklayın
6. Tokena bir isim verin (örn. "NPM Publishing")
7. İzinlerden aşağıdakileri seçin:
   - `repo` (tüm alt izinler)
   - `read:packages`
   - `write:packages`
   - `delete:packages`
8. "Generate token" butonuna tıklayın
9. Oluşturulan tokeni güvenli bir yere kaydedin (bu token bir daha gösterilmeyecektir)

## Kimlik Doğrulama Yapılandırması

1. Proje dizininde `.npmrc` dosyasını düzenleyin veya oluşturun:

```
@canakyuz:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

2. `YOUR_GITHUB_TOKEN` kısmını, az önce oluşturduğunuz tokenle değiştirin.

Alternatif olarak, npm login ile de kimlik doğrulama yapabilirsiniz:

```bash
npm login --registry=https://npm.pkg.github.com --scope=@canakyuz
```

Username: GitHub kullanıcı adınız
Password: GitHub tokeniniz
Email: GitHub e-posta adresiniz

## Paket Hazırlığı

1. `package.json` dosyasındaki versiyonu güncelleyin (her yayında artırın):

```bash
npm version patch  # Küçük güncellemeler için
npm version minor  # Yeni özellikler için 
npm version major  # Büyük değişiklikler için
```

2. Paketin içeriğini kontrol edin:

```bash
npm pack
```

Bu komut, paketinizin içeriğini içeren bir tarball oluşturur. Tarball'ı açarak hangi dosyaların dahil edildiğini kontrol edebilirsiniz.

## Paketi Yayınlama

```bash
npm publish
```

## Hata Durumunda

Eğer yayınlama sırasında hata alırsanız:

1. GitHub tokeninizin doğru izinlere sahip olduğundan emin olun
2. `.npmrc` dosyasındaki bilgilerin doğru olduğunu kontrol edin
3. Paket ismi çakışmasını önlemek için GitHub kullanıcı/organizasyon adınızla eşleşen bir scope (@username) kullandığınızdan emin olun
4. Paket versiyonunun benzersiz olduğundan emin olun (aynı versiyonu tekrar yayınlayamazsınız)

## Yayınlanan Paketi Kullanma

Paketinizi kullanmak için, kullanıcı projesinde `.npmrc` dosyası oluşturulmalı:

```
@canakyuz:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=USER_TOKEN
```

Ardından paketi normal şekilde yükleyebilirler:

```bash
npm install @canakyuz/expo-calendar
``` 