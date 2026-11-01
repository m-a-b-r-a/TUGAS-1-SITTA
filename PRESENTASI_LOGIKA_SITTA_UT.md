# NASKAH & MATERI PRESENTASI TEKNIS: SISTEM INFORMASI TIRAS DAN TRANSAKSI BAHAN AJAR (SITTA UT)
## TUGAS PRAKTIK 2: IMPLEMENTASI FRAMEWORK VUE.JS
**Program Studi Sistem Informasi / Ilmu Komputer - Universitas Terbuka**

---

## DAFTAR ISI PRESENTASI
1. **PENGANTAR & ARSITEKTUR KESELURUHAN SISTEM**
2. **HALAMAN 1: PORTAL BERANDA & GATEWAY SISTEM (`index.html`)**
   - Modul 1.1: Header & Brand Identity UT
   - Modul 1.2: Hero Section & Penjelasan Capaian Pembelajaran
   - Modul 1.3: Kartu Navigasi Dua Modul Utama
   - Modul 1.4: Panel Matriks Pemenuhan 5 Indikator Tugas Praktik 2
   - Modul 1.5: Quick Guide Pengujian Interaktif
3. **HALAMAN 2: MANAJEMEN & PENGENDALIAN STOK BAHAN AJAR (`stok.html`)**
   - Modul 2.1: Inisialisasi Instance Vue & Data Source (`js/stok-app.js` & `js/dataBahanAjar.js`)
   - Modul 2.2: Ringkasan Metrik Kartu Tiras (Reactive Summary Cards)
   - Modul 2.3: Kontrol Filter & Pengurutan Berantai (Dependent Cascading Filter)
   - Modul 2.4: Checkbox Filter Reorder & Pencarian Live
   - Modul 2.5: Tabel Data Stok Reaktif dengan Direktif Vue (`v-text`, `v-html`, `v-if`, `v-for`)
   - Modul 2.6: Modal Dialog Edit Stok Reaktif & Form Tambah Modul Baru
   - Modul 2.7: Logika Pengawas (Watchers) Deteksi Ambang Batas Stok
4. **HALAMAN 3: PENERBITAN & TRACKING PENGIRIMAN DELIVERY ORDER (`tracking.html`)**
   - Modul 3.1: Inisialisasi Instance Vue & Model State Pengiriman (`js/tracking-app.js`)
   - Modul 3.2: Pencarian Cepat DO & Panel Statistik Pengiriman
   - Modul 3.3: Formulir Penerbitan Delivery Order Baru (Auto Sequence Number)
   - Modul 3.4: Watcher Pemilihan Paket & Dynamic Package Preview
   - Modul 3.5: Validasi Input NIM Mahasiswa & Biaya Otomatis
   - Modul 3.6: Riwayat Daftar DO & Filter Status Pengiriman
   - Modul 3.7: Linimasa Pelacakan Paket Dinamis (Multi-Step Timeline Rendering)
5. **KESIMPULAN & TANYA JAWAB TEKNIS**

---

## 1. PENGANTAR & ARSITEKTUR KESELURUHAN SISTEM

### Konsep Desain & Standar Industri
Sistem ini dibangun dengan memadukan standarisasi UI akademik modern Universitas Terbuka (*Deep Navy Blue `#003B73`*, *UT Yellow/Gold `#F5A623`*, dan aksen status fungsional *Emerald Green `#059669`*, *Amber `#D97706`*, dan *Rose Red `#DC2626`*). Desain menerapkan prinsip **Zero-Emoji Discipline**, tipografi hierarkis berbasis sans-serif profesional (`Inter`), dan pemisahan perhatian (*Separation of Concerns*).

### Pola Integrasi Framework Vue.js
Aplikasi menggunakan **Vue 3 Standalone Runtime** tanpa compiler bundler pihak ketiga. Setiap halaman fungsional (`stok.html` dan `tracking.html`) memiliki instance Vue independen yang dipasang (*mount*) ke root DOM elemen `#stok-app` dan `#tracking-app`. Data master tersimpan dalam modul terisolasi `js/dataBahanAjar.js` yang diekspos secara aman ke *global window scope*.

---

## 2. HALAMAN 1: PORTAL BERANDA & GATEWAY SISTEM (`index.html`)

### Modul 1.1: Header & Brand Identity UT
- **Fungsi**: Menampilkan identitas resmi sistem dan institusi.
- **Elemen**: Baris atas (*top bar*) bernuansa biru tua dengan logo akronim "UT", nama sistem "SITTA UT - Distribusi Bahan Ajar dan Pengendalian Tiras UT-Daerah", serta navigasi antar-halaman.
- **Logika**: Navigasi menggunakan tautan absolut/relatif bersih (`href="index.html"`, `href="stok.html"`, `href="tracking.html"`). Active state ditandai dengan styling tombol kontras warna emas (`#F5A623`) dengan teks biru gelap (`#003B73`).

