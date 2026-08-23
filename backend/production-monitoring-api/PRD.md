# 1. PROJECT OVERVIEW

## 1.1 Nama Project

Production Monitoring System

## 1.2 Tujuan

Production Monitoring System adalah aplikasi untuk melakukan monitoring proses produksi injection molding.

Sistem digunakan untuk:

- mencatat laporan produksi
- memonitor output produksi
- memonitor target produksi
- menghitung achievement
- memonitor NG
- menghitung NG Rate
- memonitor uptime machine
- memonitor product
- memonitor operator
- memonitor machine
- memonitor customer
- menyediakan data untuk dashboard dan analisis produksi
- menyediakan export laporan produksi

---

# 2. BUSINESS CONTEXT

Production Monitoring System dibuat untuk menggantikan proses monitoring produksi yang sebelumnya banyak bergantung pada input manual dan spreadsheet.

Sistem harus mampu menjadi sumber data terstruktur untuk:

- Production
- Product Master
- Customer Master
- Operator Master
- Machine Master
- NG Defect
- Qty Defect

Data production kemudian digunakan untuk menghasilkan informasi:

- Output
- Target
- Achievement
- NG
- NG Rate
- Status Target
- Uptime

---

# 3. TECHNOLOGY STACK

## Backend

Java
Spring Boot
Spring Data JPA
Hibernate
PostgreSQL
Maven

## Frontend

React
Vite
JavaScript
CSS / Tailwind CSS

## Database

PostgreSQL

## Development Tools

VS Code
IntelliJ IDEA
Git
Docker (untuk deployment/production environment)

Docker tidak menjadi bagian utama development logic.

Project tetap dikembangkan dari source code.

---

# 4. SYSTEM ARCHITECTURE

Arsitektur utama:

    Frontend React
          │
          │ HTTP REST API
          ▼
    Spring Boot Backend
          │
          ▼
    Service Layer
          │
          ▼
    Repository Layer
          │
          ▼
    PostgreSQL

Business calculation:

    Production
          │
          ▼
    ProductionCalculator
          │
          ├── Total NG
          ├── Output
          ├── Target
          ├── Achievement
          ├── Status
          ├── NG Rate
          └── Uptime Formatting

---

# 5. CORE MASTER DATA

System memiliki beberapa master data.

## 5.1 Product

Product merupakan master utama yang digunakan oleh Production.

Informasi utama:

- ID
- Part Number
- Part Name
- Color
- Cycle Time
- Cavity
- Take Time
- Customer
- Status

Product digunakan untuk menentukan parameter produksi.

---

# 5.2 Customer

Customer merupakan master customer yang memiliki hubungan dengan Product.

Informasi utama:

- ID
- Customer Name

Satu customer dapat memiliki banyak product.

---

# 5.3 Machine

Machine merupakan master mesin produksi.

Contoh:

    MC-01
    MC-02
    MC-03
    ...
    MC-26

Machine juga memiliki kemungkinan special machine/flow seperti:

    WIP

Machine digunakan dalam perhitungan target produksi.

---

# 5.4 Operator

Operator merupakan master operator produksi.

Informasi:

- ID
- Name
- NIK
- Group

Operator tidak menjadi sumber business calculation.

Operator merupakan master data yang digunakan oleh Production.

---

# 5.5 NG Defect

NG Defect merupakan master jenis defect.

Digunakan untuk mengidentifikasi jenis NG pada production report.

---

# 5.6 Qty Defect

Qty Defect merupakan detail jumlah defect yang terdapat pada Production.

Relasi:

    Production
        │
        └── QtyDefect
                ├── Defect
                └── Qty NG

---

# 6. PRODUCTION REPORT

Production merupakan data utama transaksi produksi.

Production menyimpan laporan produksi aktual.

Informasi dapat mencakup:

- Production ID
- Production Lot
- Date
- Product
- Machine
- Operator
- Uptime Machine
- Qty OK
- Qty WIP
- Qty NG
- Defect detail
- Created At

Production tidak menyimpan Cycle Time sebagai data historis.

Cycle Time berasal dari Product Master.

---

