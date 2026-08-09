# Production Monitoring System

Production Monitoring System adalah aplikasi internal untuk membantu proses pencatatan, monitoring, validasi, dan analisis aktivitas produksi pada proses **plastic injection molding**.

Sistem ini dikembangkan untuk menggantikan proses pencatatan produksi yang sebelumnya bergantung pada input manual dan spreadsheet, sehingga data produksi dapat disimpan secara terstruktur, dapat ditelusuri kembali, dan nantinya dapat digunakan sebagai dasar analisis performa produksi.

---

# 1. Product Vision

Sistem ini tidak hanya ditujukan sebagai aplikasi untuk **input laporan produksi**.

Tujuan akhirnya adalah membangun sebuah **Production Monitoring System** yang mampu menghubungkan:

```text
Production Input
      ↓
Raw Production Data
      ↓
Validation & Review
      ↓
Production Calculation
      ↓
Monitoring
      ↓
Analysis
      ↓
Dashboard & Reporting
      ↓
Decision Making
```

Dengan demikian, data yang dimasukkan oleh user pada saat produksi tidak berhenti sebagai laporan historis saja, tetapi dapat digunakan untuk menjawab pertanyaan seperti:

* Berapa banyak produksi yang dihasilkan?
* Berapa banyak NG yang terjadi?
* Apa jenis defect yang paling sering muncul?
* Berapa production rate aktual?
* Berapa uptime mesin?
* Apakah target produksi tercapai?
* Bagaimana performa operator?
* Mesin mana yang memiliki downtime atau performa buruk?
* Product mana yang memiliki defect rate tinggi?
* Bagaimana performa produksi berdasarkan shift?
* Bagaimana performa produksi berdasarkan periode tertentu?
* Apa penyebab utama penurunan performa produksi?

---

# 2. Business Problem

Dalam proses produksi injection molding, data produksi memiliki banyak komponen:

* Production Lot
* Product / Part Number
* Machine
* Shift
* Operator
* Uptime Machine
* Quantity OK
* Quantity WIP
* Quantity NG
* NG Defect
* Cycle Time
* Cavity
* dan informasi pendukung lainnya.

Jika data tersebut hanya disimpan sebagai laporan manual, maka proses berikutnya menjadi sulit:

1. melakukan pencarian histori produksi,
2. melakukan validasi data,
3. menghitung performa produksi,
4. membandingkan antar shift,
5. membandingkan antar operator,
6. membandingkan antar mesin,
7. menganalisis defect,
8. membuat summary,
9. membuat dashboard,
10. mengambil keputusan berdasarkan data.

Oleh karena itu sistem ini dibangun secara bertahap dari **data capture → data validation → calculation → analysis**.

---

# 3. Scope Sistem

Secara keseluruhan sistem akan memiliki beberapa area utama:

```text
MASTER DATA
├── Product
├── Machine
├── Operator
├── Customer
└── NG Defect

PRODUCTION
├── Add Production
├── Production Report
├── Review Production
├── Edit Production
└── Production Detail

MONITORING
├── Production Summary
├── Production Rate
├── Uptime
├── NG Rate
├── Target vs Actual
└── Shift Monitoring

ANALYSIS
├── Product Performance
├── Machine Performance
├── Operator Performance
├── Defect Analysis
└── Historical Analysis

DASHBOARD
├── KPI
├── Charts
├── Trends
├── Ranking
└── Summary
```

Tidak semua bagian tersebut sudah dibuat.

Project saat ini masih berada pada tahap awal pembangunan modul **Production Input**.

---

# 4. Current Development Status

## Sudah berjalan

### Production Input

Saat ini sistem sudah dapat membuat laporan production dengan data:

* Production Lot
* Product
* Machine
* Shift
* Operator 1
* Operator 2
* Operator 3
* Uptime Machine
* Qty OK
* Qty WIP
* NG Defect

Satu production lot dapat memiliki beberapa shift.

Contoh:

```text
Production Lot: LOT-001

SHIFT 1 → ada data
SHIFT 2 → kosong
SHIFT 3 → ada data
```

Sistem hanya mengirim shift yang memiliki data production.

### Production API

Frontend React sudah terhubung dengan backend Spring Boot.

Alur:

```text
React
  ↓
Production Payload
  ↓
Spring Boot REST API
  ↓
Service
  ↓
Repository
  ↓
PostgreSQL
```

### Operator Autocomplete

Operator dapat dicari menggunakan autocomplete.

Data operator yang dipilih dipisahkan menjadi:

```text
Operator Name → untuk tampilan UI
Operator ID   → untuk backend/database
```

