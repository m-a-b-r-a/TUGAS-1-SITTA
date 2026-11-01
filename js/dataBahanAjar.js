/**
 * SITTA UT - Data Source Tugas Praktik 2 (Vue.js)
 * Universitas Terbuka - Sistem Informasi Tiras dan Distribusi Bahan Ajar
 */

export const upbjjList = [
  'Jakarta',
  'Bandung',
  'Surabaya',
  'Makassar',
  'Malang',
  'Medan'
];

export const kategoriList = [
  'Semua Kategori',
  'Ilmu Komunikasi',
  'Ekonomi dan Manajemen',
  'Ilmu Hukum',
  'Sains dan Teknologi',
  'Pendidikan dan Keguruan',
  'Biologi dan Pertanian'
];

// Pemetaan kategori yang tersedia per UPBJJ (untuk fitur Dependent Filter)
export const kategoriPerUpbjj = {
  'Jakarta': ['Semua Kategori', 'Ilmu Komunikasi', 'Ekonomi dan Manajemen', 'Ilmu Hukum', 'Sains dan Teknologi'],
  'Bandung': ['Semua Kategori', 'Pendidikan dan Keguruan', 'Ekonomi dan Manajemen', 'Sains dan Teknologi'],
  'Surabaya': ['Semua Kategori', 'Ekonomi dan Manajemen', 'Sains dan Teknologi', 'Ilmu Komunikasi'],
  'Makassar': ['Semua Kategori', 'Ilmu Komunikasi', 'Sains dan Teknologi', 'Ilmu Hukum'],
  'Malang': ['Semua Kategori', 'Biologi dan Pertanian', 'Ekonomi dan Manajemen', 'Pendidikan dan Keguruan'],
  'Medan': ['Semua Kategori', 'Ilmu Hukum', 'Ekonomi dan Manajemen', 'Pendidikan dan Keguruan']
};

export const pengirimanList = [
  'JNE Regular',
  'JNE Express',
  'Pos Indonesia',
  'TIKI Prioritas'
];

export const paketList = [
  {
    kode: 'PAKET-SI-01',
    nama: 'Paket Semester 1 - Sistem Informasi',
    harga: 240000,
    keterangan: 'Paket matakuliah dasar prodi Sistem Informasi semester awal',
    isi: [
      { kode: 'MSIM4101', judul: 'Pengantar Sistem Informasi', sks: 3, semester: 1 },
      { kode: 'MKDU4110', judul: 'Bahasa Indonesia', sks: 3, semester: 1 },
      { kode: 'MATA4101', judul: 'Pengantar Matematika Informatika', sks: 3, semester: 1 }
    ]
  },
  {
    kode: 'PAKET-MNJ-01',
    nama: 'Paket Semester 1 - Manajemen',
    harga: 180000,
    keterangan: 'Paket bahan ajar pondasi bisnis dan manajemen keuangan',
    isi: [
      { kode: 'EKMA4115', judul: 'Pengantar Manajemen', sks: 3, semester: 1 },
      { kode: 'EKMA4216', judul: 'Manajemen Keuangan', sks: 3, semester: 1 }
    ]
  },
  {
    kode: 'PAKET-KOM-02',
    nama: 'Paket Semester 2 - Ilmu Komunikasi',
    harga: 210000,
    keterangan: 'Paket teori komunikasi dan dasar jurnalistik media',
    isi: [
      { kode: 'ASIP4301', judul: 'Pengantar Ilmu Komunikasi', sks: 3, semester: 2 },
      { kode: 'SKOM4101', judul: 'Teori Komunikasi Publik', sks: 3, semester: 2 }
    ]
  },
  {
    kode: 'PAKET-PAUD-03',
    nama: 'Paket Semester 3 - PGPAUD',
    harga: 195000,
    keterangan: 'Paket materi perkembangan kognitif dan bermain anak',
    isi: [
      { kode: 'PAUD4401', judul: 'Perkembangan Anak Usia Dini', sks: 4, semester: 3 },
      { kode: 'PAUD4201', judul: 'Metode Bermain dan Permainan Edukatif', sks: 2, semester: 3 }
    ]
  },
  {
    kode: 'PAKET-BIO-04',
    nama: 'Paket Semester 4 - Biologi & Sains',
    harga: 225000,
    keterangan: 'Paket praktikum biologi laboratorium dan mikrobiologi',
    isi: [
      { kode: 'BIOL4211', judul: 'Mikrobiologi Dasar', sks: 3, semester: 4 },
      { kode: 'BIOL4215', judul: 'Genetika Molekuler', sks: 3, semester: 4 }
    ]
  },
  {
    kode: 'PAKET-HKM-01',
    nama: 'Paket Semester 1 - Ilmu Hukum',
    harga: 200000,
    keterangan: 'Paket pengantar ilmu hukum tata negara dan pidana',
    isi: [
      { kode: 'HKUM4101', judul: 'Pengantar Ilmu Hukum Indonesia', sks: 4, semester: 1 },
      { kode: 'HKUM4201', judul: 'Hukum Tata Negara', sks: 3, semester: 1 }
    ]
  }
];

