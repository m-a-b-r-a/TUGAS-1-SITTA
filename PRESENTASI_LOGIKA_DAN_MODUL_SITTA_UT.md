# DOKUMEN PRESENTASI SISTEM DAN LOGIKA MODUL
# SISTEM INFORMASI TIRAS DAN TRANSAKSI BAHAN AJAR (SITTA) UNIVERSITAS TERBUKA

---

## 1. PENGANTAR ARSITEKTUR & DESAIN SISTEM

### 1.1 Latar Belakang dan Tujuan Sistem
Sistem Informasi Tiras dan Transaksi Bahan Ajar (SITTA) Universitas Terbuka dirancang untuk memfasilitasi unit kerja UPBJJ-UT Daerah dan Pusat Pengelolaan Bahan Ajar (Puslaba) dalam mengendalikan persediaan Buku Materi Pokok (BMP) serta memantau distribusi pengiriman Delivery Order (DO) ke mahasiswa secara terpadu, transparan, dan reaktif.

### 1.2 Landasan Teknologi
- **Framework UI**: Vue.js 3 Standalone Reactive Runtime (berjalan mandiri di sisi peramban tanpa memerlukan runtime compiler tambahan).
- **Arsitektur Data**: Single Source of Truth melalui modul data master terisolasi `js/dataBahanAjar.js`.
- **Desain & Identitas Visual**: Standar resmi Universitas Terbuka dengan palet warna Deep Navy (`#003B73`), UT Gold/Yellow (`#F5A623`), Emerald Green (`#059669`), Amber (`#D97706`), dan Rose Red (`#DC2626`).
- **Prinsip Estetika**: Zero-Emoji Discipline. Seluruh representasi status menggunakan badge semantik, shape visual (dot indicator), dan tipografi hierarkis sans-serif profesional (`Inter`).

---

## 2. STRUKTUR APLIKASI DAN ALIRAN DATA GLOBAL

```
┌────────────────────────────────────────────────────────┐
│             js/dataBahanAjar.js (Master Data)          │
│  - upbjjList               - paketList                 │
│  - kategoriPerUpbjj        - pengirimanList            │
│  - dataStokBahanAjar       - dataTrackingDO            │
└───────────────┬────────────────────────┬───────────────┘
                │                        │
       ┌────────┴────────┐      ┌────────┴────────┐
       ▼                 ▼      ▼                 ▼
 ┌───────────┐     ┌───────────┐  ┌───────────┐
 │index.html │     │ stok.html │  │tracking.  │
 │(Dashboard │     │ (Tiras &  │  │   html    │
 │  Portal)  │     │   Stok)   │  │ (Logistik)│
 └─────┬─────┘     └─────┬─────┘  └─────┬─────┘
       │                 │              │
       ▼                 ▼              ▼
js/dashboard-app.js js/stok-app.js js/tracking-app.js
(Vue Instance 1)   (Vue Instance 2)(Vue Instance 3)
```

---

## 3. PRESENTASI HALAMAN DEMI HALAMAN & MODUL DEMI MODUL

---

### HALAMAN 1: PORTAL BERANDA & DASHBOARD EKSEKUTIF (`index.html`)

Halaman Beranda Portal berfungsi sebagai pusat kendali (*command center*) yang menyajikan visualisasi data analitik tingkat tinggi (*high-level executive analytics*) persediaan bahan ajar nasional dan progres ekspedisi pengiriman sebelum operator masuk ke modul kerja spesifik.

#### Modul 1.1: Header Institusi & Navigasi Terpadu
- **Fungsi**: Mempertegas identitas korporat Universitas Terbuka dan menyediakan navigasi cepat ke seluruh modul kerja.
- **Komponen Visual**: Baris identitas institusi pada bilah atas (*topbar*), badge logo akronim "UT", judul sistem "SITTA UT", dan menu tautan (`Beranda Portal`, `Stok Bahan Ajar`, `Tracking Pengiriman DO`).
- **Logika**: Menggunakan tautan navigasi standar dengan penandaan kelas `.active` pada halaman yang sedang dibuka untuk memberikan kejelasan orientasi pengguna (*user spatial orientation*).

