# 🏭 Production Monitoring System

Aplikasi internal untuk mencatat, memvalidasi, dan menganalisis laporan produksi **Plastic Injection Molding** — pengganti input manual & spreadsheet.

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend (`/frontend`) | React, Vite, Tailwind CSS |
| Backend (`/backend`) | Java 17+, Spring Boot, Spring Data JPA, Hibernate, Maven |
| Database | PostgreSQL |

## Struktur

```
production-monitoring-system/
├── CLAUDE.md                  ← Master context untuk AI agent (WAJIB dibaca dulu)
├── PROJECT_DOCUMENTATION.md   ← Dokumentasi konsep (sebagian sudah usang, lihat CLAUDE.md)
├── frontend/
│   ├── PRD.md                 ← PRD frontend
│   ├── RULES.md               ← Aturan development frontend (WAJIB)
│   └── src/
│       ├── constants/         ← SUMBER TUNGGAL master data FE (jangan duplikasi)
│       │   ├── machines.js        → MACHINES + findMachineById
│       │   └── ngDefects.js       → NG_DEFECTS (id 18 = 'LAIN-LAIN' sesuai DB)
│       ├── utils/
│       │   ├── productionTarget.js → isWipMachine() + calculateTarget() (cermin backend)
│       │   └── dateHelper.js       → getTodayISO() + getFirstDayOfMonthISO() (waktu lokal)
│       └── services/         ← Semua panggilan API wajib lewat sini
└── backend/production-monitoring-api/
    ├── PRD.md                 ← PRD backend
    ├── RULES.md               ← Aturan development backend (WAJIB)
    └── src/main/java/com/productionmonitoring/
        ├── controller/  dto/  entity/  repository/  service/
        ├── util/ProductionCalculator.java    ← SINGLE SOURCE OF TRUTH kalkulasi produksi
        ├── specification/  exception/  excel/
        └── monitoring/     ← Endpoint summary operator (agregasi di database)
```

## Keputusan arsitektur penting (update 23 Agu 2026)

1. **Semua kalkulasi produksi** ada di `ProductionCalculator` (backend). Frontend dan query SQL agregasi hanya **cermin** dari rumus itu — kalau rumus berubah, keduanya **wajib ikut diubah**.
2. **Summary monitoring** (kartu, daftar operator, kartu detail) melakukan agregasi dengan query `SUM()` di database (`ProductionRepository.sumProductionForCards` / `sumProductionForOperator`) — tidak memuat entity ke memori Java.
3. **Field agregat DTO monitoring bertipe `Long`** (bukan `Integer`) untuk menghindari overflow saat data membesar.
4. **Frontend tidak boleh menduplikasi** `MACHINES`, `NG_DEFECTS`, fungsi tanggal, atau rumus target — semuanya sudah disediakan di `src/constants/` dan `src/utils/`.
5. Deteksi mesin **WIP berdasarkan NAMA** (`'wip'`), bukan id — konsisten di backend, frontend, dan SQL.

## Menjalankan

- **Backend:** `mvn spring-boot:run` di `backend/production-monitoring-api` (PostgreSQL lokal, `production_monitoring_db`).
  - Mesin 8 GB disarankan memakai heap eksplisit: VM options `-Xmx3g`.
- **Frontend:** `npm install && npm run dev` di `frontend`.

## Dokumentasi yang mengikat

Urutan prioritas saat ragu: **CLAUDE.md → PRD → Backend Business Logic → Database → API Contract → Frontend**.
