/**
 * SITTA UT - Data Source Utama Tugas Praktik 1
 * Universitas Terbuka - Sistem Informasi Tiras dan Transaksi Bahan Ajar
 */

export var dataPengguna = [
  {
    id: 1,
    nama: "Rina Wulandari",
    email: "rina@ut.ac.id",
    password: "rina123",
    role: "UPBJJ-UT",
    lokasi: "UPBJJ Jakarta"
  },
  {
    id: 2,
    nama: "Agus Pranoto",
    email: "agus@ut.ac.id",
    password: "agus123",
    role: "UPBJJ-UT",
    lokasi: "UPBJJ Makassar"
  },
  {
    id: 3,
    nama: "Siti Marlina",
    email: "siti@ut.ac.id",
    password: "siti123",
    role: "Puslaba",
    lokasi: "Pusat"
  },
  {
    id: 4,
    nama: "Doni Setiawan",
    email: "doni@ut.ac.id",
    password: "doni123",
    role: "Fakultas",
    lokasi: "FISIP"
  },
  {
    id: 5,
    nama: "Admin SITTA",
    email: "admin@ut.ac.id",
    password: "admin123",
    role: "Administrator",
    lokasi: "Pusat"
  }
];

export var dataBahanAjar = [
  {
    kodeLokasi: "0TMP01",
    kodeBarang: "ASIP4301",
    namaBarang: "Pengantar Ilmu Komunikasi",
    jenisBarang: "BMP",
    edisi: "2",
    stok: 548,
    cover: "img/pengantar_komunikasi.jpg"
  },
  {
    kodeLokasi: "0JKT01",
    kodeBarang: "EKMA4216",
    namaBarang: "Manajemen Keuangan",
    jenisBarang: "BMP",
    edisi: "3",
    stok: 392,
    cover: "img/manajemen_keuangan.jpg"
  },
  {
    kodeLokasi: "0SBY02",
    kodeBarang: "EKMA4310",
    namaBarang: "Kepemimpinan",
    jenisBarang: "BMP",
    edisi: "1",
    stok: 278,
    cover: "img/kepemimpinan.jpg"
  },
  {
    kodeLokasi: "0MLG01",
    kodeBarang: "BIOL4211",
    namaBarang: "Mikrobiologi Dasar",
    jenisBarang: "BMP",
    edisi: "2",
    stok: 165,
    cover: "img/mikrobiologi.jpg"
  },
  {
    kodeLokasi: "0UPBJJBDG",
    kodeBarang: "PAUD4401",
    namaBarang: "Perkembangan Anak Usia Dini",
    jenisBarang: "BMP",
    edisi: "4",
    stok: 204,
    cover: "img/paud_perkembangan.jpg"
  }
];

