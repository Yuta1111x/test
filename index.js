const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Konfiguracja sesji
app.use(session({
    secret: 'aqs',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Konfiguracja Multera do obsługi uploadu plików
const upload = multer({ dest: 'public/' });

// Middleware do parsowania formularzy
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serwowanie plików statycznych – pliki z katalogu "public" będą dostępne pod rootem ("/")
app.use(express.static('public', { index: false }));

// Funkcja logowania odwiedzin
function logVisit(ip) {
    const date = new Date().toISOString();
    const logMessage = `${date} - Odwiedzin IP: ${ip}\n`;
    fs.appendFile('visits.log', logMessage, (err) => {
        if (err) console.error('Błąd zapisu logu:', err);
    });
}

// Middleware sprawdzający autoryzację
function checkAuth(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/panel/login');
    }
}

// Strona logowania
app.get('/panel/login', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Panel logowania</title>
            <style>
                body { background: #f0f0f0; font-family: Arial, sans-serif; }
                .login-container { max-width: 300px; margin: 100px auto; padding: 20px; background: white; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                input { width: 100%; padding: 10px; margin: 5px 0; }
                button { width: 100%; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer; }
                button:hover { background: #45a049; }
            </style>
        </head>
        <body>
            <div class="login-container">
                <h2>Logowanie</h2>
                <form action="/panel/login" method="POST">
                    <input type="text" name="username" placeholder="Nazwa użytkownika" required>
                    <input type="password" name="password" placeholder="Hasło" required>
                    <button type="submit">Zaloguj</button>
                </form>
            </div>
        </body>
        </html>
    `);
});

// Obsługa logowania
app.post('/panel/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'AQS' && password === 'AQS') {
        req.session.loggedIn = true;
        res.redirect('/panel/control');
    } else {
        res.send('Nieprawidłowe dane logowania.');
    }
});

// Panel kontrolny – wyświetla listę plików oraz dostępne akcje
app.get('/panel/control', checkAuth, (req, res) => {
    fs.readdir('public', (err, files) => {
        if (err) return res.send('Błąd wczytywania plików.');
        
        let fileRows = files.map(file => {
            return `
            <tr>
                <td>${file}</td>
                <td>
                    <a href="/panel/redirect/${encodeURIComponent(file)}" class="btn">Przekieruj</a>
                    <a href="/${encodeURIComponent(file)}" download class="btn">Pobierz</a>
                    <a href="/panel/edit/${encodeURIComponent(file)}" class="btn">Edytuj</a>
                    <a href="/panel/rename/${encodeURIComponent(file)}" class="btn">Zmień nazwę</a>
                    <a href="/panel/delete/${encodeURIComponent(file)}" class="btn btn-danger">Usuń</a>
                </td>
            </tr>
            `;
        }).join('');
        
        res.send(`
            <html>
            <head>
                <title>Panel Sterowania Plikami</title>
                <style>
                    body { font-family: Arial, sans-serif; background: #f9f9f9; }
                    .container { width: 90%; max-width: 1000px; margin: 20px auto; }
                    h1 { text-align: center; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { padding: 10px; border: 1px solid #ddd; text-align: center; }
                    th { background: #f2f2f2; }
                    .btn { padding: 5px 10px; margin: 2px; text-decoration: none; background: #4CAF50; color: white; border-radius: 3px; }
                    .btn:hover { background: #45a049; }
                    .btn-danger { background: #f44336; }
                    .btn-danger:hover { background: #e53935; }
                    .upload-form { margin-bottom: 20px; text-align: center; }
                    .logout { float: right; margin-top: 10px; text-decoration: none; color: #333; }
                </style>
            </head>
            <body>
                <div class="container">
                    <a href="/panel/logout" class="logout">Wyloguj</a>
                    <h1>Panel Sterowania Plikami</h1>
                    <div class="upload-form">
                        <form action="/panel/upload" method="POST" enctype="multipart/form-data">
                            <input type="file" name="file" required>
                            <button type="submit">Dodaj plik</button>
                        </form>
                    </div>
                    <table>
                        <tr>
                            <th>Nazwa pliku</th>
                            <th>Akcje</th>
                        </tr>
                        ${fileRows}
                    </table>
                </div>
            </body>
            </html>
        `);
    });
});

// Obsługa uploadu plików
app.post('/panel/upload', checkAuth, upload.single('file'), (req, res) => {
    res.redirect('/panel/control');
});

// Przekierowanie do wyświetlenia pliku – teraz bez prefiksu /public
app.get('/panel/redirect/:filename', checkAuth, (req, res) => {
    const file = req.params.filename;
    res.redirect(`/${file}`);
});

// Usuwanie pliku
app.get('/panel/delete/:filename', checkAuth, (req, res) => {
    const filePath = path.join(__dirname, 'public', req.params.filename);
    fs.unlink(filePath, (err) => {
        if (err) return res.send('Błąd usuwania pliku.');
        res.redirect('/panel/control');
    });
});

// Edycja pliku – formularz do edycji (tylko dla plików tekstowych)
app.get('/panel/edit/:filename', checkAuth, (req, res) => {
    const filePath = path.join(__dirname, 'public', req.params.filename);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.send('Błąd odczytu pliku. Upewnij się, że plik jest tekstowy.');
        res.send(`
            <html>
            <head>
                <title>Edytuj plik - ${req.params.filename}</title>
                <style>
                    body { font-family: Arial, sans-serif; background: #f9f9f9; }
                    .container { width: 90%; max-width: 600px; margin: 20px auto; }
                    textarea { width: 100%; height: 300px; padding: 10px; font-family: monospace; }
                    button { padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer; }
                    button:hover { background: #45a049; }
                    a { text-decoration: none; color: #333; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Edytuj plik: ${req.params.filename}</h1>
                    <form action="/panel/edit/${encodeURIComponent(req.params.filename)}" method="POST">
                        <textarea name="content" required>${data}</textarea><br>
                        <button type="submit">Zapisz zmiany</button>
                    </form>
                    <br>
                    <a href="/panel/control">Powrót do panelu</a>
                </div>
            </body>
            </html>
        `);
    });
});

// Obsługa zapisu edytowanego pliku
app.post('/panel/edit/:filename', checkAuth, (req, res) => {
    const filePath = path.join(__dirname, 'public', req.params.filename);
    const newContent = req.body.content;
    fs.writeFile(filePath, newContent, 'utf8', (err) => {
        if (err) return res.send('Błąd zapisu pliku.');
        res.redirect('/panel/control');
    });
});

// Zmiana nazwy pliku – formularz
app.get('/panel/rename/:filename', checkAuth, (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Zmień nazwę pliku - ${req.params.filename}</title>
            <style>
                body { font-family: Arial, sans-serif; background: #f9f9f9; }
                .container { width: 90%; max-width: 400px; margin: 20px auto; text-align: center; }
                input { width: 100%; padding: 10px; margin: 5px 0; }
                button { padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer; }
                button:hover { background: #45a049; }
                a { text-decoration: none; color: #333; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Zmień nazwę pliku</h1>
                <form action="/panel/rename/${encodeURIComponent(req.params.filename)}" method="POST">
                    <input type="text" name="newName" placeholder="Nowa nazwa pliku" required>
                    <button type="submit">Zmień nazwę</button>
                </form>
                <br>
                <a href="/panel/control">Powrót do panelu</a>
            </div>
        </body>
        </html>
    `);
});

// Obsługa zmiany nazwy pliku
app.post('/panel/rename/:filename', checkAuth, (req, res) => {
    const oldPath = path.join(__dirname, 'public', req.params.filename);
    const newPath = path.join(__dirname, 'public', req.body.newName);
    fs.rename(oldPath, newPath, (err) => {
        if (err) return res.send('Błąd zmiany nazwy pliku.');
        res.redirect('/panel/control');
    });
});

// Strona główna
app.get('/', (req, res) => {
    logVisit(req.ip);
    res.send(`
        <html>
        <head>
            <title>Moja strona</title>
            <style>
                body { background: #1e1e1e; color: white; font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            </style>
        </head>
        <body>
            <h1>Witaj na mojej stronie!</h1>
        </body>
        </html>
    `);
});

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});