#### Modul 1.2: Portal Hero Section & Call-to-Action
- **Fungsi**: Menyambut operator sistem dengan ringkasan misi operasional dan dua tombol aksi langsung (*Direct Access Actions*).
- **Logika**: Gradien latar belakang bergaya resmi institusi dengan sudut pencahayaan radial lembut. Tautan tombol langsung mengarahkan operator ke `stok.html` atau `tracking.html`.

#### Modul 1.3: Executive Key Performance Indicators (KPI) Metric Cards
- **Lokasi State**: Di-mount oleh instance Vue `#dashboard-portal-app` pada berkas `js/dashboard-app.js`.
- **Logika Perhitungan (`computed: kpi`)**:
  - `totalEksemplar`: Mengakumulasi field `qty` dari seluruh array modul bahan ajar menggunakan `reduce()`.
  - `totalJudul`: Menghitung total entri buku unik pada katalog (`stokList.length`).
  - `totalDO`: Menghitung total surat jalan pengiriman yang diterbitkan (`trackingList.length`).
  - `modulButuhPerhatian`: Mengakumulasi jumlah buku yang berstatus `Menipis` (`qty < safety && qty > 0`) dan `Kosong` (`qty === 0`).
- **Manfaat Bisnis**: Memberikan indikasi seketika kepada pimpinan UPBJJ mengenai beban tiras fisik dan potensi defisit buku tanpa harus meneliti tabel baris per baris.

#### Modul 1.4: Grafik Stok Tiras per Lokasi UPBJJ (Interactive Bar Chart)
- **Komponen Visual**: Diagram batang horizontal proporsional untuk 6 wilayah UPBJJ: Jakarta, Bandung, Surabaya, Makassar, Malang, dan Medan.
- **Logika Perhitungan (`computed: stokPerUpbjj`)**:
  - Algoritma melakukan iterasi atas `upbjjList`.
  - Untuk setiap wilayah, dilakukan pemfilteran `stokList.filter(i => i.upbjj === region)` untuk menjumlahkan eksemplar fisik.
  - Nilai maksimum (`maxQty`) dicari secara dinamis, dan lebar visual batang dihitung menggunakan persentase: `(regionQty / maxQty) * 100`.
  - Binding reaktif dilakukan pada CSS inline `:style="{ width: item.barWidth + '%' }"`.
- **Interaksi**: Saat terjadi penambahan data baru di sistem tiras, diagram batang ini secara otomatis menyesuaikan skalanya tanpa intervensi manual.

#### Modul 1.5: Komposisi Status Ketersediaan Tiras & Progres Logistik DO
- **Komponen Visual**: Bilah kemajuan segmental (*segmented progress bars*) multi-warna dengan indikator legend status.
- **Logika Perhitungan**:
  - **Segmen Tiras**: Menampilkan rasio persentase buku berkategori Aman (hijau `#059669`), Menipis (kuning amber `#D97706`), dan Kosong (merah `#DC2626`).
  - **Segmen Logistik DO**: Menampilkan rasio persentase pesanan yang Berhasil Terkirim (hijau), Sedang dalam Perjalanan Kurir (biru `#0284C7`), dan Masih Diproses di Gudang (abu-abu `#94A3B8`).
- **Logika UI**: Perhitungan persentase menggunakan pembulatan matematis `Math.round((count / total) * 100)`. Jika pembagi 0, sistem menerapkan nilai aman *fallback* 0% untuk mencegah `NaN`.

#### Modul 1.6: Navigasi Kartu Dua Modul Utama
- **Komponen Visual**: Dua kartu modul fungsional (*Stok Bahan Ajar* dan *Tracking Pengiriman DO*) dengan aksen warna pembeda (Navy dan Amber).
- **Logika**: Menyajikan daftar rincian kapabilitas dari tiap modul kerja sehingga operator memahami batasan tanggung jawab fungsional masing-masing halaman.

