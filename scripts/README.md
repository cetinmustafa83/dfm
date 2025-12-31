# Deployment Scripts

Bu klasör, deployment ve cache yönetimi için kullanılan script'leri içerir.

## 📜 Mevcut Script'ler

### 1. `clear-all-caches.sh`
**Amaç**: Tüm cache'leri agresif bir şekilde temizler.

**Kullanım**:
```bash
bash scripts/clear-all-caches.sh
# veya
pnpm clean
```

**Temizlenen Cache'ler**:
- ✅ Next.js build cache (`.next`, `out`)
- ✅ Node modules (`node_modules`)
- ✅ pnpm store cache
- ✅ npm cache
- ✅ TypeScript build info
- ✅ ESLint cache
- ✅ Prisma generated files
- ✅ Turbo cache (eğer varsa)
- ✅ Temporary files
- ✅ Log files
- ✅ Build artifacts

**Ne Zaman Kullanılır**:
- Build sorunları yaşandığında
- Dependency güncellemelerinden sonra
- Cache'den kaynaklanan hatalar olduğunda
- Temiz bir başlangıç yapmak istediğinizde

---

### 2. `dokploy-deploy.sh`
**Amaç**: Dokploy deployment'ı için kapsamlı bir build script'i.

**Kullanım**:
```bash
bash scripts/dokploy-deploy.sh
```

**Dokploy'da Kullanım**:
Dokploy dashboard'da Build Command olarak ayarlayın:
```bash
bash scripts/dokploy-deploy.sh
```

**Script Adımları**:
1. 🧹 Tüm cache'leri temizler
2. ✅ Temiz durumu doğrular
3. 📦 Dependencies'leri yükler (`pnpm install --frozen-lockfile`)
4. 🔧 Prisma Client'ı generate eder
5. 🏗️ Uygulamayı build eder
6. ✅ Build output'unu doğrular

**Avantajları**:
- Cache sorunlarını önler
- Her deployment'ta temiz bir başlangıç sağlar
- Build başarısını doğrular
- Detaylı log çıktısı verir

---

## 🚀 Kullanım Senaryoları

### Senaryo 1: Local Development'ta Cache Temizleme
```bash
# Sadece cache'leri temizle
pnpm clean

# Cache'leri temizle ve yeniden build et
pnpm build:clean
```

### Senaryo 2: Dokploy Deployment
Dokploy dashboard'da:
1. Application → Settings → Build Settings
2. Build Command: `bash scripts/dokploy-deploy.sh`
3. Save ve Deploy

### Senaryo 3: Cache Sorunları
Eğer build sorunları yaşıyorsanız:
```bash
# 1. Tüm cache'leri temizle
bash scripts/clear-all-caches.sh

# 2. Dependencies'leri yeniden yükle
pnpm install

# 3. Build et
pnpm build
```

---

## 🔧 Script Özellikleri

### Güvenlik
- ✅ `set -e`: Herhangi bir hata durumunda script durur
- ✅ Güvenli dosya silme (`2>/dev/null || true`)
- ✅ Durum kontrolleri

### Kullanıcı Dostu
- 🎨 Renkli çıktı (başarı, uyarı, hata)
- 📊 Detaylı progress gösterimi
- ✅ Her adımın doğrulanması

### Platform Uyumluluğu
- ✅ Linux
- ✅ macOS
- ✅ Windows (Git Bash ile)

---

## 📝 Package.json Script'leri

Bu script'ler `package.json` içinde tanımlanmıştır:

```json
{
  "scripts": {
    "clean": "bash scripts/clear-all-caches.sh",
    "build:clean": "bash scripts/clear-all-caches.sh && pnpm install && pnpm build"
  }
}
```

---

## 🐛 Troubleshooting

### Script çalışmıyor
**Çözüm**: Script'in executable olduğundan emin olun:
```bash
chmod +x scripts/clear-all-caches.sh
chmod +x scripts/dokploy-deploy.sh
```

### Permission denied hatası
**Çözüm**: Script'i bash ile çalıştırın:
```bash
bash scripts/clear-all-caches.sh
```

### Windows'ta çalışmıyor
**Çözüm**: Git Bash veya WSL kullanın:
```bash
# Git Bash
bash scripts/clear-all-caches.sh

# WSL
wsl bash scripts/clear-all-caches.sh
```

---

## 📚 Daha Fazla Bilgi

- [Dokploy Deployment Guide](../DOKPLOY_DEPLOYMENT.md)
- [Dokploy Cache Issue Guide](../DOKPLOY_CACHE_ISSUE.md)

---

## 🤝 Katkıda Bulunma

Yeni script'ler eklemek veya mevcut script'leri geliştirmek için:
1. Script'i `scripts/` klasörüne ekleyin
2. Executable yapın: `chmod +x scripts/your-script.sh`
3. Bu README'yi güncelleyin
4. `package.json`'a script ekleyin (gerekirse)