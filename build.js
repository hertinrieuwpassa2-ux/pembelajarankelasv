// Buat folder hasil deploy agar index.html dan Netlify Functions dapat diterbitkan.
const fs = require('fs');
fs.mkdirSync('public', { recursive: true });
fs.copyFileSync('index.html', 'public/index.html');
console.log('Halaman Kelas VB siap diterbitkan ke Netlify.');
