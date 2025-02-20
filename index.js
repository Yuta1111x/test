const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Konfiguracja sesji
app.use(session({
    secret: 'tajny_klucz',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Konfiguracja Multera do obsługi uploadu plików
const upload = multer({ dest: 'public/' });

// Middleware do parsowania formularzy
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serwowanie plików statycznych
app.use(express.static('public', { index: false }));

// Funkcja logowania odwiedzin
function logVisit(ip) {
    const date = new Date().toISOString();
    const logMessage = `${date} - Odwiedzin IP: ${ip}\n`;
    fs.appendFile('visits.log', logMessage, (err) => {
        if (err) console.error('Błąd zapisu logu:', err);
    });
}

// Middleware sprawdzający, czy użytkownik jest zalogowany
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
        <form action="/panel/login" method="POST">
            <input type="text" name="username" placeholder="Nazwa użytkownika" required><br>
            <input type="password" name="password" placeholder="Hasło" required><br>
            <button type="submit">Zaloguj</button>
        </form>
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

// Panel kontrolny
app.get('/panel/control', checkAuth, (req, res) => {
    fs.readdir('public', (err, files) => {
        if (err) return res.send('Błąd wczytywania plików.');
        
        let fileList = files.map(file => `<li>${file} <a href="/panel/delete/${file}">[Usuń]</a> <a href="/public/${file}" download>[Pobierz]</a></li>`).join('');
        
        res.send(`
            <h1>Panel sterowania plikami</h1>
            <form action="/panel/upload" method="POST" enctype="multipart/form-data">
                <input type="file" name="file" required>
                <button type="submit">Dodaj plik</button>
            </form>
            <ul>${fileList}</ul>
            <a href="/panel/logout">Wyloguj</a>
        `);
    });
});

// Obsługa uploadu plików
app.post('/panel/upload', checkAuth, upload.single('file'), (req, res) => {
    res.redirect('/panel/control');
});

// Obsługa usuwania plików
app.get('/panel/delete/:filename', checkAuth, (req, res) => {
    const filePath = path.join(__dirname, 'public', req.params.filename);
    fs.unlink(filePath, (err) => {
        if (err) return res.send('Błąd usuwania pliku.');
        res.redirect('/panel/control');
    });
});

// Wylogowanie
app.get('/panel/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/panel/login');
    });
});

// Strona główna
app.get('/', (req, res) => {
    logVisit(req.ip);
    res.send('<h1>Witaj na mojej stronie!</h1>');
});

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});
