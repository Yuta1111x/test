const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const axios = require('axios'); // Add axios for API requests
const marked = require('marked'); // Biblioteka do formatowania markdown
const { exec } = require('child_process'); // Dodajemy moduł do wykonywania komend git

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = 'AIzaSyAP1EOpnlAhNRh9MI41v8EHtyRGylNR_bA';
const GIT_TOKEN = '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'; // Zastąp tym właściwym tokenem GitHub

// Inicjalizacja konfiguracji git
function initGitConfig() {
    console.log('Inicjalizacja konfiguracji git...');

    // Ustawienie nazwy użytkownika git
    exec('git config --global user.name "Yuta1111x"', { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Błąd podczas ustawiania nazwy użytkownika git: ${error.message}`);
            return;
        }
        console.log('Nazwa użytkownika git została ustawiona pomyślnie.');

        // Ustawienie adresu email git
        exec('git config --global user.email "yoyuta1111x@gmail.com"', { cwd: __dirname }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Błąd podczas ustawiania adresu email git: ${error.message}`);
                return;
            }
            console.log('Adres email git został ustawiony pomyślnie.');
        });
    });
}

// Wywołaj inicjalizację konfiguracji git na starcie
initGitConfig();

// Upewnij się, że istnieje folder temp
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

// Configure multer to preserve original filename for file panel
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Make sure the "pliki" directory exists
        const plikiDir = path.join(__dirname, 'pliki');
        if (!fs.existsSync(plikiDir)) {
            fs.mkdirSync(plikiDir);
        }
        cb(null, plikiDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Configure multer for temporary image uploads
const tempStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const tempUpload = multer({ storage: tempStorage });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// Modern clean styles
const modernStyles = `
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    :root {
        --bg-dark: #121212;
        --bg-card: #1e1e2d;
        --accent-primary: #6366f1;
        --accent-secondary: #8b5cf6;
        --text-primary: #f3f4f6;
        --text-secondary: #d1d5db;
        --text-muted: #9ca3af;
        --border-color: #2d2d3d;
        --danger: #ef4444;
    }

    body {
        font-family: 'Inter', sans-serif;
        background: linear-gradient(135deg, #121212 0%, #1a1a2e 100%);
        color: var(--text-primary);
        line-height: 1.6;
        min-height: 100vh;
    }

    .container {
        width: 90%;
        max-width: 1200px;
        margin: 2rem auto;
        padding: 2rem;
        background: var(--bg-card);
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
        border: 1px solid var(--border-color);
    }

    @media (max-width: 767px) {
        .container {
            width: 95%;
            padding: 1.5rem;
            margin: 1rem auto;
        }
    }

    @media (max-width: 480px) {
        .container {
            width: 98%;
            padding: 1rem;
            margin: 0.5rem auto;
        }
    }

    h1 {
        text-align: center;
        margin-bottom: 2rem;
        background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 700;
        font-size: 2.2rem;
    }

    @media (max-width: 767px) {
        h1 {
            font-size: 1.8rem;
            margin-bottom: 1.5rem;
        }
    }

    @media (max-width: 480px) {
        h1 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }
    }

    a {
        text-decoration: none;
    }

    .btn {
        display: inline-block;
        padding: 0.6rem 1.2rem;
        margin: 0.3rem;
        border: none;
        border-radius: 6px;
        font-weight: 500;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: center;
    }

    @media (max-width: 767px) {
        .btn {
            padding: 0.5rem 0.8rem;
            font-size: 0.8rem;
            margin: 0.2rem;
        }

        td .btn {
            min-width: 70px;
        }
    }

    .btn-primary {
        background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
        color: white;
    }

    .btn-secondary {
        background: rgba(255, 255, 255, 0.08);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
    }

    .btn-danger {
        background: var(--danger);
        color: white;
    }

    .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }

    .btn-primary:hover {
        background: linear-gradient(to right, #5254cc, #7e4fdb);
    }

    .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.12);
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5rem 0;
        border-radius: 8px;
        overflow-x: auto;
        display: block;
    }

    @media (min-width: 768px) {
        table {
            display: table;
            overflow-x: hidden;
        }
    }

    th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
    }

    th {
        background-color: rgba(255, 255, 255, 0.05);
        font-weight: 600;
        color: var(--text-primary);
    }

    tr:hover {
        background-color: rgba(255, 255, 255, 0.03);
    }

    @media (max-width: 767px) {
        th, td {
            padding: 0.8rem 0.5rem;
        }

        td.actions {
            display: flex;
            flex-wrap: wrap;
            gap: 0.3rem;
        }
    }

    input[type="text"],
    input[type="file"] {
        width: 100%;
        padding: 0.8rem;
        margin: 0.8rem 0;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        color: var(--text-primary);
        font-family: 'Inter', sans-serif;
    }

    @media (max-width: 767px) {
        input[type="text"],
        input[type="file"] {
            padding: 0.7rem;
            margin: 0.6rem 0;
            font-size: 0.9rem;
        }
    }

    /* Poprawka dla input file na urządzeniach mobilnych */
    @media (max-width: 480px) {
        input[type="file"] {
            padding: 0.5rem;
            font-size: 0.8rem;
        }

        /* Styl dla kontenera input file w formularzu upload */
        .header-actions form div {
            width: 100%;
        }
    }

    input[type="text"]:focus,
    input[type="file"]:focus,
    textarea:focus {
        outline: none;
        border-color: var(--accent-primary);
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    }

    textarea {
        width: 100%;
        height: 70vh;
        min-height: 400px;
        padding: 0.8rem;
        margin: 0.8rem 0;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        color: var(--text-primary);
        font-family: monospace;
        resize: vertical;
    }

    @media (max-width: 767px) {
        textarea {
            height: 50vh;
            min-height: 300px;
            font-size: 14px;
        }
    }

    @media (max-width: 480px) {
        textarea {
            height: 40vh;
            min-height: 200px;
            font-size: 13px;
        }
    }

    form button[type="submit"] {
        background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
        color: white;
        padding: 0.8rem 1.5rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    form button[type="submit"]:hover {
        background: linear-gradient(to right, #5254cc, #7e4fdb);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }

    @media (max-width: 767px) {
        form {
            display: flex;
            flex-direction: column;
        }

        form button[type="submit"] {
            align-self: flex-end;
            padding: 0.7rem 1.2rem;
        }
    }

    @media (max-width: 480px) {
        form button[type="submit"] {
            align-self: stretch;
            margin-top: 0.5rem;
        }

        form div[style*="justify-content: space-between"] {
            flex-direction: column;
            gap: 0.5rem;
        }

        form div[style*="justify-content: space-between"] .btn,
        form div[style*="justify-content: space-between"] button {
            width: 100%;
            margin: 0.2rem 0;
        }
    }

    .actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        gap: 0.3rem;
    }

    .header-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        background: rgba(0, 0, 0, 0.2);
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid var(--border-color);
        flex-wrap: wrap;
        gap: 1rem;
    }

    @media (max-width: 767px) {
        .header-actions {
            flex-direction: column;
            align-items: stretch;
        }

        .header-actions > div {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .header-actions > div .btn {
            flex: 1;
            min-width: 120px;
        }

        .header-actions form {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .header-actions form button {
            align-self: stretch;
        }
    }

    .fade-in {
        animation: fadeIn 0.3s ease forwards;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
</style>
`;

app.get('/', (req, res) => {
    res.send(`
<html>
<head>
    <title>Files Portal</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${modernStyles}
</head>
<body>
    <div class="container fade-in">
        <h1>Welcome to Files Portal</h1>
        <div style="text-align: center; margin-top: 2rem; display: flex; flex-direction: column; gap: 1rem; align-items: center;">
            <a href="/panel" class="btn btn-primary">Go to File Management</a>
            <a href="/chat" class="btn btn-primary" style="background: linear-gradient(to right, #9333ea, #3b82f6);">
                <span style="display: flex; align-items: center; gap: 8px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 1a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a6 6 0 1 1 12 0v6a2.5 2.5 0 0 1-2.5 2.5H9.366a1 1 0 0 1-.866.5h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 .866.5H11.5A1.5 1.5 0 0 0 13 12h-1a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1V6a5 5 0 0 0-5-5z"/>
                    </svg>
                    Chat with YutAi
                </span>
            </a>
        </div>
    </div>
</body>
</html>
`);
});

app.get('/panel', (req, res) => {
    fs.readdir('pliki', (err, files) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Directory doesn't exist, create it
                fs.mkdirSync('pliki');
                files = [];
            } else {
                return res.send('Error loading files.');
            }
        }

        const fileRows = files.map(file => `
<tr class="fade-in">
    <td style="word-break: break-word; max-width: 200px;">${file}</td>
    <td class="actions">
            <a href="/files/${encodeURIComponent(file)}" download class="btn btn-secondary">Download</a>
            <a href="/panel/edit/${encodeURIComponent(file)}" class="btn btn-secondary">Edit</a>
            <a href="/panel/rename/${encodeURIComponent(file)}" class="btn btn-secondary">Rename</a>
            <a href="/panel/redirect/${encodeURIComponent(file)}" class="btn btn-secondary">Open</a>
            <a href="/panel/delete/${encodeURIComponent(file)}" class="btn btn-danger">Delete</a>
    </td>
</tr>
`).join('');

        res.send(`
<html>
<head>
        <title>File Management</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${modernStyles}
</head>
<body>
        <div class="container fade-in">
            <h1>File Management</h1>
            
            <div class="header-actions">
                <div>
                    <a href="/panel/create" class="btn btn-primary">Create New File</a>
                    <a href="/" class="btn btn-secondary">Powrót do strony głównej</a>
                </div>
                
                <form action="/panel/upload" method="POST" enctype="multipart/form-data" style="display: flex; align-items: center; gap: 10px;">
                    <input type="file" name="file" required style="margin: 0; width: 100%;">
                       <div style="flex: 1; min-width: 200px;">
                     <button type="submit" class="btn btn-primary">Upload</button>
        </form>
    </div>

        <table>
                    </div>
            <tr>
                <th>File Name</th>
                <th>Actions</th>
            </tr>
            ${fileRows}
        </table>
    </div>
</body>
</html>
`);
    });
});