Pendekatan ini digunakan agar state UI dan data relasional backend tidak tercampur.

### Production Reset

Setelah laporan berhasil disimpan, form dapat dikembalikan ke kondisi awal.

---

# 5. Production Input Flow

Alur utama saat ini:

```text
User membuka Add Production
        ↓
Memilih Product
        ↓
Memilih Machine
        ↓
Mengisi Production Lot
        ↓
Mengisi Shift 1 / Shift 2 / Shift 3
        ↓
Memilih Operator
        ↓
Mengisi Uptime
        ↓
Mengisi Qty OK
        ↓
Mengisi Qty WIP
        ↓
Mengisi NG Defect
        ↓
Submit
        ↓
Frontend membuat payload
        ↓
POST /api/production
        ↓
Backend melakukan processing
        ↓
Database PostgreSQL
        ↓
Production berhasil tersimpan
        ↓
Form di-reset
```

---

# 6. Production Data Model

Konsep data production menggunakan referensi terhadap master data.

Secara konseptual:

```text
Product
   │
   ├──────────────┐
   │              │
   ↓              ↓
Production ← Machine
   │
   ├── Operator 1
   ├── Operator 2
   ├── Operator 3
   │
   ├── Shift
   ├── Uptime
   ├── Qty OK
   ├── Qty WIP
   │
   └── NG Defect
```

Production merupakan **historical transaction data**.

Master data seperti Product, Operator, Machine, dan NG Defect digunakan sebagai referensi.

---

# 7. Important Business Rules

Business rules harus dipisahkan dari sekadar UI.

## 7.1 Shift

Production dapat memiliki:

```text
SHIFT 1
SHIFT 2
SHIFT 3
```

Tidak semua shift wajib diisi.

Contoh valid:

```text
SHIFT 1 → ada
SHIFT 2 → kosong
SHIFT 3 → ada
```

Maka hanya Shift 1 dan Shift 3 yang disimpan.

---

## 7.2 Operator

Operator 1 merupakan operator utama dan digunakan sebagai indikator apakah suatu shift memiliki data production.

Operator 2 dan Operator 3 bersifat opsional.

---

## 7.3 Uptime

User mengisi uptime dalam:

```text
Hour
Minute
```

Backend menerima uptime dalam menit.

Formula:

```text
uptimeMinutes = (hours × 60) + minutes
```

Contoh:

```text
2 jam 1 menit

= (2 × 60) + 1
= 121 menit
```

---

# 8. Production Calculation

Calculation akan dikembangkan secara bertahap.

Beberapa data master yang penting untuk calculation:

* Product Weight
* Runner Weight
* Cavity
* Cycle Time
* Machine
* Uptime
* Qty OK
* Qty WIP
* Qty NG

Contoh konsep perhitungan production capacity:

```text
Production Rate
= (3600 / Cycle Time) × Cavity
```

Kemudian dapat digunakan bersama uptime untuk menghitung theoretical production.

Perhitungan final harus ditentukan berdasarkan business rule produksi yang berlaku dan tidak boleh hanya bergantung pada asumsi frontend.

---

# 9. NG Defect

NG tidak hanya disimpan sebagai total NG.

Sistem menyimpan detail defect.

Contoh:

```text
BURRY       → 10
OVERCUT     → 5
DIRTY       → 2
DISCOLOR    → 1
```

Sehingga sistem nantinya dapat melakukan:

```text
Total NG
   ↓
NG Rate
   ↓
Defect Ranking
   ↓
Defect Trend
   ↓
Top Defect Analysis
```

Ini penting karena tujuan sistem bukan hanya mengetahui **berapa banyak NG**, tetapi juga mengetahui **NG tersebut berasal dari defect apa**.

---

# 10. Production Review

Setelah fitur Add Production stabil, tahap berikutnya adalah **Production Review**.

Tujuannya memastikan data yang sudah dimasukkan benar sebelum digunakan untuk reporting dan analysis.

Contoh alur:

```text
Add Production
      ↓
Saved
      ↓
Production Report
      ↓
Review
      ↓
Correct?
   ↙       ↘
 YES        NO
  ↓          ↓
Approved    Edit
  ↓          ↓
Analysis   Review Again
```

Review harus memungkinkan user melihat:

* Production Lot
* Product
* Machine
* Shift
* Operator
* Uptime
* Qty OK
* Qty WIP
* Qty NG
* Detail NG

---

# 11. Production CRUD

Setelah Add Production stabil, modul production akan berkembang menjadi:

```text
CREATE
  ↓
READ
  ↓
UPDATE
  ↓
DELETE
```

### Create

