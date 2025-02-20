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

function logVisit(ip) {
    console.log(`Odwiedzono stronę z IP: ${ip}`);
}

// Styl globalny i funkcje pomocnicze
const neonStyles = `
<style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@300;500;700&display=swap');
    
    /* Usunięcie podkreślenia tekstu wszędzie */
    a {
        text-decoration: none;
    }
    /* Nowe style dla formularza tworzenia pliku */
input[type="text"] {
    width: 100%;
    padding: 1rem;
    margin: 1rem 0;
    background: rgba(0, 243, 255, 0.1);
    border: 2px solid var(--neon-blue);
    color: white;
    border-radius: 10px;
    font-family: 'Rajdhani', sans-serif;
}

input[type="text"]:focus {
    outline: none;
    box-shadow: 0 0 15px var(--neon-blue);
}
textarea {
    width: 100%;
    height: 80vh;  /* Nowa wysokość zajmująca 80% okna */
    min-height: 500px;  /* Minimalna wysokość gwarantująca czytelność */
    padding: 1rem;
    margin: 1rem 0;
    background: rgba(0, 0, 0, 0.5);
    border: 2px solid var(--neon-blue);
    color: white;
    font-family: monospace;
    border-radius: 10px;
    resize: vertical;
}

    input[type="file"] {
        width: 100%;
        padding: 1rem;
        margin: 1rem 0;
        background: rgba(0, 243, 255, 0.1);
        border: 2px solid var(--neon-blue);
        color: white;
        border-radius: 10px;
        cursor: pointer;
        font-family: 'Rajdhani', sans-serif;
        transition: all 0.3s ease;
    }

    input[type="file"]::-webkit-file-upload-button {
        background: var(--neon-blue);
        color: black;
        padding: 1rem 2rem;
        border: none;
        border-radius: 5px;
        font-weight: bold;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    input[type="file"]:hover,
    input[type="file"]::-webkit-file-upload-button:hover {
        background: rgba(0, 243, 255, 0.3);
        box-shadow: 0 0 15px var(--neon-blue);
        transform: translateY(-2px);
    }

    :root {
        --neon-blue: #00f3ff;
        --neon-pink: #ff00ff;
        --dark-bg: #0a0a1a;
        --glass-bg: rgba(255, 255, 255, 0.05);
    }

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: 'Rajdhani', sans-serif;
        background: var(--dark-bg);
        color: white;
        min-height: 100vh;
        overflow-x: hidden;
    }

    .particles {
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: -1;
    }

    .container {
        width: 90%;
        max-width: 1200px;
        margin: 2rem auto;
        padding: 2rem;
        background: var(--glass-bg);
        backdrop-filter: blur(10px);
        border-radius: 15px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 0 30px rgba(0, 243, 255, 0.2);
    }

    h1 {
        font-family: 'Orbitron', sans-serif;
        text-align: center;
        margin-bottom: 2rem;
        font-size: 2.5em;
        background: linear-gradient(45deg, var(--neon-blue), var(--neon-pink));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 10px rgba(0, 243, 255, 0.5);
        animation: neonPulse 2s infinite alternate;
    }

    .btn {
        display: inline-block;
        padding: 0.5rem 1.2rem;
        margin: 0.3rem;
        border: none;
        border-radius: 5px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .btn.glow {
        background: rgba(0, 243, 255, 0.15);
        color: var(--neon-blue);
        border: 1px solid var(--neon-blue);
    }

    .btn.glow:hover {
        background: rgba(0, 243, 255, 0.3);
        box-shadow: 0 0 15px var(--neon-blue);
        transform: translateY(-2px);
    }

    .btn.glow.danger {
        background: rgba(255, 0, 255, 0.15);
        color: var(--neon-pink);
        border: 1px solid var(--neon-pink);
    }

    @keyframes neonPulse {
        from { text-shadow: 0 0 10px rgba(0, 243, 255, 0.5); }
        to { text-shadow: 0 0 20px rgba(0, 243, 255, 0.8); }
    }

    .fade-in { animation: fadeIn 0.5s ease forwards; opacity: 0; }
    @keyframes fadeIn { to { opacity: 1; } }

    textarea {
        width: 100%;
        height: 300px;
        padding: 1rem;
        margin: 1rem 0;
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid var(--neon-blue);
        color: white;
        font-family: monospace;
        border-radius: 10px;
        resize: vertical;
    }

    form button[type="submit"] {
        background: var(--neon-blue);
        color: black;
        padding: 0.8rem 2rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s ease;
    }

    input[type="text"], input[type="file"] {
        width: 100%;
        padding: 1rem;
        margin: 1rem 0;
        background: rgba(0, 243, 255, 0.1);
        border: 2px solid var(--neon-blue);
        color: white;
        border-radius: 10px;
        transition: all 0.3s ease;
    }
</style>
`;

const particlesScript = `
    <script src="https://cdn.jsdelivr.net/npm/tsparticles@2.3.4/tsparticles.bundle.min.js"></script>
    <script>
        particlesJS.load('particles', {
            particles: {
                number: { value: 80 },
                color: { value: ['#00f3ff', '#ff00ff'] },
                shape: { type: 'circle' },
                opacity: { value: 0.5 },
                size: { value: 3 },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' }
                }
            },
            retina_detect: true
        });
    </script>
`;

