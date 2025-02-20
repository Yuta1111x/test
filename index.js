const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({ dest: 'public/' });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public', { index: false }));

app.get('/panel', (req, res) => {
    fs.readdir('public', (err, files) => {
        if (err) return res.send('Błąd wczytywania plików.');
        let fileRows = files.map(file => `
            <tr>
                <td>${file}</td>
                <td>
                    <a href="/${encodeURIComponent(file)}" download class="btn">Pobierz</a>
                    <a href="/panel/edit/${encodeURIComponent(file)}" class="btn">Edytuj</a>
                    <a href="/panel/rename/${encodeURIComponent(file)}" class="btn">Zmień nazwę</a>
                    <a href="/panel/delete/${encodeURIComponent(file)}" class="btn btn-danger">Usuń</a>
                </td>
            </tr>
        `).join('');
        
        res.send(`
            <html>
            <head>
                <title>Panel Sterowania Plikami</title>
                <style>
                    body { font-family: Arial, sans-serif; background: #f9f9f9; }
                    .container { width: 90%; max-width: 1000px; margin: 20px auto; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { padding: 10px; border: 1px solid #ddd; text-align: center; }
                    th { background: #f2f2f2; }
                    .btn { padding: 5px 10px; text-decoration: none; background: #4CAF50; color: white; border-radius: 3px; }
                    .btn:hover { background: #45a049; }
                    .btn-danger { background: #f44336; }
                    .btn-danger:hover { background: #e53935; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Panel Sterowania Plikami</h1>
                    <form action="/panel/upload" method="POST" enctype="multipart/form-data">
                        <input type="file" name="file" required>
                        <button type="submit">Dodaj plik</button>
                    </form>
                    <table>
                        <tr><th>Nazwa pliku</th><th>Akcje</th></tr>
                        ${fileRows}
                    </table>
                </div>
            </body>
            </html>
        `);
    });
});

app.post('/panel/upload', upload.single('file'), (req, res) => res.redirect('/panel'));

app.get('/panel/delete/:filename', (req, res) => {
    fs.unlink(path.join(__dirname, 'public', req.params.filename), (err) => {
        res.redirect('/panel');
    });
});

app.get('/panel/edit/:filename', (req, res) => {
    fs.readFile(path.join(__dirname, 'public', req.params.filename), 'utf8', (err, data) => {
        if (err) return res.send('Błąd odczytu pliku.');
        res.send(`
            <html>
            <head>
                <title>Edytuj plik</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    textarea { width: 100%; height: 300px; font-family: monospace; }
                </style>
            </head>
            <body>
                <h1>Edytuj plik</h1>
                <form action="/panel/edit/${encodeURIComponent(req.params.filename)}" method="POST">
                    <textarea name="content">${data}</textarea>
                    <button type="submit">Zapisz</button>
                </form>
                <a href="/panel">Powrót</a>
            </body>
            </html>
        `);
    });
});

app.post('/panel/edit/:filename', (req, res) => {
    fs.writeFile(path.join(__dirname, 'public', req.params.filename), req.body.content, 'utf8', (err) => {
        res.redirect('/panel');
    });
});

app.get('/panel/rename/:filename', (req, res) => {
    res.send(`
        <html>
        <head><title>Zmień nazwę</title></head>
        <body>
            <h1>Zmień nazwę pliku</h1>
            <form action="/panel/rename/${encodeURIComponent(req.params.filename)}" method="POST">
                <input type="text" name="newName" required>
                <button type="submit">Zmień</button>
            </form>
            <a href="/panel">Powrót</a>
        </body>
        </html>
    `);
});

app.post('/panel/rename/:filename', (req, res) => {
    fs.rename(
        path.join(__dirname, 'public', req.params.filename),
        path.join(__dirname, 'public', req.body.newName),
        () => res.redirect('/panel')
    );
});

app.listen(PORT, () => console.log(`Serwer działa na http://localhost:${PORT}`));