app.get('/panel/create', (req, res) => {
    res.send(`
<html>
<head>
    <title>Create New File</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${modernStyles}
</head>
<body>
    <div class="container fade-in">
        <h1>Create New File</h1>
        <form action="/panel/create" method="POST">
            <input type="text" name="filename" placeholder="File name" required>
            <textarea name="content" placeholder="File content"></textarea>
            <div style="display: flex; justify-content: space-between; margin-top: 1rem;">
                <a href="/panel" class="btn btn-secondary">Back</a>
                <button type="submit" class="btn btn-primary">Create</button>
            </div>
        </form>
    </div>
</body>
</html>
`);
});

// Obsługa tworzenia plików
app.post('/panel/create', (req, res) => {
    const { filename, content } = req.body;
    if (!filename) return res.send('File name is required!');

    const filePath = path.join(__dirname, 'pliki', filename);

    // Sprawdź czy plik już istnieje
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (!err) return res.send('File already exists!');

        fs.writeFile(filePath, content || '', (err) => {
            if (err) return res.send('Error creating file!');
            // Po utworzeniu pliku, wywołaj funkcję git
            setTimeout(() => {
                executeGitCommands();
            }, 500);
            res.redirect('/panel');
        });
    });
});

app.get('/panel/edit/:filename', (req, res) => {
    fs.readFile(path.join(__dirname, 'pliki', req.params.filename), 'utf8', (err, data) => {
        if (err) return res.send('Error reading file.');
        res.send(`
<html>
<head>
    <title>Edit File</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${modernStyles}
</head>
<body>
    <div class="container fade-in">
        <h1>Edit File: ${req.params.filename}</h1>
        <form action="/panel/edit/${encodeURIComponent(req.params.filename)}" method="POST">
            <textarea name="content">${data}</textarea>
            <div style="display: flex; justify-content: space-between; margin-top: 1rem;">
                <a href="/panel" class="btn btn-secondary">Back</a>
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
</body>
</html>
`);
    });
});

