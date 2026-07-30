# Erbey Mühendislik — Web Sitesi

Statik bir web sitesi. Hiçbir sunucu, veritabanı veya kurulum gerektirmez —
dosyaları hosting'e yükleyip yayına almanız yeterli.

## Dosya yapısı

```
erbeymuhendislik/
├── index.html              Ana sayfa
├── hakkimizda.html         Hakkımızda + kalite politikası
├── hizmetler.html          9 hizmet detayı
├── projeler.html           Filtrelenebilir proje galerisi
├── iletisim.html           Form + harita + iletişim bilgileri
├── robots.txt / sitemap.xml  Arama motorları için
└── assets/
    ├── css/style.css       Tüm stiller
    ├── js/main.js          Slider, filtre, lightbox, animasyonlar
    ├── js/projects.js      ★ PROJE LİSTESİ — yeni proje buraya eklenir
    ├── projects.json       Aynı verinin JSON kopyası (yedek/referans)
    └── img/projeler/       Proje görselleri
```

---

## ★ Yeni proje nasıl eklenir?

### 1. Görseli hazırlayın

Görseli `assets/img/projeler/` klasörüne koyun. Dosya adı **küçük harf, Türkçe
karaktersiz ve boşluksuz** olmalı (tire kullanın):

```
ornek-proje-adi.jpg
```

Site üç boyut kullanır. En iyi sonuç için üçünü de üretin:

| Dosya | Genişlik | Nerede kullanılır |
|---|---|---|
| `ornek-proje-adi.jpg` | ~1600px | Lightbox (büyük görünüm) |
| `ornek-proje-adi-800.jpg` | 800px | Kart görselleri |
| `ornek-proje-adi-400.jpg` | 400px | Yedek / küçük ekran |

> Sadece tek boyut koyarsanız da çalışır — o zaman aynı dosyayı üç isimle
> kopyalamanız yeterli. `.webp` sürümleri isteğe bağlıdır (varsa otomatik kullanılır).

### 2. `assets/js/projects.js` dosyasına satır ekleyin

Dosyayı bir metin editörüyle açın. Listedeki herhangi bir kaydı kopyalayıp
en sona (son `}` ile `]` arasına) yapıştırın ve bilgileri değiştirin:

```js
  {
    "slug": "ornek-proje-adi",
    "title": "Örnek Proje Adı",
    "cat": "konut",
    "catName": "Konut & Rezidans",
    "tur": "Komple Mekanik Tesisat",
    "yil": "2025",
    "buyukluk": "240 Daire",
    "sehir": "Konya",
    "w": 1600,
    "h": 1000,
    "ratio": 1.6
  }
```

**Alanların anlamı**

| Alan | Açıklama |
|---|---|
| `slug` | Görsel dosya adıyla **birebir aynı** olmalı (uzantısız) |
| `title` | Kartta ve lightbox'ta görünen proje adı |
| `cat` | Filtre anahtarı — aşağıdaki tablodan biri |
| `catName` | Kartta görünen kategori yazısı |
| `tur` | Yaptığınız iş (ör. "Isıtma ve Doğalgaz Tesisatı") |
| `yil` | Yıl. Bilinmiyorsa boş bırakın: `""` |
| `buyukluk` | Kapsam (ör. "180 Daire", "10.000 m²", "240 Yataklı") |
| `sehir` | Konum |
| `w`, `h`, `ratio` | Görselin en/boy bilgisi. Yaklaşık değer yeterli. |

**Kategori değerleri** (`cat` → `catName`)

| `cat` | `catName` |
|---|---|
| `konut` | Konut & Rezidans |
| `endustriyel` | Endüstriyel Tesisler |
| `ticari` | Ticari & AVM |
| `otel` | Otel & Turizm |
| `kamu` | Kamu & Sosyal Tesis |

Kayıtlar arasına **virgül** koymayı unutmayın. Son kayıttan sonra virgül olmaz.

### 3. Kaydedin ve sayfayı yenileyin

Projeler sayfasındaki filtre sayıları ve galeri otomatik güncellenir.
Başka hiçbir dosyaya dokunmanıza gerek yok.

---

## Ana sayfadaki "Öne Çıkan Projeler" şeridini değiştirme

`assets/js/main.js` içinde `picks` listesi var. Buradaki `slug` değerlerini
istediğiniz projelerle değiştirin veya yenilerini ekleyin:

```js
const picks = ['empire-avcilar-istanbul', 'cherry-garden-hotel-konya', ...];
```

## Ana sayfadaki hero (büyük açılış) görsellerini değiştirme

`index.html` içinde `<div class="hero__slide">` blokları var. Her biri bir görsel.
Görsel yolunu, `data-name` (proje adı) ve `data-meta` (alt bilgi) değerlerini
değiştirebilir, blok ekleyip çıkarabilirsiniz.

> Slide sayısını değiştirirseniz alt kısımdaki `<button class="hero__dot">`
> sayısını da eşitleyin.

---

## Yayına alma

Tüm klasörü hosting'in `public_html` (veya `www`) dizinine yükleyin.
Alan adını bağladıktan sonra site çalışır durumda olur.

**Yayına almadan önce kontrol edin:**

- [ ] `robots.txt` ve `sitemap.xml` içindeki alan adı doğru mu?
- [ ] HTML dosyalarındaki `<link rel="canonical">` ve `og:` etiketleri doğru mu?
- [ ] İletişim bilgileri (telefon, e-posta, adres) güncel mi?
- [ ] `iletisim.html` içindeki harita adresi doğru konumu gösteriyor mu?

## İletişim formu hakkında

Form, ziyaretçinin **kendi e-posta uygulamasını** açar (`mailto:`) — sunucu
gerektirmediği için her hosting'de çalışır. Formun doğrudan size e-posta
göndermesini isterseniz Formspree, Web3Forms gibi ücretsiz bir servise
bağlanabilir; bu durumda `assets/js/main.js` içindeki form bölümünün
değiştirilmesi gerekir.

Alıcı adresi `iletisim.html` içinde şurada tanımlı:

```html
<form class="form" data-form="bilgi@erbeymuhendislik.com">
```

## Renkleri değiştirme

`assets/css/style.css` dosyasının en üstündeki `:root` bloğunda tüm renkler
tanımlı. Örneğin altın tonunu değiştirmek için `--gold`, `--gold-soft`,
`--gold-lite` ve `--grad-gold` değerlerini düzenlemeniz yeterli.
