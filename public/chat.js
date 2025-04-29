// Chat functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const removeImageBtn = document.getElementById('remove-image');
    const loadingIndicator = document.getElementById('loading-indicator');
    const themeSelector = document.getElementById('theme-selector');
    
    let selectedImage = null;
    let editingMessageId = null; // ID edytowanej wiadomości
    
    // Obsługa pamięci konwersacji
    let conversationHistory = [];
    
    // Obiekt do przechowywania faktów użytkownika (np. 2+2=5)
    let userFacts = {};
    
    // Załaduj historię konwersacji z localStorage
    const loadConversationHistory = () => {
        const savedHistory = localStorage.getItem('chatHistory');
        const savedFacts = localStorage.getItem('userFacts');
        
        if (savedFacts) {
            try {
                userFacts = JSON.parse(savedFacts);
                console.log('Wczytane fakty użytkownika:', userFacts);
            } catch (e) {
                console.error('Błąd podczas ładowania faktów użytkownika:', e);
                localStorage.removeItem('userFacts');
                userFacts = {};
            }
        }
        
        if (savedHistory) {
            try {
                conversationHistory = JSON.parse(savedHistory);
                
                // Wyświetl historię konwersacji
                chatMessages.innerHTML = '';
                conversationHistory.forEach((msg, index) => {
                    if (msg.isUser) {
                        // Dodaj ID wiadomości jako atrybut data
                        addMessage(msg.content, msg.isUser, false, false, index);
                    } else {
                        addMessage(msg.content, msg.isUser, false, false);
                    }
                });
                
                // Przewiń do najnowszej wiadomości
                chatMessages.scrollTop = chatMessages.scrollHeight;
            } catch (e) {
                console.error('Błąd podczas ładowania historii konwersacji:', e);
                localStorage.removeItem('chatHistory');
            }
        } else {
            // Dodaj wiadomość powitalną, jeśli nie ma historii
            addMessage("Cześć! Jestem YutAi. W czym mogę pomóc?", false, false, true);
        }
    };
    
    // Zapisz historię konwersacji do localStorage
    const saveConversationHistory = () => {
        localStorage.setItem('chatHistory', JSON.stringify(conversationHistory));
    };
    
    // Zapisz fakty użytkownika do localStorage
    const saveUserFacts = () => {
        localStorage.setItem('userFacts', JSON.stringify(userFacts));
    };
    
    // Funkcja do analizowania wiadomości użytkownika w poszukiwaniu faktów
    const analyzeForFacts = (message) => {
        // Sprawdź czy to jest matematyczny fakt (np. 2+2=5)
        const mathFactRegex = /(\d+\s*[\+\-\*\/]\s*\d+)\s*=\s*(\d+)/g;
        let match;
        let factFound = false;
        
        while ((match = mathFactRegex.exec(message)) !== null) {
            const expression = match[1].replace(/\s+/g, '');
            const claimedResult = match[2];
            
            // Sprawdź czy użytkownik twierdzi, że 2+2=5 lub inne niestandardowe równanie
            const actualResult = safeEval(expression);
            if (actualResult !== null && claimedResult !== actualResult.toString()) {
                // Zapisz fakt użytkownika tylko gdy twierdzi coś niezgodnego ze standardową matematyką
                userFacts[expression] = claimedResult;
                console.log(`Zapisano niestandardowy fakt: ${expression} = ${claimedResult} (standardowo: ${actualResult})`);
                factFound = true;
            }
        }
        
        // Sprawdź wyrażenia typu "nie bo 5"
        const correctionRegex = /nie\s+bo\s+(\d+)/i;
        const correctionMatch = message.match(correctionRegex);
        
        if (correctionMatch) {
            // Sprawdź poprzednią wiadomość AI, czy była odpowiedzią na zapytanie matematyczne
            const mathQuestionRegex = /ile\s+to\s+(\d+\s*[\+\-\*\/]\s*\d+)/i;
            
            // Znajdź ostatnie pytanie użytkownika
            let lastMathQuestion = null;
            for (let i = conversationHistory.length - 3; i >= 0; i--) {
                if (conversationHistory[i].isUser) {
                    const mathMatch = conversationHistory[i].content.match(mathQuestionRegex);
                    if (mathMatch) {
                        lastMathQuestion = mathMatch[1].replace(/\s+/g, '');
                        break;
                    }
                }
            }
            
            if (lastMathQuestion) {
                const correctedResult = correctionMatch[1];
                userFacts[lastMathQuestion] = correctedResult;
                console.log(`Poprawiono wynik: ${lastMathQuestion} = ${correctedResult}`);
                factFound = true;
            }
        }
        
        // Sprawdź, czy użytkownik prosi o wartość wyrażenia matematycznego
        const askMathRegex = /ile\s+to\s+(\d+\s*[\+\-\*\/]\s*\d+)/i;
        const askMatch = message.match(askMathRegex);
        
        if (askMatch) {
            const expression = askMatch[1].replace(/\s+/g, '');
            
            // Sprawdź, czy mamy zapisany fakt dla tego wyrażenia
            if (userFacts[expression]) {
                console.log(`Znaleziono fakt dla ${expression}: ${userFacts[expression]}`);
            } else {
                console.log(`Brak faktu dla ${expression}, używam standardowego wyniku`);
            }
        }
        
        return factFound;
    };
    
    // Bezpieczna funkcja do obliczania wyrażeń matematycznych
    const safeEval = (expression) => {
        try {
            // Bezpieczne obliczanie podstawowych operacji
            if (!expression.match(/^[\d\s\+\-\*\/\(\)\.]+$/)) {
                return null; // Niedozwolone znaki
            }
            
            // Obsługa podstawowych operacji
            let sanitizedExpr = expression.replace(/\s+/g, '');
            
            // Jeśli wyrażenie zawiera tylko dozwolone operatory
            if (sanitizedExpr.includes('+')) {
                const parts = sanitizedExpr.split('+');
                return parseFloat(parts[0]) + parseFloat(parts[1]);
            } else if (sanitizedExpr.includes('-')) {
                const parts = sanitizedExpr.split('-');
                return parseFloat(parts[0]) - parseFloat(parts[1]);
            } else if (sanitizedExpr.includes('*')) {
                const parts = sanitizedExpr.split('*');
                return parseFloat(parts[0]) * parseFloat(parts[1]);
            } else if (sanitizedExpr.includes('/')) {
                const parts = sanitizedExpr.split('/');
                return parseFloat(parts[0]) / parseFloat(parts[1]);
            }
            
            return null;
        } catch (e) {
            console.error("Błąd podczas obliczania wyrażenia:", e);
            return null;
        }
    };
    
    // Wczytaj aktualny motyw
    const loadTheme = () => {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        if (themeSelector) {
            themeSelector.value = currentTheme;
        }
    };
    
    // Obsługa zmiany motywu
    if (themeSelector) {
        themeSelector.addEventListener('change', function() {
            const selectedTheme = themeSelector.value;
            document.documentElement.setAttribute('data-theme', selectedTheme);
            localStorage.setItem('theme', selectedTheme);
        });
    }
    
    // Załaduj motyw przy starcie
    loadTheme();
    
    // Załaduj historię konwersacji przy starcie
    loadConversationHistory();
    
    // Function to add a message to the chat
    function addMessage(content, isUser = false, isError = false, isNew = true, messageId = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
        
        // Jeśli to wiadomość użytkownika, dodaj atrybut data-id
        if (isUser) {
            const id = messageId !== null ? messageId : conversationHistory.length;
            messageDiv.setAttribute('data-message-id', id);
        }
        
        if (isError) {
            const contentDiv = document.createElement('div');
            contentDiv.textContent = 'Przepraszam, wystąpił błąd. ';
            
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error';
            errorSpan.textContent = "Błąd połączenia: " + content;
            contentDiv.appendChild(errorSpan);
            
            const timeDiv = document.createElement('div');
            timeDiv.className = 'message-time';
            timeDiv.textContent = new Date().toLocaleTimeString();
            
            messageDiv.appendChild(contentDiv);
            messageDiv.appendChild(timeDiv);
        } else {
            // Główny kontener treści wiadomości
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            
            // Check if content contains HTML (for markdown rendering)
            if (typeof content === 'string' && content.includes('<')) {
                contentDiv.innerHTML = content;
            } else {
                contentDiv.textContent = content;
            }
            
            messageDiv.appendChild(contentDiv);
            
            const timeDiv = document.createElement('div');
            timeDiv.className = 'message-time';
            timeDiv.textContent = new Date().toLocaleTimeString();
            messageDiv.appendChild(timeDiv);
            
            // Dodaj przycisk edycji tylko dla wiadomości użytkownika
            if (isUser) {
                const messageActions = document.createElement('div');
                messageActions.className = 'message-actions';
                
                const editButton = document.createElement('button');
                editButton.className = 'edit-message-btn';
                editButton.innerHTML = '<i class="fas fa-edit"></i>';
                editButton.title = 'Edytuj wiadomość';
                editButton.addEventListener('click', () => {
                    startEditingMessage(messageDiv.getAttribute('data-message-id'));
                });
                
                messageActions.appendChild(editButton);
                messageDiv.appendChild(messageActions);
            }
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Dodaj wiadomość do historii konwersacji, jeśli to nowa wiadomość
        if (isNew && !isError) {
            conversationHistory.push({
                content: content,
                isUser: isUser,
                timestamp: new Date().toISOString()
            });
            
            // Zapisz zaktualizowaną historię
            saveConversationHistory();
        }
    }
    
    // Funkcja do rozpoczęcia edycji wiadomości
    function startEditingMessage(messageId) {
        // Znajdź wiadomość w historii konwersacji
        const messageIndex = parseInt(messageId);
        const message = conversationHistory[messageIndex];
        
        if (!message || !message.isUser) return;
        
        // Zapisz ID edytowanej wiadomości
        editingMessageId = messageIndex;
        
        // Wstaw treść wiadomości do pola tekstowego
        userInput.value = message.content;
        
        // Zmień tekst przycisku wysyłania
        sendButton.innerHTML = '<i class="fas fa-check"></i>';
        
        // Zmień kolor przycisku
        sendButton.classList.add('editing');
        
        // Dodaj komunikat o edycji
        const notificationDiv = document.createElement('div');
        notificationDiv.className = 'edit-notification';
        notificationDiv.textContent = 'Edytujesz poprzednią wiadomość';
        notificationDiv.id = 'edit-notification';
        
        const cancelButton = document.createElement('button');
        cancelButton.className = 'cancel-edit-btn';
        cancelButton.textContent = 'Anuluj';
        cancelButton.addEventListener('click', cancelEditing);
        
        notificationDiv.appendChild(cancelButton);
        
        // Dodaj powiadomienie nad polem tekstowym
        document.querySelector('.input-row').insertAdjacentElement('beforebegin', notificationDiv);
        
        // Ustaw fokus na pole tekstowe
        userInput.focus();
    }
    
    // Funkcja do anulowania edycji
    function cancelEditing() {
        // Usuń komunikat o edycji
        const notification = document.getElementById('edit-notification');
        if (notification) notification.remove();
        
        // Przywróć normalny stan przycisku
        sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
        sendButton.classList.remove('editing');
        
        // Wyczyść pole tekstowe
        userInput.value = '';
        
        // Zresetuj ID edytowanej wiadomości
        editingMessageId = null;
    }
    
    // Funkcja do zastosowania edycji
    function applyMessageEdit() {
        const newContent = userInput.value.trim();
        if (!newContent) return cancelEditing();
        
        // Zapisz ID edytowanej wiadomości przed jej zresetowaniem
        const editedMessageId = editingMessageId;
        
        // Przywróć normalny stan przycisku
        sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
        sendButton.classList.remove('editing');
        
        // Usuń komunikat o edycji
        const notification = document.getElementById('edit-notification');
        if (notification) notification.remove();
        
        // Wyczyść pole tekstowe
        userInput.value = '';
        
        // Aktualizuj treść wiadomości w historii
        conversationHistory[editedMessageId].content = newContent;
        
        // Aktualizuj wyświetlaną wiadomość
        const messageElement = chatMessages.querySelector(`[data-message-id="${editedMessageId}"]`);
        if (messageElement) {
            const contentDiv = messageElement.querySelector('.message-content');
            if (contentDiv) contentDiv.textContent = newContent;
        }
        
        // Znajdź indeks edytowanej wiadomości w DOM
        const allMessages = Array.from(chatMessages.querySelectorAll('.message'));
        const editedMessageIndex = allMessages.findIndex(msg => 
            msg.hasAttribute('data-message-id') && 
            parseInt(msg.getAttribute('data-message-id')) === editedMessageId
        );
        
        // Usuń wszystkie wiadomości po edytowanej wiadomości
        if (editedMessageIndex !== -1) {
            // Usuń wszystkie wiadomości po edytowanej z DOM
            for (let i = allMessages.length - 1; i > editedMessageIndex; i--) {
                allMessages[i].remove();
            }
            
            // Usuń wszystkie wiadomości po edytowanej z historii
            conversationHistory.splice(editedMessageId + 1);
        }
        
        // Zapisz zaktualizowaną historię
        saveConversationHistory();
        
        // Zresetuj ID edytowanej wiadomości PRZED wysłaniem nowej odpowiedzi
        editingMessageId = null;
        
        // Wywołaj API bez dodawania nowej wiadomości użytkownika do chatu
        sendApiRequest(newContent, false);
    }
    
    // Funkcja do czyszczenia historii
    window.clearChatHistory = function() {
        if (confirm('Czy na pewno chcesz wyczyścić całą historię czatu i zapomniane fakty?')) {
            conversationHistory = [];
            userFacts = {};
            localStorage.removeItem('chatHistory');
            localStorage.removeItem('userFacts');
            chatMessages.innerHTML = '';
            
            // Dodaj wiadomość powitalną po wyczyszczeniu
            addMessage("Cześć! Jestem YutAi. W czym mogę pomóc?", false, false, true);
        }
    };
    
    // Function to handle image upload
    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            selectedImage = file;
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                removeImageBtn.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }
    
    // Function to remove selected image
    function removeSelectedImage() {
        selectedImage = null;
        imageUpload.value = '';
        imagePreview.src = '';
        imagePreview.style.display = 'none';
        removeImageBtn.style.display = 'none';
    }
    
    // Funkcja do wysyłania wiadomości z określoną treścią
    async function sendMessageWithContent(message) {
        // Add user message to chat
        addMessage(message, true);
        
        // Analizuj wiadomość użytkownika w poszukiwaniu faktów
        const factFound = analyzeForFacts(message);
        
        // Zapisz zaktualizowane fakty
        if (Object.keys(userFacts).length > 0) {
            saveUserFacts();
        }
        
        // Wywołaj API z dodawaniem wiadomości do chatu
        await sendApiRequest(message, true);
    }
    
    // Nowa funkcja do wysyłania zapytania API bez duplikowania kodu
    async function sendApiRequest(message, isNewMessage) {
        // Show loading indicator
        loadingIndicator.style.display = 'block';
        
        try {
            // Create form data for the request
            const formData = new FormData();
            formData.append('message', message);
            
            // Dodaj kontekst konwersacji
            if (conversationHistory.length > 0) {
                const context = conversationHistory
                    .slice(-10)  // Ostatnie 10 wiadomości jako kontekst
                    .map(msg => (msg.isUser ? 'Użytkownik: ' : 'Asystent: ') + msg.content)
                    .join('\n');
                
                formData.append('context', context);
            }
            
            // Dodaj fakty użytkownika
            if (Object.keys(userFacts).length > 0) {
                formData.append('userFacts', JSON.stringify(userFacts));
            }
            
            if (selectedImage && isNewMessage) {
                formData.append('image', selectedImage);
                // Add image preview to chat
                const imageMsg = document.createElement('div');
                imageMsg.className = 'message user-message';
                
                const img = document.createElement('img');
                img.src = URL.createObjectURL(selectedImage);
                img.className = 'chat-image';
                img.alt = 'Uploaded image';
                
                imageMsg.appendChild(img);
                chatMessages.appendChild(imageMsg);
                
                // Clear image preview
                removeSelectedImage();
            }
            
            // Send request to server
            const response = await fetch('/api/chat', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const data = await response.json();
                // Add bot response to chat
                addMessage(data.reply, false);
            } else {
                throw new Error('Server responded with an error');
            }
        } catch (error) {
            // Handle error
            addMessage(error.message, false, true);
        } finally {
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
        }
    }
    
    // Function to send message
    function sendMessage() {
        const message = userInput.value.trim();
        if (!message && !selectedImage) return;
        
        // Sprawdź, czy jesteśmy w trybie edycji
        if (editingMessageId !== null) {
            applyMessageEdit();
            return;
        }
        
        // Wyczyść pole tekstowe
        userInput.value = '';
        
        // Wyślij wiadomość ze standardową treścią
        sendMessageWithContent(message);
    }
    
    // Event listeners
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    
    if (userInput) {
        userInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
            
            // Anuluj edycję przy Escape
            if (e.key === 'Escape' && editingMessageId !== null) {
                cancelEditing();
            }
        });
        
        // Auto-resize textarea
        userInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }
    
    if (imageUpload) {
        imageUpload.addEventListener('change', handleImageUpload);
    }
    
    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', removeSelectedImage);
    }
    
    // Set focus on input field
    if (userInput) {
        userInput.focus();
    }
});