app.get('/panel/rename/:filename', (req, res) => {
    res.send(`
<html>
<head>
    <title>Rename File</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${modernStyles}
</head>
<body>
    <div class="container fade-in">
        <h1>Rename File: ${req.params.filename}</h1>
        <form action="/panel/rename/${encodeURIComponent(req.params.filename)}" method="POST">
            <input type="text" name="newName" placeholder="New file name" required>
            <div style="display: flex; justify-content: space-between; margin-top: 1rem;">
                <a href="/panel" class="btn btn-secondary">Back</a>
                <button type="submit" class="btn btn-primary">Rename</button>
            </div>
        </form>
    </div>
</body>
</html>
`);
});

// Pozostałe endpointy
app.post('/panel/upload', upload.single('file'), (req, res) => {
    // Po przesłaniu pliku, wywołaj funkcję git
    setTimeout(() => {
        executeGitCommands();
    }, 500);
    res.redirect('/panel');
});

app.get('/panel/delete/:filename', (req, res) => {
    fs.unlink(path.join(__dirname, 'pliki', req.params.filename), (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.send('Error deleting file. Please try again.');
        }
        // Po usunięciu pliku, wywołaj funkcję git
        setTimeout(() => {
            executeGitCommands();
        }, 500);
        res.redirect('/panel');
    });
});

