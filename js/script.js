/**
 * SITTA UT - Skrip Logika Frontend Utama (script.js)
 * Mengontrol 4 Halaman:
 * 1. index.html (Login)
 * 2. dashboard.html (Dashboard Menu, Greeting & Laporan)
 * 3. tracking.html (Pelacakan Delivery Order)
 * 4. stok.html (Informasi & Tambah Stok DOM)
 */

import { dataPengguna, dataBahanAjar, dataTracking } from './data.js';

// Konstanta Penyimpanan LocalStorage
const STORAGE_USER_KEY = 'sitta_session_user_v1';
const STORAGE_STOK_KEY = 'sitta_custom_stok_v1';

/**
 * Mendapatkan pengguna yang sedang login
 */
export function getActiveUser() {
  try {
    const raw = sessionStorage.getItem(STORAGE_USER_KEY) || localStorage.getItem(STORAGE_USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Gagal membaca sesi pengguna:', e);
  }
  // Default fallback user pertama (Rina Wulandari)
  return dataPengguna[0];
}

/**
 * Menyimpan sesi login pengguna
 */
export function setActiveUser(user) {
  try {
    sessionStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Gagal menyimpan sesi:', e);
  }
}

/**
 * Logout pengguna
 */
export function logoutUser() {
  sessionStorage.removeItem(STORAGE_USER_KEY);
  localStorage.removeItem(STORAGE_USER_KEY);
  window.location.href = 'index.html';
}

/**
 * Generator Greeting Berdasarkan Waktu Lokal (Local Time)
 * Sesuai spesifikasi Tugas Praktik 1 (pagi / siang / sore / malam)
 */
export function getLocalGreeting() {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 11) {
    return 'Selamat Pagi';
  } else if (hour >= 11 && hour < 15) {
    return 'Selamat Siang';
  } else if (hour >= 15 && hour < 18) {
    return 'Selamat Sore';
  } else {
    return 'Selamat Malam';
  }
}

/**
 * Menampilkan Pop-up / Alert Box Kustom Interaktif
 * @param {string} message
 * @param {'error'|'success'|'info'|'warning'} type
 */
export function showAlert(message, type = 'info') {
  let container = document.getElementById('alertPopupContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'alertPopupContainer';
    container.className = 'alert-popup-container';
    document.body.appendChild(container);
  }

  const alertBox = document.createElement('div');
  alertBox.className = `alert-popup-box alert-${type}`;
  alertBox.setAttribute('role', 'alert');

  const label = type === 'error' ? 'PERINGATAN' : type === 'success' ? 'BERHASIL' : 'INFORMASI';

  alertBox.innerHTML = `
    <span class="alert-type-badge">${label}</span>
    <div style="flex: 1; font-size: 0.9rem; font-weight: 500;">${message}</div>
    <button type="button" class="alert-close-btn" aria-label="Tutup notifikasi">&times;</button>
  `;

  alertBox.querySelector('.alert-close-btn').addEventListener('click', () => {
    alertBox.remove();
  });

  container.appendChild(alertBox);

  // Auto remove setelah 4 detik
  setTimeout(() => {
    if (alertBox.parentElement) {
      alertBox.classList.add('fade-out');
      setTimeout(() => alertBox.remove(), 300);
    }
  }, 4000);
}

/**
 * Helper Membuka Modal Box
 */
export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Helper Menutup Modal Box
 */
export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Inisialisasi Modal Listener Global (Tutup klik overlay & tombol X)
 */
