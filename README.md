# Website Pembelajaran Bahasa Indonesia Kelas VB

Proyek untuk Netlify + Google Sheets lama. Materi pantun 5 bagian, absensi, kuis 5 soal dan nilai otomatis.

## Instalasi melalui GitHub dan Netlify

1. Ekstrak arsip ZIP di komputer.
2. Di GitHub, buka repository `pembelajarankelasv`.
3. Klik **Add file > Upload files**. Jika tidak terlihat di layar HP, gunakan komputer atau aktifkan situs desktop.
4. Unggah **isi folder ini** (file-file dan folder `netlify`), BUKAN file ZIP. Pastikan struktur file tetap seperti di bawah.
5. Klik **Commit changes** ke cabang utama. Tunggu build Netlify berhasil.
6. Cek `https://pembelajarankelasv.netlify.app/.netlify/functions/guru`. Endpoint harus merespons, bukan 404.
7. Periksa di Netlify apakah sudah terlihat status terhubung ke Google Sheets. Uji absen dan kuis menggunakan identitas khusus uji coba.

## Struktur repository

- `index.html` (bukan `indeks.html`)
- `package.json`
- `netlify.toml`
- `build.js`
- `netlify/functions/guru.js`

## Google Sheets tetap

Jangan menghapus spreadsheet `kuis bahasa` atau tab `Nilai_Pantun` dan `Absensi` yang sudah berisi data.
Di Apps Script lama, kode `Code.gs` harus mendukung `doGet(...api=public)` dan `doPost` untuk Netlify sebagaimana file Code.gs dalam paket Netlify sebelumnya. Jika belum, cadangkan kode lama dan perbarui seperti panduan sebelumnya, kemudian deploy sebagai **New version** tanpa menjalankan setupKelasVB lagi.

## Catatan keamanan

Repositori dan website publik tidak boleh berisi kata sandi, token pribadi, atau nama/nilai siswa sungguhan. Data siswa tetap hanya berada di Google Sheets guru.
