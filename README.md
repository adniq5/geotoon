# GEOTOON — Mengenal Bumi dari Atas

Prototype media pembelajaran Geografi berbasis web-comic.

## Fitur MVP
- Landing page GEOTOON
- Daftar episode
- Comic reader
- Progress panel
- Voice-over per panel (opsional)
- Background music per episode (opsional)
- Quiz pilihan ganda
- Perhitungan nilai di sisi browser
- Responsive untuk HP dan laptop
- Web app manifest untuk dasar PWA

## Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Menambahkan episode

1. Buat folder baru di `public/images/episodes/episode-02/`.
2. Masukkan `cover.jpg` dan gambar panel.
3. Masukkan audio ke `public/audio/episode-02/` jika tersedia.
4. Tambahkan data episode di `src/data/episodes.ts`.
5. Tambahkan soal di `src/data/quizzes.ts`.

## Catatan
Audio sengaja dibuat opsional pada prototype. Setelah klien memberikan file voice-over dan BGM asli, path audio tinggal dimasukkan ke data episode/panel.

## Deploy
Project dapat dideploy ke Vercel setelah diuji dengan `npm run build`.