Sudah menjadi fokus utama tahap sekarang.

### Read

Menampilkan histori laporan production.

### Update

Memperbaiki kesalahan input production.

### Delete

Menghapus data production dengan aturan yang jelas.

Data production tidak boleh sembarangan diubah atau dihapus jika sudah digunakan dalam calculation/reporting.

---

# 12. Reporting

Production Report akan menjadi pusat histori data production.

Kemungkinan fitur:

* Pagination
* Search
* Filter tanggal
* Filter production lot
* Filter product
* Filter machine
* Filter shift
* Filter operator
* Filter customer
* Detail production
* Edit production
* Delete production

Contoh:

```text
Production Report

Date       Product      Machine   Shift     OK      NG
---------------------------------------------------------
01/08/26   PART-001     MC-01     SHIFT 1   1,200   12
01/08/26   PART-002     MC-03     SHIFT 2   980     8
02/08/26   PART-001     MC-01     SHIFT 1   1,150   20
```

---

# 13. Monitoring

Setelah data production cukup stabil, sistem akan mulai digunakan untuk monitoring.

Metric yang direncanakan antara lain:

### Production Quantity

```text
Total OK
Total WIP
Total NG
Total Production
```

### NG Rate

```text
NG Rate
= Total NG / Total Production × 100%
```

### Production Rate

Membandingkan actual production dengan theoretical production.

### Machine Uptime

Memonitor waktu mesin berjalan dibandingkan dengan waktu yang tersedia.

### Target vs Actual

Membandingkan hasil produksi aktual dengan target PPIC/production.

---

# 14. Operator Performance

Data operator nantinya dapat digunakan untuk melakukan analisis performa.

Contoh metric:

```text
Production Qty
NG Qty
NG Rate
Uptime
Achievement
Production Rate
```

Contoh output:

```text
Operator Performance

Operator       Production    NG Rate    Achievement
----------------------------------------------------
Operator A       12,500        0.8%         97%
Operator B       13,200        0.5%        102%
Operator C       11,900        1.2%         91%
```

Namun ranking operator tidak boleh langsung dibuat hanya berdasarkan jumlah produksi.

Performance harus menggunakan metric yang sesuai dengan kondisi produksi, misalnya:

* product,
* machine,
* cycle time,
* shift,
* target,
* uptime,
* defect,
* dan faktor lain yang relevan.

---

# 15. Machine Performance

Machine dapat dianalisis berdasarkan:

* Uptime
* Production Rate
* Target Achievement
* NG Rate
* Downtime
* Product yang diproduksi
* Cycle Time
* Historical performance

Tujuannya mengetahui kondisi performa setiap mesin.

---

# 16. Product Performance

Product dapat dianalisis berdasarkan:

* Total production
* Total NG
* NG rate
* Production rate
* Machine usage
* Historical trend
* Defect distribution

Contoh pertanyaan yang harus dapat dijawab sistem:

> Product mana yang paling sering menghasilkan NG?

> Product mana yang memiliki production rate paling rendah?

> Product mana yang paling banyak diproduksi bulan ini?

---

# 17. Dashboard

Dashboard merupakan tahap lanjutan setelah data dan calculation stabil.

Dashboard tidak boleh dibuat hanya untuk mempercantik UI.

Setiap chart harus memiliki tujuan analisis.

Contoh:

```text
PRODUCTION DASHBOARD

┌────────────┐ ┌────────────┐ ┌────────────┐
│ Total OK   │ │ Total NG   │ │ NG Rate    │
│ 125,000    │ │ 1,240      │ │ 0.98%      │
└────────────┘ └────────────┘ └────────────┘

┌───────────────────────────────┐
│ Production Trend              │
│                               │
│       📈                      │
│                               │
└───────────────────────────────┘

┌────────────────┐ ┌────────────┐
│ Top NG Defect  │ │ Machine    │
│                │ │ Performance│
└────────────────┘ └────────────┘
```

Dashboard nantinya dapat memiliki filter:

```text
Date Range
Product
Machine
Shift
Operator
Customer
```

---

# 18. Architecture

Tech stack utama:

```text
Frontend
React
Tailwind CSS

Backend
Java
Spring Boot
Spring Data JPA

Database
PostgreSQL
```

Arsitektur:

```text
┌──────────────────────┐
│      React UI        │
│                      │
│ Components           │
│ Pages                │
│ Services             │
└──────────┬───────────┘
           │ HTTP / REST API
           ↓
┌──────────────────────┐
│    Spring Boot       │
│                      │
│ Controller           │
│ Service              │
│ Repository           │
│ Entity               │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│      PostgreSQL      │
└──────────────────────┘
```

