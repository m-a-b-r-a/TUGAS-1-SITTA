/**
 * SITTA UT - Main Controller & Event Dispatcher
 * Mengintegrasikan dataPengguna, dataBahanAjar, dan dataTracking
 */

import {
  dataPengguna,
  dataBahanAjar,
  dataTracking,
  FAKULTAS_LIST,
  PRODI_LIST,
  UPBJJ_LIST,
  EKSPEDISI_LIST,
  KATALOG_BMP,
  INITIAL_ORDERS,
} from './data.js';

import {
  validateNIM,
  validateNama,
  validatePhone,
  validateAlamat,
  validateItems,
  calculateOrderTotals,
  formatRupiah,
} from './validation.js';

import {
  showToast,
  openModal,
  closeModal,
  renderCatalogGrid,
  renderCartItems,
  renderOrdersTable,
  renderTrackingView,
} from './dom.js';

// Application State
const state = {
  currentUser: dataPengguna[0],
  orders: [],
  cartItems: [],
  activeTab: 'catalog',
  selectedUPBJJ: UPBJJ_LIST[0],
  metodePengiriman: 'delivery',
  selectedEkspedisi: EKSPEDISI_LIST[0].nama,
  promoCode: '',
  catalogSearch: '',
  catalogFaculty: 'ALL',
  orderSearch: '',
  orderStatusFilter: 'ALL',
  orderSort: 'NEWEST',
  activeDetailOrder: null,
  orderToDelete: null,
  orderToUpdateStatus: null,
};

// LocalStorage Keys
const STORAGE_KEY_ORDERS = 'sitta_ut_orders_v2';

/**
 * Inisialisasi Data dari LocalStorage atau Mock Data
 */
function initData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
    if (saved) {
      state.orders = JSON.parse(saved);
    } else {
      state.orders = [...INITIAL_ORDERS];
      saveOrders();
    }
  } catch (err) {
    console.error('Gagal membaca LocalStorage:', err);
    state.orders = [...INITIAL_ORDERS];
  }

  // Pre-seed keranjang pemesanan dengan buku pertama dari dataBahanAjar
  if (state.cartItems.length === 0 && KATALOG_BMP.length > 0) {
    state.cartItems = [{ ...KATALOG_BMP[0], qty: 1 }];
  }
}

function saveOrders() {
  try {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(state.orders));
  } catch (err) {
    console.error('Gagal menyimpan LocalStorage:', err);
  }
}

/**
 * Setup Pengguna Aktif & Multi-Role dari dataPengguna
 */
function setupUserSwitcher() {
  const selector = document.getElementById('userRoleSelector');
  if (!selector) return;

  selector.innerHTML = '';
  dataPengguna.forEach((user) => {
    const opt = document.createElement('option');
    opt.value = user.id;
    opt.textContent = `${user.nama} (${user.role} - ${user.lokasi})`;
    selector.appendChild(opt);
  });

  selector.value = state.currentUser.id;

  selector.addEventListener('change', (e) => {
    const userId = parseInt(e.target.value, 10);
    const selected = dataPengguna.find((u) => u.id === userId);
    if (selected) {
      state.currentUser = selected;
      showToast(
        'Peran Pengguna Aktif',
        `Login sebagai: ${selected.nama} (${selected.role} - ${selected.lokasi})`,
        'info'
      );
    }
  });
}

/**
 * Setup Tabs Navigasi
 */
function setupTabs() {
  const navButtons = document.querySelectorAll('.nav-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  document.querySelectorAll('[data-goto-tab]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = el.getAttribute('data-goto-tab');
      switchTab(target);
    });
  });
}

