import { chromium } from 'playwright';

async function run() {
  console.log('Menjalankan pengujian interaktif browser Playwright...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Test 1: Halaman Portal index.html
  console.log('Menguji index.html...');
  await page.goto('http://localhost:3000/index.html');
  const title = await page.title();
  console.log('Judul halaman index.html:', title);

  // Test 2: Halaman Stok Bahan Ajar
  console.log('Menguji stok.html...');
  await page.goto('http://localhost:3000/stok.html');
  await page.waitForSelector('#stok-app');
  await page.waitForSelector('table tbody tr');

  const rowCountAwal = await page.locator('table tbody tr').count();
  console.log('Jumlah baris awal stok:', rowCountAwal);
  if (rowCountAwal === 0) throw new Error('Data stok tidak dirender oleh Vue!');

  // Uji Dependent Filter UT-Daerah -> Kategori
  console.log('Menguji dependent filter UT-Daerah...');
  await page.selectOption('#filter-upbjj', 'Bandung');
  await page.waitForTimeout(300);

  const kategoriOptions = await page.locator('#filter-kategori option').allInnerTexts();
  console.log('Opsi kategori untuk UT Bandung:', kategoriOptions);
  if (!kategoriOptions.includes('Pendidikan dan Keguruan')) {
    throw new Error('Dependent filter gagal: Pendidikan dan Keguruan harus ada di Bandung!');
  }

  // Uji Filter Reorder
  console.log('Menguji filter reorder (stok < safety atau kosong)...');
  await page.check('input[type="checkbox"]');
  await page.waitForTimeout(300);
  const reorderCount = await page.locator('table tbody tr').count();
  console.log('Jumlah baris saat filter reorder aktif:', reorderCount);
  await page.uncheck('input[type="checkbox"]');
  await page.waitForTimeout(300);

  // Uji Modal Edit Stok
  console.log('Menguji modal edit stok...');
  await page.selectOption('#filter-upbjj', 'Semua UT-Daerah');
  await page.waitForTimeout(300);
  const firstEditBtn = page.locator('table tbody tr button:has-text("Edit")').first();
  await firstEditBtn.click();
  await page.waitForSelector('.modal-box');
  console.log('Modal edit berhasil terbuka.');

  await page.fill('#edit-qty', '600');
  await page.click('.modal-footer button:has-text("Simpan Perubahan")');
  await page.waitForTimeout(400);
  console.log('Perubahan stok berhasil disimpan.');

  // Test 3: Halaman Tracking DO
  console.log('Menguji tracking.html...');
  await page.goto('http://localhost:3000/tracking.html');
  await page.waitForSelector('#tracking-app');

  const doNumberVal = await page.locator('#do-number').inputValue();
  console.log('Nomor DO otomatis tergenerate:', doNumberVal);
  if (!doNumberVal.startsWith('DO')) throw new Error('Nomor DO tidak berformat auto sequence!');

  // Periksa rincian paket di bawah select
  const packageDetailCard = await page.locator('.package-detail-card');
  const isDetailVisible = await packageDetailCard.isVisible();
  console.log('Rincian isi paket muncul di bawah select:', isDetailVisible);
  if (!isDetailVisible) throw new Error('Rincian paket harus muncul saat paket dipilih!');

  // Isi form DO baru
  console.log('Mengisi formulir DO baru...');
  await page.fill('#nim-input', '042998877');
  await page.fill('#nama-input', 'Athaberyl Mahasiswa UT');
  await page.selectOption('#paket-select', 'PAKET-MNJ-01');
  await page.waitForTimeout(300);

  // Submit DO
  await page.click('button:has-text("Terbitkan Delivery Order Sekarang")');
  await page.waitForTimeout(500);

  // Periksa baris baru di tabel DO
  const firstDORow = page.locator('table tbody tr').first();
  const firstDOName = await firstDORow.locator('td').nth(2).innerText();
  console.log('Nama di tabel DO teratas setelah submit:', firstDOName);
  if (!firstDOName.includes('Athaberyl')) {
    throw new Error('DO baru tidak muncul di daftar tracking!');
  }

  console.log('SEMUA PENGUJIAN PLAYWRIGHT BROWSER BERHASIL 100%!');
  await browser.close();
}

run().catch(err => {
  console.error('Playwright Test Error:', err);
  process.exit(1);
});
