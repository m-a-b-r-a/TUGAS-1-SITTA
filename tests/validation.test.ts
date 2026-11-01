import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateNIM,
  validateNama,
  validatePhone,
  validateAlamat,
  validateItems,
  calculateOrderTotals,
  formatRupiah,
} from '../js/validation.js';
import { dataPengguna, dataBahanAjar, dataTracking } from '../js/data.js';

test('validateNIM: valid 9 digits NIM', () => {
  const result = validateNIM('042189345');
  assert.equal(result.isValid, true);
});

test('validateNIM: reject non-9 digits or letters', () => {
  assert.equal(validateNIM('04218934').isValid, false); // 8 digits
  assert.equal(validateNIM('0421893456').isValid, false); // 10 digits
  assert.equal(validateNIM('04218934A').isValid, false); // non digit
  assert.equal(validateNIM('').isValid, false);
});

test('validateNama: min 3 chars and valid characters', () => {
  assert.equal(validateNama('Budi Santoso').isValid, true);
  assert.equal(validateNama('Bo').isValid, false);
  assert.equal(validateNama('Budi123').isValid, false);
});

test('validatePhone: Indonesian mobile phone numbers', () => {
  assert.equal(validatePhone('081234567890').isValid, true);
  assert.equal(validatePhone('628571234567').isValid, true);
  assert.equal(validatePhone('12345').isValid, false);
});

test('validateAlamat: pickup vs delivery validation', () => {
  assert.equal(validateAlamat('pickup', '', '').isValid, true);
  assert.equal(validateAlamat('delivery', 'Jl. Merdeka No. 45 Jakarta', '12345').isValid, true);
  assert.equal(validateAlamat('delivery', 'Jl. ABC', '12345').isValid, false);
  assert.equal(validateAlamat('delivery', 'Jl. Merdeka No. 45 Jakarta', '123').isValid, false);
});

test('validateItems: checks array non-empty and valid qty', () => {
  assert.equal(validateItems([]).isValid, false);
  assert.equal(
    validateItems([{ id: 'BMP1', judul: 'Sistem Informasi', harga: 65000, qty: 1 }]).isValid,
    true
  );
  assert.equal(
    validateItems([{ id: 'BMP1', judul: 'Sistem Informasi', harga: 65000, qty: 0 }]).isValid,
    false
  );
});

test('calculateOrderTotals: correct totals and promo discount', () => {
  const items = [
    { id: '1', sks: 3, harga: 60000, qty: 2 },
    { id: '2', sks: 2, harga: 40000, qty: 1 },
  ];
  const resDelivery = calculateOrderTotals(items, 'delivery', 20000, '');
  assert.equal(resDelivery.totalSKS, 8);
  assert.equal(resDelivery.totalBuku, 3);
  assert.equal(resDelivery.subtotalBuku, 160000);
  assert.equal(resDelivery.ongkir, 20000);
  assert.equal(resDelivery.diskon, 0);
  assert.equal(resDelivery.grandTotal, 180000);
});

test('dataPengguna: authentic users login authentication', () => {
  const rina = dataPengguna.find((u) => u.email === 'rina@ut.ac.id' && u.password === 'rina123');
  assert.ok(rina, 'User Rina Wulandari must exist');
  assert.equal(rina.role, 'UPBJJ-UT');
  assert.equal(rina.lokasi, 'UPBJJ Jakarta');

  const invalid = dataPengguna.find((u) => u.email === 'rina@ut.ac.id' && u.password === 'salah123');
  assert.equal(invalid, undefined);
});

test('dataBahanAjar: contains 5 modules with valid fields', () => {
  assert.equal(dataBahanAjar.length, 5);
  const asip = dataBahanAjar.find((b) => b.kodeBarang === 'ASIP4301');
  assert.ok(asip);
  assert.equal(asip.namaBarang, 'Pengantar Ilmu Komunikasi');
  assert.equal(asip.kodeLokasi, '0TMP01');
  assert.equal(asip.stok, 548);
});

test('dataTracking: contains DO 2023001234 and 2023005678 with timeline', () => {
  const do1 = dataTracking['2023001234'];
  assert.ok(do1);
  assert.equal(do1.nama, 'Rina Wulandari');
  assert.equal(do1.ekspedisi, 'JNE');
  assert.equal(do1.status, 'Dalam Perjalanan');
  assert.equal(do1.perjalanan.length, 3);

  const do2 = dataTracking['2023005678'];
  assert.ok(do2);
  assert.equal(do2.nama, 'Agus Pranoto');
  assert.equal(do2.perjalanan.length, 6);
});