export function switchTab(tabId) {
  state.activeTab = tabId;

  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });

  document.querySelectorAll('.tab-pane').forEach((pane) => {
    pane.classList.toggle('active', pane.id === `tab-${tabId}`);
  });

  // Refresh tab-specific views
  if (tabId === 'orders') {
    applyOrdersFilterAndRender();
  } else if (tabId === 'tracking') {
    // Tampilkan dataTracking default dari Rina Wulandari (2023001234)
    if (dataTracking['2023001234']) {
      renderTrackingView(dataTracking['2023001234']);
    } else if (state.orders.length > 0) {
      renderTrackingView(state.orders[0]);
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Setup Katalog & Filter (dari dataBahanAjar)
 */
function setupCatalog() {
  const searchInput = document.getElementById('catalogSearchInput');
  const facultySelect = document.getElementById('catalogFacultySelect');

  if (facultySelect) {
    facultySelect.innerHTML = '<option value="ALL">Semua Fakultas / Kategori</option>';
    FAKULTAS_LIST.forEach((f) => {
      facultySelect.innerHTML += `<option value="${f.id}">${f.nama}</option>`;
    });

    facultySelect.addEventListener('change', (e) => {
      state.catalogFaculty = e.target.value;
      filterAndRenderCatalog();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.catalogSearch = e.target.value.toLowerCase().trim();
      filterAndRenderCatalog();
    });
  }

  filterAndRenderCatalog();
}

function filterAndRenderCatalog() {
  let filtered = KATALOG_BMP.filter((book) => {
    const matchFaculty = state.catalogFaculty === 'ALL' || book.fakultas === state.catalogFaculty;
    const matchSearch = !state.catalogSearch ||
      book.judul.toLowerCase().includes(state.catalogSearch) ||
      book.kode.toLowerCase().includes(state.catalogSearch) ||
      (book.kodeLokasi && book.kodeLokasi.toLowerCase().includes(state.catalogSearch));
    return matchFaculty && matchSearch;
  });

  renderCatalogGrid(filtered, (book) => {
    addToCart(book);
  });
}

function addToCart(book) {
  const existing = state.cartItems.find((item) => item.id === book.id);
  if (existing) {
    existing.qty += 1;
    showToast('Bahan Ajar Diperbarui', `Jumlah ${book.kode} bertambah menjadi ${existing.qty} eksemplar.`, 'info');
  } else {
    state.cartItems.push({ ...book, qty: 1 });
    showToast('Berhasil Ditambahkan', `${book.kode} - ${book.judul} dimasukkan ke formulir pesanan.`, 'success');
  }

  renderCart();
  updateCalculations();
}

/**
 * Setup Dropdown Cascading Fakultas & Prodi
 */
function setupCascadingDropdowns() {
  const fakultasSelect = document.getElementById('mhsFakultas');
  const prodiSelect = document.getElementById('mhsProdi');
  const upbjjSelect = document.getElementById('mhsUpbjj');
  const ekspedisiSelect = document.getElementById('ekspedisiSelect');

  if (fakultasSelect && prodiSelect) {
    fakultasSelect.innerHTML = '<option value="">-- Pilih Fakultas --</option>';
    FAKULTAS_LIST.forEach((f) => {
      fakultasSelect.innerHTML += `<option value="${f.id}">${f.nama}</option>`;
    });

    fakultasSelect.addEventListener('change', (e) => {
      const fak = e.target.value;
      prodiSelect.innerHTML = '<option value="">-- Pilih Program Studi --</option>';
      if (PRODI_LIST[fak]) {
        PRODI_LIST[fak].forEach((p) => {
          prodiSelect.innerHTML += `<option value="${p}">${p}</option>`;
        });
      }
      validateField(fakultasSelect, !!fak, 'Pilih fakultas mahasiswa');
    });

    prodiSelect.addEventListener('change', () => {
      validateField(prodiSelect, !!prodiSelect.value, 'Pilih program studi mahasiswa');
    });
  }

  if (upbjjSelect) {
    upbjjSelect.innerHTML = '<option value="">-- Pilih UPBJJ UT Terdekat --</option>';
    UPBJJ_LIST.forEach((u) => {
      upbjjSelect.innerHTML += `<option value="${u.kode}">${u.nama} (Lokasi: ${u.lokasiKode} &bull; Ongkir: ${formatRupiah(u.ongkir)})</option>`;
    });

    upbjjSelect.addEventListener('change', (e) => {
      const selected = UPBJJ_LIST.find((u) => u.kode === e.target.value);
      state.selectedUPBJJ = selected || UPBJJ_LIST[0];
      validateField(upbjjSelect, !!selected, 'Pilih UPBJJ UT daerah asal');
      updateCalculations();
    });
  }

  if (ekspedisiSelect) {
    ekspedisiSelect.innerHTML = '';
    EKSPEDISI_LIST.forEach((ek) => {
      ekspedisiSelect.innerHTML += `<option value="${ek.nama}">${ek.nama} (${ek.estimasi})</option>`;
    });
    ekspedisiSelect.addEventListener('change', (e) => {
      state.selectedEkspedisi = e.target.value;
    });
  }
}

/**
 * Setup Radio Metode Pengiriman
 */
function setupDeliveryMethod() {
  const radios = document.querySelectorAll('input[name="metodePengiriman"]');
  const addressSection = document.getElementById('addressFieldsContainer');
  const radioCards = document.querySelectorAll('.radio-card');

  radios.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      state.metodePengiriman = e.target.value;

      radioCards.forEach((card) => card.classList.remove('active'));
      const activeCard = radio.closest('.radio-card');
      if (activeCard) activeCard.classList.add('active');

      if (addressSection) {
        if (state.metodePengiriman === 'pickup') {
          addressSection.style.display = 'none';
        } else {
          addressSection.style.display = 'block';
        }
      }

      updateCalculations();
    });
  });
}

function validateField(inputEl, isValid, errorMsg) {
  if (!inputEl) return;
  const parent = inputEl.closest('.form-group') || inputEl.parentElement;
  let errorEl = parent ? parent.querySelector('.field-error-msg') : null;

  if (!isValid) {
    inputEl.classList.add('input-error');
    inputEl.classList.remove('input-valid');
    if (errorEl) {
      errorEl.textContent = errorMsg;
      errorEl.classList.add('visible');
    }
  } else {
    inputEl.classList.remove('input-error');
    inputEl.classList.add('input-valid');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }
}

