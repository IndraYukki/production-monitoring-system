# Production Monitoring System - Backend API

> Backend REST API untuk **Production Monitoring System**, sebuah sistem monitoring produksi berbasis web yang dirancang untuk mendigitalisasi proses pencatatan produksi pada industri **Plastic Injection Molding**.

---

# Tentang Project

Production Monitoring System merupakan sistem yang dikembangkan untuk menggantikan proses pencatatan produksi yang sebelumnya masih menggunakan Microsoft Excel secara manual.

Sistem ini berfokus pada proses pencatatan **Raw Production Report**, sehingga seluruh data produksi tersimpan secara terstruktur di database dan dapat digunakan sebagai dasar analisis, dashboard, KPI, export laporan, hingga pengembangan fitur monitoring yang lebih kompleks.

Project ini dikembangkan menggunakan arsitektur REST API sehingga frontend dapat dibuat secara terpisah menggunakan React.

---

# Tujuan Project

Project ini memiliki beberapa tujuan utama:

* Menghilangkan proses pencatatan produksi secara manual.
* Menjadikan database sebagai sumber data utama (Single Source of Truth).
* Mempermudah pencarian histori produksi.
* Menyediakan data yang siap digunakan untuk Dashboard, KPI, Chart, maupun Reporting.
* Mempermudah proses export laporan ke Microsoft Excel.
* Menjadi fondasi untuk sistem Manufacturing Execution System (MES) skala kecil.

---

# Filosofi Pengembangan

Project ini dikembangkan dengan prinsip:

* Database harus tetap Normalized.
* Business Logic berada di Backend.
* Frontend hanya bertugas menampilkan data.
* API dibuat reusable sehingga dapat digunakan oleh berbagai halaman.
* Setiap modul dipisahkan sesuai tanggung jawabnya (Single Responsibility Principle).

---

# Technology Stack

## Backend

* Java 21+
* Spring Boot
* Spring Web
* Spring Data JPA
* Hibernate
* Jakarta Validation
* Lombok

## Database

* PostgreSQL

## Build Tool

* Maven

## Library

* Apache POI (Export Excel)

---

# Struktur Arsitektur

Project menggunakan arsitektur berlapis (Layered Architecture).

```text
Client (React)
        │
        ▼
Controller
        │
        ▼
Service
        │
        ▼
Repository
        │
        ▼
PostgreSQL
```

Setiap layer memiliki tanggung jawab yang berbeda sehingga kode tetap mudah dirawat dan dikembangkan.

---

# Struktur Folder

```text
src
└── main
    └── java
        └── com.productionmonitoring
            ├── controller
            ├── service
            ├── repository
            ├── entity
            ├── dto
            ├── specification
            ├── excel
            ├── config
            ├── exception
            └── ProductionMonitoringApplication
```

## controller

Berisi seluruh REST Endpoint.

Controller hanya menerima request dari client kemudian meneruskannya ke Service.

Tidak diperbolehkan menulis Business Logic di dalam Controller.

---

## service

Merupakan pusat Business Logic.

Seluruh proses seperti:

* CRUD
* Validasi
* Mapping Entity
* Mapping DTO
* Export Excel
* Penggabungan Specification

dilakukan pada layer ini.

---

## repository

Menghubungkan aplikasi dengan database menggunakan Spring Data JPA.

Repository bertanggung jawab melakukan komunikasi dengan PostgreSQL.

---

## entity

Representasi tabel database.

Entity menggunakan relasi JPA seperti:

* ManyToOne
* OneToMany

sehingga struktur database tetap Normalized.

---

## dto

Digunakan sebagai objek pertukaran data antara Backend dan Frontend.

Project menggunakan DTO agar:

* Entity tidak langsung dikirim ke client.
* Response lebih ringan.
* Struktur response dapat disesuaikan dengan kebutuhan halaman.

DTO dibedakan menjadi:

* Request DTO
* Response DTO
* Filter DTO

---

## specification

Berisi seluruh filter dinamis menggunakan Spring Data Specification.

Contoh filter:

* Keyword Product
* Customer
* Machine
* Shift
* Production Lot
* Date Range

Layer ini dibuat agar seluruh query filtering dapat digunakan kembali tanpa menulis query yang sama berkali-kali.

---

## excel

Berisi proses pembuatan file Microsoft Excel.

Saat ini menggunakan Apache POI.

Business Logic export dipisahkan dari Service agar kode tetap bersih.

---

# Struktur Database

Database menggunakan konsep relational database.

Secara sederhana relasinya adalah sebagai berikut:

```text
Customer
    │
    │
Product
    │
    │
Production
    ├──────── Machine
    ├──────── Operator 1
    ├──────── Operator 2
    ├──────── Operator 3
    │
    └──────── Qty Defect
                    │
                    ▼
              NG Defect
```

Konsep ini dipilih agar tidak terjadi duplikasi data dan memudahkan pengembangan sistem di masa depan.

---

# Modul yang Telah Selesai

Saat README ini dibuat, backend telah memiliki modul berikut.

## Master Customer

* CRUD Customer
* Search Customer

---

## Master Product

* CRUD Product
* Relasi Customer
* Search Product
* Autocomplete Product

---

## Master Machine

* CRUD Machine
* Search Machine

---

## Master Operator

* CRUD Operator
* Search Operator

---

## Master NG Defect

* CRUD NG Defect

---

## Raw Production Report

Sudah mendukung:

* Tambah Data
* Edit Data
* Hapus Data
* Detail Relasi
* Mapping DTO
* Pagination
* Dynamic Filter

Filter yang tersedia:

* Product Keyword
* Customer
* Machine
* Shift
* Production Date Range

---

## Export Excel

Sudah mendukung:

* Export berdasarkan Filter
* Microsoft Excel (.xlsx)
* Formula Excel
* Perhitungan Target PPIC
* Total NG
* Achievement
* NG Rate
* Status Produksi

---

# Dynamic Filtering

Project menggunakan Spring Data Specification.

Hal ini memungkinkan satu endpoint melakukan filtering yang sangat kompleks tanpa membuat banyak endpoint berbeda.

Contoh:

```text
GET /api/production

?keyword=ABC
&customerId=2
&machineId=5
&shift=SHIFT 1
&tanggalMulai=2026-08-01
&tanggalSelesai=2026-08-31
```

Backend secara otomatis akan menggabungkan seluruh filter tersebut menjadi satu query.

---

# Prinsip Pengembangan API

Project ini menggunakan prinsip:

* Satu Endpoint untuk satu kebutuhan.
* Filter menggunakan Query Parameter.
* Pagination menggunakan Pageable.
* Response menggunakan DTO.
* Entity tidak langsung dikirim ke Frontend.
* Query kompleks menggunakan Specification.

---

# Roadmap Selanjutnya

Beberapa fitur yang direncanakan setelah modul Raw Production selesai adalah:

## Dashboard

* Production Summary
* Target Achievement
* Daily Production
* Monthly Production
* Machine Utilization

---

## Machine Analytics

* Running Time
* Downtime
* Uptime
* Availability

---

## Operator Performance

* Total Produksi
* Achievement
* Ranking Operator

---

## Quality Dashboard

* NG Rate
* Pareto Defect
* Top Defect
* Trend Defect

---

## Reporting

* PDF Export
* Excel Styling
* Print Report

---

## Authentication

* Login
* Role Management
* Authorization

---

## Audit

* Created By
* Updated By
* Activity Log

---

# Catatan Pengembangan

Project ini dikembangkan secara bertahap dengan pendekatan **MVP (Minimum Viable Product)**.

Prioritas utama adalah menghasilkan **Raw Production Report** yang stabil dan dapat digunakan sebagai sumber data utama.

Setelah fondasi backend selesai, seluruh dashboard, KPI, analytics, dan reporting akan dibangun menggunakan data yang sama tanpa mengubah struktur database utama.

Pendekatan ini dipilih agar sistem tetap mudah dipelihara, mudah dikembangkan, dan siap digunakan dalam skala produksi.
