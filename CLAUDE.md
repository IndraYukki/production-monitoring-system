# 🏭 Production Monitoring System — Project Master Context

## 1. TUJUAN & FILOSOFI PROJECT
- **Tujuan Utama:** Aplikasi internal operasional nyata untuk mencatat, memvalidasi, dan menganalisis laporan produksi **Plastic Injection Molding** (menggantikan input manual & spreadsheet).
- **Prinsip Utama:** 
  1. *Practical Utility First:* Dibuat berdasarkan kebutuhan nyata di lapangan. **Jangan menambah kompleksitas yang tidak memiliki manfaat praktis**.
  2. *Developer-in-the-Loop:* AI adalah asisten/akselerator. Developer harus memahami *mengapa* sebuah kode berjalan, bukan sekadar *aplikasi bisa jalan*.
  3. *Build the Foundation First:* Data yang benar ➔ Struktur yang benar ➔ Business Rule yang benar ➔ Kalkulasi yang benar ➔ Dashboard yang berguna.

---

## 2. TECH STACK & ARSITEKTUR
- **Frontend (`/frontend`):** React, Vite, Tailwind CSS
- **Backend (`/backend`):** Java 17+, Spring Boot, Spring Data JPA, Hibernate, PostgreSQL, Maven
- **Pola Arsitektur Backend:**
  `Client (React)` ──(Request DTO)──> `Controller` ──> `Service` ──> `Entity` ──> `Repository` ──> `PostgreSQL`
- **Pola Response Backend:**
  `PostgreSQL` ──> `Repository` ──> `Entity` ──> `Service Mapper` ──> `Response DTO` ──> `Controller` ──> `Client (React)`



---

## 3. STRUKTUR DATABASE & MODEL DATA
### A. Master Data
- `customers` (`id`, `customer`)
- `products` (`id`, `partNo`, `partName`, `color`, `cycleTime`, `cavity`, `takeTime`, `customer_id`)
- `machines` (`id`, `name`) — e.g., MC-01 s/d MC-26, WIP
- `operators` (`id`, `name`, `nik`, `group`)
- `ng_defects` (`id`, `name`, `description`) — Master jenis cacat (e.g., Weldline, Burn, Scratch)

### B. Transaction Data (Header-Detail)
- `production_raw_reports` (Header) ──< `qty_defects` (Detail)
  - `Production` terhubung ke: `Product`, `Machine`, `Operator1` (Utama), `Operator2` (Opt), `Operator3` (Opt).
  - `QtyDefect` terhubung ke: `NgDefect`.

> **Aturan NG Defect:** **TIDAK BOLDER MEMBUAT KOLOM DEFECT PER JENIS**. Hanya simpan defect yang memilki `qtyNg > 0`. Jika tidak ada defect, row di `qty_defects` **tidak boleh dibuat** (jangan simpan qty = 0).

---

## 4. ATURAN KALKULASI BISNIS (SINGLE SOURCE OF TRUTH)
Seluruh kalkulasi bisnis Wajib berada di Backend pada file:
`com.productionmonitoring.util.ProductionCalculator`

1. **Cycle Time:** Berasal dari Master Product (satuan: `Integer` detik, **TIDAK BOLEH DECIMAL**).
2. **Uptime Machine:** Disimpan dalam satuan **menit** (`Integer`).
3. **Target Production:**
   - **Machine Normal:** `Math.ceil((3600 / CycleTime) * Cavity * (UptimeMinutes / 60.0))`
   - **Machine WIP:** `Math.ceil((3600 / TakeTime) * (UptimeMinutes / 60.0))`
4. **Output Total:** `Qty OK + Qty WIP + Total NG`
5. **NG Rate:** `(Total NG / Total Output) * 100`

---

## 5. DTO & KONTRAK API
- Entity JPA **DILARANG** dijadikan kontrak API langsung. Gunakan Request/Response DTO (`ProductionRequestDTO`, `ProductionResponseDTO`, `QtyDefectRequestDTO`, dll).
- `ProductionResponseDTO` **WAJIB** menyertakan `cycleTime`, `cavity`, dan `takeTime` dari Product terkait agar Frontend bisa menampilkan summary tanpa perlu query terpisah.
- Modul `Production` GET menggunakan Pagination standar Spring: `GET /api/production?page=0&jumlah=10` (`Page<ProductionResponseDTO>`).