function setupRealtimeValidation() {
  const nimInput = document.getElementById('mhsNIM');
  const namaInput = document.getElementById('mhsNama');
  const hpInput = document.getElementById('mhsNoHp');
  const alamatInput = document.getElementById('mhsAlamat');
  const posInput = document.getElementById('mhsKodePos');

  if (nimInput) {
    nimInput.addEventListener('input', () => {
      const res = validateNIM(nimInput.value);
      validateField(nimInput, res.isValid, res.message);
    });
  }

  if (namaInput) {
    namaInput.addEventListener('input', () => {
      const res = validateNama(namaInput.value);
      validateField(namaInput, res.isValid, res.message);
    });
  }

  if (hpInput) {
    hpInput.addEventListener('input', () => {
      const res = validatePhone(hpInput.value);
      validateField(hpInput, res.isValid, res.message);
    });
  }

  if (alamatInput) {
    alamatInput.addEventListener('input', () => {
      if (state.metodePengiriman === 'delivery') {
        validateField(alamatInput, alamatInput.value.trim().length >= 10, 'Alamat minimal 10 karakter');
      }
    });
  }

  if (posInput) {
    posInput.addEventListener('input', () => {
      if (state.metodePengiriman === 'delivery') {
        const isValidPos = /^\d{5}$/.test(posInput.value.trim());
        validateField(posInput, isValidPos, 'Kode pos harus 5 digit angka');
      }
    });
  }

  const btnOpenQuickBMP = document.getElementById('btnQuickSelectBMP');
  if (btnOpenQuickBMP) {
    btnOpenQuickBMP.addEventListener('click', () => {
      openQuickBmpModal();
    });
  }

  const btnAutofill = document.getElementById('btnAutofillDemo');
  if (btnAutofill) {
    btnAutofill.addEventListener('click', () => {
      autofillDemoData();
    });
  }

  const btnApplyPromo = document.getElementById('btnApplyPromo');
  const promoInput = document.getElementById('promoCodeInput');
  if (btnApplyPromo && promoInput) {
    btnApplyPromo.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (!code) {
        showToast('Kode Kosong', 'Masukkan kode voucher terlebih dahulu (misal: UTBEASISWA atau MHSBARU)', 'error');
        return;
      }
      if (code === 'UTBEASISWA' || code === 'MHSBARU' || code === 'GRATISONGKIR') {
        state.promoCode = code;
        showToast('Voucher Berhasil Digunakan', `Kupon diskon ${code} aktif! Potongan biaya telah dihitung.`, 'success');
      } else {
        showToast('Voucher Tidak Valid', 'Gunakan voucher yang tersedia: UTBEASISWA, MHSBARU, atau GRATISONGKIR', 'error');
        state.promoCode = '';
      }
      updateCalculations();
    });
  }
}

function autofillDemoData() {
  const nimInput = document.getElementById('mhsNIM');
  const namaInput = document.getElementById('mhsNama');
  const fakultasSelect = document.getElementById('mhsFakultas');
  const prodiSelect = document.getElementById('mhsProdi');
  const upbjjSelect = document.getElementById('mhsUpbjj');
  const hpInput = document.getElementById('mhsNoHp');
  const alamatInput = document.getElementById('mhsAlamat');
  const posInput = document.getElementById('mhsKodePos');
  const agreeCheck = document.getElementById('agreementCheck');

  if (nimInput) nimInput.value = '043819274';
  if (namaInput) namaInput.value = state.currentUser ? state.currentUser.nama : 'Rina Wulandari';
  if (hpInput) hpInput.value = '081298765432';

  if (fakultasSelect) {
    fakultasSelect.value = 'FHISIP';
    fakultasSelect.dispatchEvent(new Event('change'));
  }
  if (prodiSelect) {
    prodiSelect.value = 'Ilmu Komunikasi (S1)';
  }
  if (upbjjSelect) {
    upbjjSelect.value = '0JKT01';
    upbjjSelect.dispatchEvent(new Event('change'));
  }
  if (alamatInput) {
    alamatInput.value = 'Jl. Salemba Raya No. 10B, Paseban, Senen, Jakarta Pusat';
  }
  if (posInput) {
    posInput.value = '10440';
  }
  if (agreeCheck) {
    agreeCheck.checked = true;
  }

  // Pre-seed dengan bahan ajar ASIP4301 dan EKMA4216
  state.cartItems = [
    { ...KATALOG_BMP[0], qty: 1 },
    { ...KATALOG_BMP[1], qty: 1 },
  ];
  renderCart();
  updateCalculations();

  showToast('Autofill Berhasil', 'Data pemesan dan modul bahan ajar berhasil diisi otomatis.', 'info');
}