function setupModalListeners() {
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
      if (modal) closeModal(modal.id);
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

// ============================================================================
// 1. LOGIKA HALAMAN LOGIN (index.html / login.html)
// ============================================================================
function initLoginPage() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const btnLupaPass = document.getElementById('btnLupaPassword');
  const btnDaftar = document.getElementById('btnDaftar');

  // Submit Form Login
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = (emailInput ? emailInput.value : '').trim().toLowerCase();
    const password = (passwordInput ? passwordInput.value : '').trim();

    // Validasi kosong
    if (!email || !password) {
      showAlert('Email dan password wajib diisi!', 'warning');
      return;
    }

    // Cek kecocokan data pengguna di dataPengguna
    const userFound = dataPengguna.find(
      (u) => u.email.toLowerCase() === email && u.password === password
    );

    if (userFound) {
      setActiveUser(userFound);
      showAlert(`Login berhasil! Selamat datang, ${userFound.nama}`, 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 700);
    } else {
      // Sesuai soal tugas: "email/password yang anda masukkan salah"
      showAlert('email/password yang anda masukkan salah', 'error');
    }
  });

  // Modal Lupa Password
  if (btnLupaPass) {
    btnLupaPass.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('modalLupaPassword');
    });
  }

  const formLupaPassword = document.getElementById('formLupaPassword');
  if (formLupaPassword) {
    formLupaPassword.addEventListener('submit', (e) => {
      e.preventDefault();
      const resetEmail = document.getElementById('resetEmailInput').value;
      if (resetEmail) {
        closeModal('modalLupaPassword');
        showAlert(`Tautan reset kata sandi telah dikirimkan ke surel: ${resetEmail}`, 'success');
      }
    });
  }

  // Modal Daftar
  if (btnDaftar) {
    btnDaftar.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('modalDaftar');
    });
  }

  const formDaftar = document.getElementById('formDaftar');
  if (formDaftar) {
    formDaftar.addEventListener('submit', (e) => {
      e.preventDefault();
      const nama = document.getElementById('regNama').value;
      const email = document.getElementById('regEmail').value;
      const lokasi = document.getElementById('regLokasi').value;

      if (nama && email) {
        closeModal('modalDaftar');
        showAlert(`Registrasi akun ${nama} (${lokasi}) berhasil diajukan untuk verifikasi UT Pusat.`, 'success');
      }
    });
  }

  // Tombol Akun Demo untuk Kemudahan Pengujian & Presentasi Video
  document.querySelectorAll('[data-demo-user]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetEmail = btn.getAttribute('data-demo-user');
      const user = dataPengguna.find((u) => u.email === targetEmail);
      if (user && emailInput && passwordInput) {
        emailInput.value = user.email;
        passwordInput.value = user.password;
        showAlert(`Data login ${user.nama} (${user.role}) terisi otomatis. Silakan klik Login.`, 'info');
      }
    });
  });
}

// ============================================================================
// 2. LOGIKA HALAMAN DASHBOARD (dashboard.html)
// ============================================================================
function initDashboardPage() {
  const greetingEl = document.getElementById('userGreetingText');
  const userNameEl = document.getElementById('userNameDisplay');
  const userRoleEl = document.getElementById('userRoleDisplay');
  const userLocationEl = document.getElementById('userLocationDisplay');
  const btnLogout = document.getElementById('btnLogout');

  const user = getActiveUser();

  if (greetingEl) {
    greetingEl.textContent = `${getLocalGreeting()},`;
  }
  if (userNameEl) {
    userNameEl.textContent = user.nama;
  }
  if (userRoleEl) {
    userRoleEl.textContent = `${user.role} - ${user.lokasi}`;
  }
  if (userLocationEl) {
    userLocationEl.textContent = user.lokasi;
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Apakah Anda yakin ingin keluar dari sistem SITTA?')) {
        logoutUser();
      }
    });
  }

  // Render Tabel Monitoring Progress DO (dataTracking)
  renderMonitoringDOTable();

  // Render Rekap Bahan Ajar (dataBahanAjar)
  renderRekapBahanAjar();
}