app.get('/', (req, res) => {
    logVisit(req.ip);
    res.send(`
        <html>
        <head>
            <title>FILES PORTAL</title>
            ${neonStyles}
        </head>
        <body>
            <div class="particles" id="particles"></div>
            <div class="container">
                <h1>🚀 Welcome to Files Zone! 🌌</h1>
                <div style="text-align: center;">
                    <button onclick="window.location.reload();" class="btn glow">🔄 Refresh</button>
                </div>
            </div>
            ${particlesScript}
        </body>
        </html>
    `);
});

app.get('/panel', (req, res) => {
    fs.readdir('public', (err, files) => {
        if (err) return res.send('Błąd wczytywania plików.');
        
        const fileRows = files.map(file => `
            <tr class="fade-in">
                <td>${file}</td>
                <td class="actions">
                    <a href="/${encodeURIComponent(file)}" download class="btn glow">📥 Pobierz</a>
                    <a href="/panel/edit/${encodeURIComponent(file)}" class="btn glow">✏️ Edytuj</a>
                    <a href="/panel/rename/${encodeURIComponent(file)}" class="btn glow">🔄 Zmień nazwę</a>
                    <a href="/panel/create" class="btn glow">✨ Create New File</a>
                    <a href="/panel/redirect/${encodeURIComponent(file)}" class="btn glow">🌐 Otwórz</a>
                    <a href="/panel/delete/${encodeURIComponent(file)}" class="btn glow danger">🗑️ Usuń</a>
                </td>
            </tr>
        `).join('');

        res.send(`
            <html>
            <head>
                <title>NEON FILE PANEL</title>
                ${neonStyles}
            </head>
            <body>
                <div class="particles" id="particles"></div>
                <div class="container">
                    <h1>🚀 NEON FILE PANEL</h1>
                    <form action="/panel/upload" method="POST" enctype="multipart/form-data">
                        <input type="file" name="file" required>
                        <button type="submit">⬆️ Upload File</button>
                    </form>
                    <table>
                        <tr><th>File Name</th><th>Actions</th></tr>
                        ${fileRows}
                    </table>
                </div>
                ${particlesScript}
            </body>
            </html>
        `);
    });
});
// Nowy formularz do tworzenia plików
app.get('/panel/create', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Create New File</title>
            ${neonStyles}
        </head>
        <body>
            <div class="particles" id="particles"></div>
            <div class="container">
                <h1>✨ Create New File</h1>
                <form action="/panel/create" method="POST">
                    <input type="text" name="filename" placeholder="File name" required>
                    <textarea name="content" placeholder="File content"></textarea>
                    <button type="submit" class="btn glow">🚀 Create</button>
                </form>
                <a href="/panel" class="btn glow">🔙 Back</a>
            </div>
            ${particlesScript}
        </body>
        </html>
    `);
});

// Obsługa tworzenia plików
app.post('/panel/create', (req, res) => {
    const { filename, content } = req.body;
    if (!filename) return res.send('File name is required!');

    const filePath = path.join(__dirname, 'public', filename);
    
    // Sprawdź czy plik już istnieje
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (!err) return res.send('File already exists!');
        
        fs.writeFile(filePath, content || '', (err) => {
            if (err) return res.send('Error creating file!');
            res.redirect('/panel');
        });
    });
});
app.get('/panel/edit/:filename', (req, res) => {
    fs.readFile(path.join(__dirname, 'public', req.params.filename), 'utf8', (err, data) => {
        if (err) return res.send('Błąd odczytu pliku.');
        res.send(`
            <html>
            <head>
                <title>Edytuj plik</title>
                ${neonStyles}
            </head>
            <body>
                <div class="particles" id="particles"></div>
                <div class="container">
                    <h1>✏️ Edit File</h1>
                    <form action="/panel/edit/${encodeURIComponent(req.params.filename)}" method="POST">
                        <textarea name="content">${data}</textarea>
                        <button type="submit">💾 Save</button>
                    </form>
                    <a href="/panel" class="btn glow">🔙 Back</a>
                </div>
                ${particlesScript}
            </body>
            </html>
        `);
    });
});

app.get('/panel/rename/:filename', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Zmień nazwę</title>
            ${neonStyles}
        </head>
        <body>
            <div class="particles" id="particles"></div>
            <div class="container">
                <h1>🔄 Rename File</h1>
                <form action="/panel/rename/${encodeURIComponent(req.params.filename)}" method="POST">
                    <input type="text" name="newName" required>
                    <button type="submit">🚀 Rename</button>
                </form>
                <a href="/panel" class="btn glow">🔙 Back</a>
            </div>
            ${particlesScript}
        </body>
        </html>
    `);
});

// Pozostałe endpointy
app.post('/panel/upload', upload.single('file'), (req, res) => res.redirect('/panel'));

app.get('/panel/delete/:filename', (req, res) => {
    fs.unlink(path.join(__dirname, 'public', req.params.filename), (err) => {
        res.redirect('/panel');
    });
});

app.post('/panel/edit/:filename', (req, res) => {
    fs.writeFile(path.join(__dirname, 'public', req.params.filename), req.body.content, 'utf8', (err) => {
        res.redirect('/panel');
    });
});

app.post('/panel/rename/:filename', (req, res) => {
    fs.rename(
        path.join(__dirname, 'public', req.params.filename),
        path.join(__dirname, 'public', req.body.newName),
        () => res.redirect('/panel')
    );
});

app.get('/panel/redirect/:filename', (req, res) => {
    res.redirect(`/${encodeURIComponent(req.params.filename)}`);
});

app.listen(PORT, () => console.log(`Serwer działa na http://localhost:${PORT}`));