function renderCart() {
  renderCartItems(
    state.cartItems,
    (id, newQty) => {
      const item = state.cartItems.find((i) => i.id === id);
      if (item) {
        item.qty = newQty;
        updateCalculations();
      }
    },
    (id) => {
      state.cartItems = state.cartItems.filter((i) => i.id !== id);
      renderCart();
      updateCalculations();
      showToast('Item Dihapus', 'Bahan ajar dikeluarkan dari daftar pesanan.', 'info');
    }
  );
}

function updateCalculations() {
  const ongkirBase = state.selectedUPBJJ ? state.selectedUPBJJ.ongkir : 15000;
  const totals = calculateOrderTotals(state.cartItems, state.metodePengiriman, ongkirBase, state.promoCode);

  const totalSksEl = document.getElementById('summaryTotalSKS');
  const totalBukuEl = document.getElementById('summaryTotalBuku');
  const subtotalEl = document.getElementById('summarySubtotal');
  const ongkirEl = document.getElementById('summaryOngkir');
  const diskonRowEl = document.getElementById('summaryDiskonRow');
  const diskonEl = document.getElementById('summaryDiskon');
  const grandTotalEl = document.getElementById('summaryGrandTotal');

  if (totalSksEl) totalSksEl.textContent = `${totals.totalSKS} SKS`;
  if (totalBukuEl) totalBukuEl.textContent = `${totals.totalBuku} Eksemplar`;
  if (subtotalEl) subtotalEl.textContent = formatRupiah(totals.subtotalBuku);
  if (ongkirEl) {
    ongkirEl.textContent = state.metodePengiriman === 'pickup' ? 'Rp 0 (Ambil Mandiri)' : formatRupiah(totals.ongkir);
  }

  if (diskonRowEl && diskonEl) {
    if (totals.diskon > 0) {
      diskonRowEl.style.display = 'flex';
      diskonEl.textContent = `- ${formatRupiah(totals.diskon)}`;
    } else {
      diskonRowEl.style.display = 'none';
    }
  }

  if (grandTotalEl) grandTotalEl.textContent = formatRupiah(totals.grandTotal);
}

function openQuickBmpModal() {
  const modalBody = document.getElementById('quickBmpList');
  if (!modalBody) return;

  modalBody.innerHTML = '';
  KATALOG_BMP.forEach((book) => {
    const isAlreadyIn = state.cartItems.some((i) => i.id === book.id);
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.justifyContent = 'space-between';
    row.style.padding = '8px 12px';
    row.style.borderBottom = '1px solid #E2E8F0';
    row.style.gap = '12px';

    row.innerHTML = `
      <div style="flex:1;">
        <strong style="color: var(--ut-primary-navy);">${book.kode}</strong> - ${book.judul}
        <div style="font-size:0.75rem; color:#64748b;">Lokasi: ${book.kodeLokasi || 'Puslaba'} &bull; ${book.edisi} &bull; ${formatRupiah(book.harga)} &bull; Stok: ${book.stokPuslaba}</div>
      </div>
      <button type="button" class="btn btn-sm ${isAlreadyIn ? 'btn-outline' : 'btn-primary'}" data-id="${book.id}">
        ${isAlreadyIn ? 'Sudah Ada' : '+ Pilih'}
      </button>
    `;

    const btn = row.querySelector('button');
    btn.addEventListener('click', () => {
      addToCart(book);
      btn.textContent = 'Sudah Ada';
      btn.className = 'btn btn-sm btn-outline';
    });

    modalBody.appendChild(row);
  });

  openModal('modalQuickBmp');
}

