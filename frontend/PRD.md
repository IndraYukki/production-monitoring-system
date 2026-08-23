PRODUCT REQUIREMENT DOCUMENT (PRD)
1. Executive Summary
Production Monitoring System (Frontend) adalah aplikasi berbasis web interaktif yang dirancang untuk memantau, mencatat, dan menganalisis performa transaksi produksi di pabrik manufaktur injection molding secara real-time. Aplikasi ini berfokus pada kecepatan input operator, kejelasan visualisasi target vs output, serta kemudahan monitoring pencapaian produksi harian.

2. Target User & Role UI
Operator Produksi / Admin Input: Membutuhkan antarmuka yang efisien, responsif, dan aman dari kesalahan input (mencegah accidental submit) untuk memasukkan data log shift.

Supervisor / Manager / Leadership: Membutuhkan dasbor monitoring read-only yang dapat memantau KPI pencapaian target, total NG, uptime mesin, dan histori transaksi per operator secara presisi tanpa risiko mengubah data secara tidak sengaja.

3. Scope & Feature Requirements
3.1 Module Input Produksi (AddProduction)
Production Information:

Pengisian tanggal lot produksi (productionLot).

Autocomplete pencarian produk (PartNoAutocomplete) yang menampilkan informasi preview produk (Part Name, Customer, Cycle Time, Take Time, Cavity).

Autocomplete mesin (MachineAutocomplete).

Shift Input Forms (Shift 1, Shift 2, Shift 3):

Pencarian Autocomplete untuk 3 Operator per shift.

Input Jam (Max 8) & Menit (Max 59) Uptime Mesin.

Input kuantitas output OK dan WIP.

Input kuantitas NG Defect terperinci berdasarkan master defect.

Input Catatan / Remark Shift.

Real-time Target Preview (UI Helper):

Menampilkan kalkulasi otomatis Target Output berdasarkan formula mesin (WIP vs Non-WIP) saat jam/menit diisi.

Display Badge Real-time: ✓ Tercapai (Hijau) vs ✕ Tidak Target (Merah) sebagai panduan visual agar user mengisi Remark alasan jika tidak target.

Form Safety Constraint:

Pemblokiran tombol Enter pada input form untuk mencegah pengiriman data secara tidak sengaja oleh operator atau barcode scanner.

Tombol submit menggunakan kontrol type="button" berbasis interaksi klik.

3.2 Module Operator Performance Summary (OperatorSummaryPage & OperatorDetailPage)
Operator Summary Dashboard (Page 1):

Filter rentang tanggal (tanggalMulai s/d tanggalSelesai).

Tabel ringkasan statistik performa seluruh operator.

Navigasi ke detail log operator dengan membawa state filter tanggal.

Operator Detail & Log Transaksi (Page 2 - Read Only):

Visualisasi KTA Cards (7 Indikator Utama KPI Operator).

Tabel transaksi log produksi lengkap dengan fitur server-side pagination & sorting.

Interactive Read-Only Log Modal (ProductionDetailModal):

Klik pada baris tabel akan membuka pop-up rincian lengkap transaksi.

Menampilkan data lengkap: Info Produk, Customer, Operator 1–3, Uptime, Breakdown Output OK/WIP/NG, Status Pencapaian, Daftar NG Defect, dan Catatan Remark.

Murni bersifat monitoring read-only (tanpa fitur edit/delete pada modul summary).

4. Technical Architecture & Tech Stack
Framework: React.js (Vite)

Routing: react-router-dom (v6+)

Styling & UI Engine: Tailwind CSS

Iconography: lucide-react

HTTP Client / Service Layer: Axios via Centralized Service Layer (src/services/)

5. Non-Functional Requirements
Performance: Waktu rendering awal aplikasi < 1.5 detik; transisi antar-halaman mulus (client-side routing).

UX Resilience: Mengamankan masukan formulir dari human error (seperti melarang scroll mouse pada input angka dan mencegah accidental submit tombol Enter).

Consistency: Mengikuti ketaatan warna dan tata letak sesuai yang telah didefinisikan pada FRONTEND DEVELOPMENT RULES.