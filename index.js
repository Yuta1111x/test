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

// ... (pozostała część kodu routingu pozostaje bez zmian) ...

function logVisit(ip) {
    console.log(`Odwiedzono stronę z IP: ${ip}`);
}

app.get('/', (req, res) => {
    logVisit(req.ip);
    res.send(`
        <html>
        <head>
            <title>Neon Universe</title>
            <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Poppins:wght@300;500;700&display=swap" rel="stylesheet">
            <style>
                :root {
                    --neon-cyan: #0ff;
                    --neon-pink: #f0f;
                    --bg-color: #0a0a0a;
                }
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    background: var(--bg-color);
                    font-family: 'Poppins', sans-serif;
                    min-height: 100vh;
                    overflow: hidden;
                    position: relative;
                }

                .particles {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    z-index: 1;
                }

                .content {
                    position: relative;
                    z-index: 2;
                    padding: 4rem;
                    text-align: center;
                }

                h1 {
                    font-family: 'Orbitron', sans-serif;
                    font-size: 4rem;
                    color: var(--neon-cyan);
                    text-shadow: 0 0 10px var(--neon-cyan),
                                0 0 20px var(--neon-cyan),
                                0 0 30px var(--neon-cyan);
                    animation: glow 2s ease-in-out infinite alternate;
                    margin-bottom: 2rem;
                }

                @keyframes glow {
                    from {
                        text-shadow: 0 0 5px var(--neon-cyan),
                                    0 0 10px var(--neon-cyan),
                                    0 0 15px var(--neon-cyan);
                    }
                    to {
                        text-shadow: 0 0 10px var(--neon-cyan),
                                    0 0 20px var(--neon-cyan),
                                    0 0 30px var(--neon-cyan);
                    }
                }

                .neon-border {
                    position: relative;
                    padding: 2rem;
                    margin: 2rem auto;
                    max-width: 800px;
                    border: 3px solid var(--neon-pink);
                    border-radius: 15px;
                    box-shadow: 0 0 15px var(--neon-pink),
                                inset 0 0 15px var(--neon-pink);
                    animation: border-pulse 3s infinite;
                }

                @keyframes border-pulse {
                    0%, 100% { border-color: var(--neon-pink); }
                    50% { border-color: var(--neon-cyan); }
                }

            </style>
        </head>
        <body>
            <canvas class="particles" id="particles"></canvas>
            <div class="content">
                <div class="neon-border">
                    <h1>Witaj w Neonowym Świecie!</h1>
                </div>
            </div>
            <script>
                const canvas = document.getElementById('particles');
                const ctx = canvas.getContext('2d');
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                const particles = [];
                class Particle {
                    constructor() {
                        this.x = Math.random() * canvas.width;
                        this.y = Math.random() * canvas.height;
                        this.size = Math.random() * 2 + 1;
                        this.speedX = Math.random() * 3 - 1.5;
                        this.speedY = Math.random() * 3 - 1.5;
                        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
                    }

                    update() {
                        this.x += this.speedX;
                        this.y += this.speedY;
                        if (this.x > canvas.width) this.x = 0;
                        if (this.x < 0) this.x = canvas.width;
                        if (this.y > canvas.height) this.y = 0;
                        if (this.y < 0) this.y = canvas.height;
                    }

                    draw() {
                        ctx.fillStyle = this.color;
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }

                function init() {
                    for (let i = 0; i < 100; i++) {
                        particles.push(new Particle());
                    }
                }

                function animate() {
                    ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    particles.forEach(particle => {
                        particle.update();
                        particle.draw();
                    });
                    
                    requestAnimationFrame(animate);
                }

                init();
                animate();

                window.addEventListener('resize', () => {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    init();
                });
            </script>
        </body>
        </html>
    `);
});

