/**
 * SITTA UT - Modul Manipulasi DOM (UI Rendering, Modals, Toasts, Tables)
 * Menggunakan dataBahanAjar, dataTracking, dan dataPengguna
 */

import { formatRupiah } from './validation.js';

/**
 * Tampilkan Toast Alert di pojok kanan atas
 * @param {string} title
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 */
export function showToast(title, message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');

  const iconSvg = type === 'success' 
    ? '✓' 
    : type === 'error' 
      ? '✕' 
      : 'ℹ';

  toast.innerHTML = `
    <div style="font-weight: 900; font-size: 1.1rem; line-height: 1;">${iconSvg}</div>
    <div style="flex: 1;">
      <strong style="display: block; font-size: 0.9rem; margin-bottom: 2px;">${title}</strong>
      <span style="font-size: 0.8rem; color: #475569;">${message}</span>
    </div>
    <button type="button" aria-label="Tutup notifikasi" style="background:none;border:none;cursor:pointer;color:#94a3b8;font-size:1rem;">&times;</button>
  `;

  const closeBtn = toast.querySelector('button');
  closeBtn.addEventListener('click', () => {
    toast.remove();
  });

  container.appendChild(toast);

  // Auto remove after 4.5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 250);
    }
  }, 4500);
}

/**
 * Buka Modal Box berdasarkan ID
 * @param {string} modalId
 */
export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Tutup Modal Box berdasarkan ID
 * @param {string} modalId
 */
export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Render Katalog Bahan Ajar (BMP) ke DOM Grid
 * Menggunakan dataBahanAjar (kodeLokasi, kodeBarang, namaBarang, jenisBarang, edisi, stok)
 * @param {Array} books
 * @param {Function} onAddToCart
 */
