const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serwuje tylko pliki na konkretne żądanie
app.use(express.static('public', { index: false }));

// Strona główna (ładny tytuł i nic więcej)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Moja strona</title>
            <style>
                body {
                    background-color: #1e1e1e;
                    color: white;
                    text-align: center;
                    font-family: Arial, sans-serif;
                    margin: 50px;
                }
            </style>
        </head>
        <body>
            <h1>Witaj na mojej stronie!</h1>
        </body>
        </html>
    `);
});

// Pliki w folderze public są dostępne bezpośrednio
app.get('/:file', (req, res) => {
    const filePath = path.join(__dirname, 'public', req.params.file);
    res.download(filePath, (err) => {
        if (err) {
            res.status(404).send('Plik nie istnieje.');
        }
    });
});

// Start serwera
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});