# 7. PRODUCT MASTER BUSINESS RULE

Cycle Time merupakan parameter master Product.

Cycle Time:

- satuan detik
- nilai integer
- tidak menggunakan decimal

Contoh:

    30 detik
    35 detik
    42 detik

Bukan:

    30.5
    35.25

Jika Cycle Time berubah pada Product Master, perhitungan production berikutnya menggunakan Cycle Time terbaru.

Data historical production tidak menyimpan copy Cycle Time kecuali secara khusus dibutuhkan untuk audit/history di masa depan.

---

# 8. TAKE TIME

Take Time merupakan parameter waktu yang digunakan khusus pada kondisi tertentu seperti production dengan machine WIP.

Take Time menggunakan satuan waktu.

Jika secara bisnis Take Time merupakan bilangan bulat detik, tipe data yang digunakan:

    Integer

Jika business requirement berubah dan Take Time membutuhkan decimal, tipe data harus ditinjau kembali.

---

# 9. UPTIME MACHINE

Uptime Machine disimpan dalam:

    menit

Contoh:

    60
    120
    450

Interpretasi:

    60 menit = 1 jam
    120 menit = 2 jam
    450 menit = 7 jam 30 menit

Uptime digunakan oleh ProductionCalculator untuk menentukan target.

---

# 10. PRODUCTION BUSINESS LOGIC

Semua logic utama production calculation berada di:

    ProductionCalculator

File:

    com.productionmonitoring.util.ProductionCalculator

---

# 11. TOTAL NG

Function:

    hitungTotalNg(Production p)

Logic:

    Total NG =
    jumlah seluruh Qty NG dari defect Production

Jika tidak ada defect:

    Total NG = 0

---

# 12. TOTAL OUTPUT

Function:

    hitungOutput(Production p)

Formula:

    Output = Qty OK + Qty WIP + Total NG

Dengan:

    Total NG = jumlah seluruh defect quantity

---

# 13. TARGET PRODUCTION

Function:

    hitungTarget(Production p)

Target bergantung pada machine.

---

## 13.1 Normal Injection Machine

Jika machine bukan WIP:

    Target =
    3600 / Cycle Time
    × Cavity
    × Uptime dalam jam

Karena Uptime disimpan dalam menit:

    Uptime Hour = Uptime / 60

Sehingga:

    Target =
    3600 / Cycle Time
    × Cavity
    × (Uptime / 60)

Hasil dibulatkan menggunakan:

    Math.ceil()

---

# 13.2 WIP Machine

Jika machine bernama:

    WIP

maka Cycle Time tidak digunakan.

Target dihitung berdasarkan Take Time:

    Target =
    3600 / Take Time
    × Uptime dalam jam

atau:

    Target =
    3600 / Take Time
    × (Uptime / 60)

Hasil menggunakan:

    Math.ceil()

Jika Take Time = 0:

    Target = 0

---

# 14. ACHIEVEMENT

Function:

    hitungAchieve(int output, int target)

Formula:

    Achievement =
    Output / Target × 100

Jika Target = 0:

    Achievement = 0

Hasil menggunakan pembulatan:

    Math.floor()

---

# 15. PRODUCTION STATUS

Function:

    hitungStatus(int output, int target)

Jika:

    Target = 0

maka:

    Tidak Target

Jika:

    Output >= Target

maka:

    Tercapai

Jika:

    Output < Target

maka:

    Tidak Target

---

# 16. NG RATE

Function:

    hitungNgRate(Production p)

Formula:

    NG Rate =
    Total NG / Total Output × 100

Jika Total Output = 0:

    NG Rate = 0

Hasil menggunakan:

    Math.floor()

---

# 17. UPTIME DISPLAY

Function:

    formatUptime(Integer menitTotal)

Input menggunakan menit.

Output ditampilkan dalam format manusia.

Contoh:

    30
    → 30 menit

    60
    → 1 jam

    90
    → 1 jam 30 menit

    120
    → 2 jam

---

# 18. PRODUCTION CALCULATOR

