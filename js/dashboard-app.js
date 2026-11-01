/**
 * SITTA UT - Dashboard Portal Charts & Statistics
 * Universitas Terbuka - Sistem Informasi Tiras dan Transaksi Bahan Ajar
 * Visualisasi data persediaan tiras dan distribusi logistik Delivery Order
 */

import { upbjjList, dataStokBahanAjar, dataTrackingDO, paketList } from './dataBahanAjar.js';

const VueInstance = (typeof Vue !== 'undefined') ? Vue : (window.Vue || null);

if (!VueInstance) {
  console.error('Vue 3 belum dimuat.');
} else {
  const { createApp } = VueInstance;

  const DashboardApp = createApp({
    data() {
      return {
        upbjjList: upbjjList || [],
        stokList: dataStokBahanAjar || [],
        trackingList: dataTrackingDO || [],
        paketList: paketList || [],
        selectedViewRegion: 'Semua',
        activeChartTab: 'stok' // 'stok' | 'logistik'
      };
    },
    computed: {
      kpi() {
        const totalEksemplar = this.stokList.reduce((acc, curr) => acc + (Number(curr.qty) || 0), 0);
        const totalSafety = this.stokList.reduce((acc, curr) => acc + (Number(curr.safety) || 0), 0);
        const totalJudul = this.stokList.length;
        const totalDO = this.trackingList.length;
        const totalUpbjj = this.upbjjList.length;

        const aman = this.stokList.filter(item => item.qty >= item.safety && item.qty > 0).length;
        const menipis = this.stokList.filter(item => item.qty < item.safety && item.qty > 0).length;
        const kosong = this.stokList.filter(item => item.qty === 0).length;

        const doSelesai = this.trackingList.filter(item => item.status === 'Terkirim').length;
        const doJalan = this.trackingList.filter(item => item.status === 'Dalam Perjalanan').length;
        const doProses = this.trackingList.filter(item => item.status === 'Diproses').length;

        return {
          totalEksemplar,
          totalSafety,
          totalJudul,
          totalDO,
          totalUpbjj,
          aman,
          menipis,
          kosong,
          persenAman: totalJudul ? Math.round((aman / totalJudul) * 100) : 0,
          persenMenipis: totalJudul ? Math.round((menipis / totalJudul) * 100) : 0,
          persenKosong: totalJudul ? Math.round((kosong / totalJudul) * 100) : 0,
          doSelesai,
          doJalan,
          doProses,
          persenDoSelesai: totalDO ? Math.round((doSelesai / totalDO) * 100) : 0,
          persenDoJalan: totalDO ? Math.round((doJalan / totalDO) * 100) : 0,
          persenDoProses: totalDO ? Math.round((doProses / totalDO) * 100) : 0
        };
      },

      // Rekap Stok per UPBJJ
      stokPerUpbjj() {
        const result = this.upbjjList.map(region => {
          const items = this.stokList.filter(i => i.upbjj === region);
          const totalQty = items.reduce((acc, curr) => acc + (Number(curr.qty) || 0), 0);
          const totalSafety = items.reduce((acc, curr) => acc + (Number(curr.safety) || 0), 0);
          const countAman = items.filter(i => i.qty >= i.safety && i.qty > 0).length;
          const countKritis = items.filter(i => i.qty < i.safety).length;
          return {
            region,
            totalQty,
            totalSafety,
            totalJudul: items.length,
            countAman,
            countKritis
          };
        });

        const maxQty = Math.max(...result.map(r => r.totalQty), 1);
        return result.map(r => ({
          ...r,
          barWidth: Math.round((r.totalQty / maxQty) * 100)
        }));
      },

      // Rekap Distribusi per Ekspedisi
      ekspedisiBreakdown() {
        const counts = {};
        this.trackingList.forEach(item => {
          const eksp = item.ekspedisi || 'Lainnya';
          counts[eksp] = (counts[eksp] || 0) + 1;
        });

        const total = this.trackingList.length || 1;
        return Object.keys(counts).map(name => ({
          name,
          count: counts[name],
          persen: Math.round((counts[name] / total) * 100)
        })).sort((a, b) => b.count - a.count);
      },

      // 4 Transaksi Terkini
      recentDeliveries() {
        return this.trackingList.slice(0, 4);
      }
    },
    methods: {
      formatRupiah(val) {
        return 'Rp ' + Number(val || 0).toLocaleString('id-ID');
      },
      formatNumber(val) {
        return Number(val || 0).toLocaleString('id-ID');
      }
    }
  });

  DashboardApp.mount('#dashboard-portal-app');
}
