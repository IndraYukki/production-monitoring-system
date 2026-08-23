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