export const dataStokBahanAjar = [
  {
    kode: 'ASIP4301',
    judul: 'Pengantar Ilmu Komunikasi',
    kategori: 'Ilmu Komunikasi',
    upbjj: 'Jakarta',
    lokasiRak: 'Rak A-01',
    harga: 65000,
    qty: 548,
    safety: 100,
    catatanHTML: '<strong>Edisi 2 Revisi</strong> - Stok gudang utama aman, tiras siap cetak ulang jika < 120.'
  },
  {
    kode: 'EKMA4216',
    judul: 'Manajemen Keuangan',
    kategori: 'Ekonomi dan Manajemen',
    upbjj: 'Jakarta',
    lokasiRak: 'Rak B-04',
    harga: 75000,
    qty: 392,
    safety: 150,
    catatanHTML: '<strong>Edisi 3 Cetakan 2024</strong> - Buku pegangan utama mahasiswa FEB semester berjalan.'
  },
  {
    kode: 'EKMA4310',
    judul: 'Kepemimpinan dan Perilaku Organisasi',
    kategori: 'Ekonomi dan Manajemen',
    upbjj: 'Surabaya',
    lokasiRak: 'Rak B-08',
    harga: 70000,
    qty: 278,
    safety: 120,
    catatanHTML: '<strong>Edisi 1</strong> - Tersimpan rapi di rak pendingin bebas lembap UPBJJ Surabaya.'
  },
  {
    kode: 'BIOL4211',
    judul: 'Mikrobiologi Dasar',
    kategori: 'Biologi dan Pertanian',
    upbjj: 'Malang',
    lokasiRak: 'Rak C-02',
    harga: 85000,
    qty: 165,
    safety: 80,
    catatanHTML: '<strong>Edisi 2 + CD Suplemen</strong> - Dilengkapi panduan praktikum mandiri laboratorium.'
  },
  {
    kode: 'PAUD4401',
    judul: 'Perkembangan Anak Usia Dini',
    kategori: 'Pendidikan dan Keguruan',
    upbjj: 'Bandung',
    lokasiRak: 'Rak D-05',
    harga: 60000,
    qty: 204,
    safety: 90,
    catatanHTML: '<strong>Edisi 4 Terbaru</strong> - Distribusi utama sentra Pokjar wilayah Jawa Barat.'
  },
  {
    kode: 'MSIM4101',
    judul: 'Pengantar Sistem Informasi',
    kategori: 'Sains dan Teknologi',
    upbjj: 'Jakarta',
    lokasiRak: 'Rak A-09',
    harga: 80000,
    qty: 45,
    safety: 80,
    catatanHTML: '<span class="text-amber-800 font-semibold">Peringatan:</span> Stok mendekati ambang batas safety. Permintaan cetak ulang sedang diproses.'
  },
  {
    kode: 'SKOM4101',
    judul: 'Teori Komunikasi Publik',
    kategori: 'Ilmu Komunikasi',
    upbjj: 'Makassar',
    lokasiRak: 'Rak C-07',
    harga: 65000,
    qty: 32,
    safety: 50,
    catatanHTML: '<span class="text-amber-800 font-semibold">Peringatan:</span> Tiras menipis di UPBJJ Makassar. Disarankan relokasi stok dari Pusat.'
  },
  {
    kode: 'HKUM4101',
    judul: 'Pengantar Ilmu Hukum Indonesia',
    kategori: 'Ilmu Hukum',
    upbjj: 'Medan',
    lokasiRak: 'Rak E-01',
    harga: 70000,
    qty: 0,
    safety: 60,
    catatanHTML: '<span class="text-red-700 font-bold">STOK HABIS (0):</span> Sedang dalam antrean ekspedisi Puslaba Pusat ke UPBJJ Medan.'
  },
  {
    kode: 'BIOL4215',
    judul: 'Genetika Molekuler',
    kategori: 'Biologi dan Pertanian',
    upbjj: 'Malang',
    lokasiRak: 'Rak C-05',
    harga: 90000,
    qty: 0,
    safety: 40,
    catatanHTML: '<span class="text-red-700 font-bold">STOK HABIS (0):</span> Menunggu cetakan modul revisi terbaru dari penerbit UT.'
  },
  {
    kode: 'EKMA4115',
    judul: 'Pengantar Manajemen Bisnis',
    kategori: 'Ekonomi dan Manajemen',
    upbjj: 'Surabaya',
    lokasiRak: 'Rak B-02',
    harga: 65000,
    qty: 410,
    safety: 100,
    catatanHTML: '<strong>Edisi 2 Revisi</strong> - Stok sangat mencukupi untuk registrasi semester ganjil.'
  }
];

