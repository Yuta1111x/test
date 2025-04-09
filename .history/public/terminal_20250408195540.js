// Terminal functionality
document.addEventListener('DOMContentLoaded', function() {
    const terminal = document.getElementById('terminal');
    const commandInput = document.getElementById('terminal-input');
    let commandHistory = [];
    let historyIndex = -1;
    
    // Load command history from localStorage
    try {
        const savedHistory = localStorage.getItem('commandInputHistory');
        if (savedHistory) {
            commandHistory = JSON.parse(savedHistory);
        }
    } catch (e) {
        console.error('Error loading command history:', e);
        commandHistory = [];
    }
    
    // Load terminal content from localStorage
    function loadCommandHistory() {
        try {
            const savedTerminal = localStorage.getItem('terminalHistory');
            if (savedTerminal) {
                terminal.innerHTML = savedTerminal;
            }
        } catch (e) {
            console.error('Error loading terminal history:', e);
        }
    }
    
    // Save terminal content to localStorage
    function saveCommandHistory() {
        localStorage.setItem('terminalHistory', terminal.innerHTML);
    }
    
    // Save input command history for arrow navigation
    function saveInputHistory(command) {
        // Don't add empty commands or duplicates of the last command
        if (command && (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== command)) {
            commandHistory.push(command);
            // Keep only the last 50 commands
            if (commandHistory.length > 50) {
                commandHistory.shift();
            }
            localStorage.setItem('commandInputHistory', JSON.stringify(commandHistory));
        }
        // Reset the history index
        historyIndex = -1;
    }
    
    // Handle arrow key navigation through command history
    function handleArrowKeys(e) {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                commandInput.value = commandHistory[commandHistory.length - 1 - historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                commandInput.value = commandHistory[commandHistory.length - 1 - historyIndex];
            } else if (historyIndex === 0) {
                historyIndex = -1;
                commandInput.value = '';
            }
        }
    }
    
    // Process command input
    async function processCommand(command) {
        if (!command.trim()) return; // Don't process empty commands
        
        // Save to input history for arrow key navigation
        saveInputHistory(command);
        
        // Create a new history item element
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = '<span class="command">$ ' + command + '</span>\n';
        terminal.appendChild(historyItem);
        
        try {
            // For client-side processing
            const parts = command.split(' ');
            const cmd = parts[0].toLowerCase();
            
            switch (cmd) {
                case 'help':
                    const helpText = 'Available commands: help, echo, clear, date, time';
                    const responseElement = document.createElement('span');
                    responseElement.className = 'response';
                    responseElement.textContent = helpText;
                    historyItem.appendChild(document.createTextNode('\n'));
                    historyItem.appendChild(responseElement);
                    break;
                    
                case 'echo':
                    const echoText = parts.slice(1).join(' ');
                    const echoElement = document.createElement('span');
                    echoElement.className = 'response';
                    echoElement.textContent = echoText;
                    historyItem.appendChild(document.createTextNode('\n'));
                    historyItem.appendChild(echoElement);
                    break;
                    
                case 'clear':
                    terminal.innerHTML = '';
                    break;
                    
                case 'date':
                    const dateElement = document.createElement('span');
                    dateElement.className = 'response';
                    dateElement.textContent = new Date().toLocaleDateString();
                    historyItem.appendChild(document.createTextNode('\n'));
                    historyItem.appendChild(dateElement);
                    break;
                    
                case 'time':
                    const timeElement = document.createElement('span');
                    timeElement.className = 'response';
                    timeElement.textContent = new Date().toLocaleTimeString();
                    historyItem.appendChild(document.createTextNode('\n'));
                    historyItem.appendChild(timeElement);
                    break;
                    
                default:
                    // Try to fetch from server
                    try {
                        const response = await fetch('/cmd/execute', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ command })
                        });
                        
                        if (response.ok) {
                            const data = await response.json();
                            if (data.output) {
                                const outputSpan = document.createElement('span');
                                outputSpan.className = 'response';
                                outputSpan.textContent = data.output;
                                historyItem.appendChild(document.createTextNode('\n'));
                                historyItem.appendChild(outputSpan);
                            }
                        } else {
                            throw new Error('Command not found');
                        }
                    } catch (error) {
                        const errorSpan = document.createElement('span');
                        errorSpan.className = 'error';
                        errorSpan.textContent = "Command not found: " + cmd + ". Type 'help' for available commands.";
                        historyItem.appendChild(document.createTextNode('\n'));
                        historyItem.appendChild(errorSpan);
                    }
            }
        } catch (error) {
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error';
            errorSpan.textContent = "Error: " + error.message;
            historyItem.appendChild(document.createTextNode('\n'));
            historyItem.appendChild(errorSpan);
        }
        
        // Scroll to bottom of terminal
        terminal.scrollTop = terminal.scrollHeight;
        
        // Save terminal state
        saveCommandHistory();
    }
    
    // Initialize terminal
    function initTerminal() {
        // Load history when page loads
        loadCommandHistory();
        
        // Set up event listeners
        if (commandInput) {
            commandInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    const command = this.value;
                    this.value = '';
                    processCommand(command);
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    handleArrowKeys(e);
                }
            });
        }
        
        // Set up clear button if it exists
        const clearButton = document.getElementById('clear-terminal');
        if (clearButton) {
            clearButton.addEventListener('click', function() {
                terminal.innerHTML = '';
                saveCommandHistory();
            });
        }
    }
    
    // Initialize the terminal
    if (terminal && commandInput) {
        initTerminal();
    }
});