# 🦓 Zebra Feature Toggle Sistemi

Bu proje, farklı **tenant**'lara ve **ortamlara (environment)** göre feature flag (özellik bayrakları) yönetimi yapılmasını sağlayan bir sistemdir. Kullanıcı bazlı `feature toggle` değerlendirmesi yapar ve çeşitli stratejileri destekler:

- `BOOLEAN` (Açık/Kapalı)
- `PERCENTAGE` (Belirli yüzde aralığında kullanıcıya açık)
- `TARGETING` (Belirli kullanıcı listesine açık)

---

## 🔧 Kullanılan Teknolojiler

- **NestJS** – Backend framework
- **TypeORM** – ORM katmanı
- **PostgreSQL** – Veritabanı
- **@nestjs/jwt** – Kimlik doğrulama
- **@nestjs/cache-manager** – Önbellekleme
- **Swagger** – API dokümantasyonu

---

## 📦 Kurulum

### Gereksinimler

- Node.js (v18+)
- PostgreSQL
- Yarn

## 🚢 Docker ile Başlatma

Uygulamayı Docker ortamında çalıştırmak için:

```bash
cp .env.example .env

docker-compose up --build
```

> Bu işlem ile sistemde 10 tenant, çeşitli feature ve feature flag'ler ile sabit 3 kullanıcı oluşur.

---

## 🚀 Uygulamayı Başlat

```bash
yarn start:dev
```

---

## 🔐 Kimlik Doğrulama (JWT)

Sistemde sabit 3 kullanıcı vardır. Giriş için aşağıdaki endpoint kullanılır:

### Login

```http
POST /api/auth/login
```

**Body:**

```json
{
  "username": "user_zebra_a",
  "password": "password"
}
```

**Response:**

```json
{
  "accessToken": "..."
}
```

Bu token ile diğer endpoint'lere erişilebilir:

```
Authorization: Bearer <accessToken>
```

---

## 🧪 Feature Flag Değerlendirme

```http
POST /api/feature-flags/evaluate
```

**Body:**

```json
{
  "tenant": "zebra",
  "feature": "new-dashboard",
  "environment": "staging",
  "userId": "user_zebra_a"
}
```

**Response:**

```json
true
```

Değerlendirme sonucu `true` ya da `false` döner. Değerlendirme sonuçları performans için önbelleğe alınır (`TTL: 60 saniye`).

---

## 📘 API Dokümantasyonu

Tüm endpoint'leri Swagger arayüzü ile test edebilirsiniz:

📎 [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

## 🧱 Modüller

| Modül           | Açıklama                                               |
|-----------------|--------------------------------------------------------|
| `User`          | Sisteme giriş yapan kullanıcıları yönetir              |
| `Tenant`        | Çoklu kiracı (tenant) yapısını sağlar                  |
| `Feature`       | Toggle'a konu olan özellikleri tanımlar                |
| `FeatureFlag`   | Feature'ların tenant ve ortama göre durumlarını yönetir|
| `Auth`          | JWT tabanlı kimlik doğrulama sağlar                    |
| `Evaluate`      | Feature flag değerlendirme işlemini yapar              |

---

## 📊 Rate Limiting

JWT ile giriş yapan kullanıcılar için kullanıcı bazlı **Rate Limiting** yapılandırması yapılabilir. (İsteğe bağlı olarak Redis ile entegre edilebilir.)

---

## 💾 Önbellekleme (Caching)

Feature değerlendirme sonuçları önbelleğe alınır. `@nestjs/cache-manager` kullanılarak servis içinde TTL süreli cache mantığı uygulanmıştır.  

---

## 👤 Sabit Kullanıcılar

| Kullanıcı Adı  | Şifre     |
|----------------|-----------|
| zebra_admin    | admin123 |
| acme_user      | user123   |
| globex_manager | manager123 |

---

## 🛠 Geliştirme Planları

- [ ] Frontend UI entegrasyonu
- [ ] Kullanıcıların self-service flag yönetimi
- [ ] Redis cache & throttling desteği
- [ ] Rollere göre yetkilendirme
- [ ] Unit / Integration test yapısı

---

## 🧼 Kod Yapısı

- `Repository Pattern` kullanıldı
- DTO, Service, Controller ayrımı yapıldı
- Swagger entegrasyonu hazır
- Modüler yapı ile kolay genişleme sağlandı

---
