/**
 * SITTA UT - Aplikasi Stok Bahan Ajar (Vue.js)
 * Universitas Terbuka - Tugas Praktik 2
 * Mengimplementasikan 5 Indikator Capaian:
 * 1. Organisasi kode Vue.js
 * 2. Mustaches, v-text, v-html (catatanHTML)
 * 3. v-if, v-else-if, v-else, v-show
 * 4. v-bind, v-model, computed properties, methods
 * 5. watch (minimal 2 watcher: reset kategori saat ganti UPBJJ, dan pantau stokForm)
 */

import { upbjjList, kategoriList, kategoriPerUpbjj, dataStokBahanAjar } from './dataBahanAjar.js';

// Pastikan Vue telah dimuat
const VueInstance = (typeof Vue !== 'undefined') ? Vue : (window.Vue || null);

if (!VueInstance) {
  console.error('Vue 3 belum dimuat.');
} else {
  const { createApp } = VueInstance;

  const StokApp = createApp({
    data() {
      return {
        // Master Data dari dataBahanAjar.js
        upbjjList: upbjjList || ['Jakarta', 'Bandung', 'Surabaya', 'Makassar', 'Malang', 'Medan'],
        kategoriList: kategoriList || ['Semua Kategori'],
        kategoriPerUpbjj: kategoriPerUpbjj || {},
        
        // Data Stok Bahan Ajar (Reaktif)
        stokList: (dataStokBahanAjar && dataStokBahanAjar.length)
          ? JSON.parse(JSON.stringify(dataStokBahanAjar))
          : [],

        // State Filter & Sorting
        selectedUpbjj: 'Semua UT-Daerah',
        selectedKategori: 'Semua Kategori',
        filterReorderOnly: false, // Menampilkan hanya yang stok < safety atau stok == 0
        searchQuery: '',
        sortBy: 'judul', // 'judul', 'qty', 'harga'
        sortOrder: 'asc', // 'asc', 'desc'

        // UI State
        showAddForm: false,
        isEditModalOpen: false,
        toastMessage: '',
        toastType: 'info', // 'info', 'success', 'warning', 'error'
        toastTimeout: null,

        // Form Tambah Bahan Ajar Baru
        newForm: {
          kode: '',
          judul: '',
          kategori: '',
          upbjj: '',
          lokasiRak: '',
          harga: 65000,
          qty: 100,
          safety: 50,
          catatanHTML: ''
        },
        addErrors: {},

        // Form Edit Bahan Ajar
        editIndex: -1,
        editForm: {
          kode: '',
          judul: '',
          kategori: '',
          upbjj: '',
          lokasiRak: '',
          harga: 0,
          qty: 0,
          safety: 0,
          catatanHTML: ''
        },
        editErrors: {},

        // Indikator watcher notice
        watcherNotice: ''
      };
    },

    computed: {
      /**
       * Indikator 4: Computed Property - Dependent Filter Kategori
       * Menghasilkan opsi kategori yang relevan sesuai UT-Daerah yang dipilih.
       */
      availableKategoriList() {
        if (!this.selectedUpbjj || this.selectedUpbjj === 'Semua UT-Daerah') {
          return this.kategoriList;
        }
        const mapping = this.kategoriPerUpbjj[this.selectedUpbjj];
        if (mapping && mapping.length > 0) {
          return mapping;
        }
        return this.kategoriList;
      },

      /**
       * Indikator 4: Computed Property - Filter & Sorting dengan Caching
       * Mengolah data stok tanpa komputasi ulang jika tidak ada dependency yang berubah.
       */
      filteredStokList() {
        let result = [...this.stokList];

        // 1. Filter UT-Daerah
        if (this.selectedUpbjj && this.selectedUpbjj !== 'Semua UT-Daerah') {
          result = result.filter(item => item.upbjj === this.selectedUpbjj);
        }

        // 2. Filter Kategori Mata Kuliah
        if (this.selectedKategori && this.selectedKategori !== 'Semua Kategori') {
          result = result.filter(item => item.kategori === this.selectedKategori);
        }

        // 3. Filter Khusus Reorder (stok < safety stock atau qty == 0)
        if (this.filterReorderOnly) {
          result = result.filter(item => item.qty < item.safety || item.qty === 0);
        }

        // 4. Pencarian Kata Kunci (Kode / Judul / Rak)
        if (this.searchQuery && this.searchQuery.trim() !== '') {
          const q = this.searchQuery.toLowerCase().trim();
          result = result.filter(item =>
            item.kode.toLowerCase().includes(q) ||
            item.judul.toLowerCase().includes(q) ||
            item.lokasiRak.toLowerCase().includes(q)
          );
        }

        // 5. Sorting Data (Judul, Stok/Qty, Harga)
        result.sort((a, b) => {
          let fieldA = a[this.sortBy];
          let fieldB = b[this.sortBy];

          if (typeof fieldA === 'string') {
            const cmp = fieldA.localeCompare(fieldB);
            return this.sortOrder === 'asc' ? cmp : -cmp;
          } else {
            return this.sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
          }
        });

        return result;
      },

      /**
       * Computed: Ringkasan statistik data stok
       */
      summaryStats() {
        const total = this.stokList.length;
        const kosong = this.stokList.filter(i => i.qty === 0).length;
        const menipis = this.stokList.filter(i => i.qty > 0 && i.qty < i.safety).length;
        const aman = this.stokList.filter(i => i.qty >= i.safety).length;
        return { total, aman, menipis, kosong };
      }
    },

    watch: {
      /**
       * Indikator 5: Watcher 1 - Dependent Filter Watcher
       * Memantau perubahan selectedUpbjj. Jika UT-Daerah berubah, otomatis reset
       * selectedKategori ke 'Semua Kategori' agar filter konsisten dan valid.
       */
      selectedUpbjj(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.selectedKategori = 'Semua Kategori';
          this.showToast(
            `Filter UT-Daerah diperbarui ke: ${newVal}. Pilihan kategori telah disesuaikan.`,
            'info'
          );
        }
      },

      /**
       * Indikator 5: Watcher 2 - Watcher Filter Reorder
       * Memantau apakah mode 'Hanya Stok Perlu Reorder' diaktifkan/dinonaktifkan.
       */
      filterReorderOnly(newVal) {
        if (newVal) {
          const count = this.stokList.filter(i => i.qty < i.safety || i.qty === 0).length;
          this.showToast(
            `Mode Reorder Aktif: Menampilkan ${count} bahan ajar dengan stok kritis atau kosong.`,
            'warning'
          );
        } else {
          this.showToast('Menampilkan seluruh bahan ajar.', 'info');
        }
      },

      /**
       * Indikator 5: Watcher 3 - Watcher Input Form Edit Stok
       * Memantau nilai editForm.qty secara reaktif untuk memberikan peringatan dini.
       */
      'editForm.qty'(newQty) {
        if (this.isEditModalOpen) {
          if (newQty === 0) {
            this.watcherNotice = 'Perhatian: Jumlah stok 0 (Kosong). Bahan ajar tidak dapat didistribusikan.';
          } else if (newQty < this.editForm.safety) {
            this.watcherNotice = `Peringatan: Stok (${newQty}) berada di bawah Safety Stock (${this.editForm.safety}).`;
          } else {
            this.watcherNotice = 'Status stok aman untuk proses distribusi perkuliahan.';
          }
        }
      }
    },

    methods: {
      /**
       * Indikator 4: Methods - Format Rupiah
       */
      formatRupiah(nominal) {
        if (typeof nominal !== 'number') return 'Rp 0';
        return 'Rp ' + nominal.toLocaleString('id-ID');
      },

      /**
       * Indikator 4: Methods - Reset Filter
       */
      resetFilters() {
        this.selectedUpbjj = 'Semua UT-Daerah';
        this.selectedKategori = 'Semua Kategori';
        this.filterReorderOnly = false;
        this.searchQuery = '';
        this.sortBy = 'judul';
        this.sortOrder = 'asc';
        this.showToast('Filter dan sorting berhasil direset ke pengaturan awal.', 'info');
      },

      /**
       * Indikator 4: Methods - Buka Modal Edit
       */
      openEditModal(item) {
        this.editIndex = this.stokList.findIndex(b => b.kode === item.kode);
        if (this.editIndex !== -1) {
          this.editForm = {
            kode: item.kode,
            judul: item.judul,
            kategori: item.kategori,
            upbjj: item.upbjj,
            lokasiRak: item.lokasiRak,
            harga: Number(item.harga),
            qty: Number(item.qty),
            safety: Number(item.safety),
            catatanHTML: item.catatanHTML || ''
          };
          this.editErrors = {};
          this.isEditModalOpen = true;
        }
      },

      closeEditModal() {
        this.isEditModalOpen = false;
        this.editIndex = -1;
        this.watcherNotice = '';
      },

      /**
       * Indikator 4: Methods - Simpan Perubahan Edit
       */
      saveEditModal() {
        this.editErrors = {};

        if (this.editForm.qty === '' || this.editForm.qty < 0) {
          this.editErrors.qty = 'Jumlah stok harus angka 0 atau lebih.';
        }
        if (this.editForm.safety === '' || this.editForm.safety < 0) {
          this.editErrors.safety = 'Safety stock harus angka 0 atau lebih.';
        }
        if (!this.editForm.lokasiRak || this.editForm.lokasiRak.trim().length === 0) {
          this.editErrors.lokasiRak = 'Lokasi rak tidak boleh kosong.';
        }

        if (Object.keys(this.editErrors).length > 0) {
          return;
        }

        // Terapkan perubahan ke state stokList
        if (this.editIndex >= 0 && this.editIndex < this.stokList.length) {
          this.stokList[this.editIndex].qty = Number(this.editForm.qty);
          this.stokList[this.editIndex].safety = Number(this.editForm.safety);
          this.stokList[this.editIndex].lokasiRak = this.editForm.lokasiRak.trim();
          this.stokList[this.editIndex].harga = Number(this.editForm.harga);
          this.stokList[this.editIndex].catatanHTML = this.editForm.catatanHTML;

          this.showToast(
            `Data bahan ajar [${this.editForm.kode}] ${this.editForm.judul} berhasil diperbarui.`,
            'success'
          );
          this.closeEditModal();
        }
      },

      /**
       * Indikator 4: Methods - Toggle Form Tambah Baru
       */
      toggleAddForm() {
        this.showAddForm = !this.showAddForm;
        if (this.showAddForm) {
          this.addErrors = {};
          // Set default UPBJJ & Kategori jika belum terpilih
          if (!this.newForm.upbjj && this.upbjjList.length > 0) {
            this.newForm.upbjj = this.upbjjList[0];
          }
          if (!this.newForm.kategori && this.kategoriList.length > 1) {
            this.newForm.kategori = this.kategoriList[1];
          }
        }
      },

      /**
       * Indikator 4: Methods - Validasi dan Tambah Bahan Ajar Baru
       */
      submitNewBahanAjar() {
        this.addErrors = {};

        const kodeClean = (this.newForm.kode || '').trim().toUpperCase();
        if (!kodeClean || kodeClean.length < 4) {
          this.addErrors.kode = 'Kode mata kuliah wajib diisi (minimal 4 karakter, contoh: EKMA4216).';
        } else if (this.stokList.some(item => item.kode.toUpperCase() === kodeClean)) {
          this.addErrors.kode = 'Kode mata kuliah sudah terdaftar di sistem. Gunakan kode lain.';
        }

        const judulClean = (this.newForm.judul || '').trim();
        if (!judulClean || judulClean.length < 3) {
          this.addErrors.judul = 'Judul mata kuliah wajib diisi (minimal 3 karakter).';
        }

        if (!this.newForm.kategori || this.newForm.kategori === 'Semua Kategori') {
          this.addErrors.kategori = 'Pilih kategori mata kuliah yang valid.';
        }

        if (!this.newForm.upbjj || this.newForm.upbjj === 'Semua UT-Daerah') {
          this.addErrors.upbjj = 'Pilih UT-Daerah lokasi penyimpanan.';
        }

        const rakClean = (this.newForm.lokasiRak || '').trim();
        if (!rakClean) {
          this.addErrors.lokasiRak = 'Lokasi rak wajib diisi (contoh: Rak A-03).';
        }

        if (this.newForm.harga === '' || this.newForm.harga < 0) {
          this.addErrors.harga = 'Harga harus berupa angka 0 atau lebih.';
        }

        if (this.newForm.qty === '' || this.newForm.qty < 0) {
          this.addErrors.qty = 'Jumlah stok harus angka 0 atau lebih.';
        }

        if (this.newForm.safety === '' || this.newForm.safety < 0) {
          this.addErrors.safety = 'Safety stock harus angka 0 atau lebih.';
        }

        if (Object.keys(this.addErrors).length > 0) {
          this.showToast('Harap periksa isian formulir yang ditandai merah.', 'error');
          return;
        }

        // Tambahkan ke stokList
        const newItem = {
          kode: kodeClean,
          judul: judulClean,
          kategori: this.newForm.kategori,
          upbjj: this.newForm.upbjj,
          lokasiRak: rakClean,
          harga: Number(this.newForm.harga),
          qty: Number(this.newForm.qty),
          safety: Number(this.newForm.safety),
          catatanHTML: this.newForm.catatanHTML.trim() || '<strong>Stok Baru Ditambahkan</strong>'
        };

        this.stokList.unshift(newItem);

        this.showToast(
          `Bahan ajar [${newItem.kode}] ${newItem.judul} berhasil ditambahkan ke daftar stok.`,
          'success'
        );

        // Reset form
        this.newForm = {
          kode: '',
          judul: '',
          kategori: this.kategoriList[1] || '',
          upbjj: this.upbjjList[0] || '',
          lokasiRak: '',
          harga: 65000,
          qty: 100,
          safety: 50,
          catatanHTML: ''
        };
        this.showAddForm = false;
      },

      /**
       * Notifikasi Toast Ringan
       */
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
      console.log('SITTA UT - StokApp Vue.js berhasil di-mount dengan', this.stokList.length, 'data bahan ajar.');
    }
  });

  // Mount aplikasi Vue ke elemen #stok-app
  const mountApp = () => {
    const el = document.getElementById('stok-app');
    if (el && !el.__vue_app__) {
      StokApp.mount('#stok-app');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountApp);
  } else {
    mountApp();
  }
}