export const dataTrackingDO = [
  {
    nomorDO: 'DO2025-001',
    nim: '042189345',
    nama: 'Rina Wulandari',
    ekspedisi: 'JNE Regular',
    paketKode: 'PAKET-KOM-02',
    paketNama: 'Paket Semester 2 - Ilmu Komunikasi',
    tanggalKirim: '2025-08-25',
    totalHarga: 210000,
    status: 'Dalam Perjalanan',
    perjalanan: [
      {
        waktu: '2025-08-25 09:30:00',
        keterangan: 'Penerimaan di Loket: Gudang Puslaba Tangerang Selatan. Pengirim: Universitas Terbuka'
      },
      {
        waktu: '2025-08-25 14:15:00',
        keterangan: 'Tiba di Hub Sortir: JNE Tangerang Gateway'
      },
      {
        waktu: '2025-08-26 08:45:00',
        keterangan: 'Diteruskan ke Kantor Distribusi JNE Jakarta Selatan'
      }
    ]
  },
  {
    nomorDO: 'DO2025-002',
    nim: '043991204',
    nama: 'Agus Pranoto',
    ekspedisi: 'Pos Indonesia',
    paketKode: 'PAKET-PAUD-03',
    paketNama: 'Paket Semester 3 - PGPAUD',
    tanggalKirim: '2025-08-25',
    totalHarga: 195000,
    status: 'Tiba di Tujuan',
    perjalanan: [
      {
        waktu: '2025-08-25 10:00:00',
        keterangan: 'Penerimaan di Loket: Tangerang Selatan. Pengirim: Universitas Terbuka'
      },
      {
        waktu: '2025-08-26 11:30:00',
        keterangan: 'Tiba di Sentral Pengolahan Pos Kota Bandung'
      },
      {
        waktu: '2025-08-27 14:00:00',
        keterangan: 'Tiba di Kantor UPBJJ UT Bandung. Siap diambil mahasiswa.'
      }
    ]
  },
  {
    nomorDO: 'DO2025-003',
    nim: '041558231',
    nama: 'Budi Santoso',
    ekspedisi: 'JNE Express',
    paketKode: 'PAKET-MNJ-01',
    paketNama: 'Paket Semester 1 - Manajemen',
    tanggalKirim: '2025-08-27',
    totalHarga: 180000,
    status: 'Diproses',
    perjalanan: [
      {
        waktu: '2025-08-27 08:15:00',
        keterangan: 'Order diterbitkan. Menunggu pengambilan kurir JNE di gudang sentral UT.'
      }
    ]
  }
];

// Pastikan data dapat diakses baik via modul ES maupun global window di browser
if (typeof window !== 'undefined') {
  window.upbjjList = upbjjList;
  window.kategoriList = kategoriList;
  window.kategoriPerUpbjj = kategoriPerUpbjj;
  window.pengirimanList = pengirimanList;
  window.paketList = paketList;
  window.dataStokBahanAjar = dataStokBahanAjar;
  window.dataTrackingDO = dataTrackingDO;
}