---

# 19. Frontend Structure

Frontend akan dipisahkan berdasarkan tanggung jawab.

Contoh struktur:

```text
src/
├── pages/
│   ├── production/
│   │   ├── AddProduction.jsx
│   │   ├── ProductionList.jsx
│   │   └── ProductionDetail.jsx
│   │
│   └── dashboard/
│
├── components/
│   ├── production/
│   │   ├── ProductionInfo.jsx
│   │   ├── ShiftForm.jsx
│   │   ├── OperatorAutoComplete.jsx
│   │   └── PartNoAutocomplete.jsx
│   │
│   └── common/
│
├── services/
│   ├── productionService.js
│   ├── productService.js
│   ├── operatorService.js
│   └── machineService.js
│
└── ...
```

Prinsip:

> Component menangani UI, service menangani komunikasi API, dan business logic penting tidak boleh tersebar tanpa alasan di berbagai component.

---

# 20. Backend Structure

Backend menggunakan pola:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Contoh:

```text
ProductionController
        ↓
ProductionService
        ↓
ProductionRepository
        ↓
PostgreSQL
```

Controller bertanggung jawab terhadap HTTP request/response.

Service bertanggung jawab terhadap business logic.

Repository bertanggung jawab terhadap akses database.

---

# 21. Database Concept

Database akan dibangun berdasarkan dua kategori utama.

## Master Data

```text
Product
Machine
Operator
Customer
NG Defect
```

Master data digunakan sebagai referensi.

## Transaction Data

```text
Production
Production Defect
```

Transaction menyimpan kejadian produksi yang benar-benar terjadi.

Secara konsep:

```text
MASTER DATA
     │
     │ reference
     ↓
TRANSACTION DATA
     │
     ↓
CALCULATION
     │
     ↓
REPORTING
     │
     ↓
ANALYSIS
```

---

# 22. Important Design Principle

## Raw Data vs Calculated Data

Sistem harus membedakan:

### Raw Data

Data yang benar-benar dimasukkan atau berasal dari kejadian produksi.

Contoh:

```text
Qty OK
Qty WIP
Uptime
Operator
Machine
Product
NG
```

### Calculated Data

Data yang diperoleh dari perhitungan.

Contoh:

```text
NG Rate
Production Rate
Achievement
Theoretical Production
Operator Performance
Machine Performance
```

Calculated data sebisa mungkin **tidak dianggap sebagai raw production data**.

Jika sebuah nilai dapat dihitung ulang dari raw data dan master data, sistem harus mempertimbangkan untuk menghitungnya pada layer calculation/reporting daripada menyimpan hasil yang berpotensi menjadi tidak sinkron.

---

# 23. Source of Truth

Database production merupakan sumber utama historical production data.

Frontend tidak boleh menjadi sumber kebenaran untuk calculation.

Contoh:

```text
Frontend
   ↓
Input

Backend
   ↓
Validation
Business Rules
Calculation

Database
   ↓
Historical Data
```

Perhitungan penting harus dapat dipertanggungjawabkan dari data yang tersimpan.

---

# 24. Development Strategy

Project dikembangkan secara bertahap.

Jangan membangun dashboard terlebih dahulu sebelum data production dan business rule stabil.

Urutan pengembangan:

```text
PHASE 1
Production Input
       ↓
PHASE 2
Production CRUD
       ↓
PHASE 3
Production Review & Validation
       ↓
PHASE 4
Business Calculation
       ↓
PHASE 5
Production Monitoring
       ↓
PHASE 6
Operator / Machine / Product Analysis
       ↓
PHASE 7
Dashboard & Charts
       ↓
PHASE 8
Advanced Reporting
```

---

# 25. Current Priority

Prioritas saat ini:

```text
[CURRENT]

Add Production
      ↓
Validation
      ↓
Save Production
      ↓
Reset Form
```

Setelah ini selesai:

```text
[NEXT]

Production List
      ↓
Search & Filter
      ↓
Production Detail
      ↓
Edit Production
      ↓
Delete / Data Management
```

Kemudian:

```text
[AFTER CRUD]

Review
      ↓
Calculation
      ↓
Monitoring
      ↓
Analysis
      ↓
Dashboard
```

---

# 26. Long-Term Goal

Tujuan akhir sistem adalah membuat satu sumber data production yang dapat digunakan untuk seluruh kebutuhan monitoring dan analisis.

