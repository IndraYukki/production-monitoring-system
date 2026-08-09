Production Monitoring System — Project Documentation

1. Tujuan Project

Production Monitoring System dibuat untuk membantu monitoring produksi injection molding.

Tujuan utama:

Mencatat laporan produksi.
Mencatat output OK/WIP.
Mencatat uptime mesin.
Menghubungkan produksi dengan Product, Customer, Machine, Operator.
Mencatat NG Defect secara fleksibel.
Menjadi sumber data dashboard React.
Mengurangi pekerjaan manual dalam pembuatan laporan produksi.
Digunakan secara nyata oleh pembuat sistem sendiri.

Prinsip project:

Sistem dibuat berdasarkan kebutuhan operasional nyata, bukan menambahkan kompleksitas atau aturan yang tidak memiliki manfaat praktis.

2. Tech Stack
   Backend
   Java
   Spring Boot
   Spring Data JPA
   Hibernate
   PostgreSQL
   Maven
   Frontend
   React
   API Testing
   Postman
3. Arsitektur Backend

Saat ini backend menggunakan pola:

Controller
↓
Service
↓
Repository
↓
Database

Dengan DTO:

Client
↓
Request DTO
↓
Controller
↓
Service
↓
Entity
↓
Repository
↓
PostgreSQL

Response:

PostgreSQL
↓
Repository
↓
Entity
↓
Service Mapper
↓
Response DTO
↓
Controller
↓
React

DTO digunakan supaya Entity JPA tidak langsung menjadi kontrak API.

4. Struktur Database

Secara konsep database sekarang terbagi menjadi:

Master Data
customers
products
machines
operators
ng_defects
Transaction
production_raw_reports
qty_defects

Relasinya:

Customer
│
└──────< Products
│
│
▼
ProductionRawReports
│ │ │
│ │ ├── Machine
│ │
│ ├──────── Operator
│
└──────< QtyDefects >──── NgDefects

Lebih sederhananya:

Customer
│
└── Products
│
└── Production
│
└── QtyDefect
│
└── NgDefect 5. Entity
Customer
Customer
├── id
└── customer

Digunakan sebagai master customer.

Saat ini sengaja sederhana karena kebutuhan utama adalah filtering/reporting berdasarkan customer.

Products
Products
├── id
├── partNo
├── partName
├── color
├── cycleTime
├── cavity
├── takeTime
└── customer_id

Relasi:

Products → Customer
@ManyToOne

Product menyimpan parameter yang diperlukan untuk perhitungan production.

Cycle Time dan Take Time harus tersedia dalam Response DTO Production karena akan digunakan oleh frontend untuk summary/perhitungan.

Machine
Machine
├── id
└── name

Contoh:

MC-01
MC-02
MC-03
...
MC-26
Operator
Operator
├── id
├── name
├── nik
└── group

Production dapat memiliki:

operator1
operator2
operator3
NgDefect

Master jenis defect:

NgDefect
├── id
├── name
└── description

Contoh:

Weldline
Burn
Scratch
Overcut
Short Mold
Production

Production adalah raw production report / header transaksi.

Production
├── id
├── product_id
├── machine_id
├── operator1_id
├── operator2_id
├── operator3_id
├── uptimeMc
├── qtyOk
├── qtyWip
├── productionLot
├── createdAt
├── remark
└── defects[]

Relasi:

Production
│
├── Product
├── Machine
├── Operator 1
├── Operator 2
├── Operator 3
│
└── QtyDefect[] 6. NG Defect — Master Detail

Kita sengaja tidak membuat kolom seperti:

weldline_qty
burn_qty
scratch_qty
overcut_qty
...

Karena kalau pabrik menambahkan defect baru, database harus diubah lagi.

Kita menggunakan:

ng_defects

sebagai master.

Kemudian:

qty_defects

sebagai detail transaksi.

Contoh:

production_id = 1

## qty_defects

## ng_defect_id | qty_ng

1 | 2
2 | 3

Dengan demikian satu production dapat memiliki banyak defect.

Production
│
├── Weldline = 2
├── Burn = 3
└── Scratch = 1
Prinsip penting

Tidak perlu menyimpan defect dengan qty 0.

Kalau production tidak memiliki Scratch:

Tidak perlu:
Scratch = 0

Cukup tidak membuat row qty_defects untuk Scratch.

Ini membuat struktur lebih fleksibel dan menghindari data kosong yang tidak diperlukan.

7. DTO Architecture

Production menggunakan:

ProductionRequestDTO
ProductionResponseDTO

QtyDefectRequestDTO
QtyDefectResponseDTO
Request

Frontend tidak mengirim Entity langsung.

Contoh konsep:

{
"productId": 1,
"machineId": 2,
"operator1Id": 3,
"operator2Id": null,
"uptimeMc": 230,
"qtyOk": 500,
"qtyWip": 50,
"defects": [
{
"ngDefectId": 1,
"qtyNg": 2
}
]
}

Service kemudian mencari entity berdasarkan ID.

productId
↓
ProductRepository
↓
Products entity

Ini adalah salah satu alasan DTO penting dalam project kita.

8. Mapper

Saat ini mapper belum dibuat sebagai file terpisah.

Mapper masih berada di:

ProductionService.java

Bagian:

private ProductionResponseDTO toResponseDTO(...)

bertugas mengubah:

Production Entity
↓
ProductionResponseDTO

Sedangkan:

private void isiDataProductionDariDTO(...)

bertugas mengubah:

ProductionRequestDTO
↓
Production Entity

Untuk ukuran project sekarang masih acceptable.

Jangan refactor hanya demi membuat struktur terlihat lebih profesional.

Kalau nanti ProductionService semakin besar dan mapper mulai mengganggu readability, baru kita pindahkan ke:

mapper/
└── ProductionMapper.java 9. CRUD Status
Production
GET ✅
POST ✅
PUT ✅
DELETE ✅
Product
GET ✅
POST ✅
PUT ✅
DELETE ✅
Customer

Master CRUD sudah mulai dibuat dan repository sudah tersedia.

Machine

Master entity + repository tersedia.

Operator

Master entity + repository tersedia.

NG Defect

Master entity + repository tersedia.

QtyDefect

Digunakan sebagai detail Production.

10. Pagination

Production GET menggunakan:

GET /api/production?page=0&jumlah=10

Konsep:

PageRequest.of(halamanKe, jumlahData)

Response menggunakan:

Page<ProductionResponseDTO>

Pagination diperlukan karena data production nantinya dapat menjadi sangat banyak.

11. Exception Handling

Sudah terdapat:

exception/
└── GlobalExceptionHandler.java

Tujuan:

Daripada error seperti:

RuntimeException
Spring stack trace
Hibernate information
...

API memberikan response sederhana.

Contoh:

{
"message": "Product tidak ditemukan"
} 12. Production Calculation

Beberapa parameter penting berasal dari Product:

Cycle Time
Cavity
Take Time

Data ini akan digunakan untuk kebutuhan:

Production Rate
Target
Uptime
Performance
Summary
Dashboard

Karena frontend React akan membutuhkan data tersebut, ProductionResponseDTO harus menyediakan Cycle Time dan Take Time dari Product terkait.

13. Flow Production

Flow POST:

React
│
│ POST ProductionRequestDTO
▼
ProductionController
│
▼
ProductionService
│
├── cari Product
├── cari Machine
├── cari Operator
├── cari NG Defect
│
▼
Production Entity
│
├── Production
│ └── QtyDefect[]
│
▼
ProductionRepository
│
▼
PostgreSQL

Flow GET:

React
│
▼
ProductionController
│
▼
ProductionService
│
▼
ProductionRepository
│
▼
Production Entity
│
▼
toResponseDTO()
│
▼
ProductionResponseDTO
│
▼
React 14. Prinsip Development Project

Ini bagian yang menurutku paling penting untuk kamu simpan.

AI digunakan sebagai mentor, assistant, dan akselerator — bukan sebagai pengganti pemahaman programmer.

Project ini dibangun dengan prinsip:

User menentukan:

- kebutuhan
- alur bisnis
- struktur data
- keputusan fitur

AI membantu:

- menjelaskan konsep
- memberi alternatif desain
- membantu implementasi
- debugging
- review kode

Tujuannya bukan sekadar:

"Aplikasi berhasil jalan."

Tetapi:

"Saya memahami mengapa aplikasi ini berjalan."