app.post('/panel/edit/:filename', (req, res) => {
    fs.writeFile(path.join(__dirname, 'pliki', req.params.filename), req.body.content, 'utf8', (err) => {
        if (err) {
            console.error('Error saving file:', err);
            return res.send('Error saving file. Please try again.');
        }
        // Po edycji pliku, wywołaj funkcję git
        setTimeout(() => {
            executeGitCommands();
        }, 500);
        res.redirect('/panel');
    });
});

app.post('/panel/rename/:filename', (req, res) => {
    fs.rename(
        path.join(__dirname, 'pliki', req.params.filename),
        path.join(__dirname, 'pliki', req.body.newName),
        (err) => {
            if (err) {
                console.error('Error renaming file:', err);
                return res.send('Error renaming file. Please try again.');
            }
            // Po zmianie nazwy pliku, wywołaj funkcję git
            setTimeout(() => {
                executeGitCommands();
            }, 500);
            res.redirect('/panel');
        }
    );
});

app.get('/panel/redirect/:filename', (req, res) => {
    res.redirect(`/files/${encodeURIComponent(req.params.filename)}`);
});

// Dodaj endpoint do udostępniania plików z folderu pliki
app.use('/files', express.static(path.join(__dirname, 'pliki')));

// Add Gemini chat page
app.get('/chat', (req, res) => {
    const chatHtml = `<!DOCTYPE html>
<html>
<head>
    <title>YutAi - Inteligentny Asystent</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    ${modernStyles}
    <style>
      body {
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(125deg, #0f0c29, #302b63, #24243e);
          color: #fff;
          line-height: 1.6;
          min-height: 100vh;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: gradientBG 15s ease infinite;
          background-size: 400% 400%;
      }
      
      @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
      }
      
      .container {
          width: 95%;
          max-width: 1100px;
          margin: 2rem auto;
          padding: 0;
          background: rgba(15, 23, 42, 0.7);
          border-radius: 20px;
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 90vh;
      }
      
      .header {
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(15, 23, 42, 0.5);
      }
      
      .logo {
          display: flex;
          align-items: center;
          gap: 10px;
      }
      
      .logo-icon {
          font-size: 1.8rem;
          background: linear-gradient(to right, #6366f1, #8b5cf6, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
      }
      
      h1 {
          margin: 0;
          font-size: 1.8rem;
          background: linear-gradient(to right, #6366f1, #8b5cf6, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
      }
      
      .status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          color: #a5b4fc;
          background: rgba(99, 102, 241, 0.1);
          padding: 5px 10px;
          border-radius: 20px;
          border: 1px solid rgba(99, 102, 241, 0.2);
      }
      
      .status-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse 2s infinite;
      }
      
      .chat-area {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem 2rem;
          scroll-behavior: smooth;
          position: relative;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      }
      
      .chat-area::-webkit-scrollbar {
          width: 6px;
      }
      
      .chat-area::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
      }
      
      .chat-area::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 10px;
      }
      
      .chat-area::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
      }
      
      .message {
          margin-bottom: 1.5rem;
          padding: 1rem 1.2rem;
          border-radius: 15px;
          max-width: 80%;
          position: relative;
          animation: fadeIn 0.3s ease forwards;
          line-height: 1.5;
      }
      
      @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
      }
      
      .user-message {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          margin-left: auto;
          border-top-right-radius: 0;
          box-shadow: 0 5px 15px rgba(99, 102, 241, 0.3);
          color: white;
      }
      
      .ai-message {
          background: rgba(255, 255, 255, 0.05);
          margin-right: auto;
          border-top-left-radius: 0;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }
      
      .message-time {
          font-size: 0.7rem;
          opacity: 0.7;
          margin-top: 5px;
          text-align: right;
      }
      
      .footer {
          padding: 1.5rem 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(15, 23, 42, 0.5);
      }
      
      .input-area {
          display: flex;
          gap: 10px;
          position: relative;
      }
      
      .input-area input {
          flex-grow: 1;
          padding: 1rem 1rem 1rem 3rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          background: rgba(15, 23, 42, 0.6);
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 1rem;
          transition: all 0.3s ease;
      }
      
      .input-area input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
      }
      
      .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6366f1;
          font-size: 1.2rem;
      }
      
      .input-area button {
          padding: 0 1.5rem;
          border: none;
          border-radius: 15px;
          background: linear-gradient(to right, #6366f1, #8b5cf6, #ec4899);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 10px;
      }
      
      .input-area button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(99, 102, 241, 0.4);
      }
      
      .input-area button i {
          font-size: 1.2rem;
      }
      
      .tools-bar {
          display: flex;
          justify-content: space-between;
          margin-top: 1rem;
      }
      
      .image-preview {
          display: none;
          position: relative;
          margin-top: 10px;
          max-width: 200px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      }
      
      .image-preview img {
          width: 100%;
          display: block;
      }
      
      .image-preview-close {
          position: absolute;
          top: 5px;
          right: 5px;
          background: rgba(0, 0, 0, 0.6);
          border: none;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
      }
      
      .file-upload {
          position: relative;
          overflow: hidden;
      }
      
      .file-upload input[type=file] {
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
      }
      
      .file-upload-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(99, 102, 241, 0.1);
          color: #a5b4fc;
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 10px;
          padding: 6px 12px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
      }
      
      .file-upload-btn:hover {
          background: rgba(99, 102, 241, 0.2);
          color: #c7d2fe;
      }
      
      .user-message-image {
          max-width: 200px;
          border-radius: 8px;
          margin-top: 10px;
          display: block;
      }
      
      .code-block {
          background: rgba(15, 23, 42, 0.8);
          padding: 1rem;
          border-radius: 8px;
          margin: 1rem 0;
          white-space: pre-wrap;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          line-height: 1.5;
          color: #e2e8f0;
          border-left: 3px solid #6366f1;
      }
      
      .code-container {
          margin: 15px 0;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(15, 23, 42, 0.6);
      }
      
      .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 15px;
          background: rgba(15, 23, 42, 0.8);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .code-header span {
          color: #a5b4fc;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
      }
      
      .code-actions {
          display: flex;
          gap: 8px;
      }
      
      .code-actions button {
          padding: 5px 10px;
          background: rgba(99, 102, 241, 0.2);
          color: #a5b4fc;
          border: none;
          border-radius: 8px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 5px;
      }
      
      .code-actions button:hover {
          background: rgba(99, 102, 241, 0.4);
          color: #c7d2fe;
      }
      
      .code-actions button i {
          font-size: 0.9rem;
      }
      
      .code-footer {
          display: flex;
          padding: 8px 15px;
          background: rgba(15, 23, 42, 0.8);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .mini-counter {
          font-size: 0.75rem;
          color: #6366f1;
          display: flex;
          align-items: center;
          gap: 5px;
      }
      
      .typing-indicator {
          display: flex;
          align-items: center;
          gap: 5px;
      }
      
      .typing-indicator span {
          display: inline-block;
          width: 8px;
          height: 8px;
          background-color: #a5b4fc;
          border-radius: 50%;
          animation: bounce 1.5s infinite;
      }
      
      .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
      }
      
      .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
      }
      
      @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
      }
      
      /* Style dla formatowania Markdown */
      .ai-message strong {
          font-weight: 700;
          color: #a5b4fc;
      }
      
      .ai-message em {
          font-style: italic;
          color: #ddd;
      }
      
      .ai-message ul, .ai-message ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
      }
      
      .ai-message li {
          margin-bottom: 0.5rem;
      }
      
      .ai-message a {
          color: #6366f1;
          text-decoration: none;
          border-bottom: 1px dotted #6366f1;
          transition: all 0.2s ease;
      }
      
      .ai-message a:hover {
          color: #818cf8;
          border-bottom-color: #818cf8;
      }
      
      .ai-message blockquote {
          border-left: 3px solid #6366f1;
          padding-left: 1rem;
          margin-left: 0;
          margin-right: 0;
          font-style: italic;
          color: #9ca3af;
      }
      
      .ai-message h1, .ai-message h2, .ai-message h3, .ai-message h4 {
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #fff;
          font-weight: 600;
      }
      
      .ai-message h1 {
          font-size: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 0.5rem;
      }
      
      .ai-message h2 {
          font-size: 1.3rem;
      }
      
      .ai-message h3 {
          font-size: 1.1rem;
      }
      
      .ai-message h4 {
          font-size: 1rem;
      }
      
      .ai-message table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          overflow: hidden;
          border-radius: 8px;
      }
      
      .ai-message th {
          background-color: rgba(99, 102, 241, 0.2);
          text-align: left;
          padding: 0.5rem;
      }
      
      .ai-message td {
          padding: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .ai-message tr:nth-child(even) {
          background-color: rgba(255, 255, 255, 0.02);
      }
      
      @media (max-width: 768px) {
          .container {
              width: 100%;
              height: 100vh;
              margin: 0;
              border-radius: 0;
          }
          
          .message {
              max-width: 90%;
          }
          
          .header, .footer {
              padding: 1rem;
          }
          
          .chat-area {
              padding: 1rem;
          }
          
          h1 {
              font-size: 1.5rem;
          }
      }
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/4.3.0/marked.min.js"></script>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <i class="fas fa-robot logo-icon"></i>
                <h1>YutAi</h1>
            </div>
            <div class="status">
                <div class="status-dot"></div>
                <span>Online</span>
            </div>
        </div>
        
        <div class="chat-area" id="chat-area">
            <div class="message ai-message">
                <div>Cześć! Jestem YutAi, Twój zaawansowany asystent AI. W czym mogę Ci dzisiaj pomóc?</div>
                <div class="message-time">Teraz</div>
            </div>
        </div>
        
        <div class="footer">
            <div class="input-area">
                <i class="fas fa-message input-icon"></i>
                <input type="text" id="user-input" placeholder="Napisz wiadomość..." autocomplete="off">
                <button id="send-button">
                    <span>Wyślij</span>
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
            
            <div class="image-preview" id="image-preview">
                <img id="preview-img" src="" alt="Podgląd zdjęcia">
                <button class="image-preview-close" id="remove-image">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="tools-bar">
                <div class="file-upload">
                    <input type="file" id="image-upload" accept="image/*">
                    <div class="file-upload-btn">
                        <i class="fas fa-image"></i>
                        <span>Dodaj zdjęcie</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
    (function() {
        const chatArea = document.getElementById('chat-area');
        const userInput = document.getElementById('user-input');
        const sendButton = document.getElementById('send-button');
        const imageUpload = document.getElementById('image-upload');
        const imagePreview = document.getElementById('image-preview');
        const previewImg = document.getElementById('preview-img');
        const removeImageBtn = document.getElementById('remove-image');
        
        let selectedImage = null;
        
        // Inicjalizacja zmiennych
        
        // Formatowanie czasu
        function formatTime() {
            const now = new Date();
            return now.getHours().toString().padStart(2, '0') + ':' + 
                   now.getMinutes().toString().padStart(2, '0');
        }
        
        // Funkcja do dodawania wiadomości
        function addMessage(text, isUser, imageUrl = null) {
            const messageDiv = document.createElement('div');
            messageDiv.className = isUser ? 'message user-message' : 'message ai-message';
            
            const contentDiv = document.createElement('div');
            
            if (isUser) {
                contentDiv.textContent = text;
                
                // Dodaj zdjęcie jeśli zostało wybrane
                if (imageUrl) {
                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.className = 'user-message-image';
                    img.alt = 'Przesłane zdjęcie';
                    messageDiv.appendChild(img);
                }
            } else {
                // Dla wiadomości AI używamy marked.js do formatowania Markdown
                // Skonfiguruj marked.js do obsługi pogrubienia i innych stylów Markdown
                const renderer = new marked.Renderer();
                
                // Użyj marked do konwersji Markdown na HTML
                marked.setOptions({
                    renderer: renderer,
                    breaks: true,
                    gfm: true
                });
                
                // Przetwórz tekst na HTML z zachowaniem bloków kodu
                let processedText = text;
                
                // Najpierw zabezpiecz bloki kodu, aby marked ich nie przetwarzał
                const codeBlocks = [];
                processedText = processedText.replace(/<div class="code-container">[\\s\\S]*?<\\/div>/g, function(match) {
                    codeBlocks.push(match);
                    return "{{CODE_BLOCK_" + (codeBlocks.length - 1) + "}}";
                });
                
                // Zastosuj formatowanie Markdown
                processedText = marked.parse(processedText);
                
                // Przywróć bloki kodu
                processedText = processedText.replace(/{{CODE_BLOCK_(\\d+)}}/g, function(match, index) {
                    return codeBlocks[parseInt(index)];
                });
                
                contentDiv.innerHTML = processedText;
            }
            
            const timeDiv = document.createElement('div');
            timeDiv.className = 'message-time';
            timeDiv.textContent = formatTime();
            
            messageDiv.appendChild(contentDiv);
            messageDiv.appendChild(timeDiv);
            
            chatArea.appendChild(messageDiv);
            chatArea.scrollTop = chatArea.scrollHeight;
        }
        
        // Funkcja do wysyłania wiadomości
        function sendMessage() {
            const message = userInput.value.trim();
            if (!message && !selectedImage) return;
            
            // Dodaj wiadomość użytkownika
            const imageUrl = selectedImage ? URL.createObjectURL(selectedImage) : null;
            addMessage(message, true, imageUrl);
            
            // Wyczyść pole wprowadzania
            userInput.value = '';
            
            // Przygotuj dane do wysłania
            const formData = new FormData();
            formData.append('message', message);
            
            // Dodaj zdjęcie jeśli zostało wybrane
            if (selectedImage) {
                formData.append('image', selectedImage);
            }
            
            // Ukryj podgląd zdjęcia
            imagePreview.style.display = 'none';
            selectedImage = null;
            
            // Dodaj wiadomość ładowania
            const loadingId = Date.now();
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'message ai-message';
            loadingDiv.id = 'loading-' + loadingId;
            
            const loadingContent = document.createElement('div');
            loadingContent.innerHTML = '<div class="typing-indicator"><span>.</span><span>.</span><span>.</span></div>';
            
            const timeDiv = document.createElement('div');
            timeDiv.className = 'message-time';
            timeDiv.textContent = formatTime();
            
            loadingDiv.appendChild(loadingContent);
            loadingDiv.appendChild(timeDiv);
            
            chatArea.appendChild(loadingDiv);
            chatArea.scrollTop = chatArea.scrollHeight;
            
            // Wyślij zapytanie do API
            fetch('/api/chat', {
                method: 'POST',
                body: formData
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                // Usuń wiadomość ładowania
                const loadingMessage = document.getElementById('loading-' + loadingId);
                if (loadingMessage) loadingMessage.remove();
                
                // Dodaj odpowiedź AI
                addMessage(data.reply, false);
            })
            .catch(function(error) {
                console.error('Error:', error);
                // Usuń wiadomość ładowania
                const loadingMessage = document.getElementById('loading-' + loadingId);
                if (loadingMessage) loadingMessage.remove();
                
                // Dodaj komunikat o błędzie
                addMessage('Przepraszam, wystąpił błąd. Spróbuj ponownie.', false);
            });
        }
        
        // Obsługa wyboru zdjęcia
        function handleImageUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            // Akceptuj tylko obrazy
            if (!file.type.startsWith('image/')) {
                alert('Proszę wybrać plik obrazu');
                return;
            }
            
            // Pokaż podgląd zdjęcia
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                imagePreview.style.display = 'block';
                selectedImage = file;
            };
            reader.readAsDataURL(file);
        }
        
        // Usunięcie wybranego zdjęcia
        function removeSelectedImage() {
            imagePreview.style.display = 'none';
            imageUpload.value = '';
            selectedImage = null;
        }
        
        // Obsługa przycisku wysyłania
        sendButton.addEventListener('click', sendMessage);
        
        // Obsługa klawisza Enter
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Obsługa uploadu zdjęć
        imageUpload.addEventListener('change', handleImageUpload);
        
        // Obsługa usuwania zdjęcia
        removeImageBtn.addEventListener('click', removeSelectedImage);
        
        // Ustaw focus na pole wprowadzania
        userInput.focus();
    })();
    </script>
</body>
</html>`;

    res.send(chatHtml);
});