#### Modul 1.7: Snapshot Monitoring Aktivitas Pengiriman Terkini
- **Komponen Visual**: Tabel transaksi responsif yang menampilkan 4 pengiriman paket kurikulum terbaru.
- **Logika (`computed: recentDeliveries`)**: Mengambil potongan transaksi teratas menggunakan `trackingList.slice(0, 4)`. Menampilkan status paket dengan badge penanda warna dan pemformatan nilai mata uang rupiah melalui method `formatRupiah()`.

---

### HALAMAN 2: MANAJEMEN DAN PENGENDALIAN STOK BAHAN AJAR (`stok.html`)

Halaman ini menangani operasi operasional harian tiras: pencatatan inventaris, penyaringan multi-parameter berantai (*cascading*), pengawasan ambang batas kritis, pembaruan stok via modal dialog, dan registrasi judul baru.

#### Modul 2.1: Inisialisasi Instance Vue & Reactive State Repository
- **Lokasi Berkas**: `js/stok-app.js`
- **Konstruksi State (`data()`)**:
  ```javascript
  stokList: [...dataStokBahanAjar], // Kloning reaktif
  upbjjList: ['Jakarta', 'Bandung', 'Surabaya', 'Makassar', 'Malang', 'Medan'],
  selectedUpbjj: 'Semua UT-Daerah',
  selectedKategori: 'Semua Kategori',
  sortBy: 'judul',
  sortOrder: 'asc',
  filterReorderOnly: false,
  searchQuery: '',
  isEditModalOpen: false,
  isAddModalOpen: false,
  editForm: { kode: '', judul: '', upbjj: '', qty: 0, safety: 0, lokasiRak: '', harga: 0 },
  newForm: { kode: '', judul: '', upbjj: '', kategori: '', qty: 0, safety: 0, lokasiRak: '', harga: 0 }
  ```

#### Modul 2.2: Banner Ringkasan & Dynamic Inventory Metric Cards
- **Komponen Visual**: Empat kartu ringkasan di atas tabel persediaan.
- **Logika (`computed: summaryStats`)**:
  - `total`: Panjang array `stokList.length`.
  - `aman`: Jumlah item dengan kondisi `item.qty >= item.safety && item.qty > 0`.
  - `menipis`: Jumlah item dengan kondisi `item.qty < item.safety && item.qty > 0`.
  - `kosong`: Jumlah item dengan kondisi `item.qty === 0`.
- **Reaktivitas**: Begitu operator mengedit kuantitas stok di baris tabel mana pun, kartu ringkasan langsung memperbarui nilainya secara real-time.

#### Modul 2.3: Dependent Cascading Filter (Hubungan Hierarkis Wilayah ke Kategori)
- **Komponen Visual**: Dua kontrol dropdown yang saling terkait: `#filter-upbjj` dan `#filter-kategori`.
- **Logika Bisnis**: Kategori mata kuliah yang tersedia di sebuah wilayah UPBJJ bersifat unik tergantung program studi yang dibuka di cabang tersebut.
- **Logika Teknis (`computed: availableKategoriList`)**:
  ```javascript
  availableKategoriList() {
    if (this.selectedUpbjj === 'Semua UT-Daerah') {
      const allKategori = new Set(this.stokList.map(item => item.kategori));
      return Array.from(allKategori).sort();
    }
    return window.SITTA_DATA.kategoriPerUpbjj[this.selectedUpbjj] || [];
  }
  ```
- **Integrasi Watcher**: Watcher `selectedUpbjj` otomatis mereset `selectedKategori = 'Semua Kategori'` saat wilayah berganti untuk mencegah status pencarian yatim (*orphaned filter state*).

