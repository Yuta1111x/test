from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return '''
    <!DOCTYPE html>
    <html lang="pl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Elegancki Kalkulator</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap">
        <style>
            :root {
                --primary-color: #6c5ce7;
                --secondary-color: #a29bfe;
                --accent-color: #fd79a8;
                --dark-color: #2d3436;
                --light-color: #dfe6e9;
                --shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                --gradient: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            }
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Montserrat', sans-serif;
            }
            
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: #f7f7f7;
                background-image: 
                    radial-gradient(circle at 10% 20%, rgba(108, 92, 231, 0.1) 0%, rgba(108, 92, 231, 0.05) 90%),
                    radial-gradient(circle at 90% 80%, rgba(253, 121, 168, 0.1) 0%, rgba(253, 121, 168, 0.05) 90%);
                overflow: hidden;
            }
            
            .container {
                position: relative;
                z-index: 1;
            }
            
            .calculator {
                width: 340px;
                background: white;
                border-radius: 20px;
                box-shadow: var(--shadow);
                overflow: hidden;
                transform: translateY(0);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .calculator:hover {
                transform: translateY(-5px);
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
            }
            
            .calculator-header {
                background: var(--gradient);
                padding: 20px;
                text-align: center;
                color: white;
                font-weight: 500;
                font-size: 1.5rem;
                border-radius: 20px 20px 0 0;
            }
            
            .display-container {
                padding: 20px;
                background: rgba(255, 255, 255, 0.9);
            }
            
            .display {
                width: 100%;
                height: 80px;
                background: var(--light-color);
                border: none;
                border-radius: 10px;
                font-size: 2.5rem;
                text-align: right;
                padding: 0 20px;
                color: var(--dark-color);
                font-weight: 300;
                box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            
            .buttons {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 15px;
                padding: 20px;
            }
            
            .button {
                height: 65px;
                border: none;
                border-radius: 12px;
                font-size: 1.5rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                justify-content: center;
                align-items: center;
                box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
            }
            
            .button:active {
                transform: scale(0.95);
            }
            
            .number {
                background: white;
                color: var(--dark-color);
            }
            
            .number:hover {
                background: var(--light-color);
            }
            
            .operator {
                background: var(--secondary-color);
                color: white;
            }
            
            .operator:hover {
                background: var(--primary-color);
            }
            
            .equals {
                background: var(--accent-color);
                color: white;
                grid-column: span 2;
            }
            
            .equals:hover {
                background: #e84393;
            }
            
            .clear {
                background: var(--dark-color);
                color: white;
            }
            
            .clear:hover {
                background: #1e272e;
            }
            
            .decimal {
                background: white;
                color: var(--dark-color);
            }
            
            .calculator-footer {
                text-align: center;
                padding: 15px;
                color: var(--dark-color);
                font-size: 0.8rem;
                opacity: 0.7;
            }
            
            /* Animacje i efekty */
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            .button.equals:active {
                animation: pulse 0.3s ease;
            }
            
            /* Responsywność */
            @media (max-width: 400px) {
                .calculator {
                    width: 300px;
                }
                
                .button {
                    height: 55px;
                    font-size: 1.2rem;
                }
                
                .display {
                    height: 70px;
                    font-size: 2rem;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="calculator">
                <div class="calculator-header">
                    Elegancki Kalkulator
                </div>
                <div class="display-container">
                    <input type="text" class="display" id="display" readonly>
                </div>
                <div class="buttons">
                    <button class="button clear" onclick="clearDisplay()">C</button>
                    <button class="button operator" onclick="backspace()">⌫</button>
                    <button class="button operator" onclick="setOperation('%')">%</button>
                    <button class="button operator" onclick="setOperation('/')">÷</button>
                    
                    <button class="button number" onclick="appendNumber('7')">7</button>
                    <button class="button number" onclick="appendNumber('8')">8</button>
                    <button class="button number" onclick="appendNumber('9')">9</button>
                    <button class="button operator" onclick="setOperation('*')">×</button>
                    
                    <button class="button number" onclick="appendNumber('4')">4</button>
                    <button class="button number" onclick="appendNumber('5')">5</button>
                    <button class="button number" onclick="appendNumber('6')">6</button>
                    <button class="button operator" onclick="setOperation('-')">−</button>
                    
                    <button class="button number" onclick="appendNumber('1')">1</button>
                    <button class="button number" onclick="appendNumber('2')">2</button>
                    <button class="button number" onclick="appendNumber('3')">3</button>
                    <button class="button operator" onclick="setOperation('+')">+</button>
                    
                    <button class="button number" onclick="appendNumber('0')">0</button>
                    <button class="button decimal" onclick="appendNumber('.')">.</button>
                    <button class="button equals" onclick="calculate()">=</button>
                </div>
                <div class="calculator-footer">
                    Stworzono z ❤️ przez Zencoder
                </div>
            </div>
        </div>
        
        <script>
            let display = document.getElementById('display');
            let currentOperation = null;
            let firstOperand = null;
            let resetDisplay = false;
            
            // Inicjalizacja wyświetlacza
            window.onload = function() {
                clearDisplay();
            };
            
            function appendNumber(number) {
                if (resetDisplay) {
                    display.value = '';
                    resetDisplay = false;
                }
                
                // Zapobieganie wielu kropkom dziesiętnym
                if (number === '.' && display.value.includes('.')) {
                    return;
                }
                
                // Zapobieganie wielu zerom na początku
                if (display.value === '0' && number !== '.') {
                    display.value = number;
                } else {
                    display.value += number;
                }
            }
            
            function setOperation(operation) {
                if (display.value === '') return;
                
                if (firstOperand !== null) {
                    calculate();
                }
                
                firstOperand = parseFloat(display.value);
                currentOperation = operation;
                resetDisplay = true;
            }
            
            function calculate() {
                if (currentOperation === null || resetDisplay) return;
                
                const secondOperand = parseFloat(display.value);
                let result;
                
                switch (currentOperation) {
                    case '+':
                        result = firstOperand + secondOperand;
                        break;
                    case '-':
                        result = firstOperand - secondOperand;
                        break;
                    case '*':
                        result = firstOperand * secondOperand;
                        break;
                    case '/':
                        if (secondOperand === 0) {
                            display.value = 'Błąd';
                            firstOperand = null;
                            currentOperation = null;
                            resetDisplay = true;
                            return;
                        }
                        result = firstOperand / secondOperand;
                        break;
                    case '%':
                        result = firstOperand % secondOperand;
                        break;
                    default:
                        return;
                }
                
                // Formatowanie wyniku, aby uniknąć zbyt długich liczb dziesiętnych
                display.value = parseFloat(result.toFixed(8)).toString();
                firstOperand = result;
                currentOperation = null;
                resetDisplay = true;
            }
            
            function clearDisplay() {
                display.value = '0';
                firstOperand = null;
                currentOperation = null;
                resetDisplay = true;
            }
            
            function backspace() {
                if (display.value.length === 1 || (display.value.length === 2 && display.value.startsWith('-'))) {
                    display.value = '0';
                    resetDisplay = true;
                } else {
                    display.value = display.value.slice(0, -1);
                }
            }
            
            // Obsługa klawiatury
            document.addEventListener('keydown', function(event) {
                const key = event.key;
                
                if (/[0-9]/.test(key)) {
                    appendNumber(key);
                } else if (key === '.') {
                    appendNumber('.');
                } else if (key === '+') {
                    setOperation('+');
                } else if (key === '-') {
                    setOperation('-');
                } else if (key === '*') {
                    setOperation('*');
                } else if (key === '/') {
                    setOperation('/');
                } else if (key === '%') {
                    setOperation('%');
                } else if (key === 'Enter' || key === '=') {
                    calculate();
                } else if (key === 'Escape') {
                    clearDisplay();
                } else if (key === 'Backspace') {
                    backspace();
                }
            });
        </script>
    </body>
    </html>
    '''

if __name__ == '__main__':
    app.run(debug=True)
