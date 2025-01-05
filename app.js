const express = require('express');
const app = express();
const port = 6000;

// Route untuk menampilkan gambar
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Nice try Diddy</title>
            </head>
            <body>
                <img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWswZTA4YWE0enRoaGd6NG80c284bjRzMG16bWRtdjRxaDBjMHQyayZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/a3Mb9g73SVCTvn9H51/giphy.webp" alt="Giphy Image" style="max-width: 100%; height: auto;">
            </body>
        </html>
    `);
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