#### Modul 2.4: Multi-Criteria Filter Engine & Live Search Optimization
- **Komponen Visual**: Kotak centang "Hanya Stok Kritis & Kosong", input pencarian teks, dropdown pengurutan field (`sortBy`), dan tombol pembalik urutan (`sortOrder`).
- **Logika Algoritma (`computed: filteredStokList`)**:
  1. *Tahap 1 (Wilayah)*: Jika bukan "Semua UT-Daerah", saring `item.upbjj === selectedUpbjj`.
  2. *Tahap 2 (Kategori)*: Jika bukan "Semua Kategori", saring `item.kategori === selectedKategori`.
  3. *Tahap 3 (Reorder Alert)*: Jika `filterReorderOnly === true`, hanya loloskan item dengan `item.qty < item.safety || item.qty === 0`.
  4. *Tahap 4 (Pencarian Teks)*: Pencarian *case-insensitive* pada kode MK, judul modul, nama UPBJJ, dan kode lokasi rak.
  5. *Tahap 5 (Sorting Engine)*: Melakukan komparasi leksikografis untuk string atau numerik untuk integer (`qty`, `harga`), dikalikan modifier arah urutan (`asc` = 1, `desc` = -1).

#### Modul 2.5: Tabel Persediaan Tiras dengan Multi-Directive Rendering
- **Komponen Visual**: Tabel semantik data tiras lengkap dengan badge status warna resmi.
- **Implementasi Direktif Vue**:
  - `v-for="(item, index) in filteredStokList" :key="item.kode"`: Merender setiap baris secara efisien dengan kunci unik.
  - `v-text="item.upbjj"` dan `v-text="item.lokasiRak"`: Mengamankan rendering teks.
  - `v-html="item.catatanHTML"`: Merender catatan khusus seperti format cetak edisi baru atau catatan tiras berformat tag `<strong>` dan `<span>`.
  - **Evaluasi Status Visual Tingkat Tiga (`v-if`, `v-else-if`, `v-else`)**:
    - Status Kosong (`qty === 0`): Badge merah `.badge-status-kosong` dengan dot merah.
    - Status Menipis (`qty < safety`): Badge oranye `.badge-status-menipis` dengan dot amber.
    - Status Aman (`qty >= safety`): Badge hijau `.badge-status-aman` dengan dot emerald.

#### Modul 2.6: Modal Dialog Edit Stok Interaktif & Live Status Preview
- **Komponen Visual**: Dialog popup modal reaktif yang dipicu oleh tombol "Edit Stok".
- **Logika Operasi (`openEditModal(item)`)**:
  - Mengkloning properti item terpilih ke dalam objek `editForm` menggunakan `Object.assign({}, item)`.
  - Menghubungkan input angka secara reaktif menggunakan `v-model.number="editForm.qty"` dan `v-model.number="editForm.safety"`.
  - Menampilkan *Live Status Indicator* di dalam modal: saat operator mengetikkan angka baru, badge status di dalam modal langsung berganti seketika sebelum tombol simpan ditekan.
  - Saat tombol "Simpan Perubahan" ditekan, method `saveEditStok()` memvalidasi data, memperbarui item di memori array `stokList`, mencatat waktu pembaruan ke `catatanHTML`, menutup modal, dan memicu notifikasi toast sukses.

#### Modul 2.7: Form Registrasi Modul Baru
- **Komponen Visual**: Panel formulir collapsible yang dibuka/tutup melalui `v-show="showAddForm"`.
- **Logika Validasi (`addNewModule()`)**:
  - Memeriksa keabsahan kode MK (tidak boleh kosong dan tidak boleh duplikat dengan modul yang sudah ada).
  - Memeriksa kelengkapan judul, kategori, kuantitas stok, dan batas safety stock.
  - Modul baru disisipkan ke indeks terdepan (`stokList.unshift(newModule)`) agar langsung terlihat oleh operator.

#### Modul 2.8: Logika Pengawas (Watchers) pada Modul Stok
- **Watcher 1: Pemantau Wilayah UPBJJ (`selectedUpbjj`)**:
  - Mereset filter kategori ke status netral "Semua Kategori".
  - Memicu notifikasi sistem bahwa kategori telah disesuaikan dengan wilayah kerja yang baru dipilih.