### Modul 1.2: Hero Section & Penjelasan Capaian Pembelajaran
- **Fungsi**: Memberikan konteks operasional bagi pengguna dan penguji tugas.
- **Elemen**: Tag badge `TUGAS PRAKTIK 2: VUE.JS FRAMEWORK`, judul sistem berukuran `2rem` semi-bold, serta paragraf penjelasan fungsi ganda sistem (pengendalian stok buku materi pokok dan pelacakan DO ekspedisi).

### Modul 1.3: Kartu Navigasi Dua Modul Utama
- **Fungsi**: Membimbing pengguna untuk masuk ke dua aplikasi spesifik.
  1. **Kartu Modul Stok Bahan Ajar**: Tombol aksi menuju `stok.html`, dilengkapi ringkasan fitur (filter UPBJJ, indikator safety stock, mutasi tiras, penambahan modul).
  2. **Kartu Modul Tracking Pengiriman DO**: Tombol aksi menuju `tracking.html`, dilengkapi ringkasan fitur (penerbitan DO baru, kalkulasi biaya otomatis, linimasa ekspedisi, pelacakan real-time).
- **Logika Interaksi**: Menggunakan efek transisi hover subtle elevation (`translateY(-2px)` dan `box-shadow`) untuk menandakan kartu dapat diklik (*clickable visual affordance*).

### Modul 1.4: Panel Matriks Pemenuhan 5 Indikator Tugas Praktik 2
- **Fungsi**: Bukti kepatuhan kurikulum tugas modul praktikum.
- **Konten Logic**:
  1. *Indikator 1 (Pengorganisasian Kode)*: Pemisahan data master `js/dataBahanAjar.js`, stylesheet `css/style.css`, serta skrip instance `js/stok-app.js` dan `js/tracking-app.js`.
  2. *Indikator 2 (Menampilkan Data)*: Penerapan interpolasi `{{ }}`, direktif `v-text` untuk data tekstual, dan `v-html` untuk render tag markup pada kolom catatan tiras.
  3. *Indikator 3 (Fungsi Kondisional)*: Penerapan `v-if`, `v-else-if`, `v-else` untuk visualisasi status stok (Aman, Menipis, Kosong) dan `v-show` untuk dialog/modal transisional.
  4. *Indikator 4 (Data Binding, Computed, Methods)*: Two-way binding `v-model` pada formulir, computed properties untuk *dependent filter* dan *auto-number DO*, serta methods untuk aksi CRUD.
  5. *Indikator 5 (Fungsi Pengawas / Watchers)*: Watcher untuk auto-reset filter kategori saat UT-Daerah berubah, watcher kalkulasi biaya paket, serta watcher validasi 9 digit NIM.

### Modul 1.5: Quick Guide Pengujian Interaktif
- **Fungsi**: Lembar panduan cepat langkah demi langkah bagi dosen/tutor untuk menguji reaktivitas aplikasi tanpa harus membaca kode sumber.

---

## 3. HALAMAN 2: MANAJEMEN & PENGENDALIAN STOK BAHAN AJAR (`stok.html`)

### Modul 2.1: Inisialisasi Instance Vue & Data Source
- **Lokasi Berkas**: `js/stok-app.js`
- **Konstruksi Logika**:
  ```javascript
  const { createApp } = Vue;
  const app = createApp({
    data() {
      return {
        stokList: window.SITTA_DATA.dataStokBahanAjar,
        upbjjList: window.SITTA_DATA.upbjjList,
        selectedUpbjj: 'Semua UT-Daerah',
        selectedKategori: 'Semua Kategori',
        sortBy: 'judul',
        sortOrder: 'asc',
        filterReorderOnly: false,
        searchQuery: '',
        // Modal states & form bindings...
      };
    }
  });
  ```
- **Prinsip**: Data di-kloning dari dataset master sehingga operasi penambahan (*create*) dan perubahan (*update*) bersifat reaktif di browser tanpa merusak integritas data asli.

### Modul 2.2: Ringkasan Metrik Kartu Tiras (Reactive Summary Cards)
- **Logika Komputasi (`computed: summaryStats`)**:
  - `totalJudul`: Menghitung panjang array `stokList.length`.
  - `statusAman`: Menghitung jumlah item dengan kondisi `item.qty >= item.safety && item.qty > 0`.
  - `statusMenipis`: Menghitung jumlah item dengan kondisi `item.qty < item.safety && item.qty > 0`.
  - `statusKosong`: Menghitung jumlah item dengan kondisi `item.qty === 0`.
