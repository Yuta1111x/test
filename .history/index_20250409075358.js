const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const axios = require('axios'); // Add axios for API requests
const marked = require('marked'); // Biblioteka do formatowania markdown
const { exec } = require('child_process'); // Przywrócone dla funkcji /cmd
// require('dotenv').config(); // Usunięte

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = 'AIzaSyAP1EOpnlAhNRh9MI41v8EHtyRGylNR_bA';

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
                    <div style="flex: 1; min-width: 200px;">
                        <input type="file" name="file" required style="margin: 0; width: 100%;">
                    </div>
                    <button type="submit" class="btn btn-primary">Upload</button>
                </form>
            </div>
            
            <table>
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
    res.redirect('/panel');
});

app.get('/panel/delete/:filename', (req, res) => {
    fs.unlink(path.join(__dirname, 'pliki', req.params.filename), (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.send('Error deleting file. Please try again.');
        }
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
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Add terminal page
app.get('/cmd', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cmd.html'));
});

// Add terminal page again for /terminal route
app.get('/terminal', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'terminal.html'));
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

// Upewnij się, że folder pliki istnieje
const plikiDir = path.join(__dirname, 'pliki');
if (!fs.existsSync(plikiDir)) {
    fs.mkdirSync(plikiDir);
}

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