- **Watcher 2: Deteksi Ambang Kritis Kuantitas (`editForm.qty`)**:
  - Jika kuantitas yang dimasukkan berada di bawah safety stock, sistem menampilkan pesan peringatan amber.
  - Jika kuantitas bernilai 0, sistem menampilkan pesan bahaya merah bahwa modul akan berstatus kosong.

---

### HALAMAN 3: PENERBITAN DAN TRACKING DELIVERY ORDER (`tracking.html`)

Halaman ini memproses transaksi pemesanan paket bahan ajar mahasiswa, menerbitkan nomor Delivery Order secara otomatis dan berurutan, serta menyediakan pelacakan multi-step linimasa ekspedisi secara transparan.

#### Modul 3.1: Inisialisasi Instance Vue & Model Logistik DO
- **Lokasi Berkas**: `js/tracking-app.js`
- **Konstruksi State (`data()`)**:
  - `trackingList`: Menyimpan seluruh riwayat DO (termasuk pesanan awal tahun 2025 dan pesanan aktif).
  - `paketList`: Master katalog paket bahan ajar semesteran dengan daftar modul penyusunnya.
  - `pengirimanList`: Vendor logistik terintegrasi (JNE Regular, JNE Express, Pos Indonesia, TIKI Prioritas).
  - `form`: State formulir pendaftaran DO baru (`nomorDO`, `nim`, `nama`, `ekspedisi`, `paketKode`, `tanggalKirim`, `totalBiaya`).
  - `activeDO`: Objek DO yang sedang aktif dipantau linimasanya di panel kanan.

#### Modul 3.2: Quick Search DO/NIM & Ringkasan Metrik Pengiriman
- **Komponen Visual**: Kotak pencarian cepat di bilah navigasi formulir dan 4 kartu status distribusi.
- **Logika (`cariDO()`)**:
  - Operator dapat memasukkan nomor DO lengkap atau NIM mahasiswa.
  - Sistem mencari kecocokan pada `trackingList`. Jika ditemukan, `activeDO` disetel ke objek tersebut dan layar melakukan *smooth scroll* ke area linimasa.
- **Ringkasan Status (`computed: summaryStats`)**: Menghitung jumlah total DO, paket yang berstatus 'Diproses', 'Dalam Perjalanan', dan 'Tiba di Tujuan'.

#### Modul 3.3: Generator Otomatis Nomor Urut DO (Auto Sequence Number)
- **Komponen Visual**: Kolom input nomor DO pada formulir dengan status *read-only*.
- **Logika Bisnis**: Nomor urut harus memiliki format resmi institusi: `DO` + `Tahun Berjalan` + `-` + `Nomor Urut 3 Digit` (contoh: `DO2026-001`, `DO2026-002`, dst.).
- **Logika Algoritma (`computed: nextDONumber`)**:
  ```javascript
  nextDONumber() {
    const year = new Date().getFullYear();
    const currentYearPrefix = `DO${year}-`;
    const currentYearDOs = this.trackingList.filter(item => 
      item.nomorDO && item.nomorDO.startsWith(currentYearPrefix)
    );
    const nextSequence = currentYearDOs.length + 1;
    return `${currentYearPrefix}${String(nextSequence).padStart(3, '0')}`;
  }
  ```
- **Keunggulan Sistem**: Mengeliminasi kesalahan pengetikan manual atau duplikasi nomor surat jalan oleh petugas loket.

#### Modul 3.4: Watcher Pemilihan Paket & Dynamic Package Contents Preview
- **Komponen Visual**: Dropdown pemilihan paket kurikulum dan kontainer pratinjau dinamis tepat di bawah dropdown.
- **Logika Pengawas (`watch: 'form.paketKode'`)**:
  - Setiap kali operator memilih opsi paket dari dropdown, watcher aktif mencari objek paket di `paketList`.
  - Field `form.totalBiaya` secara otomatis terisi dengan harga resmi paket tersebut.
  - Memicu notifikasi ringkas mengenai paket yang dipilih dan besaran biayanya.
