require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 6000;

// Konfigurasi AWS S3
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN || undefined,
  region: process.env.AWS_REGION
});
const s3 = new AWS.S3();
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// Koneksi MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Buat tabel jika belum ada
(async () => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS click_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        clicked_at DATETIME NOT NULL
      )
    `);
    console.log("✅ Tabel click_logs siap digunakan.");
  } catch (err) {
    console.error("❌ Gagal membuat tabel:", err);
  }
})();

// Halaman utama
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Nice try Diddy</title></head>
      <body>
        <img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWswZTA4YWE0enRoaGd6NG80c284bjRzMG16bWRtdjRxaDBjMHQyayZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/a3Mb9g73SVCTvn9H51/giphy.webp" 
             alt="Giphy Image" style="max-width: 100%; height: auto;">
        <br><br>
        <button onclick="fetch('/log-click').then(res => res.text()).then(alert)">Nice try!</button>
      </body>
    </html>
  `);
});

// Endpoint untuk mencatat klik dan upload ke S3 + DB
app.get('/log-click', async (req, res) => {
  const now = new Date();
  const isoTime = now.toISOString();
  const logMessage = `Tombol diklik pada ${isoTime}\n`;
  const fileName = `log-${Date.now()}.txt`;
  const filePath = path.join(__dirname, fileName);

  try {
    // Simpan log ke file lokal
    fs.writeFileSync(filePath, logMessage);

    // Upload ke S3
    const fileStream = fs.createReadStream(filePath);
    await s3.upload({
      Bucket: BUCKET_NAME,
      Key: `logs/${fileName}`,
      Body: fileStream,
      ContentType: 'text/plain'
    }).promise();

    // Hapus file lokal
    fs.unlinkSync(filePath);

    // Simpan ke database
    await db.execute('INSERT INTO click_logs (clicked_at) VALUES (?)', [now]);

    console.log(`[LOG] Klik dicatat: ${fileName}, waktu: ${isoTime}`);
    res.send('📝 Klik dicatat dan diupload ke S3 & MySQL!');
  } catch (error) {
    console.error('[ERROR] Gagal mencatat klik:', error);
    res.status(500).send('❌ Gagal mencatat klik dan upload.');
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`🚀 Server aktif di http://localhost:${port}`);
});