- **Reaktivitas**: Setiap kali kuantitas modul diubah pada modal edit atau modul baru ditambahkan, angka-angka ringkasan ini diperbarui seketika (*instant auto-recalculation*) berkat sistem dependensi reaktif Vue.

### Modul 2.3: Kontrol Filter & Pengurutan Berantai (Dependent Cascading Filter)
- **Logika Dependensi (`computed: availableKategoriList`)**:
  - Jika `selectedUpbjj === 'Semua UT-Daerah'`, kembalikan seluruh kategori unik dari seluruh database.
  - Jika UT-Daerah tertentu dipilih (misal: "Bandung" atau "Jakarta"), baca mapping di `window.SITTA_DATA.kategoriPerUpbjj[this.selectedUpbjj]`.
  - Dropdown kategori (`#filter-kategori`) otomatis me-render pilihan kategori yang hanya ada pada UT-Daerah terpilih menggunakan direktif `v-for="kategori in availableKategoriList"`.
- **Logika Pengurutan (`sortBy` & `sortOrder`)**:
  - Pilihan sorting: Judul Mata Kuliah, Stok Tersedia, Harga Modul, Kode MK.
  - Pilihan arah: Menaik (`asc`) atau Menurun (`desc`).

### Modul 2.4: Checkbox Filter Reorder & Pencarian Live
- **Logika Penyaringan Multi-Kriteria (`computed: filteredStokList`)**:
  - Filter 1 (UT-Daerah): Menyaring `item.upbjj === selectedUpbjj`.
  - Filter 2 (Kategori): Menyaring `item.kategori === selectedKategori`.
  - Filter 3 (Checkbox Reorder): Jika dicentang (`filterReorderOnly === true`), hanya menyaring item yang statusnya kritis (`item.qty === 0 || item.qty < item.safety`).
  - Filter 4 (Pencarian Teks): Mencocokkan `searchQuery` terhadap kode MK, judul modul, nama UT-Daerah, atau lokasi rak.
  - Sorting Pipeline: Mengurutkan hasil array tersaring sebelum disajikan ke template.

### Modul 2.5: Tabel Data Stok Reaktif dengan Direktif Vue
- **Penerapan Direktif**:
  1. `v-for="(item, index) in filteredStokList" :key="item.kode"`: Melakukan looping reaktif.
  2. `v-text="item.upbjj"` & `v-text="item.kategori"`: Memastikan rendering teks aman tanpa interpretasi markup.
  3. `v-html="item.catatanHTML"`: Me-render markup HTML seperti `<strong>Edisi 1</strong>` dan badge cetak ulang khusus.
  4. Evaluasi Status Visual:
     ```html
     <span v-if="item.qty === 0" class="badge-status-kosong">
       <span class="badge-dot dot-kosong"></span> Kosong
     </span>
     <span v-else-if="item.qty < item.safety" class="badge-status-menipis">
       <span class="badge-dot dot-menipis"></span> Menipis
     </span>
     <span v-else class="badge-status-aman">
       <span class="badge-dot dot-aman"></span> Aman
     </span>
     ```
  5. Formatter Rupiah: Method `formatRupiah(item.harga)` mengubah angka integer murni menjadi representasi mata uang Indonesia standar (`Rp 75.000`).

### Modul 2.6: Modal Dialog Edit Stok Reaktif & Form Tambah Modul Baru
- **Logika Edit Modal (`openEditModal(item)`)**:
  - Mengambil data item dan menyalinnya ke objek `editForm` (`Object.assign({}, item)`).
  - Menggunakan two-way binding `v-model.number="editForm.qty"` dan `v-model.number="editForm.safety"`.
  - Menampilkan kalkulasi status langsung di dalam modal (*live status preview*).
  - Ketika tombol "Simpan Perubahan Stok" diklik, method `saveEditStok()` memvalidasi angka, memperbarui data pada array `stokList`, memperbarui `catatanHTML` mutasi tiras, dan memicu notifikasi toast sukses.
- **Logika Tambah Modul Baru**:
  - Dikendalikan oleh `isAddModalOpen`.
  - Memvalidasi keunikan kode MK (tidak boleh duplikat).
  - Memasukkan item baru ke posisi teratas (`stokList.unshift(newModule)`).