Current implementation:

    package com.productionmonitoring.util;

    import com.productionmonitoring.entity.Production;
    import com.productionmonitoring.entity.QtyDefect;

    public class ProductionCalculator {

        public static int hitungTotalNg(Production p) {
            if (p.getDefects() == null) return 0;

            return p.getDefects().stream()
                    .mapToInt(d ->
                            d.getQtyNg() != null
                                    ? d.getQtyNg()
                                    : 0
                    )
                    .sum();
        }

        public static int hitungOutput(Production p) {
            int ok = p.getQtyOk() != null
                    ? p.getQtyOk()
                    : 0;

            int wip = p.getQtyWip() != null
                    ? p.getQtyWip()
                    : 0;

            int ng = hitungTotalNg(p);

            return ok + wip + ng;
        }

        public static int hitungTarget(Production p) {

            if (p.getMachine() == null ||
                p.getProduct() == null) {
                return 0;
            }

            boolean isWip =
                    p.getMachine()
                      .getName()
                      .equalsIgnoreCase("WIP");

            int uptime =
                    p.getUptimeMc() != null
                            ? p.getUptimeMc()
                            : 0;

            int cavity =
                    p.getProduct().getCavity() != null
                            ? p.getProduct().getCavity()
                            : 0;

            if (isWip) {

                int takeTime =
                        p.getProduct().getTakeTime() != null
                                ? p.getProduct().getTakeTime()
                                : 0;

                if (takeTime == 0) return 0;

                return (int) Math.ceil(
                        (double) 3600 / takeTime
                        * (uptime / 60.0)
                );

            } else {

                int cycleTime =
                        p.getProduct().getCycleTime() != null
                                ? p.getProduct().getCycleTime()
                                : 0;

                if (cycleTime == 0) return 0;

                return (int) Math.ceil(
                        (double) 3600 / cycleTime
                        * cavity
                        * (uptime / 60.0)
                );
            }
        }

        public static int hitungAchieve(
                int output,
                int target
        ) {

            if (target == 0) return 0;

            return (int) Math.floor(
                    (double) output / target * 100
            );
        }

        public static String hitungStatus(
                int output,
                int target
        ) {

            if (target == 0)
                return "Tidak Target";

            return output >= target
                    ? "Tercapai"
                    : "Tidak Target";
        }

        public static String formatUptime(
                Integer menitTotal
        ) {

            if (menitTotal == null ||
                menitTotal == 0) {
                return "0 menit";
            }

            int jam = menitTotal / 60;
            int menit = menitTotal % 60;

            if (jam == 0)
                return menit + " menit";

            if (menit == 0)
                return jam + " jam";

            return jam + " jam "
                    + menit + " menit";
        }

        public static int hitungNgRate(
                Production p
        ) {

            int totalNg = hitungTotalNg(p);
            int totalOutput = hitungOutput(p);

            if (totalOutput == 0)
                return 0;

            return (int) Math.floor(
                    (double) totalNg / totalOutput * 100
            );
        }
    }

---

# 19. IMPORTANT CALCULATION RULE

Jangan memindahkan business calculation ke:

- Controller
- Repository
- DTO
- Frontend

Semua perhitungan production yang sudah didefinisikan di ProductionCalculator harus menggunakan function existing.

Jika business requirement membutuhkan perhitungan baru:

1. Cek apakah function existing dapat digunakan.
2. Jika belum ada, tambahkan ke ProductionCalculator.
3. Gunakan function tersebut dari service/controller yang membutuhkan.
4. Jangan membuat salinan logic.

---

# 20. PRODUCT API

Base URL:

    /api/products

Endpoint utama:

    GET /api/products

Digunakan untuk mengambil Product secara pageable.

Parameter:

    halaman
    jumlah

---

# 21. PRODUCT SEARCH

Existing search digunakan oleh frontend autocomplete.

Endpoint:

    GET /api/products/search

Search:

    Part Number
    Part Name

Response saat ini berupa List.

Endpoint ini tidak boleh sembarangan diubah menjadi pageable karena digunakan oleh autocomplete.

Jika diperlukan product listing dengan pagination + filter:

gunakan endpoint/filter yang berbeda atau mekanisme yang tidak merusak consumer existing.

