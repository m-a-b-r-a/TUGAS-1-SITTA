# LAPORAN DAN PANDUAN IMPLEMENTASI TUGAS PRAKTIK 2
## SISTEM INFORMASI TIRAS DAN TRANSAKSI BAHAN AJAR (SITTA) UNIVERSITAS TERBUKA
**Framework:** Vue.js (Standalone Runtime / Tanpa SFC Compiler)  
**Institusi:** Universitas Terbuka  
**Fokus:** Front-End Interaktif Berbasis Vue.js, Data Binding, Computed, Watchers, dan Organisasi Kode

---

## 1. PENDAHULUAN DAN TUJUAN

Tugas Praktik 2 ini bertujuan agar mahasiswa mampu mengimplementasikan konsep sistem pengorganisasian kode JavaScript Framework Vue.js untuk membangun antarmuka dan alur interaktif aplikasi pemesanan serta distribusi bahan ajar SITTA UT. Data dummy dibaca dari berkas JavaScript eksternal (`js/dataBahanAjar.js`) tanpa database backend, dengan implementasi komponen reaktif Vue murni.

---

## 2. PEMETAAN 5 INDIKATOR CAPAIAN HASIL BELAJAR

Aplikasi ini dirancang dengan kepatuhan penuh terhadap 5 Indikator Capaian Belajar Tugas Praktik 2:

### Indikator 1: Sistem Pengorganisasian Kode Javascript Framework Vue.js
* **Pemisahan Sumber Data:** Data dummy disimpan di berkas terpisah `js/dataBahanAjar.js` yang mengekspor variabel `upbjjList`, `kategoriList`, `kategoriPerUpbjj`, `pengirimanList`, `paketList`, `dataStokBahanAjar`, dan `dataTrackingDO`.
* **Pemisahan Logika Vue:** Logika aplikasi dipisahkan menjadi dua instansiasi Vue yang bersih dan terisolasi:
  * `js/stok-app.js` untuk mengelola inventaris, tiras, filter, dan modal edit bahan ajar.
  * `js/tracking-app.js` untuk mengelola penerbitan Delivery Order (DO) berurutan, pratinjau isi paket kurikulum, dan pelacakan linimasa.
* **Markup Semantik & Eksternal Stylesheet:** Struktur dokumen HTML menggunakan elemen semantik (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) dengan aturan gaya seragam di `css/style.css` tanpa inline style acak.

### Indikator 2: Fungsi untuk Menampilkan Data (Mustaches, v-text, v-html)
* **Mustaches (`{{ }}`):**
  * Menampilkan kode mata kuliah: `{{ item.kode }}`
  * Menampilkan judul bahan ajar: `{{ item.judul }}`
  * Menampilkan kuantitas stok & safety stock: `{{ item.qty }}` dan `{{ item.safety }}`
  * Menampilkan hasil kalkulasi mata uang: `{{ formatRupiah(item.harga) }}`
  * Menampilkan nomor DO terbitan: `{{ doItem.nomorDO }}`
* **Direktif `v-text`:**
  * Menampilkan kategori modul: `<span v-text="item.kategori"></span>`
  * Menampilkan nama UT-Daerah: `<span v-text="item.upbjj"></span>`
  * Menampilkan lokasi rak gudang: `<span v-text="item.lokasiRak"></span>`
  * Menampilkan ekspedisi kurir: `<span v-text="doItem.ekspedisi"></span>`
* **Direktif `v-html` (Khusus Catatan HTML):**
  * Pada kolom catatan tiras di `stok.html`: `<div v-html="item.catatanHTML"></div>`
  * Me-render konten HTML seperti tag `<strong>`, `<span class="text-red-700 font-bold">`, dan penanda revisi edisi secara aman.

### Indikator 3: Fungsi Kondisional / Pengandaian (v-if, v-else-if, v-else, v-show)
* **Logika Status Ketersediaan Stok Bahan Ajar:**
  ```html
  <span v-if="item.qty === 0" class="badge-status-kosong">
    <span class="status-dot-red"></span> Kosong
  </span>
  <span v-else-if="item.qty < item.safety" class="badge-status-menipis">
    <span class="status-dot-yellow"></span> Menipis
  </span>
  <span v-else class="badge-status-aman">
    <span class="status-dot-green"></span> Aman
  </span>
  ```
* **Pratinjau Isi Paket Bahan Ajar Tepat di Bawah Dropdown:**
  * Pada `tracking.html`: Kontainer `<div v-if="selectedPaketDetails" class="package-detail-card">` hanya muncul saat paket dipilih, menampilkan seluruh rincian modul BMP di dalamnya.
* **Tampilan Kosong (Empty State):**
  * `<div v-if="filteredStokList.length === 0">` menampilkan pesan instruktif saat filter tidak menghasilkan data.
* **Direktif `v-show`:**
  * Menampilkan formulir pendaftaran bahan ajar baru: `<section v-show="showAddForm">`
  * Validasi error per field: `<span v-if="addErrors.kode" class="form-field-error">`

### Indikator 4: Data Binding, Computed Properties, & Methods
* **Two-Way Data Binding (`v-model`):**
  * Form input teks, angka (`v-model.number`), select box, checkbox, dan date picker.