// Add API endpoint for Gemini with image support
app.post('/api/chat', tempUpload.single('image'), async (req, res) => {
    try {
        const userMessage = req.body.message || '';

        // Podstawowa instrukcja dla modelu
        let instruction = "Odpowiadaj zawsze w języku polskim, bez względu na język zapytania.";

        const fullMessage = instruction + " " + userMessage;

        let apiRequestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: fullMessage
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192
            }
        };

        // If image is present, add it to the API request
        if (req.file) {
            const imagePath = path.join(__dirname, req.file.path);
            const imageBuffer = fs.readFileSync(imagePath);
            const base64Image = imageBuffer.toString('base64');

            // Modify the request to include image
            apiRequestBody.contents[0].parts = [
                {
                    text: fullMessage || "Opisz to zdjęcie w języku polskim"
                },
                {
                    inlineData: {
                        mimeType: req.file.mimetype,
                        data: base64Image
                    }
                }
            ];
        }

        // Determine the appropriate model based on whether an image is included
        const apiModel = req.file ? 'gemini-1.5-pro-latest' : 'gemini-1.5-flash-latest';

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${apiModel}:generateContent?key=${GEMINI_API_KEY}`,
            apiRequestBody,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        // Extract the AI's response text
        let aiReply = response.data.candidates[0].content.parts[0].text;

        // Format code blocks properly
        // Replace markdown code blocks with styled HTML code containers
        aiReply = aiReply.replace(/\`\`\`(.*)\n([\s\S]*?)\`\`\`/g, function (match, language, code) {
            // Escape HTML in the code content
            const escapedCode = code
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');

            // Determine language display name
            let displayLang = 'Code';
            if (language) {
                if (language === 'c++' || language === 'cpp') displayLang = 'C++';
                else if (language === 'js') displayLang = 'JavaScript';
                else displayLang = language.charAt(0).toUpperCase() + language.slice(1);
            }

            return '<div class="code-container">' +
                '<div class="code-header">' +
                '<span>' + displayLang + '</span>' +
                '</div>' +
                '<pre class="code-block"><code>' + escapedCode + '</code></pre>' +
                '<div class="code-footer">' +
                '<div class="mini-counter"><i class="fas fa-code"></i> kod</div>' +
                '</div>' +
                '</div>';
        });

        // If image was uploaded temporarily, delete it after processing
        if (req.file) {
            fs.unlink(path.join(__dirname, req.file.path), (err) => {
                if (err) console.error('Error deleting temporary image:', err);
            });
        }

        res.json({ reply: aiReply });
    } catch (error) {
        console.error('Error calling Gemini API:', error);

        // More detailed error handling
        let errorMessage = 'Przepraszam, wystąpił błąd. Spróbuj ponownie później.';

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('API Error Response:', error.response.data);
            console.error('Status:', error.response.status);

            if (error.response.status === 400) {
                errorMessage = 'Przepraszam, nie mogę przetworzyć tego zapytania. Spróbuj inaczej sformułować pytanie.';
            } else if (error.response.status === 429) {
                errorMessage = 'Przekroczono limit zapytań do API. Proszę spróbować ponownie za chwilę.';
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
            errorMessage = 'Nie udało się połączyć z serwerem AI. Sprawdź swoje połączenie internetowe.';
        }

        res.status(500).json({
            error: 'Failed to get response from Gemini',
            reply: errorMessage
        });
    }
});

// Funkcja do wykonywania komend git
function executeGitCommands() {
    console.log('Wykryto zmianę w folderze pliki - wykonuję komendy git...');

    // Wykonaj komendy git jedna po drugiej
    exec('git add *', { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Błąd podczas wykonywania git add: ${error.message}`);
            return;
        }

        console.log('git add * - wykonano pomyślnie');

        // Po pomyślnym wykonaniu git add, wykonaj git commit
        exec('git commit -m "automat"', { cwd: __dirname }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Błąd podczas wykonywania git commit: ${error.message}`);
                return;
            }

            console.log('git commit -m "automat" - wykonano pomyślnie');

            // Po pomyślnym wykonaniu git commit, wykonaj git push
            exec('git push origin main', { cwd: __dirname }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Błąd podczas wykonywania git push: ${error.message}`);
                    return;
                }

                console.log('git push - wykonano pomyślnie');
                console.log('Wszystkie komendy git zostały wykonane pomyślnie!');
            });
        });
    });
}

// Monitorowanie zmian w folderze pliki
const plikiDir = path.join(__dirname, 'pliki');
if (!fs.existsSync(plikiDir)) {
    fs.mkdirSync(plikiDir);
}

// Zmienna do śledzenia ostatniej zmiany, aby uniknąć wielokrotnego wykonania komend dla tej samej zmiany
let debounceTimer = null;

// Monitoruj zmiany w folderze pliki
fs.watch(plikiDir, { persistent: true }, (eventType, filename) => {
    if (filename) {
        console.log(`Wykryto zmianę w pliku: ${filename}`);

        // Użyj debounce, aby uniknąć wielokrotnego wykonania komend dla wielu zmian w krótkim czasie
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            executeGitCommands();
        }, 2000); // Poczekaj 2 sekundy po ostatniej zmianie
    }
});

console.log(`Monitorowanie zmian w folderze pliki zostało uruchomione.`);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
