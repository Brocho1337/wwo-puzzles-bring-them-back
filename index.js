const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./src/config');
const firebase = require("firebase");
const corePuzzle = require('./src/corePuzzle');

firebase.initializeApp(config.firebase);

// Initialize Cloud Firestore through Firebase
const db = firebase.firestore();

let nextPuzzle = {};

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const nextSessionDoc = db.collection('announcements').doc('next_session');

    const observer = nextSessionDoc.onSnapshot(async docSnapshot => {
        await client.user.setActivity(`next giveaway ${docSnapshot.data().date}`, { type: 'WATCHING' });

        const puzzleGame = await db.collection('sessions').doc(docSnapshot.data().id).get();
        nextPuzzle.date = docSnapshot.data().date;
        if (puzzleGame.data()) {
            nextPuzzle.author = puzzleGame.data().author;
            nextPuzzle.rewardType = puzzleGame.data().rewardType;
            nextPuzzle.rewardPromotion = puzzleGame.data().rewardPromotion;
        }
    }, err => {
        console.log(`Encountered error: ${err}`);
    });
});

client.on('message', msg => {
    const { prefix } = config;

        if (msg.channel.name !== 'bot-commands' && msg.channel.name !== 'puzzle-games' && msg.channel.name !== 'puzzle-games-bot-tests') return;

        if (msg.author.bot) return;
        switch (msg.content) {
        case `${prefix}help`: return msg.channel.send(`My cute prefix is a cute dot \`.\` :blush:\n\n__**Commands**__\n\n- \`${prefix}help\`: to get some fluffy help\n- \`${prefix}puzzle\`: to get the next giveaway date\n- \`${prefix}nothingelse\`: so you know there are no more commands for this bot right now`);
        case `${prefix}puzzle`: {
            if (nextPuzzle.author) {
                return msg.channel.send(`The next giveaway puzzle, made by ${nextPuzzle.author} will start ${nextPuzzle.date}! If you win you'll get ${nextPuzzle.rewardType}! Be prepared :tada:`, { file: nextPuzzle.rewardPromotion });
            } else {
                return msg.channel.send('The next giveaway puzzle will start soon! Be prepared :tada:');
            }
        }

        case `${prefix}nothingelse`: return msg.channel.send(`I said **no**! There's __**nothing**__ else! :rage:`);

        default: return corePuzzle.handle(msg, db);
    }

});

client.login(`NjUzMzAzNTEzMTk0OTU0NzUy.Xe1CXA.NysQh-F5OBtP_iPNnFICYZNy_Po`).then(r => console.log("Bot logged in!"));