- **Pratinjau Isi Paket (`v-if="selectedPaketDetails"`)**:
  - Merender kartu rincian modul Buku Materi Pokok penyusun paket: kode MK, judul modul, beban SKS, dan semester kurikulum.
  - Memberikan kepastian kepada operator bahwa paket yang dipilih sesuai dengan kurikulum mahasiswa.

#### Modul 3.5: Watcher Validasi NIM 9-Digit & Method Penerbitan DO
- **Logika Pengawas NIM (`watch: 'form.nim'`)**:
  - Memeriksa apakah input hanya terdiri dari karakter angka menggunakan regex `^\d+$`.
  - Menghitung panjang digit secara real-time. Jika kurang atau lebih dari 9 digit, teks peringatan muncul di bawah kolom input.
  - Jika tepat 9 digit angka, menampilkan label validasi berhasil berwarna hijau.
- **Logika Penyimpanan (`simpanDO()`)**:
  - Memeriksa validitas: nama mahasiswa minimal 3 karakter, ekspedisi wajib dipilih, dan paket wajib ditentukan.
  - Menetapkan nomor DO dari `nextDONumber`.
  - Menginisialisasi tahap pertama linimasa: "Order diterbitkan. Menunggu pengambilan kurir di gudang sentral UT."
  - Memasukkan DO baru ke urutan pertama (`trackingList.unshift(newDO)`), menetapkannya sebagai `activeDO`, mereset formulir, dan otomatis menaikkan nomor urut generator untuk transaksi berikutnya.

#### Modul 3.6: Riwayat Transaksi DO & Filter Status Pengiriman
- **Komponen Visual**: Tabel riwayat pengiriman lengkap dengan kontrol filter status ('Semua Status', 'Diproses', 'Dalam Perjalanan', 'Terkirim') dan pencarian kata kunci.
- **Interaktivitas Baris**:
  - Baris DO yang sedang dipilih di linimasa diberi sorotan visual border samping emas (`border-l-4 border-[#F5A623]`).
  - Setiap baris memiliki tombol aksi "Lacak Linimasa" yang memanggil `selectDO(item)`.

#### Modul 3.7: Linimasa Multi-Step Pelacakan Logistik Interaktif
- **Komponen Visual**: Panel linimasa vertikal di sebelah kanan tabel riwayat.
- **Logika Render (`v-if="activeDO"`)**:
  - Menampilkan nomor DO aktif, nama penerima, nomor resi ekspedisi, dan status terakhir.
  - Looping riwayat transit menggunakan `v-for="(step, index) in activeDO.perjalanan" :key="index"`.
  - Tiap pos perjalanan menampilkan nomor langkah (*step badge*), stempel waktu (*timestamp*), serta deskripsi pergerakan fisik barang dari gudang pengirim hingga kurir tujuan.

---

## 4. INTEGRASI DATA DAN SINKRONISASI LINTAS MODUL

1. **Konsistensi Wilayah (UPBJJ Scope)**:
   Data master wilayah UPBJJ pada `js/dataBahanAjar.js` digunakan seragam pada modul stok, chart per wilayah di dashboard portal, serta manifest logistik ekspedisi.
2. **Pencegahan Data Yatim (*Zero Orphaned Data*)**:
   Kombinasi antara *computed property* dan *watcher* menjamin bahwa tidak ada pilihan formulir atau filter yang mengarah pada data kosong atau kondisi tak terdefinisi (*undefined state*).
3. **Penyimpanan Berbasis Memori (*In-Memory Reactive Persistence*)**:
   Setiap mutasi data (tambah stok, edit kuantitas, terbitkan DO baru) bertahan selama sesi peramban berjalan dan langsung berdampak pada seluruh komponen yang bergantung padanya tanpa reload halaman.

---

