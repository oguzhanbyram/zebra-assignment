# 🦓 Zebra Feature Toggle Service

Zebra Feature Toggle Service, tenant bazlı, çevresel (environment) ve strateji destekli feature flag yönetim sistemidir. Sistem, yüksek ölçeklenebilirlik, güvenlik ve gözlemlenebilirlik (observability) ilkeleri gözetilerek NestJS, TypeORM, PostgreSQL ve Redis ile inşa edilmiştir.

## 🚀 Özellikler

- ✅ Tenant ve kullanıcı yönetimi (username + password bazlı auth)
- ✅ JWT tabanlı kimlik doğrulama
- ✅ Feature flag oluşturma, güncelleme, silme
- ✅ Boolean, Percentage, Targeting stratejileri
- ✅ Çevre bazlı flag promote özelliği
- ✅ Evaluate endpoint (flag değerlendirme)
- ✅ Tenant planına göre **burst rate limit (Redis tabanlı)**
- ✅ **Caching ve invalidation** (Redis + TTL)
- ✅ Event bazlı mimari
- ✅ Audit log
- ✅ Prometheus & Grafana ile metrik toplama
- ✅ Docker Compose ile kolay kurulum
- ✅ Swagger/OpenAPI dokümantasyonu

## 🧠 Teknolojiler