---

# 22. PRODUCT FILTER

Product listing membutuhkan kemampuan filtering:

- Part Number
- Part Name
- Customer
- Status

Filter Part Number dan Part Name dapat menggunakan pencarian case-insensitive.

Customer dan Status merupakan parameter filter terpisah.

Product filter harus tetap pageable.

---

# 23. OPERATOR

Operator merupakan master data.

Informasi:

    Name
    NIK
    Group

Operator tidak memiliki relasi bisnis kompleks dengan entity lain.

Kebutuhan search:

    Name
    NIK

Group dapat digunakan sebagai parameter/filter terpisah apabila dibutuhkan oleh UI.

Jangan membuat Specification kompleks apabila kebutuhan hanya search sederhana.

---

# 24. PRODUCTION FILTER

Production memiliki filtering yang lebih kompleks.

Production dapat menggunakan:

- keyword
- product
- part number
- part name
- machine
- operator
- customer
- date
- dan filter lain sesuai kebutuhan sistem

Production filtering menggunakan:

    ProductionFilterDTO

dan:

    ProductionSpecification

Karena Production memiliki relasi dengan beberapa master entity, Specification digunakan apabila memang diperlukan untuk filtering lintas relasi.

---

# 25. DATA RELATIONSHIP

Konsep hubungan utama:

    Customer
       │
       └── Products
              │
              ├── Cycle Time
              ├── Cavity
              ├── Take Time
              └── Production

    Machine
       │
       └── Production

    Operator
       │
       └── Production

    Production
       │
       └── QtyDefect
               │
               └── NG Defect

---

# 26. PRODUCTION FLOW

Alur normal:

    User membuka form Production
             ↓
    Memilih Part Number
             ↓
    System mendapatkan Product Master
             ↓
    System mendapatkan:
        - Part Name
        - Customer
        - Cycle Time
        - Cavity
        - Take Time
             ↓
    User memilih Machine
             ↓
    User memilih Operator
             ↓
    User memasukkan Uptime
             ↓
    User memasukkan Qty OK
             ↓
    User memasukkan Qty WIP
             ↓
    User memasukkan Defect
             ↓
    Backend menyimpan Production
             ↓
    ProductionCalculator menghitung:
        - Total NG
        - Output
        - Target
        - Achievement
        - Status
        - NG Rate
             ↓
    Data ditampilkan pada frontend
             ↓
    Data dapat digunakan untuk dashboard/report

---

# 27. VALIDATION

Validation harus dilakukan di backend.

Data wajib harus memiliki validation annotation sesuai kebutuhan.

Contoh:

    @NotBlank

untuk String wajib.

    @NotNull

untuk field numeric/relationship wajib.

Frontend validation boleh digunakan untuk UX, tetapi backend tetap menjadi validator utama.

---

# 28. DATABASE RULE

Development dapat menggunakan:

    spring.jpa.hibernate.ddl-auto=update

Namun untuk production, perubahan schema harus dilakukan secara terkontrol.

Jangan mengubah tipe database secara sembarangan.

Jika tipe data master berubah, contoh:

    cycle_time
    DOUBLE

menjadi:

    INTEGER

maka:

1. Periksa Entity.
2. Periksa DTO.
3. Periksa Service.
4. Periksa calculation.
5. Periksa frontend.
6. Periksa database.
7. Periksa data existing.
8. Test API.

---

# 29. CURRENT DATA TYPE RULE

## Cycle Time

Business definition:

    satuan: detik
    tipe: Integer

Tidak boleh dianggap sebagai berat/gramasi.

## Take Time

Business definition:

    satuan: detik

Tipe harus mengikuti kebutuhan aktual bisnis.

## Uptime

Business definition:

    satuan: menit
    tipe: Integer

## Qty

Business definition:

    satuan: pcs
    tipe: Integer

## Percentage

Digunakan sebagai hasil perhitungan.

Contoh:

    Achievement
    NG Rate

---

# 30. FRONTEND RESPONSIBILITY

Frontend bertanggung jawab terhadap:

- UI
- form
- table
- pagination
- filtering UI
- autocomplete
- modal
- loading state
- error state
- theme
- API integration

Frontend tidak boleh menduplikasi business calculation backend.

---

# 31. BACKEND RESPONSIBILITY

Backend bertanggung jawab terhadap:

- API
- validation
- persistence
- business logic
- calculation
- relationship
- filtering
- pagination
- error handling
- data integrity

---

# 32. API DESIGN PRINCIPLES

Endpoint harus:

- memiliki nama konsisten
- menggunakan HTTP method yang benar
- memiliki response yang konsisten
- tidak menduplikasi logic
- tidak membuat query repository yang tidak diperlukan
- tidak membuat service yang tidak digunakan

---

# 33. ERROR HANDLING

System menggunakan centralized exception handling.

Existing:

    GlobalExceptionHandler

dan:

    ResourceNotFoundException

Error response harus konsisten.

Jangan membuat exception handler baru untuk kasus yang sebenarnya dapat ditangani oleh GlobalExceptionHandler.

---

# 34. EXPORT

Production memiliki fitur export.

Komponen terkait:

    ProductionExcelExporter

dan:

    ProductionExportService

Export harus mengambil data berdasarkan filter yang digunakan user jika business requirement mengharuskannya.

Jangan membuat logic export yang berbeda dari logic filter production existing.

---

# 35. DASHBOARD

Dashboard merupakan tahap lanjutan.

Dashboard diharapkan dapat menampilkan informasi seperti:

- Total Production
- Total Output
- Target
- Achievement
- NG
- NG Rate
- Machine Performance
- Operator Performance
- Product Performance
- Uptime
- Production trend

Dashboard harus menggunakan data backend yang sudah dihitung secara konsisten.

Jangan menghitung ulang formula production secara terpisah di frontend.

---

# 36. REPORTING

System harus mendukung reporting berdasarkan data Production.

Reporting dapat menggunakan:

- date range
- product
- customer
- machine
- operator
- status
- defect

Semua filter harus menggunakan business logic yang konsisten dengan Production API.

---

# 37. NON-FUNCTIONAL REQUIREMENTS

## Maintainability

Kode harus mudah dipahami dan dipelihara.

## Reusability

Function existing harus digunakan kembali.

## Consistency

Business calculation harus menghasilkan hasil yang sama di seluruh aplikasi.

## Scalability

Arsitektur harus memungkinkan penambahan:

- dashboard
- authentication
- authorization
- reporting
- analytics

tanpa melakukan rewrite seluruh sistem.

---

# 38. TESTING REQUIREMENT

Sebelum feature dianggap selesai:

1. Backend compile.
2. API dapat dijalankan.
3. API diuji.
4. Database dapat menyimpan data.
5. Frontend dapat mengambil data.
6. Filtering diuji.
7. Pagination diuji.
8. Business calculation diuji.
9. Edge case diuji.

Minimum edge case:

    Target = 0
    Output = 0
    NG = 0
    Uptime = 0
    Cycle Time = 0
    Take Time = 0
    Product tidak ditemukan
    Customer tidak ditemukan
    Machine tidak ditemukan

---

# 39. DEVELOPMENT WORKFLOW

Sebelum coding:

    1. Pahami requirement
    2. Baca entity
    3. Baca repository
    4. Baca service
    5. Baca controller
    6. Cari function existing
    7. Cari consumer frontend
    8. Tentukan perubahan minimum

Saat coding:

    1. Reuse function existing
    2. Jangan duplicate logic
    3. Jangan membuat function tidak digunakan
    4. Jangan mengubah API tanpa mengecek consumer
    5. Jangan memindahkan business logic sembarangan

Setelah coding:

    1. Compile
    2. Test API
    3. Test frontend
    4. Test business calculation
    5. Check regression
    6. Check unused code

---

# 40. REFACTOR POLICY

Jika perubahan kecil:

    langsung implementasi

Jika perubahan mempengaruhi beberapa layer:

    informasikan file yang terdampak

Jika perubahan besar:

    STOP SEBELUM IMPLEMENTASI