// Panel sterowania - zaktualizowany CSS
app.get('/panel', (req, res) => {
    fs.readdir('public', (err, files) => {
        if (err) return res.send('Błąd wczytywania plików.');
        let fileRows = files.map(file => `
            <tr class="file-row">
                <td>${file}</td>
                <td>
                    <div class="button-group">
                        <a href="/${encodeURIComponent(file)}" download class="btn cyan">Pobierz</a>
                        <a href="/panel/edit/${encodeURIComponent(file)}" class="btn pink">Edytuj</a>
                        <a href="/panel/rename/${encodeURIComponent(file)}" class="btn purple">Zmień nazwę</a>
                        <a href="/panel/delete/${encodeURIComponent(file)}" class="btn danger">Usuń</a>
                        <a href="/panel/redirect/${encodeURIComponent(file)}" class="btn yellow">Otwórz</a>
                    </div>
                </td>
            </tr>
        `).join('');
        
        res.send(`
            <html>
            <head>
                <title>Neon Panel</title>
                <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Poppins:wght@300;500;700&display=swap" rel="stylesheet">
                <style>
                    :root {
                        --neon-cyan: #0ff;
                        --neon-pink: #f0f;
                        --neon-purple: #a0f;
                        --neon-yellow: #ff0;
                        --bg-color: #0a0a0a;
                        --glass-bg: rgba(15, 15, 15, 0.2);
                    }

                    body {
                        background: var(--bg-color);
                        color: #fff;
                        font-family: 'Poppins', sans-serif;
                        min-height: 100vh;
                    }

                    .container {
                        max-width: 1200px;
                        margin: 2rem auto;
                        padding: 2rem;
                        backdrop-filter: blur(10px);
                        background: var(--glass-bg);
                        border-radius: 20px;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        box-shadow: 0 0 30px rgba(0, 255, 255, 0.1);
                    }

                    h1 {
                        font-family: 'Orbitron', sans-serif;
                        color: var(--neon-cyan);
                        text-align: center;
                        margin-bottom: 2rem;
                        text-shadow: 0 0 10px var(--neon-cyan);
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 2rem;
                        background: var(--glass-bg);
                        border-radius: 15px;
                        overflow: hidden;
                    }

                    th, td {
                        padding: 1.2rem;
                        text-align: left;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    th {
                        background: rgba(0, 0, 0, 0.3);
                        font-weight: 700;
                    }

                    .file-row:hover {
                        background: rgba(255, 255, 255, 0.03);
                        transform: translateX(10px);
                        transition: all 0.3s ease;
                    }

                    .btn {
                        display: inline-block;
                        padding: 0.6rem 1.2rem;
                        margin: 0.2rem;
                        border: none;
                        border-radius: 5px;
                        font-weight: 500;
                        text-transform: uppercase;
                        transition: all 0.3s ease;
                        position: relative;
                        overflow: hidden;
                    }

                    .btn:before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(
                            120deg,
                            transparent,
                            rgba(255, 255, 255, 0.3),
                            transparent
                        );
                        transition: 0.5s;
                    }

                    .btn:hover:before {
                        left: 100%;
                    }

                    .cyan {
                        background: rgba(0, 255, 255, 0.1);
                        color: var(--neon-cyan);
                        border: 1px solid var(--neon-cyan);
                        box-shadow: 0 0 10px var(--neon-cyan);
                    }

                    .pink {
                        background: rgba(255, 0, 255, 0.1);
                        color: var(--neon-pink);
                        border: 1px solid var(--neon-pink);
                        box-shadow: 0 0 10px var(--neon-pink);
                    }

                    /* ... (podobne style dla innych kolorów przycisków) ... */

                    form input[type="file"] {
                        background: rgba(255, 255, 255, 0.1);
                        color: white;
                        padding: 1rem;
                        border: 2px dashed var(--neon-cyan);
                        border-radius: 10px;
                        transition: all 0.3s ease;
                    }

                    form input[type="file"]:hover {
                        background: rgba(0, 255, 255, 0.05);
                        border-style: solid;
                        box-shadow: 0 0 15px var(--neon-cyan);
                    }

                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-20px); }
                    }

                    .floating {
                        animation: float 3s ease-in-out infinite;
                    }
                </style>
            </head>
            <body>
                <div class="container floating">
                    <h1>🚀 Neonowy Panel Sterowania</h1>
                    <form action="/panel/upload" method="POST" enctype="multipart/form-data">
                        <input type="file" name="file" required>
                        <button type="submit" class="btn cyan">Dodaj plik</button>
                    </form>
                    <table>
                        <thead>
                            <tr><th>Nazwa pliku</th><th>Akcje</th></tr>
                        </thead>
                        <tbody>
                            ${fileRows}
                        </tbody>
                    </table>
                </div>
            </body>
            </html>
        `);
    });
});

// ... (reszta endpointów z podobnymi stylami) ...

app.listen(PORT, () => console.log(`Serwer działa na http://localhost:${PORT}`));