function renderMonitoringDOTable() {
  const tbody = document.getElementById('monitoringDOTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  const doKeys = Object.keys(dataTracking);

  doKeys.forEach((key) => {
    const doItem = dataTracking[key];
    const tr = document.createElement('tr');

    // Menghitung persentase progress pengiriman
    let percent = 50;
    let progressColor = '#0066B3';
    let statusClass = 'badge-primary';

    if (doItem.status.toLowerCase().includes('selesai') || doItem.status.toLowerCase().includes('diterima')) {
      percent = 100;
      progressColor = '#059669';
      statusClass = 'badge-success';
    } else if (doItem.status.toLowerCase().includes('perjalanan') || doItem.status.toLowerCase().includes('antar')) {
      percent = 70;
      progressColor = '#0284C7';
      statusClass = 'badge-primary';
    } else if (doItem.status.toLowerCase().includes('dikirim')) {
      percent = 40;
      progressColor = '#D97706';
      statusClass = 'badge-warning';
    }

    tr.innerHTML = `
      <td><strong>${doItem.nomorDO}</strong></td>
      <td>${doItem.nama}</td>
      <td>${doItem.ekspedisi} (${doItem.paket})</td>
      <td>${doItem.tanggalKirim}</td>
      <td>
        <span class="badge ${statusClass}">${doItem.status}</span>
        <div style="background: #E2E8F0; border-radius: 999px; height: 6px; width: 100%; margin-top: 6px; overflow: hidden;">
          <div style="background: ${progressColor}; width: ${percent}%; height: 100%;"></div>
        </div>
      </td>
      <td><strong>${doItem.total}</strong></td>
      <td>
        <a href="tracking.html?do=${doItem.nomorDO}" class="btn btn-sm btn-outline" style="text-decoration:none;">
          Lacak Resi &rarr;
        </a>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderRekapBahanAjar() {
  const tbody = document.getElementById('rekapBahanAjarTableBody');
  const totalStokEl = document.getElementById('totalStokSummary');
  if (!tbody) return;

  tbody.innerHTML = '';
  let totalStokAll = 0;

  // Baca gabungan dataBahanAjar + custom stok
  const list = getCombinedBahanAjar();

  list.forEach((b) => {
    totalStokAll += Number(b.stok) || 0;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="code-badge">${b.kodeLokasi}</span></td>
      <td><strong>${b.kodeBarang}</strong></td>
      <td>${b.namaBarang}</td>
      <td>${b.jenisBarang}</td>
      <td>Edisi ${b.edisi}</td>
      <td style="text-align: right; font-weight: 700; color: var(--ut-primary-navy);">${Number(b.stok).toLocaleString('id-ID')} Eks</td>
    `;
    tbody.appendChild(tr);
  });

  if (totalStokEl) {
    totalStokEl.textContent = `${totalStokAll.toLocaleString('id-ID')} Eksemplar`;
  }
}

// ============================================================================
// 3. LOGIKA HALAMAN TRACKING (tracking.html)
// ============================================================================
function initTrackingPage() {
  const inputDO = document.getElementById('inputNomorDO');
  const btnCari = document.getElementById('btnCariDO');
  const resultCard = document.getElementById('trackingResultCard');
  const emptyNotice = document.getElementById('trackingEmptyNotice');

  // Baca query parameter URL jika diarahkan dari dashboard (?do=2023001234)
  const urlParams = new URLSearchParams(window.location.search);
  const paramDO = urlParams.get('do');
  if (paramDO && inputDO) {
    inputDO.value = paramDO;
    cariDeliveryOrder(paramDO);
  }

  if (btnCari && inputDO) {
    btnCari.addEventListener('click', () => {
      const nomorDO = inputDO.value.trim();
      cariDeliveryOrder(nomorDO);
    });

    inputDO.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        cariDeliveryOrder(inputDO.value.trim());
      }
    });
  }

  // Tombol Cepat Contoh DO
  document.querySelectorAll('[data-example-do]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const doVal = btn.getAttribute('data-example-do');
      if (inputDO) inputDO.value = doVal;
      cariDeliveryOrder(doVal);
    });
  });

  function cariDeliveryOrder(nomorDO) {
    if (!nomorDO) {
      showAlert('Silakan masukkan Nomor Delivery Order terlebih dahulu!', 'warning');
      return;
    }

    // Mencari pada variabel konstanta dataTracking
    const trackingData = dataTracking[nomorDO];

    if (!trackingData) {
      showAlert(`Nomor Delivery Order "${nomorDO}" tidak ditemukan dalam sistem!`, 'error');
      if (resultCard) resultCard.style.display = 'none';
      if (emptyNotice) emptyNotice.style.display = 'block';
      return;
    }

    if (emptyNotice) emptyNotice.style.display = 'none';
    if (resultCard) resultCard.style.display = 'block';

    renderTrackingDetail(trackingData);
    showAlert(`Data Delivery Order ${nomorDO} berhasil ditemukan!`, 'success');
  }

  function renderTrackingDetail(data) {
    // 1. Informasi Mahasiswa & DO
    const doEl = document.getElementById('resNomorDO');
    const namaEl = document.getElementById('resNamaMahasiswa');
    const ekspedisiEl = document.getElementById('resEkspedisi');
    const tanggalEl = document.getElementById('resTanggalKirim');
    const paketEl = document.getElementById('resJenisPaket');
    const totalEl = document.getElementById('resTotalPembayaran');
    const statusBadge = document.getElementById('resStatusBadge');
    const progressBar = document.getElementById('resProgressBar');
    const perjalananContainer = document.getElementById('resPerjalananTimeline');

    if (doEl) doEl.textContent = data.nomorDO;
    if (namaEl) namaEl.textContent = data.nama;
    if (ekspedisiEl) ekspedisiEl.textContent = data.ekspedisi;
    if (tanggalEl) tanggalEl.textContent = data.tanggalKirim;
    if (paketEl) paketEl.textContent = data.paket;
    if (totalEl) totalEl.textContent = data.total;

    // Simulasi Progress Bar & Warna Status Sesuai Soal Tugas
    let progressVal = 60;
    let badgeClass = 'badge-primary';
    let barColor = '#0066B3';

    if (data.status.toLowerCase().includes('selesai') || data.status.toLowerCase().includes('antar')) {
      progressVal = 100;
      badgeClass = 'badge-success';
      barColor = '#059669';
    } else if (data.status.toLowerCase().includes('perjalanan')) {
      progressVal = 65;
      badgeClass = 'badge-primary';
      barColor = '#0284C7';
    } else if (data.status.toLowerCase().includes('dikirim')) {
      progressVal = 40;
      badgeClass = 'badge-warning';
      barColor = '#D97706';
    }

    if (statusBadge) {
      statusBadge.className = `badge ${badgeClass}`;
      statusBadge.textContent = data.status;
    }
    if (progressBar) {
      progressBar.style.width = `${progressVal}%`;
      progressBar.style.backgroundColor = barColor;
    }

    // Render Riwayat Perjalanan
    if (perjalananContainer) {
      perjalananContainer.innerHTML = '';
      if (Array.isArray(data.perjalanan) && data.perjalanan.length > 0) {
        data.perjalanan.forEach((step, idx) => {
          const isLatest = idx === data.perjalanan.length - 1;
          const stepDiv = document.createElement('div');
          stepDiv.className = `timeline-step-item ${isLatest ? 'step-active' : 'step-done'}`;
          stepDiv.innerHTML = `
            <div class="step-dot">${idx + 1}</div>
            <div class="step-body">
              <span class="step-time">${step.waktu}</span>
              <div class="step-desc">${step.keterangan}</div>
            </div>
          `;
          perjalananContainer.appendChild(stepDiv);
        });
      } else {
        perjalananContainer.innerHTML = '<p style="color:#64748b;font-size:0.85rem;">Belum ada catatan pergerakan paket.</p>';
      }
    }
  }
}

