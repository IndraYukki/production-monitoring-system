FRONTEND DEVELOPMENT RULES
Version: 1.0

Scope: Frontend Application (React, Vite, Tailwind CSS, Lucide React)

Last Updated: 2026

0. DEVELOPMENT RULES — FRONTEND MANDATE
Bagian ini merupakan aturan utama dan hukum mengikat dalam pengembangan Frontend Production Monitoring System.

0.1 Ketersediaan & Reusabilitas Kode (No Duplicate Code)
KODE DILARANG REDUNDAN DI SETIAP ROUTE, COMPONENT, ATAU SERVICE.

Sebelum membuat function, custom hook, component, service layer, atau utility baru:

Wajib audit eksistensi kode: Periksa apakah fungsi atau UI component tersebut sudah pernah dibuat di file/folder lain.

Reuse First: Jika fungsi/UI sudah ada, langsung gunakan kembali (reuse). Jika terdapat sedikit perbedaan perilaku, gunakan props/parameter konfigurasi, bukan membuat fungsi/file duplicate.

Pusat Utility & Helpers:

Semua fungsi formatting tanggal, angka, atau kalkulasi pembantu UI wajib ditaruh di folder src/utils/.

Dilarang keras menduplikasi fungsi seperti formatRupiah, formatUptime, calculateTarget, atau getTodayISO di dalam file komponen secara terisolasi.

Pusat API Services:

Komponen React dilarang melakukan panggilan axios/fetch secara langsung di dalam useEffect atau event handler.

Semua transaksi API harus melalui Service Layer di folder src/services/ (contoh: productionService.js, summaryOperatorService.js, productService.js).

Jangan membuat service method baru jika service existing bisa mengembalikan data yang sama.

0.2 Backend adalah Single Source of Truth
Frontend hanya penampil data & penangkap input UI:

Frontend tidak boleh menjadi sumber kebenaran perhitungan bisnis utama.

Kalkulasi real-time di Frontend (seperti target produksi di ShiftForm.jsx) hanya berfungsi sebagai indikator/preview visual (UI Helper), bukan pengganti kalkulasi akhir Backend.

Format Data:

Semua manipulasi data kritis (status pencapaian target, total NG, total output akhir) harus mempercayai hasil kalkulasi dari API DTO Backend.

0.3 Kebersihan Kode & Dead Code Ban
Dilarang Menumpuk Kode Mati:

Dilarang menyisakan import yang tidak digunakan (unused imports).

Dilarang meninggalkan fungsi/handler lokal yang tidak pernah dipanggil.

Dilarang menyisakan komentar berisi blok kode mati (commented-out code) setelah fitur selesai dikembangkan.

Tindakan Pembersihan:

Jika ditemukan fungsi atau komponen yang sudah tidak dipakai, konfirmasi dan langsung hapus (clean up).

0.4 Konstitusi Frontend Style & Design System
Aplikasi menggunakan pendekatan Dark Mode Industrial Aesthetic berbasis Tailwind CSS yang responsif, bersih, dan fungsional.

Palet Warna Resmi (Tailwind Config Reference)
Semua komponen wajib menggunakan variabel token warna berikut, dilarang menggunakan arbitrary color (seperti bg-[#121212]):

Background Utama: bg-background (Dark Charcoal / Industrial Matte Black)

Surface / Card Level 1: bg-card (Elevated dark surface)

Surface / Card Level 2: bg-card-secondary (Input backgrounds, hovered rows, badges)

Text Primary: text-foreground (High contrast white/off-white)

Text Muted / Subtitle: text-muted (Secondary label, non-critical texts)

Border Color: border-border (Subtle boundary separators)

Accent Color (Primary Actions): bg-accent / text-accent (Deep Blue / Violet Brand)

Info Color (Highlights & Status): bg-info / text-info (Cyan / Light Blue)

Success Color (Target Tercapai / Valid): bg-success / text-success (Emerald Green)

Warning Color (WIP / Caution): bg-warning / text-warning (Amber / Yellow)

Danger Color (NG / Tidak Target / Error): bg-danger / text-danger (Rose Red)

Aturan Tampilan & Interaksi UI
Read-Only vs Editable State:

Halaman Monitoring/Summary (seperti Operator Detail) bersifat Read-Only (hanya menampilkan data dan modal detail tanpa tombol aksi destruktif).

Halaman Input (seperti AddProduction.jsx) wajib menyediakan indikator real-time yang informatif tanpa memblokir UX operasional secara destruktif.

Keyboard Safety & Form Handling:

Setiap form wajib menerapkan pencegahan Submit otomatis via tombol Enter pada <form> (kecuali <textarea>).

Tombol eksekusi utama wajib menggunakan type="button" dengan event onClick untuk menghindari eksekusi tidak sengaja.

Cursor & Hover Standard:

Baris tabel yang dapat diklik wajib menggunakan cursor-pointer dan hover:bg-card-secondary/40 transition.

Input/Select numerik wajib menonaktifkan scroll wheel behavior (onWheel={(e) => e.currentTarget.blur()}) untuk mencegah salah ketik angka saat me-scroll halaman.

0.5 Refactor Besar & Koordinasi Breaking Changes
Setiap perubahan Frontend yang berdampak sistemik wajib diberitahukan terlebih dahulu:

Perubahan signature props pada komponen global/shared (seperti Modal, Table, Autocomplete).

Perubahan struktur state utama yang dipakai oleh banyak tab/halaman.

Perubahan routing aplikasi (react-router-dom).

Format Pemberitahuan:

Plaintext
⚠️ REFACTOR FRONTEND BESAR

Komponen/File Terdampak:
...
Alasan:
...
Dampak ke Komponen Lain:
...