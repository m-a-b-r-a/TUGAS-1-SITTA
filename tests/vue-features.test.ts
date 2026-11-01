import test from 'node:test';
import assert from 'node:assert/strict';
import {
  upbjjList,
  kategoriList,
  kategoriPerUpbjj,
  pengirimanList,
  paketList,
  dataStokBahanAjar,
  dataTrackingDO
} from '../js/dataBahanAjar.js';

test('Tugas 2 Data: upbjjList and pengirimanList are populated', () => {
  assert.ok(Array.isArray(upbjjList));
  assert.ok(upbjjList.includes('Jakarta'));
  assert.ok(upbjjList.includes('Bandung'));
  assert.ok(upbjjList.includes('Surabaya'));
  assert.ok(upbjjList.includes('Makassar'));

  assert.ok(Array.isArray(pengirimanList));
  assert.ok(pengirimanList.includes('JNE Regular'));
  assert.ok(pengirimanList.includes('Pos Indonesia'));
});

test('Tugas 2 Data: kategoriPerUpbjj provides dependent category mappings', () => {
  assert.ok(kategoriPerUpbjj['Jakarta']);
  assert.ok(kategoriPerUpbjj['Jakarta'].includes('Ilmu Komunikasi'));
  assert.ok(kategoriPerUpbjj['Bandung'].includes('Pendidikan dan Keguruan'));
  assert.ok(kategoriPerUpbjj['Malang'].includes('Biologi dan Pertanian'));
});

test('Tugas 2 Data: paketList contains package details and module contents', () => {
  assert.ok(paketList.length >= 4);
  const si = paketList.find(p => p.kode === 'PAKET-SI-01');
  assert.ok(si);
  assert.equal(si.harga, 240000);
  assert.ok(si.isi.length >= 3);
  assert.equal(si.isi[0].kode, 'MSIM4101');
});

test('Tugas 2 Data: dataStokBahanAjar has all required 9 fields including catatanHTML', () => {
  assert.ok(dataStokBahanAjar.length >= 8);
  for (const item of dataStokBahanAjar) {
    assert.ok(item.kode, 'Item must have kode');
    assert.ok(item.judul, 'Item must have judul');
    assert.ok(item.kategori, 'Item must have kategori');
    assert.ok(item.upbjj, 'Item must have upbjj');
    assert.ok(item.lokasiRak, 'Item must have lokasiRak');
    assert.equal(typeof item.harga, 'number');
    assert.equal(typeof item.qty, 'number');
    assert.equal(typeof item.safety, 'number');
    assert.ok(typeof item.catatanHTML === 'string', 'Item must have catatanHTML');
  }
});

test('Tugas 2 Logic: Stock status evaluation (Aman, Menipis, Kosong)', () => {
  const getStatus = (qty: number, safety: number) => {
    if (qty === 0) return 'Kosong';
    if (qty < safety) return 'Menipis';
    return 'Aman';
  };

  assert.equal(getStatus(500, 100), 'Aman');
  assert.equal(getStatus(100, 100), 'Aman');
  assert.equal(getStatus(99, 100), 'Menipis');
  assert.equal(getStatus(1, 100), 'Menipis');
  assert.equal(getStatus(0, 100), 'Kosong');
});

test('Tugas 2 Logic: Auto-generated DO sequence number format', () => {
  const generateNextDO = (list: { nomorDO: string }[], year = 2025) => {
    const prefix = `DO${year}-`;
    let maxSeq = 0;
    list.forEach(item => {
      if (item.nomorDO && item.nomorDO.startsWith(prefix)) {
        const seq = parseInt(item.nomorDO.replace(prefix, ''), 10);
        if (!isNaN(seq) && seq > maxSeq) {
          maxSeq = seq;
        }
      }
    });
    return `${prefix}${String(maxSeq + 1).padStart(3, '0')}`;
  };

  const sampleList = [
    { nomorDO: 'DO2025-001' },
    { nomorDO: 'DO2025-002' },
    { nomorDO: 'DO2025-003' }
  ];

  assert.equal(generateNextDO(sampleList, 2025), 'DO2025-004');
  assert.equal(generateNextDO([], 2025), 'DO2025-001');
});

test('Tugas 2 Logic: NIM Mahasiswa 9-digit validation', () => {
  const isValidNIM = (nim: string) => /^\d{9}$/.test(nim.trim());
  assert.equal(isValidNIM('042189345'), true);
  assert.equal(isValidNIM('123456789'), true);
  assert.equal(isValidNIM('12345678'), false); // 8 digit
  assert.equal(isValidNIM('1234567890'), false); // 10 digit
  assert.equal(isValidNIM('04218934A'), false); // Huruf
  assert.equal(isValidNIM(''), false);
});
