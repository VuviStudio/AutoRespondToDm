const fs = require('fs');
const { Client, Intents } = require('discord.js-selfbot-v13');
const client = new Client({
    intents: [Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS],
    checkUpdate: false,
});

let respondedUsers = [];

client.once('ready', () => {
    console.log(`Vuvi Auto Dm's logged on ${client.user.tag}!`);

    if (fs.existsSync('dmdusers.json')) {
        const data = fs.readFileSync('dmdusers.json', 'utf8');
        respondedUsers = JSON.parse(data);
    }
});

client.on('messageCreate', async (message) => {
    if (message.author.id === client.user.id) return;

    if (message.channel.type === 'DM' && !respondedUsers.includes(message.author.id)) {
        fs.readFile('respondmessage.txt', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }

            message.channel.send(data)
                .then(() => {
                    respondedUsers.push(message.author.id);

                    fs.writeFileSync('dmdusers.json', JSON.stringify(respondedUsers, null, 2), 'utf8');
                })
                .catch((err) => console.error('Error sending message:', err));
        });
    }
});



client.login('urtoken');