### Modul 2.7: Logika Pengawas (Watchers) pada Stok App
- **Watcher 1 (`selectedUpbjj`)**:
  ```javascript
  watch: {
    selectedUpbjj(newVal) {
      this.selectedKategori = 'Semua Kategori';
      this.triggerToast(`Filter disesuaikan dengan wilayah: ${newVal}`);
    }
  }
  ```
  *Penjelasan*: Mencegah situasi inkonsistensi data ketika pengguna memilih kategori yang tidak ada di UT-Daerah baru.
- **Watcher 2 (`editForm.qty`)**:
  ```javascript
  watch: {
    'editForm.qty'(newQty) {
      if (newQty < this.editForm.safety && newQty > 0) {
        this.editWarning = 'Perhatian: Kuantitas stok berada di bawah batas safety stock!';
      } else if (newQty === 0) {
        this.editWarning = 'Peringatan Kritis: Kuantitas stok 0! Status modul menjadi Kosong.';
      } else {
        this.editWarning = '';
      }
    }
  }
  ```
  *Penjelasan*: Memberikan umpan balik instan (*real-time safety alert*) saat operator mengetik angka stok baru di modal.

---

## 4. HALAMAN 3: PENERBITAN & TRACKING PENGIRIMAN DELIVERY ORDER (`tracking.html`)

### Modul 3.1: Inisialisasi Instance Vue & Model State Pengiriman
- **Lokasi Berkas**: `js/tracking-app.js`
- **Model State**:
  - `trackingList`: Menyimpan riwayat DO (termasuk DO sampel awal seperti `DO2023001234` dan `DO2023005678`).
  - `paketList`: Katalog paket bahan ajar semesteran dengan daftar buku dan harga.
  - `pengirimanList`: Daftar opsi ekspedisi (JNE Regular, JNE YES, Pos Indonesia Kilat Khusus, SiCepat Reguler).
  - `form`: Objek reaktif untuk input penerbitan DO (`nomorDO`, `nim`, `nama`, `ekspedisi`, `paketKode`, `tanggalKirim`, `totalBiaya`).
  - `activeDO`: Objek DO yang sedang dipilih untuk ditampilkan detail linimasanya.

### Modul 3.2: Pencarian Cepat DO & Panel Statistik Pengiriman
- **Pencarian Cepat (`quickSearchQuery`)**:
  - Input teks di panel header atas memungkinkan operator mencari nomor DO atau NIM mahasiswa secara langsung.
  - Method `cariDO()` memfilter dan mencocokkan query; bila ditemukan, `activeDO` langsung disetel ke DO terkait dan layar melakukan *smooth scroll* ke linimasa.
- **Panel Statistik Ringkasan**:
  - `computed: stats`: Menghitung total DO yang diterbitkan, jumlah DO berstatus 'Dalam Perjalanan', 'Terkirim', dan 'Diproses'.

### Modul 3.3: Formulir Penerbitan Delivery Order Baru (Auto Sequence Number)
- **Logika Generator Otomatis Nomor DO (`computed: nextDONumber`)**:
  ```javascript
  computed: {
    nextDONumber() {
      const year = new Date().getFullYear();
      const currentYearPrefix = `DO${year}-`;
      const currentYearDOs = this.trackingList.filter(item => 
        item.nomorDO.startsWith(currentYearPrefix)
      );
      const nextSequence = currentYearDOs.length + 1;
      return `${currentYearPrefix}${String(nextSequence).padStart(3, '0')}`;
    }
  }
  ```
- **Logika Bisnis**: Nomor DO digenerate secara otomatis dengan format standar institusi (`DO2026-001`, `DO2026-002`, dst.) dan bersifat *read-only* pada antarmuka pengguna (`:value="nextDONumber" readonly`). Hal ini mencegah kesalahan penomoran ganda atau salah ketik (*human error*).

### Modul 3.4: Watcher Pemilihan Paket & Dynamic Package Preview
- **Logika Pengawas Paket (`watch: form.paketKode`)**:
  ```javascript
  watch: {
    'form.paketKode'(kodePaketBaru) {
      const paket = this.paketList.find(p => p.kode === kodePaketBaru);
      if (paket) {
        this.form.totalBiaya = paket.harga;
        this.triggerToast(`Paket dipilih: ${paket.nama} - Biaya otomatis disetel: ${this.formatRupiah(paket.harga)}`);
      } else {
        this.form.totalBiaya = 0;
      }
    }
  }
  ```