| Katman           | Teknoloji             |
|------------------|----------------------|
| Framework        | [NestJS](https://nestjs.com) |
| ORM              | TypeORM + PostgreSQL  |
| Cache            | Redis                 |
| Auth             | JWT (passport-jwt)    |
| Rate Limiting    | Redis + Custom Interceptor |
| Metrics          | prom-client + Prometheus |
| Logging          | nestjs-pino           |
| Monitoring       | Grafana               |
| Containerization | Docker, Docker Compose |
| Testing          | Jest (planlandı)      |

## 🛠️ Kurulum

### 📄 Ortam Değişkenlerini Hazırla
```bash
cp .env.example .env
```

### 🔄 Tüm sistemi ayağa kaldır
```bash
docker-compose up --build
```

### 🔧 Migration ve Seed İşlemlerini Çalıştır
```bash
docker exec -it zebra-api sh -lc 'yarn migration:run && yarn seed:run'
```
Bu komut sonrası migration ve seed işlemleri otomatik olarak çalıştırılır.

## 📖 Swagger Dokümantasyonu

Swagger API dokümantasyonuna aşağıdaki URL üzerinden erişebilirsiniz:

[http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## 🔑 Auth

### Login
```http
POST /auth/login
{
  "username": "admin_user",
  "password": "adminPass123"
}
```

#### Response:
```json
{
  "accessToken": "JWT_TOKEN",
  "user": {
    "id": "...",
    "username": "admin_user",
    "role": "ADMIN",
    "tenantId": "..."
  }
}
```

JWT içerisinde `plan` bilgisi yer alır.

## 🧩 Feature Flag API'leri

### ➕ Create/Update
```http
POST /feature-flags
Authorization: Bearer <token>
```

```json
{
  "tenantId": "...",
  "featureId": "...",
  "environment": "dev",
  "enabled": true,
  "strategy": "PERCENTAGE",
  "value": { "percentage": 50 }
}
```

### 🧪 Evaluate
```http
POST /feature-flags/evaluate
Authorization: Bearer <token>
```

```json
{
  "tenant": "blutv",
  "feature": "recommendation",
  "environment": "prod",
  "userId": "user-123"
}
```

#### Response:
```json
{ "isEnabled": true }
```

> 📌 **Evaluate endpoint’i cache’lenir (1 gün TTL)** ve `X-RateLimit-*` header’ları ile rate limit bilgisi döner.

### ⏫ Promote (Dry Run destekli)
```http
POST /feature-flags/promote
Authorization: Bearer <token>
```

```json
{
  "tenantId": "...",
  "sourceEnv": "dev",
  "targetEnv": "prod",
  "dryRun": true
}
```

#### Response:
```json
{ "created": 3, "updated": 1 }
```

## 🧮 Rate Limit

- **Plan Bazlı** Rate Limiting:

| Plan   | Burst | Sustained |
|--------|-------|-----------|
| FREE   | 20    | 100       |
| BASIC  | 100   | 1000      |
| PRO    | 300   | 3000      |

- Evaluate endpoint'ine özel uygulanır.
- Redis üzerinden kontrol edilir.
- Yanıt header'ları:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`

## ⚡️ Caching

- Evaluate sonucu Redis cache’ine 1 gün süreyle (`86400000ms`) kaydedilir.
- `feature-flag:evaluate:{tenant}:{feature}:{env}` şeklinde tutulur.
- `CREATE / UPDATE / DELETE` durumlarında event emit edilerek otomatik invalidation sağlanır.

## 🧾 Audit Log

- FeatureFlag işlemlerinde:
  - `before` ve `after` verilerinin farkı hesaplanır.
  - `CREATE`, `UPDATE`, `DELETE` aksiyonları loglanır.
- JSON olarak audit_log tablosuna yazılır.

## 📊 Observability

- Kullanılan logger: `nestjs-pino`
- Metrikler: `prom-client` + `/api/metrics`
- Prometheus scrape eder.
- Grafana dashboard hazırlandı.

### Custom Metrics:
```ts
evaluate_feature_flag_total{tenant="...", feature="...", environment="..."} 1
```

## 📈 Prometheus & Grafana

- Prometheus endpoint: [http://localhost:9090](http://localhost:9090)
- Grafana endpoint: [http://localhost:3001](http://localhost:3001)
- Prometheus, `/api/metrics` endpoint'ini scrape eder.

## 🐳 Docker Compose Servisleri

| Servis        | Port      |
|---------------|-----------|
| API           | 3000      |
| PostgreSQL    | 5432      |
| Redis         | 6379      |
| PgAdmin       | 5050      |
| Prometheus    | 9090      |
| Grafana       | 3001      |

> Not: Migration ve seed işlemleri `docker-compose up --build` komutu ile otomatik olarak çalıştırılır.

## 📌 Örnek Kullanıcılar (Seed)

| Username      | Password     | Role   | Tenant Name  |
|---------------|--------------|--------|--------------|
| admin_user    | adminPass123 | ADMIN  | zebra        |
| google_user   | google123    | TENANT | google       |
| netflix_user  | netflix123   | TENANT | netflix      |
| airbnb_user   | airbnb123    | TENANT | airbnb       |

## 🔚 Yol Haritası

- [x] Evaluate caching
- [x] Rate limiting
- [x] Feature promotion
- [x] Strategy pattern
- [x] Redis TTL
- [x] Observability
- [ ] Unit test'ler
- [ ] CLI tool for feature flag bulk import (optional)

## 📊 Grafana Ayarları

1. Grafana’ya giriş yapın: [http://localhost:3001](http://localhost:3001), kullanıcı adı ve şifre olarak `admin`/`admin` kullanın.  
2. İlk girişte sizden şifre değiştirmeniz istenecektir. Yeni şifrenizi belirleyin.  
3. Sol menüden **Configuration** → **Data Sources** bölümüne gidin ve **Add data source** butonuna tıklayın.  
4. Açılan listeden **Prometheus**’u seçin.  
5. URL alanına `http://prometheus:9090` yazın.  
6. Sayfanın altındaki **Save & Test** butonuna tıklayarak bağlantıyı doğrulayın.  
7. Ardından, **Dashboard** eklemek için **Import dashboard** seçeneğini kullanarak hazır dashboardları yükleyin ve Prometheus metriklerini görselleştirin.
8. Dashboardlarınızı özelleştirebilir ve metriklerinizi takip edebilirsiniz.
