require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

const app = express();
const port = process.env.PORT;

// Konfigurasi AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN, // boleh dikosongkan kalau tidak pakai session
  region: process.env.AWS_REGION
});
const s3 = new AWS.S3();
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

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

// Endpoint untuk mencatat klik dan upload ke S3
app.get('/log-click', async (req, res) => {
  const now = new Date().toISOString();
  const logMessage = `Tombol diklik pada ${now}\n`;
  const fileName = `log-${Date.now()}.txt`;
  const filePath = path.join(__dirname, fileName);

  try {
    // Simpan log ke file lokal sementara
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

    console.log(`[LOG] Tombol diklik dan log diupload: ${fileName}`);
    res.send('📝 Tercatat dan diupload ke S3!');
  } catch (error) {
    console.error('[ERROR] Gagal mencatat klik:', error);
    res.status(500).send('❌ Gagal mencatat klik dan upload.');
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`🚀 Server aktif di http://localhost:${port}`);
});