## 5. PANDUAN LANGKAH DEMI LANGKAH PRESENTASI LIVE DEMO

Saat melakukan demonstrasi di hadapan pimpinan atau penguji, lakukan tahapan berikut secara berurutan:

1. **Demonstrasi Halaman 1 (Beranda Portal - `index.html`)**:
   - Tunjukkan metrik KPI eksekutif (Total Eksemplar, Katalog Judul, DO Diterbitkan, Modul Butuh Perhatian).
   - Tunjukkan **Grafik Stok Tiras per UPBJJ** dan jelaskan bagaimana panjang diagram batang dihitung secara dinamis dari data tiras aktif.
   - Tunjukkan **Komposisi Status Ketersediaan & Progres DO** dan jelaskan representasi persentasenya.
   - Klik tombol "Buka Stok Bahan Ajar" untuk berpindah ke modul pengendalian stok.

2. **Demonstrasi Halaman 2 (Manajemen Stok - `stok.html`)**:
   - **Dependent Filter**: Ubah filter wilayah ke "Bandung". Tunjukkan bahwa dropdown kategori langsung berganti menyajikan kategori yang hanya ada di wilayah Bandung. Jelaskan bahwa watcher otomatis mereset pilihan kategori agar tidak terjadi inkonsistensi.
   - **Filter Re-order**: Centang kotak "Hanya Stok Kritis & Kosong". Perhatikan bagaimana tabel menyaring buku-buku yang membutuhkan pemesanan ulang.
   - **Modal Edit & Watcher Warning**: Klik tombol "Edit Stok" pada salah satu modul. Ubah kuantitasnya menjadi `0` atau di bawah safety stock. Tunjukkan teks peringatan real-time yang muncul seketika berkat watcher kuantitas. Simpan perubahan, lalu tunjukkan bahwa kartu ringkasan di atas ikut berubah secara reaktif.
   - Klik navigasi atas "Tracking Pengiriman DO" untuk berpindah ke modul ekspedisi.

3. **Demonstrasi Halaman 3 (Tracking Pengiriman DO - `tracking.html`)**:
   - **Auto-Sequence Number**: Tunjukkan nomor DO yang sudah terisi otomatis (contoh: `DO2026-001`) dan jelaskan formula pembentukannya.
   - **Watcher Validasi NIM**: Masukkan 5 angka pada kolom NIM untuk memperlihatkan pesan peringatan bahwa NIM belum memenuhi 9 digit. Lengkapi hingga 9 digit untuk melihat label verifikasi valid.
   - **Watcher Pemilihan Paket & Pratinjau**: Pilih salah satu paket bahan ajar. Tunjukkan bahwa daftar isi buku BMP langsung muncul di bawah dropdown via `v-if`, dan kolom total biaya terisi otomatis sesuai tarif paket resmi.
   - **Penerbitan DO & Linimasa**: Klik tombol "Terbitkan Delivery Order". Tunjukkan bahwa data baru langsung muncul di baris teratas riwayat pengiriman, linimasa langsung menampilkan checkpoint awal di Gudang Pusat Tiras UT, dan nomor DO di formulir otomatis berganti ke urutan berikutnya (`DO2026-002`).

---

## 6. KESIMPULAN TEKNIS

Implementasi arsitektur berbasis Vue.js 3 pada sistem SITTA UT berhasil menghasilkan antarmuka sistem enterprise yang:
- **Deklaratif**: Seluruh perubahan antarmuka dikendalikan oleh perubahan state data, bukan manipulasi elemen DOM langsung.
- **Efisien**: Computed properties memastikan kalkulasi analitik (seperti grafik persediaan dan penomoran DO) di-*cache* dan hanya dihitung ulang saat dependensinya berubah.
- **Tahan Kesalahan (*Error-Resilient*)**: Validasi dua arah (*two-way binding*) dan fungsi pengawas (*watchers*) secara proaktif mencegah kesalahan input sebelum data disimpan ke dalam sistem.
