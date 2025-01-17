# Ngorei Framework

Selamat datang di Ngorei Framework! Framework web modern yang mengutamakan kesederhanaan dan kecepatan development.

## Keunggulan
- Tulis HTML, CSS, dan JavaScript murni tanpa perlu template engine
- PHP sebagai backend yang powerful
- Development 2x lebih cepat
- Kode yang mudah dimaintain
- Performa web yang maksimal

## Instalasi

```bash
composer require ngorei/framework
```

## Cara Penggunaan

Framework ini mendukung berbagai cara import sesuai kebutuhan Anda:

```js
// 1. ES Modules (Modern Browsers)
import { Ngorei } from './js/ngorei-framework.js';
const NexaUI = new Ngorei().Network();

// 2. AMD (RequireJS)
define(['ngorei-framework'], function(Ngorei) {
    const NexaUI = new Ngorei().Network();
});

// 3. CommonJS (Node.js)
const Ngorei = require('./js/ngorei-framework');
const NexaUI = new Ngorei().Network();

// 4. Browser Global
const NexaUI = new Ngorei().Network(); // Tersedia otomatis sebagai variabel global
```

## Dokumentasi Lengkap
Untuk informasi lebih detail, silakan kunjungi [dokumentasi resmi](https://ngorei.com/doc/v.4.0.5)

## Lisensi
MIT License

## Kontribusi
Kami sangat menghargai kontribusi dari komunitas. Silakan buat pull request atau laporkan issues.