---

## 6. STATUS FITUR (CRUD STATUS)
- **Production (Header + Detail NG):** GET ✅ | POST ✅ | PUT ✅ | DELETE ✅
- **Product Master:** GET ✅ | POST ✅ | PUT ✅ | DELETE ✅
- **Master Customer, Machine, Operator, NG Defect:** Entity + Repository sudah siap.

---

## 7. ATURAN MUTLAK UNTUK AI AGENT / CLAUDE CLI

1. **Gunakan Fungsi Existing:**
   Selalu periksa `ProductionCalculator` sebelum membuat logika perhitungan. **DILARANG DUPLIKASI LOGIKA KALKULASI DI CONTROLLER, SERVICE LAIN, ATAU FRONTEND.**
2. **Prinsip Refactor:**
   - **DILARANG** melakukan *premature refactoring* (seperti memisahkan mapper, membuat class abstrak baru, atau mengubah arsitektur) hanya agar terlihat "lebih rapi".
   - Jika harus melakukan refactor besar yang berdampak pada >1 layer, **WAJIB MEMBERITAHU DAN MEMINTA PERSETUJUAN USER TERLEBIH DAHULU**.
3. **Cek Consumer Sebelum Mengubah API:**
   Jangan mengubah struktur Response DTO tanpa mengecek komponen React yang mengonsumsinya.
4. **Backend Adalah Validasi Utama:**
   Frontend hanya untuk UX. Semua Business Rules, Validasi Nilai (`@NotNull`, `@NotBlank`), dan Kalkulasi adalah tanggung jawab penuh Backend.

---

## 8. PETA TEKNIS TERBARU (update 23 Agu 2026) — JANGAN DIDUPLIKASI

### A. Sumber data & utility frontend (sudah tersedia, WAJIB reuse)
- `frontend/src/constants/machines.js` — `MACHINES` + `findMachineById()`. **Jangan tulis ulang array mesin di komponen.**
- `frontend/src/constants/ngDefects.js` — `NG_DEFECTS` (id 18 = `'LAIN-LAIN'`, sesuai database).
- `frontend/src/utils/productionTarget.js` — `isWipMachine()` + `calculateTarget()`. Ini **cermin** `ProductionCalculator.hitungTarget()`; deteksi WIP via **NAMA mesin** (`'wip'`), bukan id. Kalau formula backend berubah, file ini WAJIB ikut diubah.
- `frontend/src/utils/dateHelper.js` — `getTodayISO()` + `getFirstDayOfMonthISO()` memakai **waktu lokal**. JANGAN pakai `toISOString().split('T')[0]` — di zona WIB tanggalnya mundur 1 hari.

