// Kolorowanie składni dla C++
function highlightCppSyntax(code) {
    return code
        .replace(/\b(int|double|float|char|void|bool|const|auto|struct|class|namespace|using|return|if|else|for|while|do|switch|case|break|continue)\b/g, '<span class="cpp-keyword">$1</span>')
        .replace(/\b(std|cout|cin|endl|string|vector|map|set)\b/g, '<span class="cpp-type">$1</span>')
        .replace(/(#include\s*<[^>]*>)/g, '<span class="cpp-preprocessor">$1</span>')
        .replace(/("[^"]*")/g, '<span class="cpp-string">$1</span>')
        .replace(/(\d+(\.\d+)?)/g, '<span class="cpp-number">$1</span>')
        .replace(/(\/\/[^\n]*)/g, '<span class="cpp-comment">$1</span>');
}

// Tworzenie bloku kodu
window.createCodeBlock = function(containerId, code, language) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Wygeneruj unikalne ID dla bloku kodu
    const blockId = 'code-' + Math.random().toString(36).substr(2, 9);
    
    // Utwórz strukturę HTML
    const codeBlockHTML = `
        <div class="code-container">
            <div class="code-header">
                <span>${language || 'cpp'}</span>
                <div class="code-actions">
                    <button class="copy-btn" onclick="copyCode('${blockId}')">Kopiuj</button>
                    <button class="edit-btn" onclick="toggleEdit('${blockId}')">Edytuj</button>
                </div>
            </div>
            <pre class="code-block"><code id="${blockId}">${highlightCppSyntax(code)}</code></pre>
            <textarea id="${blockId}-editor" class="code-editor" style="display: none;">${code}</textarea>
            <div class="code-footer">
                <button class="action-btn like-btn" title="Polub"><i class="fas fa-thumbs-up"></i></button>
                <button class="action-btn dislike-btn" title="Nie lubię"><i class="fas fa-thumbs-down"></i></button>
                <button class="action-btn sound-btn" title="Odczytaj"><i class="fas fa-volume-up"></i></button>
                <button class="action-btn copy-link-btn" title="Kopiuj link"><i class="fas fa-link"></i></button>
                <div class="mini-counter">kod</div>
            </div>
        </div>
    `;
    
    // Wstaw blok kodu do kontenera
    container.innerHTML = codeBlockHTML;
}; 