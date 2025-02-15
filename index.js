const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 3000;

// Serwuje tylko pliki na konkretne żądanie
app.use(express.static('public', { index: false }));

// Funkcja do zapisywania logów odwiedzin
function logVisit(ip) {
    const date = new Date().toISOString();
    const logMessage = `${date} - Odwiedzin IP: ${ip}\n`;
    fs.appendFile('visits.log', logMessage, (err) => {
        if (err) {
            console.error('Błąd zapisu logu:', err);
        }
    });
}

// Funkcja do logowania pobrania pliku
function logDownload(ip, fileName) {
    const date = new Date().toISOString();
    const logMessage = `${date} - Pobranie pliku: ${fileName} przez IP: ${ip}\n`;
    console.log(`Pobranie pliku: ${fileName} przez IP: ${ip}`);
    fs.appendFile('downloads.log', logMessage, (err) => {
        if (err) {
            console.error('Błąd zapisu logu pobrania:', err);
        }
    });
}

// Strona główna
app.get('/', (req, res) => {
    const visitorIp = req.ip;
    logVisit(visitorIp);  // Logowanie odwiedzin
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


// Start serwera
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});