### B. Agregasi summary monitoring
- Ketiga endpoint summary (`/api/monitoring/operator-summary/cards`, `/operator-summary`, `/operator-summary/{id}/cards`) melakukan agregasi **di database** lewat native query `ProductionRepository.sumProductionForCards` / `sumProductionForOperator`. Java hanya menerima hasil akhir — JANGAN kembali ke pola "load semua entity lalu jumlah di loop".
- ⚠️ Rumus target di dalam SQL kedua query itu adalah **CERMIN `ProductionCalculator.hitungTarget()`** — kalau rumus berubah, SQL WAJIB ikut diubah.
- Field agregat DTO monitoring sudah `Long` (`totalOutput`, `totalTarget`, `totalOk`, `totalWip`, `totalNg`, `totalUptime`, `totalLogs`, `totalLogsAchieve`). Persentase (`achievePercent`, `totalAchieve`, `ngRate`) bertipe `Double` dengan 2 desimal — tampilan FE lewat `formatPercent()` di `src/utils/format.js`.
- Semantik (TIDAK berubah): kartu summary menghitung produksi **sekali** bila salah satu operatornya cocok grup; baris per-operator menghitung produksi untuk **setiap** operator yang terlibat (kepemilikan bersama).
- **Nama field beda antar DTO:** `ProductionResponseDTO` = `totalNg` + `productionStatus`; `OperatorDetailLogDTO` = `qtyNg` + `status`. Modal bersama (`ProductionDetailModal`) membaca nama milik `ProductionResponseDTO` — **kedua** halaman detail (operator & product) mengambil data modal lewat `GET /api/production/{id}` saat baris diklik, karena DTO log (`OperatorDetailLogDTO`, `ProductDetailLogDTO`) sengaja ramping (tanpa defects/remark/customerName/createdAt/groub). NG per baris di list operator dihitung lewat `sumNgPerProductionIds` (satu query agregat) — BUKAN lazy-load defects per baris. Jangan "menyamakan" nama field tanpa cek kedua consumer.
- **Product Summary** (`/api/monitoring/product-summary/*`): pola agregasi sama (Versi A). DTO-nya: `ProductSummaryCardDTO` (totalNgRate/totalAchieve + `totalUptime`/`uptimeDisplay`), `ProductSummaryRowDTO` (ngRate/achievePct + `totalUptime`/`uptimeDisplay`), `ProductDetailCardDTO`, `ProductDetailLogDTO` (**tidak** membawa defects/remark/customerName/createdAt), plus chart DTO `defectName`+`totalNg`. Filter halaman utama: tanggal + `machineId` + `customerId` (opsional, WHERE di 3 native query utama — `sumNgPerDefectGlobal` ikut join `products` untuk filter customer). Sorting list dilakukan di Java (`ProductSummaryService.sort()`) — kolom sortable baru wajib ditambah case di switch (termasuk `customerName`). ⚠️ `findLogsForProductDetail` adalah native query dengan ORDER BY sendiri — JANGAN kirim Sort lewat Pageable (Spring Data menolak dynamic sorting di native query).
- **Export Excel** (`GET /api/production/export`): filter + agregasi NG + rumus target dihitung **PostgreSQL** (`ProductionRepository.findRowsForExport` — proyeksi `Object[]` ringan, BUKAN entity penuh + relasi), lalu `ProductionExcelExporter` menulis `SXSSFWorkbook` sambil stream (fetchSize 1000). Filter opsional termasuk `operatorId` (kepemilikan bersama: `operator1/2/3_id = :operatorId` OR) — dipakai tombol export di halaman detail operator. Achieve %, NG Rate %, dan Status dihitung di Java lewat overload agregat `ProductionCalculator.hitungAchieve(long,long)` / `hitungNgRate(long,long)` — TIDAK diduplikasi di SQL. ⚠️ Rumus target di SQL query itu adalah CERMIN `hitungTarget()` — kalau berubah, SQL WAJIB ikut diubah. Urutan kolom `Object[]` terikat kontrak dengan `ProductionExcelExporter` — jangan diubah sepihak. `ORDER BY p.id` (dulu tanpa order). ⚠️ Controller wajib `dispose()` workbook (file sementara SXSSF).

### C. Keputusan yang masih MENUNGGU (belum dikerjakan)
- Aturan "tidak target ⇒ remark wajib" **belum** diimplementasi di backend (pilihan belum diputus: auto-fill vs reject).
- `MACHINES` / `NG_DEFECTS` masih hardcode di FE (ideal: ambil dari API `/machines` & master NG defect — risiko dropdown kosong kalau API mati, belum diputuskan).
- Heap JVM belum diset (`-Xmx3g` disarankan untuk RAM 8 GB).

### D. Rencana PR — Unifikasi Table Skeleton
- **Status:** belum dikerjakan. Saat ini ada 5 skeleton terpisah: `SummaryTableSkeleton`, `DetailLogsTableSkeleton`, `ProductionRawTableSkeleton`, `SummaryProductTableSkeleton`, `SummaryProductDetailTableSkeleton`.
- **Rencana:** refactor menjadi SATU komponen skeleton bersama berbasis props (jumlah baris `count`, tata letak/lebar kolom, avatar/badge opsional) — supaya halaman/tabel baru TIDAK perlu membuat file skeleton baru lagi.