- **Pratinjau Isi Modul (`v-if="selectedPaketDetails"`)**:
  - Ketika dropdown `#paket-select` memilih salah satu opsi, kontainer pratinjau muncul di bawah dropdown menggunakan direktif `v-if`.
  - Kontainer ini menampilkan nama program studi, semester, total SKS, rincian buku modul yang termasuk, serta harga paket.

### Modul 3.5: Validasi Input NIM Mahasiswa & Biaya Otomatis
- **Watcher Validasi NIM (`watch: form.nim`)**:
  ```javascript
  watch: {
    'form.nim'(newNIM) {
      if (!newNIM) {
        this.nimValidationMsg = '';
      } else if (!/^\d+$/.test(newNIM)) {
        this.nimValidationMsg = 'NIM hanya boleh berisi angka!';
      } else if (newNIM.length !== 9) {
        this.nimValidationMsg = `NIM harus tepat 9 digit (saat ini ${newNIM.length} digit)`;
      } else {
        this.nimValidationMsg = 'Format NIM valid (9 digit).';
      }
    }
  }
  ```
- **Validasi Submit (`simpanDO()`)**:
  - Memeriksa kelengkapan nama mahasiswa (minimal 3 karakter).
  - Memverifikasi paket bahan ajar telah dipilih.
  - Memverifikasi ekspedisi telah dipilih.
  - Mencegah *submit* jika validasi gagal dengan menampilkan pesan error terperinci.

### Modul 3.6: Riwayat Daftar DO & Filter Status Pengiriman
- **Penyaringan Reaktif (`computed: filteredTrackingList`)**:
  - Filter status pengiriman: 'Semua Status', 'Diproses', 'Dalam Perjalanan', 'Terkirim'.
  - Pencarian fleksibel berdasarkan nomor DO, nama mahasiswa, atau nomor resi pengiriman.
- **Interaktivitas Baris**:
  - Setiap baris riwayat memiliki tombol "Lihat Linimasa".
  - Baris yang sedang aktif diberi highlight visual border emas (`border-l-4 border-[#F5A623]`) untuk memudahkan pelacakan mata pengguna.

### Modul 3.7: Linimasa Pelacakan Paket Dinamis (Multi-Step Timeline Rendering)
- **Komponen Linimasa**:
  - Ditampilkan di panel sebelah kanan menggunakan direktif `v-if="activeDO"`.
  - Jika belum ada DO yang dipilih, panel menampilkan *empty state card* dengan instruksi pemilihan.
  - Jika `activeDO` terpilih, me-render seluruh riwayat transit:
    ```html
    <div v-for="(step, index) in activeDO.perjalanan" :key="index" class="timeline-item">
      <div class="timeline-step-badge">{{ step.step || (index + 1) }}</div>
      <div class="timeline-content">
        <div class="timeline-time">{{ step.waktu }}</div>
        <div class="timeline-desc">{{ step.keterangan }}</div>
      </div>
    </div>
    ```
- **Logika Status Pengiriman**:
  - Status Terkirim: Diberi badge hijau dengan indikator tuntas.
  - Status Dalam Perjalanan: Diberi badge biru dengan indikator pergerakan kurir.
  - Status Diproses: Diberi badge abu-abu / amber pada tahap penyiapan di gudang pusat.

---

## 5. KESIMPULAN & PETUNJUK PRESENTASI

1. **Efisiensi Reaktivitas**: Framework Vue.js 3 berhasil mengeliminasi manipulasi DOM manual (`document.getElementById` atau `innerHTML`) yang rentan error dan lambat. Seluruh perubahan data dipicu secara deklaratif melalui state.
2. **Kesesuaian Spesifikasi UT**: Seluruh entitas data (Buku Materi Pokok, Tiras, Safety Stock, UPBJJ/UT-Daerah, Delivery Order, Ekspedisi) merefleksikan model operasional nyata Universitas Terbuka.
3. **Kesiapan Demonstrasi**: Saat mempresentasikan di depan penguji, disarankan mengikuti alur:
   - **Langkah 1**: Buka `index.html`, jelaskan arsitektur dan matriks 5 indikator.
   - **Langkah 2**: Buka `stok.html`, demonstrasikan *dependent filter* (ganti UT-Daerah ke "Bandung", tunjukkan kategori otomatis menyesuaikan).
   - **Langkah 3**: Centang checkbox "Hanya Stok Kritis" dan ubah salah satu stok via modal edit untuk mendemonstrasikan *watcher warning*.
   - **Langkah 4**: Buka `tracking.html`, perlihatkan auto-generated nomor DO (`DO2026-001`), pilih paket untuk melihat *dynamic preview* dan *auto-calculate fee*, lalu simpan DO baru dan lihat linimasanya terupdate secara langsung!
