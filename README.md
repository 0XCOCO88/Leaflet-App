# 🌿 Leaflet Gizi Generator

Generator otomatis leaflet diet RS dari file Word — dibuat khusus untuk **Fika Nurul Uyun** (Dept. Ilmu Gizi FK Undip).

Upload file `.docx` → AI baca otomatis → leaflet siap cetak.

---

## 🚀 Cara Deploy ke Vercel (Tutorial Lengkap)

### **Step 1 — Dapatkan API Key Gemini (GRATIS)**

1. Buka https://aistudio.google.com/app/apikey
2. Login pakai akun Google kamu
3. Klik **"Create API Key"** → **"Create API key in new project"**
4. Copy API key yang muncul (formatnya: `AIzaSy...`)
5. Simpan dulu, nanti dipakai di Step 4

> ⚠️ Jangan share API key ke siapapun, dan jangan commit ke GitHub.

---

### **Step 2 — Upload Project ke GitHub**

1. Download semua file project ini ke komputer kamu (folder `leaflet-app`)
2. Buka https://github.com → login
3. Klik **"+"** di pojok kanan atas → **"New repository"**
4. Isi:
   - Repository name: `leaflet-gizi-generator`
   - Visibility: **Private** (biar ga keliatan orang)
   - Jangan centang "Add README" (udah ada)
5. Klik **"Create repository"**

6. Di komputer kamu, buka terminal di folder project, lalu jalankan:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME_KAMU/leaflet-gizi-generator.git
git push -u origin main
```

> Ganti `USERNAME_KAMU` dengan username GitHub kamu.

---

### **Step 3 — Connect ke Vercel**

1. Buka https://vercel.com → login pakai akun GitHub
2. Klik **"Add New..."** → **"Project"**
3. Cari repo `leaflet-gizi-generator` → klik **"Import"**
4. Di halaman configure:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./`
   - Build Command: biarin default
5. **JANGAN KLIK DEPLOY DULU** — lanjut ke Step 4!

---

### **Step 4 — Set Environment Variable**

Di halaman configure Vercel yang sama:

1. Expand bagian **"Environment Variables"**
2. Tambahkan:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: paste API key dari Step 1
3. Klik **"Add"**

4. Baru klik **"Deploy"**

Tunggu 1-2 menit... Selesai! 🎉

Kamu akan dapet URL kayak `https://leaflet-gizi-generator.vercel.app`

---

## 🧪 Cara Testing Lokal (Opsional)

Kalau mau coba dulu sebelum deploy:

```bash
cd leaflet-app
npm install

# Bikin file .env.local
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

npm run dev
```

Buka http://localhost:3000 di browser.

---

## 📁 Struktur Project

```
leaflet-app/
├── app/
│   ├── api/parse/route.js    # API endpoint buat parse Word
│   ├── layout.js              # Root layout
│   └── page.js                # Halaman utama
├── components/
│   └── LeafletPreview.js      # Komponen desain leaflet
├── package.json
├── next.config.js
└── README.md
```

---

## 💡 Cara Pakai

1. Buka URL Vercel yang udah di-deploy
2. Drag & drop file Word (`.docx`) leaflet diet
3. AI otomatis baca + generate leaflet
4. Ganti tema warna dari sidebar (6 pilihan)
5. Quick edit kalau ada yang perlu diubah
6. Klik **"Re-generate AI"** kalau hasilnya kurang pas
7. Klik **"Download PDF"** → pilih Save as PDF di print dialog

---

## 🔧 Troubleshooting

**Error "GEMINI_API_KEY tidak di-set"**
→ Cek di Vercel Dashboard > Settings > Environment Variables, pastikan `GEMINI_API_KEY` udah ada

**Leaflet kosong / AI error**
→ Coba klik "Re-generate AI" lagi. Kalau tetap error, file Word mungkin kebanyakan formatting aneh

**Mau nambah tema warna**
→ Edit `components/LeafletPreview.js`, array `THEMES` di atas

---

## 👥 Credits

- **Content**: Fika Nurul Uyun (22030125220050) — Dept. Ilmu Gizi FK Undip
- **Development**: Made with 💛 by pacar Fika
- **Stack**: Next.js 14 + Gemini 2.0 Flash + Mammoth.js

---

## 💰 Cost

- **Gemini API**: Free tier cukup (1500 request/hari)
- **Vercel**: Free tier cukup untuk pemakaian pribadi
- **Total**: **Rp 0** 🎉
