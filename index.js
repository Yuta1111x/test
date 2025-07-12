const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const plikiDir = path.join(__dirname, 'pliki');
        if (!fs.existsSync(plikiDir)) fs.mkdirSync(plikiDir);
        cb(null, plikiDir);
    },
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 1024 } });

// Middleware
app.use(express.json({ limit: '1024mb' }));
app.use(express.urlencoded({ limit: '1024mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// Extensive styling
const modernStyles = `
<style>
/* Google Fonts - Poppins, Inter, and Roboto Mono for code */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap');

/* Base Reset & Variables */
:root {
    /* Colors - Dark theme */
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --bg-tertiary: #334155;
    --accent-primary: #6366f1;
    --accent-secondary: #8b5cf6;
    --accent-tertiary: #ec4899;
    --text-primary: #f8fafc;
    --text-secondary: #cbd5e1;
    --text-tertiary: #94a3b8;
    --border-primary: #475569;
    --border-secondary: #334155;
    --shadow-color: rgba(0, 0, 0, 0.4);
    --danger: #ef4444;
    --warning: #f59e0b;
    --success: #10b981;
    --info: #0ea5e9;

    /* Typography */
    --font-primary: 'Poppins', system-ui, sans-serif;
    --font-secondary: 'Inter', system-ui, sans-serif;
    --font-mono: 'Roboto Mono', monospace;
    
    /* Dimensions & Spacing */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 16px;
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.5);
    
    /* Transitions */
    --transition-fast: 0.15s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Global Reset */
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

/* Base Elements */
html {
    scroll-behavior: smooth;
    font-size: 16px;
}

body {
    font-family: var(--font-secondary);
    background: linear-gradient(135deg, var(--bg-primary) 0%, #131b2e 100%);
    color: var(--text-primary);
    line-height: 1.6;
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
}

/* Scrollbar styling */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
    background: var(--bg-tertiary);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--accent-primary);
}

/* Container */
.container {
    width: 90%;
    max-width: 1200px;
    margin: 2rem auto;
    padding: 2.5rem;
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border-secondary);
    position: relative;
    overflow: hidden;
    z-index: 1;
}

.container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary), var(--accent-tertiary));
    z-index: 2;
}

.container::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232d3748' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.3;
    z-index: -1;
}

/* Typography */
h1 {
    font-family: var(--font-primary);
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary), var(--accent-tertiary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
    padding-bottom: 0.5rem;
}

h1::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(to right, var(--accent-primary), var(--accent-tertiary));
    border-radius: 2px;
}

h2, h3 {
    color: var(--text-primary);
    margin-bottom: 1rem;
    font-family: var(--font-primary);
    font-weight: 600;
}

p {
    color: var(--text-secondary);
    margin-bottom: 1rem;
}

a {
    text-decoration: none;
    color: var(--accent-primary);
    transition: var(--transition-normal);
}

/* Buttons */
.btn {
    display: inline-block;
    padding: 0.7rem 1.4rem;
    margin: 0.3rem;
    border: none;
    border-radius: var(--radius-md);
    font-weight: 500;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all var(--transition-normal);
    text-align: center;
    position: relative;
    overflow: hidden;
    font-family: var(--font-primary);
}

.btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: rgba(255,255,255,0.1);
    transition: all 0.3s ease;
}

.btn:hover::before {
    width: 100%;
}

.btn-primary {
    background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
    color: var(--text-primary);
    box-shadow: 0 4px 8px rgba(99, 102, 241, 0.2);
}

.btn-primary:hover, .btn-primary:focus {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(99, 102, 241, 0.3);
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-primary);
    border: 1px solid var(--border-secondary);
    backdrop-filter: blur(4px);
}

.btn-secondary:hover, .btn-secondary:focus {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
}

.btn-danger {
    background: linear-gradient(90deg, var(--danger), #f87171);
    color: var(--text-primary);
    box-shadow: 0 4px 8px rgba(239, 68, 68, 0.2);
}

.btn-danger:hover, .btn-danger:focus {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(239, 68, 68, 0.3);
}

/* Table Styles */
table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 1.5rem 0;
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-secondary);
}

thead {
    background: var(--bg-tertiary);
}

th {
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.05em;
    font-weight: 600;
    color: var(--text-primary);
    padding: 1.2rem 1rem;
    text-align: left;
}

td {
    padding: 1.2rem 1rem;
    text-align: left;
    border-bottom: 1px solid var(--border-secondary);
    color: var(--text-secondary);
    font-size: 0.95rem;
    transition: var(--transition-normal);
}

tr:last-child td {
    border-bottom: none;
}

tr {
    transition: var(--transition-normal);
}

tbody tr:hover {
    background: rgba(255, 255, 255, 0.05);
}

/* Form Elements */
input, textarea, select, button {
    font-family: var(--font-secondary);
}

input[type="text"], 
input[type="email"], 
input[type="password"], 
input[type="file"], 
textarea, 
select {
    width: 100%;
    padding: 0.8rem 1rem;
    margin: 0.5rem 0 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-secondary);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: 1rem;
    transition: var(--transition-normal);
}

input[type="file"] {
    padding: 0.6rem;
    cursor: pointer;
}

input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

textarea {
    height: 60vh;
    min-height: 300px;
    font-family: var(--font-mono);
    resize: vertical;
    line-height: 1.5;
    padding: 1rem;
    background: rgba(15, 23, 42, 0.6);
}

::placeholder {
    color: var(--text-tertiary);
    opacity: 0.7;
}

/* Progress Bar */
.progress-bar {
    width: 100%;
    height: 8px;
    background: var(--bg-tertiary);
    border-radius: 4px;
    margin: 0.8rem 0;
    overflow: hidden;
    position: relative;
}

.progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
    border-radius: 4px;
    width: 0%;
    transition: width 0.3s ease;
    position: relative;
}

.progress-bar-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        90deg, 
        rgba(255,255,255,0) 0%, 
        rgba(255,255,255,0.15) 50%, 
        rgba(255,255,255,0) 100%
    );
    animation: shimmer 1.5s infinite;
    transform: translateX(-100%);
}

@keyframes shimmer {
    100% {
        transform: translateX(100%);
    }
}

/* Header Actions */
.header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    background: rgba(15, 23, 42, 0.6);
    padding: 1.2rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-secondary);
    flex-wrap: wrap;
    gap: 1rem;
    backdrop-filter: blur(8px);
}

/* Upload Container */
.multi-upload-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 1rem 0;
    width: 100%;
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: var(--radius-md);
    border: 1px dashed var(--border-secondary);
    transition: var(--transition-normal);
}

.file-item:hover {
    border-color: var(--accent-primary);
    background: rgba(255, 255, 255, 0.08);
}

.file-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 70%;
    font-weight: 500;
}

.file-size {
    color: var(--text-tertiary);
    font-size: 0.8rem;
}

/* Animation Classes */
.fade-in {
    animation: fadeIn 0.5s ease forwards;
}

.slide-in {
    animation: slideIn 0.4s ease forwards;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

/* Card Styling */
.card {
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    padding: 1.5rem;
    margin: 1rem 0;
    border: 1px solid var(--border-secondary);
    box-shadow: var(--shadow-md);
    transition: var(--transition-normal);
}

.card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
}

/* Upload Drop Zone */
.drop-zone {
    border: 2px dashed var(--border-secondary);
    border-radius: var(--radius-md);
    padding: 2rem;
    text-align: center;
    margin: 1rem 0;
    transition: var(--transition-normal);
    cursor: pointer;
    background: rgba(15, 23, 42, 0.4);
}

.drop-zone:hover, .drop-zone.drag-over {
    border-color: var(--accent-primary);
    background: rgba(99, 102, 241, 0.1);
}

.drop-zone-text {
    color: var(--text-secondary);
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
}

.drop-zone-hint {
    color: var(--text-tertiary);
    font-size: 0.9rem;
}

/* Notifications */
.notification {
    position: fixed;
    top: 1rem;
    right: 1rem;
    padding: 1rem 1.5rem;
    border-radius: var(--radius-md);
    background: var(--bg-secondary);
    color: var(--text-primary);
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    opacity: 0;
    transform: translateX(50px);
    animation: notificationEnter 0.3s ease forwards;
    border-left: 4px solid var(--accent-primary);
}

.notification.error {
    border-left-color: var(--danger);
}

.notification.success {
    border-left-color: var(--success);
}

@keyframes notificationEnter {
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Status Badge */
.badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.badge-success {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
}

.badge-warning {
    background: rgba(245, 158, 11, 0.2);
    color: #f59e0b;
}

.badge-danger {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
}

/* Custom Controls - Checkbox */
.custom-checkbox {
    position: relative;
    display: flex;
    align-items: center;
    margin: 0.5rem 0;
    cursor: pointer;
    user-select: none;
}

.custom-checkbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.checkbox-mark {
    position: relative;
    height: 20px;
    width: 20px;
    background-color: var(--bg-tertiary);
    border-radius: 4px;
    margin-right: 10px;
    transition: var(--transition-normal);
}

.custom-checkbox:hover input ~ .checkbox-mark {
    background-color: var(--border-primary);
}

.custom-checkbox input:checked ~ .checkbox-mark {
    background-color: var(--accent-primary);
}

.checkbox-mark:after {
    content: "";
    position: absolute;
    display: none;
    left: 7px;
    top: 3px;
    width: 6px;
    height: 11px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

.custom-checkbox input:checked ~ .checkbox-mark:after {
    display: block;
}

/* Custom file input styling */
.file-input-container {
    position: relative;
    display: flex;
    width: 100%;
    margin: 0.5rem 0;
    border-radius: var(--radius-md);
    overflow: hidden;
}

.file-input-container input[type="file"] {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    z-index: 2;
}

.file-input-label {
    display: flex;
    align-items: center;
    padding: 0.8rem 1.2rem;
    background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
    color: var(--text-primary);
    font-weight: 500;
    border-radius: var(--radius-md) 0 0 var(--radius-md);
    min-width: 120px;
    justify-content: center;
    box-shadow: var(--shadow-sm);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
}

.file-input-label:hover {
    transform: translateY(-2px);
}

.file-input-label::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.1), rgba(255,255,255,0));
    transform: translateX(-100%);
}

.file-input-label:hover::before {
    animation: shimmer-effect 1.5s infinite;
}

@keyframes shimmer-effect {
    to {
        transform: translateX(100%);
    }
}

.file-input-text {
    flex-grow: 1;
    padding: 0.8rem 1.2rem;
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-secondary);
    border: 1px solid var(--border-secondary);
    border-left: none;
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all 0.3s ease;
}

.file-input-icon {
    margin-right: 8px;
    display: inline-flex;
    font-style: normal;
    transition: transform 0.3s ease;
}

.file-input-container:hover .file-input-icon {
    transform: translateY(-3px);
}

/* Tooltip */
.tooltip {
    position: relative;
    display: inline-block;
}

.tooltip .tooltip-text {
    visibility: hidden;
    width: 120px;
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    text-align: center;
    border-radius: var(--radius-sm);
    padding: 5px;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -60px;
    opacity: 0;
    transition: opacity 0.3s;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-secondary);
}

.tooltip:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
}

/* Responsive Design */
@media (max-width: 1200px) {
    .container {
        width: 95%;
        max-width: 1000px;
    }
}

@media (max-width: 1024px) {
    .container {
        padding: 2rem;
    }
    
    h1 {
        font-size: 2.2rem;
    }
    
    .file-actions {
        flex-wrap: wrap;
        justify-content: flex-start;
    }
    
    .file-actions .btn {
        margin-bottom: 5px;
    }
}

@media (max-width: 768px) {
    html {
        font-size: 15px;
    }
    
    .container {
        width: 95%;
        padding: 1.8rem;
    }
    
    h1 {
        font-size: 2rem;
    }
    
    .header-actions {
        flex-direction: column;
        align-items: stretch;
    }
    
    .btn {
        width: 100%;
        margin: 0.3rem 0;
    }
    
    table {
        display: block;
        overflow-x: auto;
        white-space: nowrap;
    }
    
    th, td {
        padding: 0.8rem;
    }
    
    td {
        font-size: 0.9rem;
    }
    
    .header-actions > div {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    form {
        width: 100%;
    }
    
    .file-input-container {
        flex-direction: column;
        border-radius: var(--radius-md);
    }
    
    .file-input-label {
        width: 100%;
        border-radius: var(--radius-md) var(--radius-md) 0 0;
        padding: 0.8rem;
    }
    
    .file-input-text {
        width: 100%;
        border-radius: 0 0 var(--radius-md) var(--radius-md);
        border-left: 1px solid var(--border-secondary);
        border-top: none;
        text-align: center;
    }
    
    .drop-zone {
        padding: 1.5rem 1rem;
    }
    
    .file-row {
        display: flex;
        flex-direction: column;
    }
    
    .file-row td {
        width: 100%;
        display: block;
        box-sizing: border-box;
        border-bottom: none;
    }
    
    .file-row td:last-child {
        border-bottom: 1px solid var(--border-secondary);
        padding-top: 0;
    }
    
    .file-actions {
        justify-content: flex-start;
        padding-left: 2rem;
    }
}

@media (max-width: 576px) {
    html {
        font-size: 14px;
    }
    
    .container {
        width: 100%;
        padding: 1.5rem;
        margin: 0.5rem 0;
        border-radius: var(--radius-md);
    }
    
    h1 {
        font-size: 1.8rem;
    }
    
    .btn {
        padding: 0.6rem 1.2rem;
        font-size: 0.9rem;
    }
    
    .header-actions {
        padding: 1rem;
    }
    
    td {
        font-size: 0.85rem;
    }
    
    .file-info {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .notification {
        width: 90%;
        left: 5%;
        right: 5%;
    }
    
    textarea {
        height: 50vh;
    }
}

@media (max-width: 480px) {
    .btn-text {
        display: none;
    }
    
    .btn-icon {
        margin-right: 0;
        font-size: 1.1rem;
    }
    
    .file-actions .btn {
        padding: 0.5rem;
        min-width: 38px;
        text-align: center;
        justify-content: center;
    }
    
    .action-buttons-container {
        justify-content: space-around;
        width: 100%;
    }
    
    .file-info {
        padding: 0.5rem 0;
    }
}

@media (max-width: 380px) {
    .container {
        width: 100%;
        padding: 1rem;
        margin: 0;
        border-radius: 0;
    }
    
    h1 {
        font-size: 1.6rem;
    }
    
    .header-actions {
        padding: 0.8rem;
    }
    
    .btn {
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
    }
    
    .file-actions .btn {
        padding: 0.4rem;
        font-size: 0.8rem;
        min-width: 32px;
    }
    
    .file-icon {
        margin-right: 6px;
    }
    
    .drop-zone-text {
        font-size: 0.9rem;
    }
    
    .drop-zone-hint {
        font-size: 0.8rem;
    }
    
    table {
        margin: 0.5rem 0;
    }
    
    th {
        font-size: 0.8rem;
        padding: 0.8rem 0.5rem;
    }
    
    .file-name-text {
        font-size: 0.9rem;
    }
}

/* File actions */
.file-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.file-actions .btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
}

.action-buttons-container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: flex-start;
}

/* File info styling */
.file-info {
    display: flex;
    align-items: center;
    padding: 0.3rem 0;
}

.file-name-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: calc(100% - 30px);
}

/* Home icon */
.home-icon {
    width: 20px;
    height: 20px;
    vertical-align: middle;
    margin-right: 6px;
}

/* File icons */
.file-icon {
    margin-right: 10px;
    color: var(--text-tertiary);
    flex-shrink: 0;
}

/* Upload Button Enhancements */
.upload-btn {
    position: relative;
    overflow: hidden;
}

.upload-btn input[type="file"] {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
}

/* Star background effect */
.stars {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
}

.star {
    position: absolute;
    width: 2px;
    height: 2px;
    background-color: #fff;
    border-radius: 50%;
    opacity: 0.3;
    animation: twinkle var(--twinkle-duration) infinite ease-in-out;
}

@keyframes twinkle {
    0% { opacity: 0.2; }
    50% { opacity: 0.7; }
    100% { opacity: 0.2; }
}

/* Glow effect */
.glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
    opacity: 0.5;
    z-index: -1;
    animation: rotate 15s infinite linear;
}

@keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
<!-- Add star background via JS -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Create stars
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    document.body.appendChild(starsContainer);
    
    // Add stars
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.top = \`\${Math.random() * 100}%\`;
        star.style.left = \`\${Math.random() * 100}%\`;
        star.style.setProperty('--twinkle-duration', \`\${3 + Math.random() * 5}s\`);
        starsContainer.appendChild(star);
    }
    
    // Add glow effect to container
    const containers = document.querySelectorAll('.container');
    containers.forEach(container => {
        const glow = document.createElement('div');
        glow.className = 'glow';
        container.appendChild(glow);
    });
});
</script>`;

app.get('/', (req, res) => {
    res.send(`<html><head><title>Files</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    ${modernStyles}
    <style>
    /* New animation styles */
    .hero-container {
        text-align: center;
        padding: 2rem 0 3rem;
        position: relative;
        overflow: visible;
    }
    
    .title-container {
        position: relative;
        display: inline-block;
        margin: 0 auto 1.5rem;
        overflow: visible;
    }
    
    .animated-title {
        font-size: 3rem;
        background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary), var(--accent-tertiary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        position: relative;
        display: inline-block;
        margin: 0;
        padding: 0;
        font-family: var(--font-primary);
        font-weight: 700;
    }
    
    .description {
        font-size: 1.2rem;
        color: var(--text-secondary);
        max-width: 600px;
        margin: 0 auto 2rem;
    }
    
    .button-container {
        margin-top: 2rem;
    }
    
        /* Removed fireworks and confetti effects */
    }
    
    @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .pulse-button {
        animation: pulse 2s infinite;
        box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
    }
    
    @keyframes pulse {
        0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
        }
        70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
        }
        100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
        }
    }
    
    .fly-in {
        animation: flyIn 1.2s ease-out forwards;
    }
    
    @keyframes flyIn {
        from {
            opacity: 0;
            transform: translateX(-50px) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translateX(0) scale(1);
        }
    }
    
    .rotating-bg {
        background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary), var(--accent-tertiary), var(--accent-secondary), var(--accent-primary));
        background-size: 400% 400%;
        animation: gradientRotate 8s ease infinite;
    }
    
    @keyframes gradientRotate {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    @keyframes bounce {
        0% { transform: translateY(0); }
        100% { transform: translateY(-5px); }
    }
    
    /* Responsive styles for home page */
    @media (max-width: 768px) {
        .animated-title {
            font-size: 2.5rem !important;
        }
        
        .description {
            font-size: 1.1rem !important;
        }
        
        .btn.pulse-button {
            font-size: 1rem !important;
            padding: 0.8rem 1.6rem !important;
        }
    }
    
    @media (max-width: 480px) {
        .animated-title {
            font-size: 2rem !important;
        }
        
        .description {
            font-size: 1rem !important;
            padding: 0 1rem;
        }
        
        .btn.pulse-button {
            font-size: 0.9rem !important;
            padding: 0.7rem 1.4rem !important;
        }
    }
    
    @media (max-width: 380px) {
        .animated-title {
            font-size: 1.8rem !important;
        }
        
        .description {
            font-size: 0.9rem !important;
        }
        
        .btn.pulse-button {
            font-size: 0.85rem !important;
            padding: 0.6rem 1.2rem !important;
        }
    }
    </style>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // Create stars
        var starsContainer = document.createElement('div');
        starsContainer.className = 'stars';
        document.body.appendChild(starsContainer);
        
        // Add stars
        for (var i = 0; i < 100; i++) {
            var star = document.createElement('div');
            star.className = 'star';
            star.style.top = Math.random() * 100 + '%';
            star.style.left = Math.random() * 100 + '%';
            star.style.setProperty('--twinkle-duration', (3 + Math.random() * 5) + 's');
            starsContainer.appendChild(star);
        }
        
        // Add floating animation to container
        var container = document.querySelector('.container');
        container.classList.add('float-animation');
        
        // Create particles
        createParticles();
    });
    
    function createParticles() {
        const container = document.createElement('div');
        container.className = 'particles';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.overflow = 'hidden';
        container.style.zIndex = '-1';
        document.body.appendChild(container);
        
        // Adjust number of particles based on screen size
        const particleCount = window.innerWidth < 768 ? 15 : 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 5 + 2;
            
            particle.style.position = 'absolute';
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.background = 'rgba(255, 255, 255, 0.2)';
            particle.style.borderRadius = '50%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.left = Math.random() * 100 + '%';
            
            const duration = Math.random() * 10 + 10;
            
            particle.style.animation = 'float ' + duration + 's infinite ease-in-out ' + Math.random() * 5 + 's, ' + 
                                      'sideways ' + duration * 2 + 's infinite ease-in-out ' + Math.random() * 5 + 's';
            
            container.appendChild(particle);
        }
        
        // Add keyframes for animations
        const style = document.createElement('style');
        style.textContent = 
            '@keyframes float {' +
            '    0% { transform: translateY(0); }' +
            '    50% { transform: translateY(-100px); }' +
            '    100% { transform: translateY(0); }' +
            '}' +
            '' +
            '@keyframes sideways {' +
            '    0% { margin-left: 0; }' +
            '    50% { margin-left: 50px; }' +
            '    100% { margin-left: 0; }' +
            '}';
        document.head.appendChild(style);
    }
    </script>
    </head>
<body>
<div class="container animated-bg">
    <div class="hero-container">
        <div class="title-container">
            <h1 class="animated-title">Files Portal</h1>
        </div>
        <div class="button-container">
            <a href="/panel" class="btn btn-primary pulse-button rotating-bg" style="font-size:1.1rem;padding:1rem 2rem;border-radius:30px;">
                <span style="display:inline-block;margin-right:10px;animation:bounce 1s infinite alternate ease-in-out;">📂</span>
                Manage Files
            </a>
        </div>
    </div>
</div>
</body></html>`);
});

app.get('/panel', (req, res) => {
    fs.readdir('pliki', (err, files) => {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.mkdirSync('pliki');
                files = [];
            } else {
                return res.send('Error loading files.');
            }
        }

        const fileRows = files.map((file, index) => `<tr class="file-row" style="animation-delay: ${index * 0.08}s">
    <td>
        <div class="file-info">
            <i class="file-icon">📄</i>
            <span class="file-name-text">${file}</span>
        </div>
    </td>
    <td class="file-actions">
        <div class="action-buttons-container">
            <a href="/files/${encodeURIComponent(file)}" download class="btn btn-secondary btn-animate">
                <span class="btn-icon">⬇️</span> <span class="btn-text">Download</span>
            </a>
            <a href="/panel/edit/${encodeURIComponent(file)}" class="btn btn-secondary btn-animate">
                <span class="btn-icon">✏️</span> <span class="btn-text">Edit</span>
            </a>
            <a href="/panel/rename/${encodeURIComponent(file)}" class="btn btn-secondary btn-animate">
                <span class="btn-icon">🔄</span> <span class="btn-text">Rename</span>
            </a>
            <a href="/panel/redirect/${encodeURIComponent(file)}" class="btn btn-secondary btn-animate">
                <span class="btn-icon">👁️</span> <span class="btn-text">Open</span>
            </a>
            <a href="/panel/delete/${encodeURIComponent(file)}" class="btn btn-danger btn-animate">
                <span class="btn-icon">🗑️</span> <span class="btn-text">Delete</span>
            </a>
        </div>
    </td>
</tr>`).join('');

        res.send(`<html><head><title>Files</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        ${modernStyles}
        <style>
        /* Additional animation styles */
        .file-row {
            animation: slideInFromRight 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
            opacity: 0;
            animation-fill-mode: forwards;
        }
        
        @keyframes slideInFromRight {
            0% {
                transform: translateX(30px);
                opacity: 0;
            }
            100% {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .btn-animate {
            position: relative;
            transition: all 0.3s;
            transform-origin: center;
            overflow: hidden;
        }
        
        .btn-animate:hover {
            transform: translateY(-3px) scale(1.05);
        }
        
        .btn-animate::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 5px;
            height: 5px;
            background: rgba(255, 255, 255, 0.3);
            opacity: 0;
            border-radius: 100%;
            transform: scale(1, 1) translate(-50%);
            transform-origin: 50% 50%;
        }
        
        .btn-animate:hover::after {
            animation: ripple 1s ease-out;
        }
        
        @keyframes ripple {
            0% {
                transform: scale(0, 0);
                opacity: 0.5;
            }
            100% {
                transform: scale(20, 20);
                opacity: 0;
            }
        }
        
        .file-info {
            display: flex;
            align-items: center;
            transition: all 0.3s ease;
        }
        
        .file-info:hover {
            transform: translateX(5px);
        }
        
        .file-icon {
            margin-right: 10px;
            font-style: normal;
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .file-row:hover .file-icon {
            transform: rotate(-8deg) scale(1.2);
        }
        
        .btn-icon {
            display: inline-block;
            margin-right: 5px;
            transform: scale(0.85);
            transition: transform 0.3s ease;
        }
        
        .btn-animate:hover .btn-icon {
            animation: pulseIcon 0.6s infinite alternate ease-in-out;
        }
        
        @keyframes pulseIcon {
            0% { transform: scale(0.85); }
            100% { transform: scale(1.1); }
        }
        
        /* Page transition effect */
        .page-transition {
            animation: fadeInUp 0.6s cubic-bezier(0.39, 0.575, 0.565, 1) both;
        }
        
        @keyframes fadeInUp {
            0% {
                transform: translateY(20px);
                opacity: 0;
            }
            100% {
                transform: translateY(0);
                opacity: 1;
            }
        }

        /* Upload animations */
        .upload-animation {
            position: relative;
        }
        
        .upload-animation::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
            transform: translateX(-100%);
        }
        
        .upload-animation.uploading::before {
            animation: loadingBar 2s infinite linear;
        }
        
        @keyframes loadingBar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        /* Float animation for container */
        .float-animation {
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        
        /* Animated background gradient */
        .animated-bg {
            background: linear-gradient(-45deg, #1e293b, #1e1e2d, #2d3748, #334155);
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
        }
        
        @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        /* Interactive hover menu */
        .file-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            transition: all 0.3s ease;
        }
        
                /* Removed animations */
        </style>
        <script>
            function handleMultiUpload() {
                const files = document.getElementById('multi-file-input').files;
                if (files.length === 0) return;
                
                const formData = new FormData();
                for (let i = 0; i < files.length; i++) formData.append('files', files[i]);
                
                document.getElementById('progress-container').style.display = 'block';
                document.getElementById('upload-button').classList.add('uploading');
                
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/panel/multi-upload', true);
                xhr.upload.onprogress = e => {
                    if (e.lengthComputable) {
                        const percent = (e.loaded / e.total) * 100;
                        document.getElementById('progress-bar-fill').style.width = percent + '%';
                    }
                };
                xhr.onload = () => {
                    if(xhr.status === 200) {
                        showNotification('Files uploaded successfully!', 'success');
                        setTimeout(() => location.reload(), 1000);
                    } else {
                        showNotification('Upload failed!', 'error');
                    }
                };
                xhr.send(formData);
            }
            
            // Notification system
            function showNotification(message, type = 'info') {
                const notification = document.createElement('div');
                notification.className = 'notification ' + type;
                notification.textContent = message;
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.style.opacity = '0';
                    setTimeout(() => notification.remove(), 500);
                }, 3000);
            }
            
            // Update file input text
            function updateFileInputText(input) {
                const textElement = input.parentElement.querySelector('.file-input-text');
                if (!textElement) return;
                
                if (input.files.length === 0) {
                    textElement.textContent = 'No file' + (input.multiple ? 's' : '') + ' selected';
                    return;
                }
                
                if (input.multiple) {
                    textElement.textContent = input.files.length + ' file' + (input.files.length > 1 ? 's' : '') + ' selected';
                } else {
                    textElement.textContent = input.files[0].name;
                }
            }
            
            document.addEventListener('DOMContentLoaded', function() {
                // Create stars
                var starsContainer = document.createElement('div');
                starsContainer.className = 'stars';
                document.body.appendChild(starsContainer);
                
                // Add stars
                for (var i = 0; i < 100; i++) {
                    var star = document.createElement('div');
                    star.className = 'star';
                    star.style.top = Math.random() * 100 + '%';
                    star.style.left = Math.random() * 100 + '%';
                    star.style.setProperty('--twinkle-duration', (3 + Math.random() * 5) + 's');
                    starsContainer.appendChild(star);
                }
                
                // Add glow effect to container
                const containers = document.querySelectorAll('.container');
                containers.forEach(container => {
                    const glow = document.createElement('div');
                    glow.className = 'glow';
                    container.appendChild(glow);
                    
                    // Add floating animation
                    container.classList.add('float-animation');
                });
            });
        </script>
        </head>
<body><div class="container">
    <h1>File Management</h1>
    
    <div class="header-actions">
        <div>
            <a href="/panel/create" class="btn btn-primary btn-animate">
                <span class="btn-icon">📝</span> Create New File
            </a>
            <a href="/" class="btn btn-secondary btn-animate">
                <span class="btn-icon">🏠</span> Back
            </a>
        </div>
        <form action="/panel/upload" method="POST" enctype="multipart/form-data" style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:400px;">
            <div class="file-input-container upload-animation">
                <input type="file" name="file" id="single-file-input" required onChange="updateFileInputText(this)">
                <div class="file-input-label">
                    <span class="file-input-icon">📁</span>
                    Select File
                </div>
                <div class="file-input-text">No file selected</div>
            </div>
            <button type="submit" class="btn btn-primary btn-animate" style="width:100%">
                <span class="btn-icon">📤</span> Upload
            </button>
        </form>
    </div>
    
    <div class="header-actions">
        <h3 style="width:100%;margin-bottom:10px">Multiple File Upload</h3>
        <div class="drop-zone">
            <p class="drop-zone-text">Drop files here or click to upload</p>
            <p class="drop-zone-hint">You can upload multiple files at once</p>
            <input type="file" id="multi-file-input" multiple style="display:none" onChange="updateFileInputText(this)">
        </div>
        <div class="file-input-container" style="margin:1rem 0;">
            <input type="file" id="multi-file-browse" multiple onChange="
                document.getElementById('multi-file-input').files = this.files;
                updateFileInputText(document.getElementById('multi-file-input'));
                const dropZoneText = document.querySelector('.drop-zone-text');
                if(this.files.length > 0) {
                    dropZoneText.textContent = this.files.length + ' file' + (this.files.length > 1 ? 's' : '') + ' selected';
                }
            ">
            <div class="file-input-label">
                <span class="file-input-icon">📁</span>
                Browse Files
            </div>
            <div class="file-input-text">No files selected</div>
        </div>
        <div id="progress-container" style="display:none;width:100%">
            <div class="progress-bar"><div class="progress-bar-fill" id="progress-bar-fill"></div></div>
        </div>
        <button id="upload-button" onclick="handleMultiUpload()" class="btn btn-primary btn-animate upload-animation">
            <span class="btn-icon">📤</span> Upload Multiple Files
        </button>
    </div>
    
    <table>
        <thead>
            <tr><th>File Name</th><th>Actions</th></tr>
        </thead>
        <tbody>
            ${fileRows}
        </tbody>
    </table>
</div>

<script>
    // Drop zone functionality
    const dropZone = document.querySelector('.drop-zone');
    const fileInput = document.getElementById('multi-file-input');
    
    dropZone.addEventListener('click', () => {
        document.getElementById('multi-file-browse').click();
    });
    
    ['dragover', 'dragenter'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });
    });
    
    ['dragleave', 'dragend', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
        });
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        fileInput.files = e.dataTransfer.files;
        if (fileInput.files.length > 0) {
            dropZone.querySelector('.drop-zone-text').textContent = 
                \`\${fileInput.files.length} file\${fileInput.files.length > 1 ? 's' : ''} selected\`;
            updateFileInputText(document.getElementById('multi-file-browse'));
        }
    });
    
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            dropZone.querySelector('.drop-zone-text').textContent = 
                \`\${fileInput.files.length} file\${fileInput.files.length > 1 ? 's' : ''} selected\`;
        }
    });
</script>
</body></html>`);
    });
});

app.get('/panel/create', (req, res) => {
    res.send(`<html><head><title>Create</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    ${modernStyles}</head>
<body><div class="container">
    <h1>Create New File</h1>
    <form action="/panel/create" method="POST">
        <input type="text" name="filename" placeholder="File name" required>
        <textarea name="content" placeholder="File content"></textarea>
        <div style="display:flex;justify-content:space-between;margin-top:1rem;flex-wrap:wrap;gap:10px">
            <a href="/panel" class="btn btn-secondary" style="flex:1;min-width:120px;text-align:center">Back</a>
            <button type="submit" class="btn btn-primary" style="flex:1;min-width:120px">Create</button>
        </div>
    </form>
</div></body></html>`);
});

// Obsługa tworzenia plików
app.post('/panel/create', (req, res) => {
    const { filename, content } = req.body;
    if (!filename) return res.send('File name is required!');

    const filePath = path.join(__dirname, 'pliki', filename);
    if (fs.existsSync(filePath)) return res.send('File already exists!');
    
    fs.writeFile(filePath, content || '', err => {
        if (err) return res.send('Error creating file!');
        res.redirect('/panel');
    });
});

app.get('/panel/edit/:filename', (req, res) => {
    fs.readFile(path.join(__dirname, 'pliki', req.params.filename), 'utf8', (err, data) => {
        if (err) return res.send('Error reading file.');
        res.send(`<html><head><title>Edit</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        ${modernStyles}</head>
<body><div class="container">
    <h1>Edit File: ${req.params.filename}</h1>
    <form action="/panel/edit/${encodeURIComponent(req.params.filename)}" method="POST">
        <textarea name="content">${data}</textarea>
        <div style="display:flex;justify-content:space-between;margin-top:1rem;flex-wrap:wrap;gap:10px">
            <a href="/panel" class="btn btn-secondary" style="flex:1;min-width:120px;text-align:center">Back</a>
            <button type="submit" class="btn btn-primary" style="flex:1;min-width:120px">Save</button>
        </div>
    </form>
</div>
<script>
    // Adjust textarea height on mobile devices
    document.addEventListener('DOMContentLoaded', function() {
        const textarea = document.querySelector('textarea');
        if (window.innerWidth <= 576) {
            textarea.style.height = '50vh';
        }
    });
</script>
</body></html>`);
    });
});

app.get('/panel/rename/:filename', (req, res) => {
    res.send(`<html><head><title>Rename</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    ${modernStyles}</head>
<body><div class="container">
    <h1>Rename File: ${req.params.filename}</h1>
    <form action="/panel/rename/${encodeURIComponent(req.params.filename)}" method="POST">
        <input type="text" name="newName" placeholder="New file name" required>
        <div style="display:flex;justify-content:space-between;margin-top:1rem;flex-wrap:wrap;gap:10px">
            <a href="/panel" class="btn btn-secondary" style="flex:1;min-width:120px;text-align:center">Back</a>
            <button type="submit" class="btn btn-primary" style="flex:1;min-width:120px">Rename</button>
        </div>
    </form>
</div></body></html>`);
});

// Pozostałe endpointy
app.post('/panel/upload', upload.single('file'), (req, res) => {
    res.redirect('/panel');
});

// Endpoint for multiple file uploads
app.post('/panel/multi-upload', upload.array('files', 100), (req, res) => 
    res.json({ success: true, filesUploaded: req.files.length })
);

app.get('/panel/delete/:filename', (req, res) => {
    fs.unlink(path.join(__dirname, 'pliki', req.params.filename), err => {
        if (err) console.error('Error deleting file:', err);
        res.redirect('/panel');
    });
});

app.post('/panel/edit/:filename', (req, res) => {
    fs.writeFile(path.join(__dirname, 'pliki', req.params.filename), req.body.content, 'utf8', err => {
        if (err) console.error('Error saving file:', err);
        res.redirect('/panel');
    });
});

app.post('/panel/rename/:filename', (req, res) => {
    fs.rename(
        path.join(__dirname, 'pliki', req.params.filename),
        path.join(__dirname, 'pliki', req.body.newName),
        err => {
            if (err) console.error('Error renaming file:', err);
            res.redirect('/panel');
        }
    );
});

app.get('/panel/redirect/:filename', (req, res) => res.redirect(`/files/${encodeURIComponent(req.params.filename)}`));

// Udostępnianie plików
app.use('/files', express.static(path.join(__dirname, 'pliki')));

// Upewnij się, że folder pliki istnieje
const plikiDir = path.join(__dirname, 'pliki');
if (!fs.existsSync(plikiDir)) fs.mkdirSync(plikiDir);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));