```text
                    PRODUCTION DATA
                           │
          ┌────────────────┼────────────────┐
          ↓                ↓                ↓
       PRODUCT           MACHINE          OPERATOR
          │                │                │
          └────────────────┼────────────────┘
                           ↓
                     PRODUCTION
                           │
              ┌────────────┼────────────┐
              ↓            ↓            ↓
             QTY          UPTIME        NG
              │            │            │
              └────────────┼────────────┘
                           ↓
                     CALCULATION
                           │
              ┌────────────┼────────────┐
              ↓            ↓            ↓
          Production    Performance   Defect
             Rate         Analysis     Analysis
              │            │            │
              └────────────┼────────────┘
                           ↓
                       DASHBOARD
                           │
                           ↓
                    DECISION MAKING
```

Sistem pada akhirnya diharapkan bukan hanya menjawab:

> "Berapa produksi hari ini?"

tetapi juga:

> "Mengapa performa produksi hari ini turun?"

dan:

> "Apa faktor yang paling berpengaruh terhadap hasil produksi?"

---

# 27. Development Rules

Selama pengembangan, beberapa prinsip harus dipertahankan:

1. Jangan membuat calculation sebelum business rule jelas.
2. Jangan mencampur data display dengan ID database tanpa alasan.
3. Jangan membuat frontend menjadi sumber kebenaran business logic.
4. Master data digunakan sebagai reference.
5. Production merupakan historical transaction.
6. Raw data dan calculated data harus dibedakan.
7. Setiap fitur baru harus memiliki tujuan bisnis yang jelas.
8. Dashboard harus dibuat berdasarkan kebutuhan analisis, bukan sekadar visualisasi.
9. Perubahan struktur database harus dipikirkan dampaknya terhadap historical data.
10. Fitur yang belum diperlukan tidak perlu dibuat terlalu dini.

---

# 28. Current Project Philosophy

Project ini dibangun dengan prinsip:

> **Build the data foundation first, then build the intelligence on top of it.**

Atau secara sederhana:

```text
Data yang benar
      ↓
Struktur yang benar
      ↓
Business rule yang benar
      ↓
Calculation yang benar
      ↓
Analysis yang benar
      ↓
Dashboard yang berguna
```

Karena dashboard yang bagus dengan data yang salah tetap menghasilkan keputusan yang salah.

---

# 29. Roadmap

## Phase 1 — Production Input

* [x] Product selection
* [x] Machine selection
* [x] Production Lot
* [x] Shift 1 / 2 / 3
* [x] Operator autocomplete
* [x] Uptime input
* [x] Qty OK
* [x] Qty WIP
* [x] NG Defect
* [x] Submit production
* [x] Save to PostgreSQL
* [x] Reset form

## Phase 2 — Production Management

* [ ] Production List
* [ ] Pagination
* [ ] Search
* [ ] Filter
* [ ] Production Detail
* [ ] Edit Production
* [ ] Delete Production
* [ ] Review Production

## Phase 3 — Production Calculation

* [ ] Cycle Time calculation
* [ ] Theoretical Production
* [ ] Production Rate
* [ ] NG Rate
* [ ] Achievement
* [ ] Uptime calculation
* [ ] Target vs Actual

## Phase 4 — Monitoring

* [ ] Daily Production Monitoring
* [ ] Shift Monitoring
* [ ] Machine Monitoring
* [ ] Product Monitoring
* [ ] NG Monitoring

## Phase 5 — Analysis

* [ ] Operator Performance
* [ ] Machine Performance
* [ ] Product Performance
* [ ] Defect Analysis
* [ ] Historical Trend

## Phase 6 — Dashboard

* [ ] KPI Cards
* [ ] Production Trend
* [ ] NG Trend
* [ ] Defect Ranking
* [ ] Machine Ranking
* [ ] Operator Performance
* [ ] Target vs Actual
* [ ] Interactive Filters

## Phase 7 — Advanced System

* [ ] Advanced reporting
* [ ] Export report
* [ ] Role / permission
* [ ] Audit trail
* [ ] Data approval workflow
* [ ] Advanced analytics

---

# 30. Current Development Principle

**Do not rush to build everything.**

Current focus is:

```text
MAKE PRODUCTION INPUT RELIABLE
```

Then:

```text
MAKE PRODUCTION DATA MANAGEABLE
```

Then:

```text
MAKE PRODUCTION DATA TRUSTWORTHY
```

Then:

```text
MAKE PRODUCTION DATA USEFUL
```

And finally:

```text
MAKE PRODUCTION DATA INTELLIGENT
```

---

# Project Status

**Status:** Active Development

**Current Focus:** Production Input & Production Data Management

**Next Major Milestone:** Production CRUD + Review

**Long-Term Goal:** Production monitoring, performance analysis, and decision-support dashboard for injection molding operations.
