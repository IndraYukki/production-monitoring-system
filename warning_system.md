● Berikut peta lengkapnya — silakan disalin ke warning system Anda.

  ✅ Sudah ditangani (dari diskusi memori/OOM itu)

  ┌─────┬───────────────────────────────────────────────────────────────────────┬───────────────────────────────────┐
  │  #  │                                 Item                                  │              Status               │
  ├─────┼───────────────────────────────────────────────────────────────────────┼───────────────────────────────────┤
  │ 1   │ Overflow Integer → Long di DTO monitoring + akumulator service        │ ✅ Selesai                        │
  ├─────┼───────────────────────────────────────────────────────────────────────┼───────────────────────────────────┤
  │ 2   │ Versi A — agregasi SUM() di database untuk 3 endpoint summary (cards, │ ✅  Selesai                        │
  │     │  list, detail cards)                                                  │                                   │
  ├─────┼───────────────────────────────────────────────────────────────────────┼───────────────────────────────────┤
  │ 3   │ N+1 defect 400rb query di endpoint summary                            │ ✅  Hilang (ikut terselesaikan     │
  │     │                                                                       │ oleh no. 2)                       │
  ├─────┼───────────────────────────────────────────────────────────────────────┼───────────────────────────────────┤
  │ 4   │ show-sql=false                                                        │ ✅ Selesai                        │
  ├─────┼───────────────────────────────────────────────────────────────────────┼───────────────────────────────────┤
  │ 5   │ Persentase desimal (achieve + NG rate) & createdAt di modal           │ ✅  Selesai (bonus dari sesi ini)  │
  └─────┴───────────────────────────────────────────────────────────────────────┴───────────────────────────────────┘

  Konsekuensinya: tabel "Nasib dengan heap 2 GB" yang dulu itu tidak berlaku lagi untuk endpoint summary — tidak ada
  entity yang dimuat ke Java. Aman dari OOM.

  ⚠️ Belum ditangani (kandidat warning system)

  #: 1
  Item: Heap JVM -Xmx3g belum diset
  Dampak kalau dibiarkan: Plafon default 2 GB tetap berlaku — pengaman penting walau summary sudah aman
  Catatan: Set di VM options IntelliJ / perintah run. Bukan kode, tapi wajib ada di daftar
  ────────────────────────────────────────
  #: 2
  Item: Excel export masih memuat seluruh entity ke memori (findAll(specification) tanpa batas)
  Dampak kalau dibiarkan: Export rentang besar (3+ bulan) bisa OOM — ini satu-satunya sisa risiko memori yang masih
  nyata
  Catatan: Summary aman, tapi export belum dioptimalkan. Bisa diredam dengan batas rentang atau streaming
  ────────────────────────────────────────
  #: 3
  Item: Versi B — GROUP BY menggantikan loop ±60 query ringan di list operator
  Dampak kalau dibiarkan: Mulai terasa lambat kalau jumlah operator tumbuh ke ratusan
  Catatan: Ditunda atas keputusan Anda — wajar ditunda
  ────────────────────────────────────────
  #: 4
  Item: Detail logs: lazy defect per halaman (±10–50 query per halaman)
  Dampak kalau dibiarkan: Kecil, tapi bisa dioptimalkan dengan hibernate.default_batch_fetch_size
  Catatan: Opsional
  ────────────────────────────────────────
  #: 5
  Item: Aturan "tidak target ⇒ remark wajib" di backend
  Dampak kalau dibiarkan: Belum ada enforcement
  Catatan: Keputusan auto-fill vs reject belum dibuat
  ────────────────────────────────────────
  #: 6
  Item: MACHINES / NG_DEFECTS hardcode di FE
  Dampak kalau dibiarkan: Tambah mesin/defect baru di DB tidak muncul di form
  Catatan: Belum diputuskan (trade-off API mati → dropdown kosong)
  ────────────────────────────────────────
  #: 7
  Item: Header backend/RULES.md masih diawali "PRODUCT REQUIREMENT DOCUMENT (PRD)"
  Dampak kalau dibiarkan: Kosmetik
  Catatan: Bisa dibereskan kapan saja

  Urutan prioritas yang saya sarankan untuk warning system Anda

  1. -Xmx3g — paling murah, pengaman global (dan catat di README sudah ada instruksinya).
  2. Batas rentang Excel export — satu-satunya sisa risiko OOM nyata.
  3. Sisanya (Versi B, batch fetch, remark rule) — biarkan di "nanti".

  Kalau mau, daftar ini bisa langsung saya sinkronkan ke CLAUDE.md bagian C supaya AI berikutnya membaca status yang
  sama persis. Bilang saja.