export var dataTracking = {
  "2023001234": {
    nomorDO: "2023001234",
    nama: "Rina Wulandari",
    status: "Dalam Perjalanan",
    ekspedisi: "JNE",
    tanggalKirim: "2025-08-25",
    paket: "0JKT01",
    total: "Rp 180.000",
    perjalanan: [
      {
        waktu: "2025-08-25 10:12:20",
        keterangan: "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka"
      },
      {
        waktu: "2025-08-25 14:07:56",
        keterangan: "Tiba di Hub: TANGERANG SELATAN"
      },      
      {
        waktu: "2025-08-25 18:30:15",
        keterangan: "Diteruskan ke Kantor Jakarta Selatan"
      }
    ]
  },
  "2023005678": {
    nomorDO: "2023005678",
    nama: "Agus Pranoto",
    status: "Selesai",
    ekspedisi: "Pos Indonesia",
    tanggalKirim: "2025-08-25",
    paket: "0UPBJJBDG",
    total: "Rp 220.000",
    perjalanan: [
      {
        waktu: "2025-08-25 10:12:20",
        keterangan: "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka"
      },
      {
        waktu: "2025-08-25 14:07:56",
        keterangan: "Tiba di Hub: TANGERANG SELATAN"
      },      
      {
        waktu: "2025-08-25 16:30:10",
        keterangan: "Diteruskan ke Kantor Kota Bandung"
      },
      {
        waktu: "2025-08-26 12:15:33",
        keterangan: "Tiba di Hub: Kota BANDUNG"
      },
      {
        waktu: "2025-08-26 15:06:12",
        keterangan: "Proses antar ke Cimahi"
      },
      {
        waktu: "2025-08-26 20:00:00",
        keterangan: "Selesai Antar. Penerima: Agus Pranoto"
      }
    ]
  },
  "2023002468": {
    nomorDO: "2023002468",
    nama: "Budi Santoso",
    status: "Selesai",
    ekspedisi: "JNE",
    tanggalKirim: "2025-08-27",
    paket: "0SBY02",
    total: "Rp 195.000",
    perjalanan: [
      {
        waktu: "2025-08-27 09:00:10",
        keterangan: "Penerimaan di Hub Puslaba: Tangerang Selatan"
      },
      {
        waktu: "2025-08-27 15:45:00",
        keterangan: "Diteruskan ke Hub Logistik Surabaya"
      },
      {
        waktu: "2025-08-28 11:20:45",
        keterangan: "Tiba di Hub: Kota Surabaya"
      },
      {
        waktu: "2025-08-28 17:10:00",
        keterangan: "Selesai Antar. Penerima: Budi Santoso (UPBJJ Surabaya)"
      }
    ]
  },
  "2023003579": {
    nomorDO: "2023003579",
    nama: "Dewi Lestari",
    status: "Dalam Perjalanan",
    ekspedisi: "Pos Indonesia",
    tanggalKirim: "2025-08-28",
    paket: "0TMP01",
    total: "Rp 240.000",
    perjalanan: [
      {
        waktu: "2025-08-28 08:30:00",
        keterangan: "Penerimaan di Loket: Tangerang Selatan. Pengirim: Universitas Terbuka"
      },
      {
        waktu: "2025-08-28 13:10:20",
        keterangan: "Pengiriman kargo udara ke Bandara Sultan Hasanuddin Makassar"
      },
      {
        waktu: "2025-08-29 09:40:15",
        keterangan: "Tiba di Hub Sentral Pengolahan Pos Makassar"
      }
    ]
  },
  "2023004680": {
    nomorDO: "2023004680",
    nama: "Ahmad Fauzi",
    status: "Diproses",
    ekspedisi: "JNE",
    tanggalKirim: "2025-08-29",
    paket: "0MLG01",
    total: "Rp 150.000",
    perjalanan: [
      {
        waktu: "2025-08-29 11:00:00",
        keterangan: "Penerimaan di Loket: Gudang Puslaba Pusat"
      },
      {
        waktu: "2025-08-29 16:20:30",
        keterangan: "Proses sortir tujuan Malang Jawa Timur"
      }
    ]
  },
  "2023007891": {
    nomorDO: "2023007891",
    nama: "Siti Aminah",
    status: "Dalam Perjalanan",
    ekspedisi: "Pos Indonesia",
    tanggalKirim: "2025-08-29",
    paket: "0TMP01",
    total: "Rp 210.000",
    perjalanan: [
      {
        waktu: "2025-08-29 10:15:00",
        keterangan: "Penerimaan di Loket Puslaba UT"
      },
      {
        waktu: "2025-08-30 08:00:00",
        keterangan: "Diteruskan ke Sentral Pengolahan Pos Makassar"
      }
    ]
  },
  "2023008902": {
    nomorDO: "2023008902",
    nama: "Hendra Wijaya",
    status: "Selesai",
    ekspedisi: "JNE",
    tanggalKirim: "2025-08-26",
    paket: "0JKT01",
    total: "Rp 175.000",
    perjalanan: [
      {
        waktu: "2025-08-26 09:00:00",
        keterangan: "Penerimaan di Loket: Tangerang Selatan"
      },
      {
        waktu: "2025-08-26 14:10:00",
        keterangan: "Tiba di Hub JNE Jakarta Pusat"
      },
      {
        waktu: "2025-08-27 10:30:00",
        keterangan: "Selesai Antar. Penerima: Hendra Wijaya"
      }
    ]
  },
  "2023009013": {
    nomorDO: "2023009013",
    nama: "Nurul Hidayah",
    status: "Diproses",
    ekspedisi: "Pos Indonesia",
    tanggalKirim: "2025-08-30",
    paket: "0SBY02",
    total: "Rp 160.000",
    perjalanan: [
      {
        waktu: "2025-08-30 08:30:00",
        keterangan: "Penerimaan di Loket: Gudang Puslaba Pusat"
      }
    ]
  },
  "2023009124": {
    nomorDO: "2023009124",
    nama: "Rizky Pratama",
    status: "Selesai",
    ekspedisi: "JNE",
    tanggalKirim: "2025-08-25",
    paket: "0UPBJJBDG",
    total: "Rp 230.000",
    perjalanan: [
      {
        waktu: "2025-08-25 10:00:00",
        keterangan: "Penerimaan di Loket: Tangerang Selatan"
      },
      {
        waktu: "2025-08-26 11:30:00",
        keterangan: "Tiba di Hub JNE Kota Bandung"
      },
      {
        waktu: "2025-08-26 16:45:00",
        keterangan: "Selesai Antar. Penerima: Rizky Pratama"
      }
    ]
  },
  "2023009235": {
    nomorDO: "2023009235",
    nama: "Fitri Handayani",
    status: "Dalam Perjalanan",
    ekspedisi: "Pos Indonesia",
    tanggalKirim: "2025-08-29",
    paket: "0MLG01",
    total: "Rp 185.000",
    perjalanan: [
      {
        waktu: "2025-08-29 09:30:00",
        keterangan: "Penerimaan di Loket: Puslaba Tangerang Selatan"
      },
      {
        waktu: "2025-08-30 14:15:00",
        keterangan: "Diteruskan ke Kantor Pos Malang"
      }
    ]
  }
};

// Inisialisasi ke window untuk kompatibilitas global
if (typeof window !== 'undefined') {
  window.dataPengguna = dataPengguna;
  window.dataBahanAjar = dataBahanAjar;
  window.dataTracking = dataTracking;
}
