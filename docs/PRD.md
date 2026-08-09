Product Requirement Document (PRD)

Production Monitoring System (PMS)
Version : 0.1 (Brainstorming & Foundation)

1. Project Overview
   Project Name
   Production Monitoring System (PMS)

Description
Production Monitoring System adalah aplikasi berbasis web yang digunakan untuk melakukan pencatatan laporan produksi harian pada perusahaan injection molding.
Sistem ini dirancang agar operator hanya perlu menginput data produksi, kemudian seluruh data tersimpan secara terstruktur di database dan dapat digunakan untuk analisis produksi pada tahap selanjutnya.
Project ini dibuat sebagai media pembelajaran React.js, Spring Boot, dan PostgreSQL sekaligus dipersiapkan agar dapat digunakan di lingkungan production di masa depan.

2. Objectives
   Tujuan utama project ini adalah:
   • Menghilangkan pencatatan manual menggunakan spreadsheet.
   • Menyimpan seluruh data produksi ke dalam database.
   • Membuat data produksi lebih rapi dan mudah dicari.
   • Menjadi fondasi untuk dashboard produksi.
   • Menjadi fondasi untuk analisis KPI produksi.

3. Target Users
   Operator Produksi
   Menginput laporan produksi.
   Leader / Supervisor
   Melihat laporan produksi.
   Administrator
   Mengelola master data.

4. Tech Stack
   Frontend
   • React.js
   Backend
   • Java Spring Boot
   Database
   • PostgreSQL

5. Design System
   Dark Theme
   Element Color
   Background #0F172A
   Card #1E293B
   Card Secondary #25344C
   Text #E4E2F0

Light Theme
Element Color
Background #E4E2F0
Card #98DFFF
Card Secondary #70CBF4
Text #0F172A

Status Colors
Success
Hijau
Warning
Orange
Danger
Merah
Info
Biru

6. Current Scope (MVP)
   Versi pertama hanya berfokus pada penyimpanan data produksi.
   Belum mencakup:
   • Stock
   • Material
   • OEE
   • Inventory
   • Purchase
   • Maintenance
   • Scheduling

7. Master Data
   Customer
   Data customer.
   Contoh:
   • Nama customer
   • Alamat
   • Nnomoor telefoon

Product
Informasi produk.
Contoh data:
• Part Number
• Part Name
• Customer
• Weight part
• Weight runner
• Cycle Time Standard
• Cavity

Operator
· Nama operator :
· Group :

NG Defect
Daftar jenis defect.
Contoh:
• Burry
• Overcut
• Dirty
• Sicoloor
• Buble
• Broken
• Blackkdot
• Shortmold
• Dented
• Shinning
• Bending
• Buram
• Weldline
• Silver
• Lain-lain

8. Transaction Data
   Production Report
   Merupakan data utama yang diinput setiap hari oleh operator.
   Data yang akan disimpan antara lain:
   • Tanggal Produksi
   • Shift
   • Mesin
   • Operator
   • target
   • Qty OK
   • Qty NG
   • Uptime
   Detail struktur database akan dirancang pada tahap berikutnya.

9. Dashboard (Future Feature)
   Data produksi yang telah tersimpan akan digunakan untuk membuat dashboard.
   Contoh KPI:
   • Production Rate
   • NG Rate
   • Operator Performance
   • Machine Uptime
   • Pareto NG
   • Trend Produksi
   • Trend Defect
   Dashboard belum menjadi fokus pada versi pertama.

10. Development Strategy
    Project dikembangkan secara bertahap.
    Phase 1
    Brainstorming

Phase 2
PRD

Phase 3
Database Design

Phase 4
Backend API

Phase 5
Frontend

Phase 6
Dashboard

Phase 7
Deployment

11. Development Philosophy
    Project ini mengutamakan:
    • Mudah dipahami.
    • Bertahap.
    • Tidak over engineering.
    • Fokus pada fondasi yang kuat.
    • Mudah dikembangkan di masa depan.
    Versi awal tidak bertujuan menjadi sistem yang sempurna, tetapi menjadi dasar yang stabil untuk pengembangan berikutnya.

12. Current Status
    Status saat ini:
    ✅ Brainstorming selesai.
    ✅ Konsep aplikasi selesai.
    ✅ Tech Stack ditentukan.
    ✅ Design System ditentukan.
    ⏳ Menunggu perancangan database.
    ⏳ Menunggu desain ERD.
    ⏳ Menunggu implementasi backend.
    ⏳ Menunggu implementasi frontend.
