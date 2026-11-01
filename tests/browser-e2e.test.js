import test from 'node:test';
import assert from 'node:assert/strict';

// Verifikasi ketersediaan static endpoint dev server
test('Dev Server: responds with HTTP 200 on all routes', async () => {
  const routes = ['/', '/index.html', '/stok.html', '/tracking.html', '/js/dataBahanAjar.js', '/js/stok-app.js', '/js/tracking-app.js'];
  for (const r of routes) {
    const res = await fetch(`http://localhost:3000${r}`);
    assert.equal(res.status, 200, `Route ${r} should return status 200`);
  }
});

test('stok.html: contains Vue mount target and script tags', async () => {
  const res = await fetch('http://localhost:3000/stok.html');
  const text = await res.text();
  assert.ok(text.includes('id="stok-app"'), 'stok-app mount point must exist');
  assert.ok(text.includes('v-html="item.catatanHTML"'), 'v-html directive must be present');
  assert.ok(text.includes('v-if="item.qty === 0"'), 'conditional status check must be present');
  assert.ok(text.includes('v-else-if="item.qty < item.safety"'), 'conditional warning status check must be present');
  assert.ok(text.includes('v-else'), 'conditional safe status check must be present');
  assert.ok(text.includes('/js/dataBahanAjar.js'), 'dataBahanAjar.js must be loaded');
  assert.ok(text.includes('/js/stok-app.js'), 'stok-app.js must be loaded');
});

test('tracking.html: contains package select and package detail preview target', async () => {
  const res = await fetch('http://localhost:3000/tracking.html');
  const text = await res.text();
  assert.ok(text.includes('id="tracking-app"'), 'tracking-app mount point must exist');
  assert.ok(text.includes('v-if="selectedPaketDetails"'), 'package details must render conditionally below select');
  assert.ok(text.includes('package-detail-card'), 'package details styling class must be present');
  assert.ok(text.includes(':value="nextDONumber"'), 'auto-generated DO sequence must be bound');
  assert.ok(text.includes('form.nim'), 'nim input model must be bound');
  assert.ok(text.includes('/js/tracking-app.js'), 'tracking-app.js must be loaded');
});