Informasikan:

    ⚠️ REFACTOR BESAR

    Scope:
    ...

    Layer terdampak:
    ...

    Endpoint terdampak:
    ...

    Database terdampak:
    ...

    Frontend terdampak:
    ...

    Risiko:
    ...

    Rencana migrasi:
    ...

User harus mengetahui perubahan besar sebelum implementasi.

---

# 41. AI / CLI DEVELOPMENT RULE

AI coding assistant seperti:

- ChatGPT
- Gemini CLI
- Qwen CLI
- AI coding agent

WAJIB membaca dokumen ini sebelum melakukan perubahan besar.

AI tidak boleh:

- membuat function duplicate
- membuat endpoint duplicate
- membuat utility duplicate
- menghapus existing function tanpa mengecek consumer
- mengubah business calculation tanpa pemberitahuan
- melakukan refactor besar tanpa pemberitahuan
- mengubah database schema tanpa pemberitahuan
- mengasumsikan business logic tanpa membaca project

Jika AI menemukan function yang tampaknya tidak digunakan:

    BERITAHU USER TERLEBIH DAHULU.

Jangan langsung menghapus.

---

# 42. SOURCE OF TRUTH

Prioritas sumber kebenaran:

    1. Business Requirement
    2. PRD
    3. Backend Business Logic
    4. Database Model
    5. API Contract
    6. Frontend Implementation

Jika terdapat konflik:

    jangan mengambil keputusan diam-diam.

Laporkan konflik dan minta keputusan.

---

# 43. CURRENT PROJECT STATUS

Status:

    Development

Project belum dianggap Production Ready.

Masih terdapat pengembangan pada:

- Product Management
- Production Management
- Filtering
- Dashboard
- Reporting
- Operator Management
- Master Data
- Validation
- Business Logic
- Deployment

Docker telah dipelajari/dipersiapkan, tetapi deployment production bukan prioritas selama development masih berlangsung.

---

# 44. FUTURE FEATURES

Fitur yang dapat dikembangkan:

## Authentication

- Login
- User
- Role
- Permission

## Dashboard

- Production KPI
- Machine KPI
- Operator KPI
- Product KPI
- NG analysis

## Analytics

- Trend production
- Trend NG
- Machine utilization
- Achievement trend

## Reporting

- Daily report
- Weekly report
- Monthly report
- Excel export

## WIP

Future WIP monitoring dapat dikembangkan sebagai bagian terpisah jika kebutuhan bisnis sudah jelas.

---

# 45. DEFINITION OF DONE

Sebuah feature dianggap selesai jika:

- Requirement terpenuhi.
- Tidak membuat duplicate logic.
- Tidak ada function tidak terpakai.
- Backend compile.
- Frontend compile.
- API berhasil diuji.
- Database bekerja.
- Business calculation benar.
- Existing feature tidak rusak.
- Consumer API sudah dicek.
- Dokumentasi diperbarui jika diperlukan.

---

# 46. FINAL DEVELOPMENT PRINCIPLE

Production Monitoring System bukan sekadar kumpulan endpoint CRUD.

System harus dikembangkan berdasarkan:

    BUSINESS FLOW
          ↓
    DATA MODEL
          ↓
    BUSINESS LOGIC
          ↓
    API
          ↓
    FRONTEND
          ↓
    REPORTING / DASHBOARD

Prioritas utama:

    Correctness
        >
    Maintainability
        >
    Reusability
        >
    Performance
        >
    Convenience

Jangan membuat kode hanya agar fitur "bisa jalan".

Kode harus:

- benar
- dapat digunakan kembali
- mudah dipelihara
- mengikuti business flow
- tidak redundant
- tidak menghasilkan dead code

ProductionCalculator menjadi pusat perhitungan produksi.

Jika logic baru berkaitan dengan Production calculation:

    CEK ProductionCalculator TERLEBIH DAHULU.

Jika function sudah tersedia:

    GUNAKAN KEMBALI.

Jika function belum tersedia:

    PERTIMBANGKAN MENAMBAHKANNYA KE ProductionCalculator.

Jangan membuat function paralel yang memiliki tujuan sama.