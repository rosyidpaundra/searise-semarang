# 🌊 SeaRise Semarang
### Simulasi Interaktif Kenaikan Muka Air Laut & Penurunan Tanah

> **Platform:** Google Earth Engine · **Area Kajian:** Kota Semarang, Indonesia · **Status:** Active



---

## 📌 Deskripsi

**SeaRise Semarang** adalah aplikasi berbasis **Google Earth Engine (GEE)** yang memvisualisasikan dampak gabungan dari **kenaikan muka air laut** (*sea level rise*) dan **penurunan tanah** (*land subsidence*) terhadap wilayah Kota Semarang secara temporal dan spasial.

Aplikasi ini dirancang untuk mendukung kegiatan:
- 🔬 **Penelitian ilmiah** kebencanaan dan perubahan iklim
- 🏛️ **Perencanaan tata ruang** berbasis risiko banjir rob
- 📢 **Komunikasi publik** tentang ancaman kenaikan muka air laut
- 🎓 **Pendidikan** geografi dan ilmu kebumian

---

## 🚀 Demo Langsung
<img width="1363" height="691" alt="image" src="https://github.com/user-attachments/assets/c1d37669-c9b6-476d-a5fe-b53b0a20d46a" />
▶️ **Buka WebGIS Sederhana dari Google Earth Engine  > (https://rosyidpaundra.users.earthengine.app/view/simulasi-pj-pesisir) ** 

> *Akses memerlukan akun Google Earth Engine (gratis untuk akademisi & peneliti)*

---

## ✨ Fitur Utama

| Fitur | Keterangan |
|-------|-----------|
| 🗺️ **Visualisasi DEM** | Peta elevasi berbasis NASA NASADEM dengan hillshade overlay |
| 📅 **Slider Tahun** | Proyeksi dari tahun 2025 hingga 2125 |
| 📈 **Slider Kenaikan Muka Air Laut** | Rentang 0–2000 mm/tahun |
| 📉 **Slider Penurunan Tanah** | Rentang 0–2000 cm/tahun |
| 💧 **Area Tergenang Real-time** | Visualisasi langsung area yang berisiko tergenang |
| 🔑 **Legenda Interaktif** | Legenda elevasi dan area tergenang |

---

## 🧮 Metodologi

Simulasi menggunakan pendekatan batimetri sederhana (*bathtub model*) dengan rumus:

```
Total Efek (m) = (Kenaikan Muka Air Laut [mm/thn] / 1000 × Δtahun)
               + (Penurunan Tanah [cm/thn] / 100 × Δtahun)
```

Area dinyatakan **tergenang** apabila nilai elevasi ≤ Total Efek.

**Data yang digunakan:**
- 🛰️ `NASA/NASADEM_HGT/001` — Digital Elevation Model resolusi ~30 meter
- 📐 Area kajian: Bounding box Kota Semarang (`110.32°E–110.51°E`, `7.07°S–6.89°S`)

> ⚠️ **Catatan:** Model bathtub tidak memperhitungkan faktor hidrologi dinamis (drainase, tanggul, dll). Hasil simulasi bersifat indikatif dan tidak menggantikan kajian teknis terperinci.

---

## 🗂️ Struktur Kode

```
searise-semarang/
│
├── main.js              # Skrip utama Google Earth Engine
└── README.md            # Dokumentasi ini
```

**Alur Kode:**

```
1. Definisi Area Kajian (Semarang Bounding Box)
       ↓
2. Load & Masking Data Elevasi (NASA NASADEM)
       ↓
3. Visualisasi Hillshade + DEM
       ↓
4. UI Panel (3 Slider: mm, cm, tahun)
       ↓
5. Fungsi seaRise() → hitung & render area tergenang
       ↓
6. Legenda Elevasi + Legenda Area Tergenang
```

---

## 🖥️ Cara Menggunakan

### Opsi A — Buka Script Langsung
1. Kunjungi [link aplikasi](https://code.earthengine.google.com/87ca49c9208ed13d499d3347521b7e36)
2. Klik **Run** di Code Editor GEE
3. Gunakan panel slider di kanan untuk mengatur parameter simulasi

### Opsi B — Import ke Proyek GEE Sendiri
1. Salin seluruh isi `main.js`
2. Buat script baru di [code.earthengine.google.com](https://code.earthengine.google.com)
3. Tempel kode dan klik **Run**

---

## 📊 Konteks Ilmiah

Semarang adalah salah satu kota di Indonesia dengan laju penurunan tanah tertinggi, mencapai **7–25 cm/tahun** di beberapa titik (Abidin et al., 2011; Chaussard et al., 2013). Dikombinasikan dengan proyeksi kenaikan muka air laut akibat perubahan iklim global, wilayah pesisir utara Semarang menghadapi risiko genangan permanen dalam beberapa dekade ke depan.

Simulasi ini membantu memvisualisasikan berbagai **skenario** berdasarkan asumsi laju yang berbeda-beda, mendukung diskusi kebijakan berbasis bukti.

---

## 🤝 Kontribusi

Kontribusi sangat disambut! Silakan:
1. **Fork** repositori ini
2. Buat **branch** baru (`git checkout -b fitur/nama-fitur`)
3. **Commit** perubahan (`git commit -m 'Tambah fitur X'`)
4. **Push** ke branch (`git push origin fitur/nama-fitur`)
5. Buat **Pull Request**

Ide pengembangan yang mungkin:
- [ ] Integrasi data subsidence dari Sentinel-1 InSAR
- [ ] Tambah layer infrastruktur (jalan, permukiman, fasilitas publik)
- [ ] Export area tergenang ke format shapefile/GeoJSON
- [ ] Perbandingan multi-kota pesisir Indonesia
- [ ] Skenario IPCC AR6 (SSP1-2.6, SSP2-4.5, SSP5-8.5)

---



<div align="center">

**Dibuat dengan ❤️ untuk mendukung riset kebencanaan Indonesia**

[![GEE](https://img.shields.io/badge/Platform-Google%20Earth%20Engine-4285F4?style=flat-square&logo=google)](https://earthengine.google.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Area](https://img.shields.io/badge/Area-Semarang%2C%20Indonesia-red?style=flat-square)](https://code.earthengine.google.com/87ca49c9208ed13d499d3347521b7e36)

</div>
