# BioStream AI - Project Progress

Bu dosya, projenin başından itibaren yapılan tüm değişiklikleri, güncel durumu ve bir sonraki adımları kaydetmek amacıyla oluşturulmuştur. Yeni bir oturum açıldığında ajanın (Antigravity) projeyi hızla kavraması için bir "Hafıza" görevi görür.

## 🟢 Tamamlanan Aşamalar

### 1. Mimari ve Temel Kurulum (Infrastructure)
* `frontend`, `backend`, `iot_simulator`, `ml_models` klasör yapısı oluşturuldu.
* **Docker Compose:** TimescaleDB (PostgreSQL) ve Eclipse Mosquitto (MQTT Broker) servislerini içeren `docker-compose.yml` dosyası yazıldı.
* **Git Monorepo:** Hatalı iç içe geçmiş Git depoları temizlendi, projenin kök dizininde tek bir `.git` deposu başlatıldı ve `.gitignore` dosyası eklendi.
* 4 farklı rol için Subagent'lar sisteme tanımlandı (`frontend_dev`, `backend_dev`, `iot_engineer`, `data_scientist`).

### 2. Frontend (Next.js & UI)
* Next.js App Router, TypeScript ve Tailwind CSS ile proje başlatıldı.
* `shadcn/ui` bileşenleri (Card, Button, Input vb.) ve `framer-motion` animasyon kütüphanesi kuruldu.
* **Responsive Layout:** Bilgisayarda solda `Sidebar`, mobilde ekranın altında sabit kalan `Bottom Navigation` yapısı kuruldu.
* **Tema Motoru:** `next-themes` entegre edilerek Dark/Light mode geçiş butonu eklendi.
* **Sayfalar:** Dashboard, FASTA Analysis ve Settings sayfalarının iskeletleri ve UI tasarımları yapıldı.
* **Canlı Veri Bağlantısı:** `DashboardGrid.tsx` bileşeni React `useState` ve `useEffect` hook'ları ile Backend'deki WebSocket adresine bağlanıp, gelen verileri animasyonlu kartlara canlı olarak aktaracak şekilde kodlandı.

### 3. IoT Simülatörü (Python)
* Gerçek sensör donanımı olmadığı için rastgele (mock) değerler üreten `simulator.py` yazıldı.
* Üretilen veriler (Sıcaklık, Nem, CO2, Titreşim, Derin Dondurucu Isısı, Enerji Tüketimi) JSON formatında her 5 saniyede bir `biolab/sensors` MQTT kanalına basılıyor.

### 4. Backend (FastAPI)
* **Veritabanı (TimescaleDB):** `asyncpg` ve `SQLAlchemy` kurularak asenkron veritabanı bağlantısı (`database.py`) ve `SensorData` tablosu (`models.py`) oluşturuldu. Sunucu başlarken tablonun otomatik yaratılması sağlandı.
* **MQTT Client:** `paho-mqtt` kütüphanesi ile arka planda (thread-safe şekilde) çalışan bir dinleyici (`mqtt_client.py`) yazıldı.
* **Veri Akış Köprüsü:** Simülatörden gelen verilerin önce TimescaleDB'ye kaydedilip (Log), ardından `websocket_manager.py` aracılığıyla anında Next.js Frontend'ine (WebSockets) fırlatılmasını sağlayan tam senkronize boru hattı kuruldu.

---

## 🟡 Sıradaki Adımlar (Next Steps)

1. **Biyoinformatik API'sinin Yazılması (Backend):**
   * FastAPI üzerinde `/api/analyze-fasta` adında bir POST endpoint'i oluşturulacak.
   * Yüklenen FASTA dosyası **Biopython** ile okunarak dizi özellikleri (Sequence Length, GC Content, K-mer Distribution vb.) çıkarılacak.
2. **Makine Öğrenmesi (ML Models):**
   * Çıkarılan bu genetik özellikler basit bir Scikit-Learn (veya kural tabanlı bir mock model) sınıflandırıcısına sokulup anlamlı bir sonuç (Prediction/Classification) üretilecek.
3. **Frontend FASTA Entegrasyonu:**
   * `fasta/page.tsx` sayfasındaki dosya yükleme (Drag-Drop) butonu aktifleştirilip backend'e dosya gönderecek şekilde bağlanacak.
   * Backend'den dönen analiz ve yapay zeka tahmin sonuçları arayüzdeki kartlara yansıtılacak.
4. **(Opsiyonel) Anomali Tespiti:**
   * IoT verileri akarken eşik değerleri aşıldığında (Örn: Derin dondurucu ısısı aniden düştüğünde) arayüzde bir uyarı (Alert) çıkaracak mantık eklenecek.