* **One-Way Data Binding (`v-bind` / `:`):**
  * Binding kelas dinamis: `:class="['form-input', { 'input-invalid': addErrors.kode }]"`
  * Binding status tombol dan nilai readonly: `:value="nextDONumber"`
* **Computed Properties (Dengan Caching Reaktif):**
  * `availableKategoriList`: Menghasilkan daftar opsi kategori dependent sesuai UT-Daerah yang sedang dipilih.
  * `filteredStokList`: Menggabungkan filter UT-Daerah, filter kategori, toggle reorder, pencarian teks, dan pengurutan (sorting) tanpa kalkulasi ulang jika dependency tidak berubah.
  * `nextDONumber`: Mengotomasi penomoran Delivery Order dengan format `DO` + Tahun Berjalan + Urutan 3 digit (misal: `DO2025-004`).
  * `selectedPaketDetails`: Mencari objek paket lengkap dari `paketList` secara instan.
  * `summaryStats`: Menghitung ringkasan statistik total, aman, menipis, dan kosong.
* **Methods:**
  * `resetFilters()`: Mengembalikan seluruh kondisi filter ke default.
  * `openEditModal(item)` & `saveEditModal()`: Membuka dialog edit dengan kloning data dan menyimpan pembaruan.
  * `submitNewBahanAjar()` & `submitDO()`: Validasi form lengkap sebelum disimpan ke state reaktif.
  * `formatRupiah(num)`: Pemformatan nominal rupiah berstandar Indonesia.

### Indikator 5: Fungsi Pengawas (Watchers)
* **Watcher 1 (Dependent Filter Reset):**
  * Memantau properti `selectedUpbjj`. Ketika UT-Daerah berubah, watcher otomatis mereset `selectedKategori` ke `'Semua Kategori'` agar tidak terjadi inkonsistensi kategori antar-daerah.
* **Watcher 2 (Sinkronisasi Harga Paket DO):**
  * Memantau `form.paketKode`. Begitu pengguna memilih salah satu paket, watcher mencari harga paket dan mengisi `form.totalHarga` secara otomatis serta memunculkan toast konfirmasi.
* **Watcher 3 (Validasi Interaktif & Ambang Batas):**
  * Memantau panjang digit NIM `form.nim` (real-time feedback 9 digit numerik).
  * Memantau `editForm.qty` pada modal edit: memberikan peringatan dini jika nilai kuantitas yang dimasukkan berada di bawah safety stock atau bernilai 0.

---

## 3. STRUKTUR FOLDER DAN BERKAS PROYEK

```text
├── index.html                   # Beranda Portal SITTA UT (Navigasi ke Modul Tugas 2)
├── stok.html                    # Halaman 1: Stok Bahan Ajar berbasis Vue.js
├── tracking.html                # Halaman 2: Tracking Pengiriman DO berbasis Vue.js
├── css/
│   └── style.css                # Stylesheet universal (Palet Warna UT, Zero-Emoji)
├── js/
│   ├── dataBahanAjar.js         # Dummy Data: upbjjList, kategoriList, paketList, stok, DO
│   ├── stok-app.js              # Instance Vue 3 untuk Stok Bahan Ajar
│   └── tracking-app.js          # Instance Vue 3 untuk Tracking & Pemesanan DO
└── tests/
    ├── validation.test.ts       # Pengujian unit tugas 1
    └── vue-features.test.ts     # Pengujian unit integritas data & logika tugas 2
```

---

## 4. ALUR PROSES APLIKASI PER HALAMAN

### Halaman 1: Informasi Stok Bahan Ajar (`stok.html`)
1. **Inisialisasi Data:** Vue membaca data `window.dataStokBahanAjar` dari `dataBahanAjar.js`. Terdapat 10+ bahan ajar dengan kombinasi status Aman, Menipis, dan Kosong.
2. **Dependent Filter UT-Daerah ke Kategori:**
   * Pengguna memilih salah satu UT-Daerah (misal: *Bandung*).
   * Watcher mendeteksi perubahan, mereset kategori ke default, dan computed `availableKategoriList` hanya memunculkan kategori yang ada di UT Bandung (*Pendidikan dan Keguruan*, *Ekonomi dan Manajemen*, *Sains dan Teknologi*).
3. **Filter Reorder Cepat:**
   * Centang opsi *"Tampilkan Hanya Stok Kritis / Perlu Reorder"*.
   * Tabel hanya menampilkan bahan ajar dengan `qty < safety` atau `qty === 0`.
4. **Pengurutan (Sort):**
   * Pilihan urut berdasarkan Judul (A-Z/Z-A), Kuantitas Stok (Terbanyak/Tersedikit), atau Harga Satuan.
5. **Edit Stok Tiras:**
   * Klik tombol **Edit** pada baris bahan ajar.
   * Modal dialog muncul. Ubah kuantitas `qty`. Watcher modal secara reaktif menampilkan feedback jika stok yang diketik jatuh di bawah safety stock.
   * Klik **Simpan Perubahan** untuk memperbarui state secara live.
