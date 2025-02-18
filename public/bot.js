const mineflayer = require('mineflayer');
const readline = require('readline');

let bot;

function createBot() {
    bot = mineflayer.createBot({
        host: 'donutsmp.net',
        port: 25565,
        username: 'Yuta1111x',
        auth: 'microsoft'
    });

    bot.on('spawn', () => {
        console.log('Bot joined.');
        bot.chat('/shards')
        setInterval(() => bot.chat('/shards'), 60000);
    });

bot.on('message', (message) => {
    const messageStr = message.toString();
    if (messageStr.startsWith('Your shards')) {
    	console.clear();
        console.log(`${messageStr}`);
    }
});

    bot.on('kicked', reason => {
        console.log(`Kicked: ${reason}`);
        process.exit(1);
    });

    bot.on('error', err => {
        console.log(`Error: ${err}`);
        process.exit(1);
    });

    bot.on('end', () => {
        console.log('Bot disconnected. Reconnecting...');
        setTimeout(createBot, 5000);
    });
}

createBot();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', input => {
    if (input.trim() === 'afk') {
        bot.chat('/afk');
        bot.once('windowOpen', window => setTimeout(() => {
            const slot = window.slots.findIndex(item => item?.name === 'amethyst_block');
            if (slot !== -1) {
                bot.clickWindow(slot, 0, 0);
                console.log('Bot poszedł na randomową strefę AFK!');
                setTimeout(() => {
                    console.log('Restarting bot...');
                    bot.end();
                    createBot();
                }, 6000);
            } else {
                console.log('Amethyst block not found.');
            }
        }, 500));
    }
});