// ============================================================================
// 4. LOGIKA HALAMAN STOK BAHAN AJAR (stok.html)
// Menampilkan dinamis dari dataBahanAjar & Menambahkan baris stok baru via DOM
// ============================================================================
function getCombinedBahanAjar() {
  let customStok = [];
  try {
    const raw = localStorage.getItem(STORAGE_STOK_KEY);
    if (raw) customStok = JSON.parse(raw);
  } catch (e) {
    console.error('Gagal membaca custom stok:', e);
  }
  return [...dataBahanAjar, ...customStok];
}

function saveCustomStok(newStokItem) {
  try {
    let customStok = [];
    const raw = localStorage.getItem(STORAGE_STOK_KEY);
    if (raw) customStok = JSON.parse(raw);
    customStok.push(newStokItem);
    localStorage.setItem(STORAGE_STOK_KEY, JSON.stringify(customStok));
  } catch (e) {
    console.error('Gagal menyimpan stok baru:', e);
  }
}

function initStokPage() {
  const tbody = document.getElementById('stokTableBody');
  const countSummaryEl = document.getElementById('stokCountSummary');
  const btnOpenModalTambah = document.getElementById('btnOpenModalTambah');
  const formTambahStok = document.getElementById('formTambahStok');
  const filterLokasi = document.getElementById('filterLokasiStok');
  const searchInput = document.getElementById('searchStokInput');
  const btnResetStok = document.getElementById('btnResetStokDefault');

  renderStokTable();

  // Buka Modal Tambah Bahan Ajar Baru
  if (btnOpenModalTambah) {
    btnOpenModalTambah.addEventListener('click', () => {
      openModal('modalTambahStok');
    });
  }

  // Submit Form Tambah Bahan Ajar Baru (Manipulasi Javascript DOM)
  if (formTambahStok) {
    formTambahStok.addEventListener('submit', (e) => {
      e.preventDefault();

      const kodeLokasi = document.getElementById('inputKodeLokasi').value.trim();
      const kodeBarang = document.getElementById('inputKodeBarang').value.trim().toUpperCase();
      const namaBarang = document.getElementById('inputNamaBarang').value.trim();
      const jenisBarang = document.getElementById('inputJenisBarang').value.trim();
      const edisi = document.getElementById('inputEdisi').value.trim();
      const stokVal = parseInt(document.getElementById('inputStok').value, 10);
      const coverVal = document.getElementById('inputCover').value.trim() || `img/${kodeBarang.toLowerCase()}.jpg`;

      // Validasi Form
      if (!kodeLokasi || !kodeBarang || !namaBarang || !jenisBarang || !edisi || isNaN(stokVal) || stokVal < 0) {
        showAlert('Harap lengkapi semua kolom isian stok dengan benar!', 'warning');
        return;
      }

      const newBahanAjar = {
        kodeLokasi,
        kodeBarang,
        namaBarang,
        jenisBarang,
        edisi,
        stok: stokVal,
        cover: coverVal,
      };

      // Simpan ke storage
      saveCustomStok(newBahanAjar);

      // Tambahkan baris baru ke tabel menggunakan Javascript DOM createElement & appendChild
      appendStokRow(newBahanAjar, true);

      // Tutup modal dan reset form
      closeModal('modalTambahStok');
      formTambahStok.reset();

      showAlert(`Bahan ajar ${kodeBarang} - "${namaBarang}" berhasil ditambahkan ke tabel stok!`, 'success');
      updateStokCount();
    });
  }

  // Filter Lokasi
  if (filterLokasi) {
    filterLokasi.addEventListener('change', () => {
      renderStokTable();
    });
  }

  // Pencarian Stok
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderStokTable();
    });
  }

  // Reset ke Stok Default
  if (btnResetStok) {
    btnResetStok.addEventListener('click', () => {
      if (confirm('Kembalikan tabel stok ke 5 data dummy bawaan dataBahanAjar?')) {
        localStorage.removeItem(STORAGE_STOK_KEY);
        renderStokTable();
        showAlert('Data stok dikembalikan ke data default dataBahanAjar.', 'info');
      }
    });
  }

  function renderStokTable() {
    if (!tbody) return;
    tbody.innerHTML = '';

    const list = getCombinedBahanAjar();
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedLokasi = filterLokasi ? filterLokasi.value : 'ALL';

    const filtered = list.filter((item) => {
      const matchLokasi = selectedLokasi === 'ALL' || item.kodeLokasi === selectedLokasi;
      const matchSearch = !query ||
        item.kodeBarang.toLowerCase().includes(query) ||
        item.namaBarang.toLowerCase().includes(query) ||
        item.kodeLokasi.toLowerCase().includes(query);
      return matchLokasi && matchSearch;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:30px; color:#64748b;">
            Tidak ada bahan ajar yang sesuai dengan filter atau kata kunci pencarian.
          </td>
        </tr>
      `;
      updateStokCount(0);
      return;
    }

    filtered.forEach((item) => {
      appendStokRow(item, false);
    });

    updateStokCount(filtered.length);
  }

  function appendStokRow(item, isNewHighlight = false) {
    if (!tbody) return;

    // Manipulasi DOM murni: createElement
    const tr = document.createElement('tr');
    if (isNewHighlight) {
      tr.style.backgroundColor = '#FEF3C7';
      tr.style.transition = 'background-color 1.5s ease';
      setTimeout(() => {
        tr.style.backgroundColor = '';
      }, 2000);
    }

    const isLow = Number(item.stok) < 200;
    const stockClass = isLow ? 'stock-low' : 'stock-in';
    const stockLabel = isLow ? 'Menipis' : 'Aman';

    tr.innerHTML = `
      <td><span class="code-badge">${item.kodeLokasi}</span></td>
      <td><strong>${item.kodeBarang}</strong></td>
      <td>${item.namaBarang}</td>
      <td>${item.jenisBarang}</td>
      <td>Edisi ${item.edisi}</td>
      <td>
        <strong style="color:var(--ut-primary-navy); font-size:1rem;">${Number(item.stok).toLocaleString('id-ID')}</strong> Eks.
        <span class="stock-tag ${stockClass}" style="margin-left: 6px;">${stockLabel}</span>
      </td>
      <td>
        <code style="font-size:0.75rem; background:#F1F5F9; padding:2px 6px; border-radius:4px; color:#475569;">
          ${item.cover || '-'}
        </code>
      </td>
    `;

    // Manipulasi DOM: appendChild / insertBefore
    if (isNewHighlight && tbody.firstChild) {
      tbody.insertBefore(tr, tbody.firstChild);
    } else {
      tbody.appendChild(tr);
    }
  }

  function updateStokCount(customCount) {
    if (!countSummaryEl) return;
    const count = typeof customCount === 'number' ? customCount : getCombinedBahanAjar().length;
    countSummaryEl.textContent = `${count} Jenis Bahan Ajar`;
  }
}

// ============================================================================
// BOOTSTRAPPER UTAMA
// ============================================================================
window.addEventListener('DOMContentLoaded', () => {
  setupModalListeners();

  // Deteksi Halaman Aktif Berdasarkan Elemen Unik
  if (document.getElementById('loginForm')) {
    initLoginPage();
  } else if (document.getElementById('dashboardMainView')) {
    initDashboardPage();
  } else if (document.getElementById('trackingMainView')) {
    initTrackingPage();
  } else if (document.getElementById('stokMainView')) {
    initStokPage();
  }
});
