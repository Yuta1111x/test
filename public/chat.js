// Chat functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const removeImageBtn = document.getElementById('remove-image');
    const loadingIndicator = document.getElementById('loading-indicator');
    
    let selectedImage = null;
    
    // Function to add a message to the chat
    function addMessage(content, isUser = false, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
        
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
            // Check if content contains HTML (for markdown rendering)
            if (typeof content === 'string' && content.includes('<')) {
                const contentDiv = document.createElement('div');
                contentDiv.innerHTML = content;
                messageDiv.appendChild(contentDiv);
            } else {
                const contentDiv = document.createElement('div');
                contentDiv.textContent = content;
                messageDiv.appendChild(contentDiv);
            }
            
            const timeDiv = document.createElement('div');
            timeDiv.className = 'message-time';
            timeDiv.textContent = new Date().toLocaleTimeString();
            messageDiv.appendChild(timeDiv);
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
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
    
    // Function to send message to the server
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message && !selectedImage) return;
        
        // Add user message to chat
        addMessage(message, true);
        
        // Clear input
        userInput.value = '';
        
        // Show loading indicator
        loadingIndicator.style.display = 'block';
        
        try {
            // Create form data for the request
            const formData = new FormData();
            formData.append('message', message);
            
            if (selectedImage) {
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
                addMessage(data.response);
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