from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return '''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kalkulator</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #f0f0f0;
            }
            .calculator {
                background-color: #fff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .display {
                width: 100%;
                padding: 10px;
                font-size: 2em;
                text-align: right;
                margin-bottom: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
            }
            .buttons {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
            }
            .button {
                padding: 20px;
                font-size: 1.5em;
                background-color: #007BFF;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            .button:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="calculator">
            <input type="text" class="display" id="display" disabled>
            <div class="buttons">
                <button class="button" onclick="appendNumber('7')">7</button>
                <button class="button" onclick="appendNumber('8')">8</button>
                <button class="button" onclick="appendNumber('9')">9</button>
                <button class="button" onclick="setOperation('/')">/</button>
                <button class="button" onclick="appendNumber('4')">4</button>
                <button class="button" onclick="appendNumber('5')">5</button>
                <button class="button" onclick="appendNumber('6')">6</button>
                <button class="button" onclick="setOperation('*')">*</button>
                <button class="button" onclick="appendNumber('1')">1</button>
                <button class="button" onclick="appendNumber('2')">2</button>
                <button class="button" onclick="appendNumber('3')">3</button>
                <button class="button" onclick="setOperation('-')">-</button>
                <button class="button" onclick="appendNumber('0')">0</button>
                <button class="button" onclick="appendNumber('.')">.</button>
                <button class="button" onclick="calculate()">=</button>
                <button class="button" onclick="setOperation('+')">+</button>
            </div>
        </div>
        <script>
            let display = document.getElementById('display');
            let currentOperation = null;
            let firstOperand = null;

            function appendNumber(number) {
                display.value += number;
            }

            function setOperation(operation) {
                if (display.value === '') return;
                firstOperand = parseFloat(display.value);
                currentOperation = operation;
                display.value = '';
            }

            function calculate() {
                if (currentOperation === null || display.value === '') return;
                let secondOperand = parseFloat(display.value);
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
                        result = firstOperand / secondOperand;
                        break;
                    default:
                        return;
                }
                display.value = result;
                currentOperation = null;
                firstOperand = null;
            }
        </script>
    </body>
    </html>
    '''

if __name__ == '__main__':
    app.run(debug=True)