function setupFormSubmit() {
  const form = document.getElementById('sittaOrderForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nimInput = document.getElementById('mhsNIM');
    const nimVal = nimInput ? nimInput.value : '';
    const nimCheck = validateNIM(nimVal);
    validateField(nimInput, nimCheck.isValid, nimCheck.message);

    const namaInput = document.getElementById('mhsNama');
    const namaVal = namaInput ? namaInput.value : '';
    const namaCheck = validateNama(namaVal);
    validateField(namaInput, namaCheck.isValid, namaCheck.message);

    const hpInput = document.getElementById('mhsNoHp');
    const hpVal = hpInput ? hpInput.value : '';
    const hpCheck = validatePhone(hpVal);
    validateField(hpInput, hpCheck.isValid, hpCheck.message);

    const fakSelect = document.getElementById('mhsFakultas');
    const prodiSelect = document.getElementById('mhsProdi');
    const upbjjSelect = document.getElementById('mhsUpbjj');
    validateField(fakSelect, !!(fakSelect && fakSelect.value), 'Pilih fakultas');
    validateField(prodiSelect, !!(prodiSelect && prodiSelect.value), 'Pilih program studi');
    validateField(upbjjSelect, !!(upbjjSelect && upbjjSelect.value), 'Pilih UPBJJ UT');

    const alamatInput = document.getElementById('mhsAlamat');
    const posInput = document.getElementById('mhsKodePos');
    let alamatCheck = { isValid: true, message: '' };
    if (state.metodePengiriman === 'delivery') {
      alamatCheck = validateAlamat(
        'delivery',
        alamatInput ? alamatInput.value : '',
        posInput ? posInput.value : ''
      );
      validateField(alamatInput, alamatInput && alamatInput.value.trim().length >= 10, 'Alamat lengkap wajib diisi min 10 karakter');
      validateField(posInput, posInput && /^\d{5}$/.test(posInput.value.trim()), 'Kode pos 5 digit');
    }

    const itemsCheck = validateItems(state.cartItems);
    const agreeCheck = document.getElementById('agreementCheck');
    const isAgreed = agreeCheck ? agreeCheck.checked : false;

    if (
      !nimCheck.isValid ||
      !namaCheck.isValid ||
      !hpCheck.isValid ||
      !fakSelect.value ||
      !prodiSelect.value ||
      !upbjjSelect.value ||
      !alamatCheck.isValid ||
      !itemsCheck.isValid ||
      !isAgreed
    ) {
      let errorMsg = 'Silakan lengkapi formulir dengan benar.';
      if (!itemsCheck.isValid) errorMsg = itemsCheck.message;
      else if (!isAgreed) errorMsg = 'Anda harus menyetujui syarat & ketentuan pemesanan bahan ajar.';
      else if (!nimCheck.isValid) errorMsg = nimCheck.message;

      showToast('Validasi Gagal', errorMsg, 'error');
      return;
    }

    const totals = calculateOrderTotals(
      state.cartItems,
      state.metodePengiriman,
      state.selectedUPBJJ ? state.selectedUPBJJ.ongkir : 15000,
      state.promoCode
    );

    showOrderConfirmationModal({
      nim: nimVal.trim(),
      nama: namaVal.trim(),
      fakultas: fakSelect.value,
      prodi: prodiSelect.value,
      upbjjKode: state.selectedUPBJJ.kode,
      upbjjNama: state.selectedUPBJJ.nama,
      noHp: hpVal.trim(),
      metode: state.metodePengiriman,
      alamat: state.metodePengiriman === 'pickup'
        ? `Pengambilan mandiri di Loket Pelayanan BMP ${state.selectedUPBJJ.nama}`
        : (alamatInput ? alamatInput.value.trim() : ''),
      kodePos: state.metodePengiriman === 'pickup' ? '' : (posInput ? posInput.value.trim() : ''),
      ekspedisi: state.metodePengiriman === 'pickup' ? 'Ambil Mandiri di UPBJJ' : state.selectedEkspedisi,
      items: [...state.cartItems],
      ...totals,
    });
  });
}