6. **Tambah Bahan Ajar Baru:**
   * Klik **+ Tambah Bahan Ajar Baru**.
   * Lengkapi kode mata kuliah, judul, UT-Daerah, kategori, lokasi rak, harga, qty, safety, dan catatan HTML.
   * Sistem memvalidasi kelengkapan data sebelum ditambahkan ke tabel.

### Halaman 2: Tracking Pengiriman DO (`tracking.html`)
1. **Nomor DO Otomatis (Auto-Sequence):**
   * Field Nomor DO bersifat *readonly* dan otomatis dihitung oleh computed `nextDONumber` (misal: `DO2025-004`).
2. **Validasi NIM & Nama:**
   * Kolom NIM diawasi oleh watcher yang menghitung panjang digit (tepat 9 digit angka).
3. **Pemilihan Paket & Rincian Isi Modul:**
   * Saat memilih Paket Bahan Ajar pada dropdown (contoh: *PAKET-SI-01 - Paket Semester 1 Sistem Informasi*), kontainer rincian modul di bawah select langsung terbuka via `v-if`.
   * Menampilkan daftar mata kuliah: `MSIM4101 Pengantar Sistem Informasi (3 SKS)`, `MKDU4110 Bahasa Indonesia (3 SKS)`, `MATA4101 Pengantar Matematika (3 SKS)`.
   * Total pembayaran otomatis diperbarui menjadi `Rp 240.000` via watcher.
4. **Penerbitan Delivery Order:**
   * Klik **Terbitkan Delivery Order Sekarang**.
   * Data masuk ke daftar riwayat DO dan langsung terpilih di panel pelacakan linimasa.
5. **Pelacakan Linimasa Interaktif:**
   * Panel samping menampilkan status pengiriman (*Diproses*, *Dalam Perjalanan*, *Tiba di Tujuan*) lengkap dengan waktu dan keterangan perpindahan kargo pos/kurir.

---

## 5. PANDUAN NASKAH VIDEO PENJELASAN (MAKSIMAL 15 MENIT)

Gunakan struktur berikut untuk mempresentasikan tugas praktik dalam rekaman video:

| Menit | Segmen Presentasi | Poin Utama yang Dijelaskan & Didemokan |
| :--- | :--- | :--- |
| **00:00 - 02:00** | **Pembukaan & Arsitektur** | Salam, perkenalan diri, NIM, pengenalan aplikasi SITTA UT, struktur file modular (`dataBahanAjar.js`, `stok-app.js`, `tracking-app.js`, `style.css`), dan penjelasan bahwa aplikasi menggunakan runtime Vue.js mandiri tanpa SFC compiler sesuai instruksi tugas. |
| **02:00 - 07:00** | **Demo Halaman Stok (`stok.html`)** | - Tunjukkan tabel data bahan ajar dengan 9 field.<br>- Jelaskan penggunaan `Mustaches`, `v-text`, dan `v-html` untuk field `catatanHTML`.<br>- Tunjukkan badge status dengan logika `v-if` (Kosong: merah), `v-else-if` (Menipis: oranye), dan `v-else` (Aman: hijau).<br>- Demokan **Dependent Filter**: pilih UT Jakarta -> tunjukkan kategori yang tersedia; lalu ganti ke UT Malang -> tunjukkan watcher mereset kategori.<br>- Demokan filter reorder & sorting judul/stok.<br>- Buka form edit stok, ubah angka stok, tunjukkan watcher modal memberi peringatan, simpan data. |
| **07:00 - 11:30** | **Demo Halaman Tracking DO (`tracking.html`)** | - Tunjukkan nomor DO otomatis (`DO2025-004`) via computed property.<br>- Ketik NIM mahasiswa (tunjukkan live feedback watcher 9 digit).<br>- Pilih paket bahan ajar -> sorot bagaimana **rincian isi modul muncul tepat di bawah dropdown** via `v-if`.<br>- Tunjukkan total pembayaran terisi otomatis via watcher.<br>- Klik terbitkan DO -> tunjukkan linimasa perjalanan kargo interaktif. |
| **11:30 - 14:00** | **Bedah Kode Sumber (5 Indikator)** | - Buka editor kode, tunjukkan blok computed properties (`availableKategoriList`, `nextDONumber`).<br>- Buka blok watchers (`watch` selectedUpbjj, `watch` form.paketKode, `watch` form.nim).<br>- Tunjukkan baris template pengkondisian `v-if`/`v-else-if`/`v-else` dan `v-html`. |
| **14:00 - 15:00** | **Penutup & Kesimpulan** | Ringkasan pemenuhan capaian belajar, ucapan terima kasih, dan salam penutup. |

---

## 6. CARA MENJALANKAN DI LOKAL

1. Pastikan Node.js terpasang pada komputer Anda.
2. Buka terminal di folder proyek ini:
   ```bash
   npm install
   ```
3. Jalankan development server:
   ```bash
   npm run dev
   ```
4. Buka peramban (browser) di alamat:
   ```text
   http://localhost:3000
   ```
5. Untuk menjalankan pengujian otomatis unit logic:
   ```bash
   npx tsx --test tests/*.test.ts
   ```
