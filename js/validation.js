/**
 * SITTA UT - Modul Validasi dan Kalkulasi Biaya (Pure Functions)
 * Universitas Terbuka - Sistem Pemesanan Bahan Ajar
 */

/**
 * Validasi NIM Mahasiswa Universitas Terbuka (harus 9 digit angka)
 * @param {string} nim
 * @returns {{ isValid: boolean, message: string }}
 */
export function validateNIM(nim) {
  if (!nim || typeof nim !== 'string') {
    return { isValid: false, message: 'NIM wajib diisi' };
  }
  const clean = nim.trim();
  if (clean.length === 0) {
    return { isValid: false, message: 'NIM tidak boleh kosong' };
  }
  if (!/^\d+$/.test(clean)) {
    return { isValid: false, message: 'NIM hanya boleh berisi angka' };
  }
  if (clean.length !== 9) {
    return { isValid: false, message: `NIM UT harus tepat 9 digit angka (saat ini: ${clean.length} digit)` };
  }
  return { isValid: true, message: 'NIM valid' };
}

/**
 * Validasi Nama Mahasiswa
 * @param {string} nama
 * @returns {{ isValid: boolean, message: string }}
 */
export function validateNama(nama) {
  if (!nama || typeof nama !== 'string') {
    return { isValid: false, message: 'Nama lengkap wajib diisi' };
  }
  const clean = nama.trim();
  if (clean.length < 3) {
    return { isValid: false, message: 'Nama minimal terdiri dari 3 karakter' };
  }
  if (!/^[a-zA-Z\s.,'`-]+$/.test(clean)) {
    return { isValid: false, message: 'Nama hanya boleh mengandung huruf dan tanda baca nama' };
  }
  return { isValid: true, message: 'Nama valid' };
}

/**
 * Validasi Nomor HP / WhatsApp
 * @param {string} phone
 * @returns {{ isValid: boolean, message: string }}
 */
export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, message: 'Nomor telepon/WhatsApp wajib diisi' };
  }
  const clean = phone.trim().replace(/[\s-]/g, '');
  if (!/^(08|628|\+628)[0-9]{8,12}$/.test(clean)) {
    return { isValid: false, message: 'Format nomor tidak valid (contoh: 08123456789 atau 628123456789)' };
  }
  return { isValid: true, message: 'Nomor valid' };
}

/**
 * Validasi Alamat Pengiriman
 * @param {string} metode 'delivery' | 'pickup'
 * @param {string} alamat
 * @param {string} kodePos
 * @returns {{ isValid: boolean, message: string }}
 */
export function validateAlamat(metode, alamat, kodePos) {
  if (metode === 'pickup') {
    return { isValid: true, message: 'Pengambilan mandiri di UPBJJ UT' };
  }
  if (!alamat || alamat.trim().length < 10) {
    return { isValid: false, message: 'Alamat pengiriman lengkap wajib diisi (minimal 10 karakter)' };
  }
  if (!kodePos || !/^\d{5}$/.test(kodePos.trim())) {
    return { isValid: false, message: 'Kode pos harus 5 digit angka' };
  }
  return { isValid: true, message: 'Alamat pengiriman valid' };
}

/**
 * Validasi Item Pesanan BMP (Buku Materi Pokok)
 * @param {Array<{ id: string, judul: string, harga: number, qty: number }>} items
 * @returns {{ isValid: boolean, message: string }}
 */
export function validateItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return { isValid: false, message: 'Pilih minimal 1 Bahan Ajar (BMP) untuk dipesan' };
  }
  for (const item of items) {
    if (!item.qty || item.qty < 1) {
      return { isValid: false, message: `Jumlah eksemplar untuk ${item.judul || 'buku'} minimal 1` };
    }
  }
  return { isValid: true, message: 'Daftar item valid' };
}

/**
 * Hitung total rincian biaya pesanan bahan ajar SITTA
 * @param {Array<{ sks: number, harga: number, qty: number }>} items
 * @param {'delivery' | 'pickup'} metodePengiriman
 * @param {number} ongkirBase
 * @param {string} kodePromo
 * @returns {{ totalSKS: number, totalBuku: number, subtotalBuku: number, ongkir: number, diskon: number, grandTotal: number }}
 */
export function calculateOrderTotals(items = [], metodePengiriman = 'delivery', ongkirBase = 15000, kodePromo = '') {
  let totalSKS = 0;
  let totalBuku = 0;
  let subtotalBuku = 0;

  for (const item of items) {
    const qty = Math.max(1, Number(item.qty) || 1);
    const sks = Number(item.sks) || 0;
    const harga = Number(item.harga) || 0;

    totalSKS += sks * qty;
    totalBuku += qty;
    subtotalBuku += harga * qty;
  }

  const ongkir = metodePengiriman === 'pickup' ? 0 : Math.max(0, ongkirBase);

  let diskon = 0;
  const promo = (kodePromo || '').trim().toUpperCase();
  if (promo === 'UTBEASISWA' || promo === 'MHSBARU') {
    diskon = Math.round(subtotalBuku * 0.15); // Diskon 15%
  } else if (promo === 'GRATISONGKIR' && metodePengiriman === 'delivery') {
    diskon = ongkir;
  }

  const grandTotal = Math.max(0, subtotalBuku + ongkir - diskon);

  return {
    totalSKS,
    totalBuku,
    subtotalBuku,
    ongkir,
    diskon,
    grandTotal,
  };
}

/**
 * Format angka ke mata uang Rupiah
 * @param {number} amount
 * @returns {string}
 */
export function formatRupiah(amount) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);
}