function showOrderConfirmationModal(orderData) {
  const modalContent = document.getElementById('confirmOrderContent');
  const confirmBtn = document.getElementById('btnConfirmPlaceOrder');
  if (!modalContent || !confirmBtn) return;

  modalContent.innerHTML = `
    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
      <h4 style="color: var(--ut-primary-navy); margin-bottom: 8px; font-weight: 700;">Identitas Mahasiswa</h4>
      <div style="font-size: 0.85rem; line-height: 1.6;">
        <div>NIM: <strong>${orderData.nim}</strong></div>
        <div>Nama: <strong>${orderData.nama}</strong></div>
        <div>Program Studi: ${orderData.prodi} (${orderData.fakultas})</div>
        <div>UPBJJ-UT Asal: <strong>${orderData.upbjjNama}</strong></div>
        <div>Nomor Kontak: ${orderData.noHp}</div>
        <div>Metode: <strong>${orderData.metode === 'pickup' ? 'Ambil di Kantor UPBJJ' : 'Kirim ke Alamat Rumah'}</strong></div>
        <div>Tujuan: <em>${orderData.alamat} ${orderData.kodePos ? `(${orderData.kodePos})` : ''}</em></div>
      </div>
    </div>

    <h4 style="color: var(--ut-primary-navy); margin-bottom: 8px; font-weight: 700;">Daftar Bahan Ajar (${orderData.totalBuku} buku / ${orderData.totalSKS} SKS)</h4>
    <div style="border: 1px solid #E2E8F0; border-radius: 6px; overflow: hidden; margin-bottom: 16px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem;">
        <thead style="background: #F1F5F9;">
          <tr>
            <th style="padding: 8px 12px; text-align: left;">Bahan Ajar</th>
            <th style="padding: 8px 12px; text-align: center;">Lokasi</th>
            <th style="padding: 8px 12px; text-align: center;">Qty</th>
            <th style="padding: 8px 12px; text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${orderData.items.map(item => `
            <tr style="border-top: 1px solid #E2E8F0;">
              <td style="padding: 8px 12px;"><strong>${item.kode || item.kodeBarang}</strong> - ${item.judul}</td>
              <td style="padding: 8px 12px; text-align: center;">${item.kodeLokasi || 'Puslaba'}</td>
              <td style="padding: 8px 12px; text-align: center;">${item.qty}</td>
              <td style="padding: 8px 12px; text-align: right;">${formatRupiah(item.harga * item.qty)}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot style="background: #F8FAFC; border-top: 2px solid #CBD5E1; font-weight: 700;">
          <tr>
            <td colspan="3" style="padding: 8px 12px; text-align: right;">Subtotal BMP:</td>
            <td style="padding: 8px 12px; text-align: right;">${formatRupiah(orderData.subtotalBuku)}</td>
          </tr>
          <tr>
            <td colspan="3" style="padding: 8px 12px; text-align: right;">Ongkir (${orderData.ekspedisi}):</td>
            <td style="padding: 8px 12px; text-align: right;">${formatRupiah(orderData.ongkir)}</td>
          </tr>
          ${orderData.diskon > 0 ? `
            <tr style="color: var(--color-success);">
              <td colspan="3" style="padding: 8px 12px; text-align: right;">Potongan Diskon:</td>
              <td style="padding: 8px 12px; text-align: right;">- ${formatRupiah(orderData.diskon)}</td>
            </tr>
          ` : ''}
          <tr style="font-size: 0.95rem; color: var(--ut-primary-navy);">
            <td colspan="3" style="padding: 10px 12px; text-align: right;">TOTAL TAGIHAN:</td>
            <td style="padding: 10px 12px; text-align: right; font-weight: 800;">${formatRupiah(orderData.grandTotal)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;

  const newConfirmBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

  newConfirmBtn.addEventListener('click', () => {
    executePlaceOrder(orderData);
    closeModal('modalConfirmOrder');
  });

  openModal('modalConfirmOrder');
}

function executePlaceOrder(orderData) {
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newOrderId = `202600${randomSuffix}`;

  const resiPrefix = orderData.metode === 'pickup' ? 'PICKUP' : 'POSUT';
  const newResi = `${resiPrefix}${Math.floor(100000 + Math.random() * 900000)}`;

  const finalOrder = {
    ...orderData,
    orderId: newOrderId,
    nomorDO: newOrderId,
    nomorResi: newResi,
    status: 'Diproses di Gudang Puslaba',
    tanggalPesan: dateStr,
    catatan: 'Pesanan dibuat melalui SITTA UT Web.',
  };

  state.orders.unshift(finalOrder);
  saveOrders();

  const form = document.getElementById('sittaOrderForm');
  if (form) form.reset();
  state.cartItems = [];
  renderCart();
  updateCalculations();

  showToast('Pesanan Berhasil Dibuat!', `No. DO / Pesanan: ${newOrderId}. Data telah disimpan ke sistem SITTA.`, 'success');
  switchTab('orders');
}

function applyOrdersFilterAndRender() {
  let list = [...state.orders];

  if (state.orderSearch) {
    const q = state.orderSearch.toLowerCase();
    list = list.filter((o) =>
      (o.orderId && o.orderId.toLowerCase().includes(q)) ||
      (o.nomorDO && o.nomorDO.toLowerCase().includes(q)) ||
      (o.nim && o.nim.toLowerCase().includes(q)) ||
      (o.nama && o.nama.toLowerCase().includes(q)) ||
      (o.nomorResi && o.nomorResi.toLowerCase().includes(q))
    );
  }

  if (state.orderStatusFilter !== 'ALL') {
    list = list.filter((o) => o.status === state.orderStatusFilter);
  }

  if (state.orderSort === 'NEWEST') {
    list.sort((a, b) => (b.tanggalPesan || b.tanggalKirim || '').localeCompare(a.tanggalPesan || a.tanggalKirim || ''));
  } else if (state.orderSort === 'OLDEST') {
    list.sort((a, b) => (a.tanggalPesan || a.tanggalKirim || '').localeCompare(b.tanggalPesan || b.tanggalKirim || ''));
  } else if (state.orderSort === 'TOTAL_HIGH') {
    list.sort((a, b) => (b.grandTotal || 0) - (a.grandTotal || 0));
  } else if (state.orderSort === 'TOTAL_LOW') {
    list.sort((a, b) => (a.grandTotal || 0) - (b.grandTotal || 0));
  }

  renderOrdersTable(list, {
    onViewDetail: (order) => openOrderDetailModal(order),
    onUpdateStatus: (order) => openUpdateStatusModal(order),
    onDeleteOrder: (order) => openDeleteConfirmModal(order),
  });
}

function setupOrdersToolbar() {
  const searchInput = document.getElementById('orderSearchInput');
  const statusSelect = document.getElementById('orderStatusFilter');
  const sortSelect = document.getElementById('orderSortSelect');
  const resetBtn = document.getElementById('btnResetDemoData');
  const exportBtn = document.getElementById('btnExportJson');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.orderSearch = e.target.value.trim();
      applyOrdersFilterAndRender();
    });
  }

  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      state.orderStatusFilter = e.target.value;
      applyOrdersFilterAndRender();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.orderSort = e.target.value;
      applyOrdersFilterAndRender();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Kembalikan data transaksi ke data awal praktikum?')) {
        state.orders = [...INITIAL_ORDERS];
        saveOrders();
        applyOrdersFilterAndRender();
        showToast('Data Direset', 'Data transaksi SITTA telah dikembalikan ke kondisi awal demonstrasi.', 'info');
      }
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state.orders, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `SITTA_UT_Orders_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Export Berhasil', 'File data transaksi JSON berhasil diunduh.', 'success');
    });
  }
}

function openOrderDetailModal(order) {
  state.activeDetailOrder = order;
  const content = document.getElementById('orderDetailContent');
  if (!content) return;

  const orderNum = order.nomorDO || order.orderId;
  const totalFormatted = order.total || formatRupiah(order.grandTotal);

  content.innerHTML = `
    <div style="border-bottom: 2px solid var(--ut-accent-gold); padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
      <div>
        <h3 style="color: var(--ut-primary-navy); margin: 0; font-size: 1.25rem;">UNIVERSITAS TERBUKA</h3>
        <p style="margin: 0; font-size: 0.8rem; color: #64748b;">SISTEM INFORMASI TIRAS DAN TRANSAKSI BAHAN AJAR (SITTA)</p>
      </div>
      <div style="text-align: right;">
        <span class="badge badge-primary" style="font-size: 0.85rem; padding: 4px 10px;">${order.status}</span>
        <div style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">Tgl: ${order.tanggalPesan || order.tanggalKirim || '-'}</div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; font-size: 0.85rem; background: #F8FAFC; padding: 14px; border-radius: 8px;">
      <div>
        <div style="color: #64748b; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">Nomor Delivery Order (DO)</div>
        <strong style="color: var(--ut-primary-navy); font-size: 1.1rem;">${orderNum}</strong>
        <div style="margin-top: 8px;"><span style="color: #64748b;">Penerima:</span> <strong>${order.nama}</strong></div>
        <div><span style="color: #64748b;">NIM:</span> ${order.nim || 'Mahasiswa UT'}</div>
        <div><span style="color: #64748b;">Prodi:</span> ${order.prodi || '-'}</div>
      </div>
      <div>
        <div style="color: #64748b; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">Pengiriman & Distribusi</div>
        <div><span style="color: #64748b;">UPBJJ / Lokasi:</span> <strong>${order.upbjjNama || order.paket || '-'}</strong></div>
        <div><span style="color: #64748b;">Ekspedisi:</span> ${order.ekspedisi || '-'}</div>
        <div><span style="color: #64748b;">No. Resi:</span> <strong style="color: #0066B3;">${order.nomorResi || '-'}</strong></div>
        <div style="margin-top: 4px; font-size: 0.8rem; color: #475569;"><em>${order.alamat || 'Alamat mahasiswa sesuai data akademik UT'}</em></div>
      </div>
    </div>

    <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--ut-primary-navy); margin-bottom: 8px;">Daftar Bahan Ajar (BMP)</h4>
    <div style="border: 1px solid #E2E8F0; border-radius: 6px; overflow: hidden; margin-bottom: 16px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
        <thead style="background: #F1F5F9;">
          <tr>
            <th style="padding: 8px 12px; text-align: left;">Kode & Judul</th>
            <th style="padding: 8px 12px; text-align: center;">Lokasi</th>
            <th style="padding: 8px 12px; text-align: center;">Harga</th>
            <th style="padding: 8px 12px; text-align: center;">Qty</th>
            <th style="padding: 8px 12px; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${(order.items || []).map(i => `
            <tr style="border-top: 1px solid #E2E8F0;">
              <td style="padding: 8px 12px;"><strong>${i.kode || i.kodeBarang}</strong> - ${i.judul}</td>
              <td style="padding: 8px 12px; text-align: center;">${i.kodeLokasi || order.paket || 'Puslaba'}</td>
              <td style="padding: 8px 12px; text-align: center;">${formatRupiah(i.harga)}</td>
              <td style="padding: 8px 12px; text-align: center;">${i.qty}</td>
              <td style="padding: 8px 12px; text-align: right;">${formatRupiah(i.harga * i.qty)}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot style="background: #F8FAFC; border-top: 2px solid #CBD5E1; font-weight: 700;">
          <tr style="font-size: 1rem; color: var(--ut-primary-navy);">
            <td colspan="4" style="padding: 10px 12px; text-align: right;">TOTAL PEMBAYARAN:</td>
            <td style="padding: 10px 12px; text-align: right; font-weight: 800;">${totalFormatted}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div style="font-size: 0.75rem; color: #64748b; background: #FFFBEB; border-left: 3px solid #F5A623; padding: 8px 12px; border-radius: 4px;">
      * Bukti transaksi resmi ini sah diterbitkan oleh sistem SITTA Universitas Terbuka sebagai dokumen distribusi dan tanda terima bahan ajar.
    </div>
  `;

  const btnPrint = document.getElementById('btnPrintOrderDetail');
  if (btnPrint) {
    btnPrint.onclick = () => window.print();
  }

  const btnTrackOrderFromDetail = document.getElementById('btnTrackFromDetail');
  if (btnTrackOrderFromDetail) {
    btnTrackOrderFromDetail.onclick = () => {
      closeModal('modalOrderDetail');
      switchTab('tracking');
      renderTrackingView(dataTracking[orderNum] || order);
    };
  }

  openModal('modalOrderDetail');
}

function openUpdateStatusModal(order) {
  state.orderToUpdateStatus = order;
  const selectStatus = document.getElementById('updateStatusSelect');
  const resiInput = document.getElementById('updateResiInput');
  const titleEl = document.getElementById('updateStatusOrderTitle');

  if (titleEl) {
    titleEl.textContent = `${order.nomorDO || order.orderId} (${order.nama})`;
  }
  if (selectStatus) {
    selectStatus.value = order.status;
  }
  if (resiInput) {
    resiInput.value = order.nomorResi || '';
  }

  const saveBtn = document.getElementById('btnSaveUpdateStatus');
  if (saveBtn) {
    saveBtn.onclick = () => {
      if (state.orderToUpdateStatus) {
        state.orderToUpdateStatus.status = selectStatus.value;
        state.orderToUpdateStatus.nomorResi = resiInput.value.trim();
        saveOrders();
        applyOrdersFilterAndRender();
        closeModal('modalUpdateStatus');
        showToast('Status Diperbarui', `Status pesanan ${order.orderId} kini "${selectStatus.value}".`, 'success');
      }
    };
  }

  openModal('modalUpdateStatus');
}

function openDeleteConfirmModal(order) {
  state.orderToDelete = order;
  const descEl = document.getElementById('deleteConfirmDesc');
  if (descEl) {
    descEl.textContent = `Apakah Anda yakin ingin menghapus data transaksi ${order.nomorDO || order.orderId} atas nama ${order.nama}? Tindakan ini tidak dapat dibatalkan.`;
  }

  const confirmBtn = document.getElementById('btnConfirmDelete');
  if (confirmBtn) {
    confirmBtn.onclick = () => {
      if (state.orderToDelete) {
        state.orders = state.orders.filter((o) => (o.orderId !== state.orderToDelete.orderId && o.nomorDO !== state.orderToDelete.nomorDO));
        saveOrders();
        applyOrdersFilterAndRender();
        closeModal('modalDeleteConfirm');
        showToast('Data Dihapus', `Pesanan telah berhasil dihapus dari tabel.`, 'info');
        state.orderToDelete = null;
      }
    };
  }

  openModal('modalDeleteConfirm');
}

/**
 * Setup Tracking Search (Mencari dari dataTracking & state.orders)
 */
function setupTrackingSearch() {
  const input = document.getElementById('trackingSearchInput');
  const btn = document.getElementById('btnSearchTracking');

  const doSearch = (queryVal) => {
    const q = (queryVal || (input ? input.value : '')).trim();
    if (!q) {
      showToast('Input Kosong', 'Masukkan nomor DO atau nomor pesanan (misal: 2023001234 atau 2023005678)', 'error');
      return;
    }

    // 1. Cek di dataTracking terlebih dahulu
    if (dataTracking[q]) {
      renderTrackingView(dataTracking[q]);
      showToast('DO Ditemukan', `Menampilkan riwayat pelacakan Delivery Order: ${q}`, 'success');
      return;
    }

    // 2. Cek di array state.orders
    const match = state.orders.find(
      (o) =>
        (o.orderId && o.orderId.toLowerCase() === q.toLowerCase()) ||
        (o.nomorDO && o.nomorDO.toLowerCase() === q.toLowerCase()) ||
        (o.nomorResi && o.nomorResi.toLowerCase() === q.toLowerCase()) ||
        (o.nama && o.nama.toLowerCase().includes(q.toLowerCase()))
    );

    if (match) {
      renderTrackingView(match);
      showToast('Paket Ditemukan', `Menampilkan progres pengiriman untuk ${match.nomorDO || match.orderId}.`, 'success');
    } else {
      showToast('Tidak Ditemukan', `Tidak ada data tracking untuk Nomor DO / Resi "${q}". Coba: 2023001234 atau 2023005678`, 'error');
    }
  };

  if (btn && input) {
    btn.addEventListener('click', () => doSearch());
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doSearch();
    });
  }

  // Helper global untuk klik link contoh DO
  window.trackDO = (doNumber) => {
    if (input) input.value = doNumber;
    switchTab('tracking');
    doSearch(doNumber);
  };
}

function setupGlobalModals() {
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });

  document.querySelectorAll('.modal-close-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        closeModal(modal.id);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach((modal) => {
        closeModal(modal.id);
      });
    }
  });
}

/**
 * Main DOMContentLoaded Bootstrapper
 */
window.addEventListener('DOMContentLoaded', () => {
  initData();
  setupUserSwitcher();
  setupTabs();
  setupCatalog();
  setupCascadingDropdowns();
  setupDeliveryMethod();
  setupRealtimeValidation();
  setupFormSubmit();
  setupOrdersToolbar();
  setupTrackingSearch();
  setupGlobalModals();

  renderCart();
  updateCalculations();
  applyOrdersFilterAndRender();
});
