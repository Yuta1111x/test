// Terminal functionality

document.addEventListener('DOMContentLoaded', function() {
    const terminal = document.getElementById('terminal');
    const commandInput = document.getElementById('command-input');
    
    if (terminal && commandInput) {
        commandInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const command = this.value.trim();
                if (command) {
                    executeCommand(command);
                    this.value = '';
                }
            }
        });
    }
    
    function executeCommand(command) {
        // Create a new history item element
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `<span class="command">$ ${command}</span>\n`;
        terminal.appendChild(historyItem);
        
        try {
            // Process the command here
            let response = processCommand(command);
            
            // Add response to history item
            if (response) {
                const responseElement = document.createElement('div');
                responseElement.className = 'response';
                responseElement.textContent = response;
                historyItem.appendChild(responseElement);
            }
        } catch (error) {
            // Handle errors
            const errorElement = document.createElement('div');
            errorElement.className = 'error';
            errorElement.textContent = `Error: ${error.message}`;
            historyItem.appendChild(errorElement);
        }
        
        // Scroll to bottom of terminal
        terminal.scrollTop = terminal.scrollHeight;
    }
    
    function processCommand(command) {
        // Simple command processing logic
        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();
        
        switch (cmd) {
            case 'help':
                return 'Available commands: help, echo, clear';
            case 'echo':
                return parts.slice(1).join(' ');
            case 'clear':
                terminal.innerHTML = '';
                return '';
            default:
                return `Command not found: ${cmd}. Type 'help' for available commands.`;
        }
    }
});