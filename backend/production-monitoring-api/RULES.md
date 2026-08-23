# PRODUCT REQUIREMENT DOCUMENT (PRD)
# Production Monitoring System

Version: 1.0
Status: Development
Last Updated: 2026

---

# 0. DEVELOPMENT RULES — WAJIB DIBACA

Bagian ini merupakan aturan utama dalam pengembangan Production Monitoring System.

## 0.1 Jangan Membuat Kode Redundan

**KODE TIDAK BOLEH REDUNDAN.**

Sebelum membuat function, method, service, utility, endpoint, component, atau logic baru:

1. Periksa terlebih dahulu apakah function/logic tersebut sudah ada.
2. Baca service dan utility yang berkaitan.
3. Baca alur project secara keseluruhan.
4. Pahami business flow sebelum membuat kode.
5. Gunakan kembali function yang sudah tersedia apabila fungsinya sama.
6. Jangan membuat function yang sama untuk route/endpoint yang berbeda.
7. Jangan membuat utility baru jika logic tersebut sudah tersedia di utility existing.
8. Jangan melakukan copy-paste logic hanya karena endpoint berbeda.

Contoh:

Jika sudah tersedia:

    ProductionCalculator.hitungTarget()

Maka endpoint lain yang membutuhkan target production harus menggunakan function tersebut.

JANGAN membuat:

    hitungTargetProduction()
    calculateTarget()
    calculateProductionTarget()

yang melakukan perhitungan sama.

---

# 0.2 ProductionCalculator adalah Pusat Business Logic Produksi

File:

    src/main/java/com/productionmonitoring/util/ProductionCalculator.java

merupakan pusat business logic untuk perhitungan produksi.

Business logic baru yang berkaitan dengan perhitungan Production HARUS dipertimbangkan untuk ditambahkan ke ProductionCalculator terlebih dahulu.

Jangan membuat perhitungan yang sama:

- di Controller
- di Service
- di Repository
- di DTO
- di Frontend
- di endpoint tertentu

jika logic tersebut merupakan business logic inti produksi.

Frontend hanya bertugas menampilkan hasil dan mengirim data.

Backend merupakan sumber kebenaran business logic.

---

# 0.3 Jangan Membuat Function yang Tidak Digunakan

Setiap function yang dibuat harus mempunyai alasan dan penggunaan yang jelas.

Dilarang membuat:

- helper yang tidak digunakan
- service method yang tidak dipanggil
- endpoint yang tidak digunakan
- utility yang tidak digunakan
- DTO field yang tidak memiliki kebutuhan
- repository query method yang tidak digunakan

Jika ditemukan function yang tidak digunakan:

1. Beritahu terlebih dahulu.
2. Jelaskan lokasi dan fungsinya.
3. Tentukan apakah memang dibutuhkan.
4. Jika tidak dibutuhkan, hapus.

Jangan membiarkan dead code menumpuk.

---

# 0.4 Selalu Baca Business Flow Sebelum Coding

Sebelum melakukan perubahan:

    Controller
        ↓
    Service
        ↓
    Repository
        ↓
    Entity / Database

dan jika berkaitan dengan produksi:

    Production
        ↓
    Product
        ↓
    Machine
        ↓
    Operator
        ↓
    Defect
        ↓
    ProductionCalculator
        ↓
    Result / Dashboard

harus dipahami terlebih dahulu.

Jangan melakukan perubahan hanya berdasarkan satu file.

---

# 0.5 Refactor Besar Wajib Diberitahukan

Jika perubahan yang diminta berpotensi mempengaruhi banyak bagian sistem, wajib memberitahu user sebelum melakukan perubahan.

Contoh refactor besar:

- perubahan struktur database
- perubahan relationship entity
- perubahan tipe data master
- perubahan API response
- perubahan pagination
- perubahan business logic
- perubahan formula produksi
- perubahan struktur DTO
- perubahan endpoint yang digunakan frontend
- perubahan authentication/authorization
- perubahan arsitektur project

Format informasi:

    ⚠️ REFACTOR BESAR

    Perubahan:
    ...

    File yang terdampak:
    ...

    Risiko:
    ...

    Alasan:
    ...

Jangan melakukan refactor besar secara diam-diam.

---

# 0.6 Jangan Membuat Endpoint Baru Jika Endpoint Existing Bisa Digunakan

Sebelum membuat endpoint:

    GET /api/...

periksa terlebih dahulu endpoint existing.

Jika endpoint existing dapat dikembangkan tanpa merusak consumer yang sudah ada, prioritaskan pengembangan endpoint tersebut.

Jika endpoint existing digunakan oleh frontend untuk kebutuhan lain, jangan sembarangan mengubah response-nya.

Periksa terlebih dahulu seluruh consumer endpoint.

---

# 0.7 Jangan Mengubah API Tanpa Mengecek Frontend

Perubahan pada:

- response JSON
- nama field
- pagination
- endpoint
- parameter
- tipe data

harus dicek terhadap frontend.

Contoh:

Jika endpoint sebelumnya mengembalikan:

    List<ProductResponseDTO>

jangan langsung mengubah menjadi:

    Page<ProductResponseDTO>

sebelum memeriksa seluruh frontend yang menggunakan endpoint tersebut.

---

# 0.8 Backend adalah Source of Truth

Frontend tidak boleh menjadi sumber utama business logic.

Frontend boleh melakukan:

- validasi UI
- formatting
- filtering untuk kebutuhan tampilan
- state management

Tetapi business calculation utama harus berasal dari backend.

---