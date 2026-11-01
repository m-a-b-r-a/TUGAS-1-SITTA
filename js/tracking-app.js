/**
 * SITTA UT - Aplikasi Tracking Delivery Order (Vue.js)
 * Universitas Terbuka - Tugas Praktik 2
 * Mengimplementasikan 5 Indikator Capaian:
 * 1. Organisasi kode Vue.js
 * 2. Mustaches, v-text, v-html
 * 3. v-if, v-else-if, v-else, v-show
 * 4. v-bind, v-model, computed properties, methods
 * 5. watch (minimal 2 watcher: watch form.paketKode untuk update harga & watch form.nim)
 */

import { pengirimanList, paketList, dataTrackingDO } from './dataBahanAjar.js';

const VueInstance = (typeof Vue !== 'undefined') ? Vue : (window.Vue || null);

if (!VueInstance) {
  console.error('Vue 3 belum dimuat.');
} else {
  const { createApp } = VueInstance;

  // Tanggal default hari ini (local time YYYY-MM-DD)
  const getTodayLocalDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const TrackingApp = createApp({
    data() {
      return {
        // Master Data dari dataBahanAjar.js
        pengirimanList: pengirimanList || ['JNE Regular', 'JNE Express', 'Pos Indonesia', 'TIKI Prioritas'],
        paketList: paketList || [],
        
        // Data Transaksi DO (Reaktif)
        trackingList: (dataTrackingDO && dataTrackingDO.length)
          ? JSON.parse(JSON.stringify(dataTrackingDO))
          : [],

        // State Form Pemesanan DO Baru
        form: {
          nim: '',
          nama: '',
          ekspedisi: 'JNE Regular',
          paketKode: '',
          tanggalKirim: getTodayLocalDate(),
          totalHarga: 0
        },
        formErrors: {},
        nimHelpText: '',

        // State Pencarian & Filter
        searchKeyword: '',
        filterStatus: 'Semua Status',
        selectedActiveDO: null, // DO yang sedang dilihat detail linimasanya
        showAddDOForm: true,

        // Notifikasi Toast
        toastMessage: '',
        toastType: 'info',
        toastTimeout: null
      };
    },

    computed: {
      /**
       * Indikator 4: Computed Property - Auto-Generated Nomor DO
       * Format: DO + Tahun Berjalan + Sequence Number (contoh: DO2025-004)
       */
      nextDONumber() {
        const currentYear = new Date().getFullYear();
        const prefix = `DO${currentYear}-`;
        
        // Cari urutan sequence tertinggi dari trackingList
        let maxSeq = 0;
        this.trackingList.forEach(item => {
          if (item.nomorDO && item.nomorDO.startsWith(prefix)) {
            const seqStr = item.nomorDO.replace(prefix, '');
            const seqNum = parseInt(seqStr, 10);
            if (!isNaN(seqNum) && seqNum > maxSeq) {
              maxSeq = seqNum;
            }
          }
        });

        const nextSeq = maxSeq + 1;
        return `${prefix}${String(nextSeq).padStart(3, '0')}`;
      },

      /**
       * Indikator 4: Computed Property - Paket Bahan Ajar Terpilih
       * Menghasilkan detail object paket untuk menampilkan rincian modul di bawah select
       */
      selectedPaketDetails() {
        if (!this.form.paketKode) return null;
        return this.paketList.find(p => p.kode === this.form.paketKode) || null;
      },

      /**
       * Indikator 4: Computed Property - Filter Daftar DO
       */
      filteredDOList() {
        let result = [...this.trackingList];

        // Filter berdasarkan status
        if (this.filterStatus && this.filterStatus !== 'Semua Status') {
          result = result.filter(item => item.status === this.filterStatus);
        }

        // Filter pencarian Nomor DO / NIM / Nama
        if (this.searchKeyword && this.searchKeyword.trim() !== '') {
          const q = this.searchKeyword.toLowerCase().trim();
          result = result.filter(item =>
            item.nomorDO.toLowerCase().includes(q) ||
            item.nim.toLowerCase().includes(q) ||
            item.nama.toLowerCase().includes(q) ||
            (item.paketKode && item.paketKode.toLowerCase().includes(q))
          );
        }

        return result;
      },

      /**
       * Computed Property: Statistik Status DO
       */
      summaryStats() {
        const total = this.trackingList.length;
        const diproses = this.trackingList.filter(i => i.status === 'Diproses').length;
        const perjalanan = this.trackingList.filter(i => i.status === 'Dalam Perjalanan').length;
        const sampai = this.trackingList.filter(i => i.status === 'Tiba di Tujuan' || i.status === 'Selesai').length;
        return { total, diproses, perjalanan, sampai };
      }
    },

    watch: {
      /**
       * Indikator 5: Watcher 1 - Watcher Pemilihan Paket Bahan Ajar
       * Memantau perubahan paketKode pada formulir.
       * Mengotomasi total harga sesuai paket terpilih & memberikan respon visual.
       */
      'form.paketKode'(newVal) {
        if (!newVal) {
          this.form.totalHarga = 0;
          return;
        }
        const found = this.paketList.find(p => p.kode === newVal);
        if (found) {
          this.form.totalHarga = found.harga;
          this.showToast(
            `Paket dipilih: ${found.nama} (Total: ${this.formatRupiah(found.harga)})`,
            'info'
          );
        }
      },

      /**
       * Indikator 5: Watcher 2 - Watcher Input NIM Mahasiswa
       * Memantau panjang digit NIM secara live (harus tepat 9 digit angka).
       */
      'form.nim'(newNIM) {
        const clean = (newNIM || '').trim();
        if (!clean) {
          this.nimHelpText = '';
        } else if (!/^\d+$/.test(clean)) {
          this.nimHelpText = 'Peringatan: NIM hanya boleh berisi angka.';
        } else if (clean.length < 9) {
          this.nimHelpText = `Digit NIM: ${clean.length}/9 angka.`;
        } else if (clean.length === 9) {
          this.nimHelpText = 'NIM valid (9 digit).';
        } else {
          this.nimHelpText = `Peringatan: NIM lebih dari 9 digit (${clean.length} digit).`;
        }
      },

      /**
       * Indikator 5: Watcher 3 - Watcher Kata Kunci Pencarian
       */
      searchKeyword(newVal) {
        if (newVal && newVal.trim().length >= 3) {
          const matchCount = this.filteredDOList.length;
          console.log(`Pencarian tracking "${newVal}" menemukan ${matchCount} hasil.`);
        }
      }
    },

    methods: {
      formatRupiah(nominal) {
        if (typeof nominal !== 'number') return 'Rp 0';
        return 'Rp ' + nominal.toLocaleString('id-ID');
      },

      /**
       * Indikator 4: Methods - Validasi dan Submit Delivery Order Baru
       */
      submitDO() {
        this.formErrors = {};

        // Validasi NIM (9 Digit Angka)
        const nimClean = (this.form.nim || '').trim();
        if (!nimClean) {
          this.formErrors.nim = 'NIM Mahasiswa wajib diisi.';
        } else if (!/^\d{9}$/.test(nimClean)) {
          this.formErrors.nim = 'NIM harus berupa 9 digit angka valid.';
        }

        // Validasi Nama Mahasiswa
        const namaClean = (this.form.nama || '').trim();
        if (!namaClean || namaClean.length < 3) {
          this.formErrors.nama = 'Nama lengkap mahasiswa wajib diisi (minimal 3 karakter).';
        }

        // Validasi Ekspedisi
        if (!this.form.ekspedisi) {
          this.formErrors.ekspedisi = 'Pilih salah satu layanan ekspedisi kurir.';
        }

        // Validasi Paket
        if (!this.form.paketKode) {
          this.formErrors.paketKode = 'Pilih paket bahan ajar yang dipesan.';
        }

        // Validasi Tanggal Kirim
        if (!this.form.tanggalKirim) {
          this.formErrors.tanggalKirim = 'Tanggal kirim wajib diisi.';
        }

        if (Object.keys(this.formErrors).length > 0) {
          this.showToast('Mohon lengkapi formulir dengan data yang valid.', 'error');
          return;
        }

        const selectedPkg = this.paketList.find(p => p.kode === this.form.paketKode);
        const nomorGenerated = this.nextDONumber;
        const nowTime = new Date().toTimeString().split(' ')[0];

        // Buat record DO baru
        const newDO = {
          nomorDO: nomorGenerated,
          nim: nimClean,
          nama: namaClean,
          ekspedisi: this.form.ekspedisi,
          paketKode: this.form.paketKode,
          paketNama: selectedPkg ? selectedPkg.nama : this.form.paketKode,
          tanggalKirim: this.form.tanggalKirim,
          totalHarga: Number(this.form.totalHarga),
          status: 'Diproses',
          perjalanan: [
            {
              waktu: `${this.form.tanggalKirim} ${nowTime}`,
              keterangan: `Penerimaan berkas Delivery Order di Loket SITTA Pusat. Pengirim: Universitas Terbuka (${this.form.ekspedisi})`
            }
          ]
        };

        // Tambahkan ke trackingList (state Vue reaktif)
        this.trackingList.unshift(newDO);
        this.selectedActiveDO = newDO;

        this.showToast(
          `Pesanan Delivery Order ${nomorGenerated} atas nama ${namaClean} berhasil diterbitkan!`,
          'success'
        );

        // Reset form
        this.form.nim = '';
        this.form.nama = '';
        this.form.paketKode = '';
        this.form.totalHarga = 0;
        this.formErrors = {};
        this.nimHelpText = '';
      },

      /**
       * Indikator 4: Methods - Tampilkan Detail Linimasa DO Tertentu
       */
      lacakDO(doItem) {
        this.selectedActiveDO = doItem;
        // Scroll halus ke kartu detail
        this.$nextTick(() => {
          const detailEl = document.getElementById('tracking-detail-section');
          if (detailEl) {
            detailEl.scrollIntoView({ behavior: 'smooth' });
          }
        });
      },

      /**
       * Helper class untuk status DO
       */
      getStatusBadgeClass(status) {
        switch (status) {
          case 'Diproses':
            return 'badge-status-menipis';
          case 'Dalam Perjalanan':
            return 'badge-status-aman';
          case 'Tiba di Tujuan':
          case 'Selesai':
            return 'badge-status-aman';
          default:
            return 'badge-status-menipis';
        }
      },

      showToast(message, type = 'info') {
        this.toastMessage = message;
        this.toastType = type;
        if (this.toastTimeout) {
          clearTimeout(this.toastTimeout);
        }
        this.toastTimeout = setTimeout(() => {
          this.toastMessage = '';
        }, 4000);
      }
    },

    mounted() {
      // Set default paket pertama jika ada agar user langsung melihat rincian paket
      if (this.paketList.length > 0 && !this.form.paketKode) {
        this.form.paketKode = this.paketList[0].kode;
      }
      // Pilih DO pertama untuk linimasa awal
      if (this.trackingList.length > 0) {
        this.selectedActiveDO = this.trackingList[0];
      }
      console.log('SITTA UT - TrackingApp Vue.js berhasil di-mount dengan', this.trackingList.length, 'data DO.');
    }
  });

  const mountApp = () => {
    const el = document.getElementById('tracking-app');
    if (el && !el.__vue_app__) {
      TrackingApp.mount('#tracking-app');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountApp);
  } else {
    mountApp();
  }
}

