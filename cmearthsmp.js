const mineflayer = require('mineflayer');
const readline = require('readline');
const fs = require('fs');

require('events').EventEmitter.defaultMaxListeners = 100;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let homeInterval = null;
let botCheckInterval = null;
let pendingCommand = null;
const botNicks = fs.readFileSync('nicks.txt', 'utf-8').split('\n').map(nick => nick.trim()).filter(nick => nick);
const totalBots = botNicks.length;

function createBot(username, botName) {
    global[botName] = mineflayer.createBot({
        host: 'clearmc.pl',
        port: 25565,
        username: username,
        version: '1.19.2'
    });

    global[botName].on('end', () => {
        console.log(`${botName} został rozłączony od serwera, restartuję za 3 sekundy...`);
        setTimeout(() => createBot(username, botName), 3000);
    });

    global[botName].once('spawn', () => {
        console.log(`${botName} połączony i gotowy!`);
        global[botName].chat('/register AQSONTOP AQSONTOP');
        global[botName].chat('/login AQSONTOP');
        setTimeout(() => {
            global[botName].setQuickBarSlot(0);
            global[botName].activateItem();
            searchAndClickItem('player_head');
        }, 500);

        if (!global[botName].windowOpenListenerAdded) {
            setupWindowOpenListener(global[botName]);
            global[botName].windowOpenListenerAdded = true;
        }
    });

    global[botName].on('error', (err) => {
        process.exit(1);
    });

    global[botName].on('message', (message) => {
        const messageStr = message.toString();
        const parts = messageStr.split(' ');
        const username = parts[0];
        console.log(`${botName}: ${username}>> ${messageStr}`);
    });
}

function startHomeCommandCycle() {
    const allBots = Object.keys(global).filter(key => key.startsWith('bot'));

    if (homeInterval) {
        clearInterval(homeInterval);
    }

    function sendHomeCommand() {
        allBots.forEach(botName => {
            if (global[botName]) {
                global[botName].chat('/home');
                console.log(`${botName} wysłał komendę /home`);
            }
        });
    }

    sendHomeCommand();

    homeInterval = setInterval(() => {
        sendHomeCommand();
    }, 10000);
}

function stopHomeCommandCycle() {
    if (homeInterval) {
        clearInterval(homeInterval);
        homeInterval = null;
        console.log('Boty zatrzymały wysyłanie komendy /home');
    }
}

async function searchAndClickItem(itemName) {
    const allBots = Object.keys(global).filter(key => key.startsWith('bot'));

    allBots.forEach(botName => {
        const bot = global[botName];
        if (bot) {
            bot.once('windowOpen', async (window) => {
                const item = window.slots.find(slot => slot && slot.name === itemName);
                if (item) {
                    bot.clickWindow(item.slot, 0, 0).catch(err => {
                        console.log(`${botName}: Błąd podczas klikania na przedmiot ${itemName}: ${err}`);
                    });
                    console.log(`${botName}: Kliknięto na przedmiot ${itemName}`);
                }
            });
        }
    });
}

const validCommands = ['@home on', '@home off', '@daily', '@boty', '@tp', '@r'];

function handleConsoleCommand(input) {
    if (input === 'tak') {
        executePendingCommand();
    } else if (input === 'nie') {
        pendingCommand = null;
        console.log('Komenda została anulowana.');
    } else if (input.startsWith('@')) {
        const parts = input.split(' ');

        if (validCommands.includes(parts[0])) {
            if (parts[0] === '@home on') {
                startHomeCommandCycle();
            } else if (parts[0] === '@home off') {
                stopHomeCommandCycle();
            } else if (parts[0] === '@daily') {
                sendDailyCommand();
            } else if (parts[0] === '@tp') {
                const allBots = Object.keys(global).filter(key => key.startsWith('bot')); // Definiujemy allBots
                allBots.forEach(botName => {
                    if (global[botName]) {
                        global[botName].chat('/tpa CytrusiaKK');
                        console.log(`${botName} wysłał komendę /tpa`);
                    }
                });
            } else if (parts[0] === '@r' && parts.length > 1) {
                const botIndexes = parts.slice(1).map(num => parseInt(num)).filter(num => !isNaN(num) && num > 0 && num <= totalBots);

                botIndexes.forEach(botIndex => {
                    const botName = `bot${botIndex}`;
                    const username = botNicks[botIndex - 1];

                    if (global[botName]) {
                        console.log(`Restartuję bota ${botIndex} (${username})...`);
                        global[botName].end(); // Rozłącza bota, co wywoła ponowne stworzenie
                    } else {
                        console.log(`Bot ${botIndex} nie był aktywny, tworzę go ponownie.`);
                        createBot(username, botName);
                    }
                });
            }
        } else {
            console.log(`"${input}" nie jest prawidłową komendą.`);
        }
    } else {
        pendingCommand = input;
        console.log(`Czy na pewno chcesz wysłać komendę "${input}" do wszystkich botów? (tak/nie)`);
    }
}

function sendDailyCommand() {
    const allBots = Object.keys(global).filter(key => key.startsWith('bot'));

    allBots.forEach(botName => {
        if (global[botName]) {
            global[botName].chat('/daily');
            console.log(`${botName} wysłał komendę /daily`);

            global[botName].once('windowOpen', async (window) => {
                await searchAndClickItem('green_dye');
            });
        }
    });
}

function executePendingCommand() {
    if (!pendingCommand) {
        console.log('Brak komendy do wykonania.');
        return;
    }

    const allBots = Object.keys(global).filter(key => key.startsWith('bot'));
    allBots.forEach(botName => {
        if (global[botName]) {
            global[botName].chat(pendingCommand);
            console.log(`${botName} wysłał komendę: ${pendingCommand}`);
        }
    });

    pendingCommand = null;
}

function createBotsSequentially() {
    botNicks.forEach((username, index) => {
        const botName = `bot${index + 1}`;

        setTimeout(() => {
            createBot(username, botName);
        }, index * 1750);
    });
}

function setupWindowOpenListener(bot) {
    bot.once('windowOpen', (window) => {
        console.log(`${bot.username}: Okno otwarte`);
    });
}

createBotsSequentially();

rl.on('line', handleConsoleCommand);