export function renderCatalogGrid(books, onAddToCart) {
  const container = document.getElementById('catalogGrid');
  if (!container) return;

  container.innerHTML = '';

  if (books.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 40px; text-align: center; background: #fff; border: 1px dashed #cbd5e1; border-radius: 8px;">
        <p style="color: #64748b; font-size: 0.95rem;">Tidak ada bahan ajar yang sesuai dengan kata kunci pencarian atau filter fakultas.</p>
      </div>
    `;
    return;
  }

  books.forEach((book) => {
    const card = document.createElement('article');
    card.className = 'book-card';
    card.setAttribute('data-id', book.id);

    const isStockLow = book.stokPuslaba < 200;
    const stockClass = isStockLow ? 'stock-low' : 'stock-in';
    const stockLabel = isStockLow ? `Sisa ${book.stokPuslaba} Eks.` : `Tersedia (${book.stokPuslaba})`;

    card.innerHTML = `
      <div class="book-header" style="background-color: ${book.coverColor || '#003B73'};">
        <div>
          <span class="book-code-badge">${book.kode}</span>
          <span style="font-size: 0.72rem; background: rgba(0,0,0,0.25); color: #fff; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">Lokasi: ${book.kodeLokasi || 'Puslaba'}</span>
        </div>
        <span class="book-sks-badge">${book.sks || 3} SKS</span>
      </div>
      <div class="book-body">
        <span class="book-faculty">${book.fakultas || 'UT'} &bull; ${book.jenisBarang || 'BMP'} &bull; ${book.edisi}</span>
        <h4 class="book-title">${book.judul}</h4>
        <div style="font-size: 0.78rem; color: #64748b; margin-bottom: 8px;">
          Cover: <code style="font-size: 0.75rem; background: #f1f5f9; padding: 1px 4px; border-radius: 3px;">${book.cover || '-'}</code>
        </div>
        <div class="book-meta">
          <span class="book-price">${formatRupiah(book.harga || 60000)}</span>
          <span class="stock-tag ${stockClass}">${stockLabel}</span>
        </div>
      </div>
      <div class="book-footer">
        <button type="button" class="btn btn-primary btn-sm btn-add-cart" style="flex: 1;" data-id="${book.id}">
          + Pesan Bahan Ajar
        </button>
      </div>
    `;

    const addBtn = card.querySelector('.btn-add-cart');
    addBtn.addEventListener('click', () => {
      onAddToCart(book);
    });

    container.appendChild(card);
  });
}

/**
 * Render Item Terpilih di Formulir Pemesanan
 * @param {Array} cartItems
 * @param {Function} onQtyChange
 * @param {Function} onRemoveItem
 */
export function renderCartItems(cartItems, onQtyChange, onRemoveItem) {
  const container = document.getElementById('selectedItemsContainer');
  const countBadge = document.getElementById('selectedItemsCount');
  if (!container) return;

  container.innerHTML = '';
  if (countBadge) {
    countBadge.textContent = cartItems.length;
  }

  if (cartItems.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-notice">
        Belum ada bahan ajar yang dipilih.<br>
        Silakan pilih mata kuliah/BMP dari menu <strong>Katalog Bahan Ajar</strong> atau klik tombol <em>Pilih Cepat BMP</em>.
      </div>
    `;
    return;
  }

  cartItems.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'cart-item-row';
    row.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-title">${item.judul}</div>
        <div class="cart-item-code">
          Kode: <strong>${item.kode}</strong> &bull; Lokasi: ${item.kodeLokasi || 'Puslaba'} &bull; ${item.sks || 3} SKS &bull; ${formatRupiah(item.harga || 60000)}/eks
        </div>
      </div>
      <div class="cart-item-controls">
        <label for="qty-${item.id}" style="font-size: 0.75rem; color: #64748b;">Qty:</label>
        <input type="number" id="qty-${item.id}" min="1" max="10" value="${item.qty || 1}" class="qty-input" data-id="${item.id}" aria-label="Jumlah untuk ${item.judul}">
        <button type="button" class="btn btn-danger btn-icon btn-sm btn-remove-item" data-id="${item.id}" title="Hapus dari pesanan" aria-label="Hapus ${item.judul}">
          &times;
        </button>
      </div>
    `;

    const qtyInput = row.querySelector('.qty-input');
    qtyInput.addEventListener('change', (e) => {
      const val = parseInt(e.target.value, 10);
      onQtyChange(item.id, isNaN(val) || val < 1 ? 1 : val);
    });

    const removeBtn = row.querySelector('.btn-remove-item');
    removeBtn.addEventListener('click', () => {
      onRemoveItem(item.id);
    });

    container.appendChild(row);
  });
}

/**
 * Render Tabel Riwayat Transaksi Pemesanan SITTA
 * @param {Array} orders
 * @param {Object} handlers { onViewDetail, onUpdateStatus, onDeleteOrder }
 */
export function renderOrdersTable(orders, handlers) {
  const tbody = document.getElementById('ordersTableBody');
  const emptyState = document.getElementById('ordersEmptyState');
  const totalCountEl = document.getElementById('ordersCountSummary');

  if (!tbody) return;
  tbody.innerHTML = '';

  if (totalCountEl) {
    totalCountEl.textContent = `${orders.length} Transaksi`;
  }

  if (orders.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  orders.forEach((order) => {
    const tr = document.createElement('tr');

    let badgeClass = 'badge-secondary';
    if (order.status === 'Menunggu Pembayaran') badgeClass = 'badge-warning';
    else if (order.status === 'Diproses di Gudang Puslaba') badgeClass = 'badge-info';
    else if (order.status === 'Dalam Pengiriman' || order.status === 'Dalam Perjalanan') badgeClass = 'badge-primary';
    else if (order.status === 'Tiba di UPBJJ' || order.status === 'Dikirim') badgeClass = 'badge-info';
    else if (order.status === 'Selesai Diterima' || order.status === 'Selesai Antar') badgeClass = 'badge-success';

    const itemsSummary = order.items && order.items.length > 0
      ? `${order.items.map(i => `${i.kode || i.kodeBarang} (${i.qty}x)`).join(', ')}`
      : (order.paket ? `Paket Lokasi: ${order.paket}` : 'Bahan Ajar UT');

    const totalBiayaFormatted = order.total || formatRupiah(order.grandTotal);

    tr.innerHTML = `
      <td>
        <strong style="color: var(--ut-primary-navy); display:block;">${order.nomorDO || order.orderId}</strong>
        <span style="font-size: 0.75rem; color: #64748b;">${order.tanggalPesan || order.tanggalKirim || '-'}</span>
      </td>
      <td>
        <strong style="display:block;">${order.nama}</strong>
        <span style="font-size: 0.75rem; color: #64748b;">NIM: ${order.nim || 'Mhs UT'}</span>
      </td>
      <td>
        <span>${order.upbjjNama || order.paket || order.upbjjKode || 'UPBJJ UT'}</span>
        <div style="font-size: 0.72rem; color: #64748b;">${order.metode === 'pickup' ? 'Ambil di UPBJJ' : 'Kirim Rumah'} &bull; ${order.ekspedisi || '-'}</div>
      </td>
      <td style="max-width: 200px;">
        <span style="font-size: 0.8rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;" title="${itemsSummary}">
          ${itemsSummary}
        </span>
        <span style="font-size: 0.72rem; color: #64748b;">${order.totalSKS ? `${order.totalSKS} SKS` : 'BMP UT'}</span>
      </td>
      <td>
        <strong>${totalBiayaFormatted}</strong>
      </td>
      <td>
        <span class="badge ${badgeClass}">${order.status}</span>
        ${order.nomorResi ? `<div style="font-size: 0.72rem; color: #0066B3; font-family: monospace; margin-top: 2px;">${order.nomorResi}</div>` : ''}
      </td>
      <td>
        <div class="table-actions-cell">
          <button type="button" class="btn btn-outline btn-sm btn-detail" title="Lihat Rincian & Cetak Bukti" data-id="${order.orderId}">
            Lihat
          </button>
          <button type="button" class="btn btn-outline btn-sm btn-update-status" title="Perbarui Status Distribusi" data-id="${order.orderId}">
            Status
          </button>
          <button type="button" class="btn btn-danger btn-sm btn-icon btn-delete" title="Hapus Transaksi" data-id="${order.orderId}" aria-label="Hapus transaksi ${order.orderId}">
            🗑
          </button>
        </div>
      </td>
    `;

    // Event listeners
    tr.querySelector('.btn-detail').addEventListener('click', () => handlers.onViewDetail(order));
    tr.querySelector('.btn-update-status').addEventListener('click', () => handlers.onUpdateStatus(order));
    tr.querySelector('.btn-delete').addEventListener('click', () => handlers.onDeleteOrder(order));

    tbody.appendChild(tr);
  });
}

/**
 * Render Tampilan Lacak Pengiriman Bahan Ajar
 * Menampilkan dataTracking resmi (nomorDO, paket, total, ekspedisi, dan log perjalanan)
 * @param {Object} trackingItem
 */
export function renderTrackingView(trackingItem) {
  const container = document.getElementById('trackingResultContainer');
  if (!container) return;

  if (!trackingItem) {
    container.innerHTML = `
      <div style="padding: 30px; text-align: center; color: #64748b;">
        Masukkan Nomor DO (misal: <strong>2023001234</strong> atau <strong>2023005678</strong>) atau Nomor Pesanan SITTA di atas untuk melihat linimasa pelacakan distribusi paket.
      </div>
    `;
    return;
  }

  // Jika trackingItem memiliki log perjalanan khusus (dari dataTracking)
  if (Array.isArray(trackingItem.perjalanan) && trackingItem.perjalanan.length > 0) {
    let timelineHtml = '<div class="timeline">';
    trackingItem.perjalanan.forEach((step, idx) => {
      const isLast = idx === trackingItem.perjalanan.length - 1;
      const stateClass = isLast ? 'active' : 'completed';
      const icon = isLast ? '●' : '✓';

      timelineHtml += `
        <div class="timeline-item ${stateClass}">
          <div class="timeline-dot">${icon}</div>
          <div class="timeline-content">
            <span style="font-size: 0.78rem; color: #0066B3; font-weight: 700; font-family: monospace;">${step.waktu}</span>
            <strong style="margin-top: 2px;">${step.keterangan}</strong>
          </div>
        </div>
      `;
    });
    timelineHtml += '</div>';

    container.innerHTML = `
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px 20px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
          <div>
            <span style="font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase;">Nomor Delivery Order (DO)</span>
            <h4 style="font-size: 1.25rem; font-weight: 800; color: var(--ut-primary-navy);">${trackingItem.nomorDO || trackingItem.orderId}</h4>
            <div style="font-size: 0.88rem; color: #334155;">Penerima: <strong>${trackingItem.nama}</strong> &bull; Paket: <strong>${trackingItem.paket || '0JKT01'}</strong></div>
            <div style="font-size: 0.8rem; color: #64748b;">Tanggal Kirim: ${trackingItem.tanggalKirim || '-'} &bull; Ekspedisi: <strong>${trackingItem.ekspedisi}</strong></div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase;">Status Saat Ini</span>
            <div><span class="badge badge-primary" style="font-size: 0.85rem; padding: 4px 10px;">${trackingItem.status}</span></div>
            <div style="font-size: 0.95rem; color: var(--ut-primary-navy); font-weight: 800; margin-top: 6px;">Total: ${trackingItem.total || formatRupiah(trackingItem.grandTotal)}</div>
          </div>
        </div>
      </div>
      <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--ut-primary-navy); margin-bottom: 12px;">Linimasa Perjalanan Paket Ekspedisi:</h4>
      ${timelineHtml}
    `;
    return;
  }

  // Fallback untuk pesanan baru yang dibuat secara interaktif
  const statuses = [
    'Menunggu Pembayaran',
    'Diproses di Gudang Puslaba',
    'Dalam Pengiriman',
    'Tiba di UPBJJ',
    'Selesai Diterima'
  ];
  const currentIndex = statuses.indexOf(trackingItem.status);

  const steps = [
    { title: 'Pesanan Terkonfirmasi & Lunas', desc: `Registrasi sistem SITTA UT berhasil (${trackingItem.tanggalPesan || 'Selesai'})` },
    { title: 'Dipacking di Gudang Puslaba UT Pondok Cabe', desc: 'Bahan ajar diambil dari rak tiras, diperiksa kelengkapan, dan disegel plastik tahan air.' },
    { title: 'Diberangkatkan oleh Kurir Ekspedisi', desc: `Paket diserahkan ke kurir ${trackingItem.ekspedisi}. No Resi: ${trackingItem.nomorResi || 'Menunggu input resi'}` },
    { title: trackingItem.metode === 'pickup' ? `Tiba di Loket Layanan ${trackingItem.upbjjNama || 'UPBJJ'}` : `Paket Tiba di Hub Transit Kota Tujuan (${trackingItem.upbjjNama || 'UPBJJ'})`, desc: 'Paket siap diambil atau diteruskan ke alamat mahasiswa.' },
    { title: 'Paket Bahan Ajar Diterima Mahasiswa', desc: `Diserahterimakan kepada ${trackingItem.nama} (${trackingItem.nim || '-'}). Transaksi selesai.` },
  ];

  let timelineHtml = '<div class="timeline">';
  steps.forEach((step, idx) => {
    let stateClass = '';
    let icon = idx + 1;
    if (idx < currentIndex) {
      stateClass = 'completed';
      icon = '✓';
    } else if (idx === currentIndex) {
      stateClass = 'active';
      icon = '●';
    }

    timelineHtml += `
      <div class="timeline-item ${stateClass}">
        <div class="timeline-dot">${icon}</div>
        <div class="timeline-content">
          <strong>${step.title}</strong>
          <span>${step.desc}</span>
        </div>
      </div>
    `;
  });
  timelineHtml += '</div>';

  container.innerHTML = `
    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px 20px; margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
        <div>
          <span style="font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase;">Nomor Pesanan / DO</span>
          <h4 style="font-size: 1.2rem; font-weight: 800; color: var(--ut-primary-navy);">${trackingItem.nomorDO || trackingItem.orderId}</h4>
          <div style="font-size: 0.85rem; color: #334155;">Penerima: <strong>${trackingItem.nama}</strong> - ${trackingItem.upbjjNama || trackingItem.paket || 'UPBJJ'}</div>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase;">Status Saat Ini</span>
          <div><span class="badge badge-primary" style="font-size: 0.85rem; padding: 4px 10px;">${trackingItem.status}</span></div>
          <div style="font-size: 0.8rem; color: #0284c7; font-weight: 600; margin-top: 4px;">Resi: ${trackingItem.nomorResi || '-'}</div>
        </div>
      </div>
    </div>
    ${timelineHtml}
  `;
}
