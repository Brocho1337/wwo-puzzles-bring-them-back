// config
const debug = false;

//global var - don't touch
let sessionId;

module.exports = {
    "handle": async function(msg, db) {
        if (!msg.content.startsWith(".", 0)) return;

        if (debug) {
            if (msg.channel.name !== 'puzzle-games' && msg.channel.name !== 'puzzle-games-bot-tests') return;
        }

        if (!msg.content.substring(1, msg.content.length).includes(".") && msg.content.length !== 1) {
            await msg.delete();
        }

        const sessionIdRoute = await db.collection('announcements').doc('next_session').get();
        sessionId = sessionIdRoute.data().id;
        const puzzleGame = await db.collection('sessions').doc(sessionId).get();

        if (msg.author.bot) return;

        // TODO /////////////////////////////////////////////
        switch (msg.content.substring(1).toLowerCase() ) {

            case 'warri':
                msg.author.send('Yep, that was a pretty easy one wasn’t it? Here’s the next clue. 3 more until my 50th clue :D\n\nBy the way, no caps.\n\nhttps://cdn.discordapp.com/attachments/539179884577161222/618802313716563986/TheWarri27_1.png\n\nHint: tnemhcatta eht ni eman s’resu eht lruynit\n\nF=12\nJ=16\nM=3\nQ=5\nU=9');
                break;
                
            case 'ohcorb':
                msg.author.send('Well done so far, looks like you are a few stages away from my 50th clue/stage celebration :D. Good luck! By the way, the answer to this is a role from WWO. Don’t use caps, no spaces, dashes, punctuation etc.\n\nFifth day.\n11: Kill me, and 10 and 12 will die. ~~A~~HAHAHAHAHAHA!\n9: Ah, so you are the role that’s the hardest to win...interesting.\n12: Hey, I am not a sect member…\n9: That was not what I meant…\n11: Well, tell you what. I’ve used every available action ~~f~~or every night up to now. Honest.\n9: ...Huh?!\n4: Impossible! Then what can you be?! Don’t lynch him guys, he’s de~~f~~initely the fool.\n11: Oh no, looks l~~i~~ke I’m exposed! Oh my god!\n4: Hah. What a noob…\n11: Sike, I’m not the fool by the way. One of the co~~n~~ditions for me to win is for all of the werewolves to be killed!\n9: Ok, I give up. Just who are you?\n11: Well...it’s not your job to gu~~e~~ss who I am...that job belongs to the masochistic puzzle solvers...hehe!\n\nV=13\nW=14\nX=19\nY=21\nZ=25\n\n');
                break;

            case 'madscientist':
                msg.author.send('Nice, you are more than halfway there. Have fun! :) Once again, answer without caps, punctuation, etc\n\nhttps://drive.google.com/drive/folders/1OOo4MGT3YssIaWuY4BDSCIrCwwFPbwzM?usp=sharing\n\nEver heard of a maze?\nBut wait, there’s more!\nIt’s a maze...in folders!\nIsn’t that cool?!\n\nB=1\nG=20\nR=11\na=7\nS=17');
                break;
            case 'myrors':
                msg.author.send(`Good job getting this far. After this, you have one last stage to go, all the best!\n\nHe protecc\nHe attacc\nBut most importantly\nHe cannot protecc twice\nxvrgynhvgjgfmxxsvuwsu'qhitdhdvdlow?wrlu,fhkkgbvuuvdrhyqldmgimal\n\nHint: erenegiv\n\nC=2\nI=10\nP=24\nT=23\nK=18`);
                break;

            case 'lucienbl':
                msg.author.send(`Ah, looks like you have reached the 50th stage/clue/whatever that I have made the moment I had joined as a WWO puzzle maker. Good luck! By the way, the answer is not Warri.\n\nHint: y=ax+b...mod26?\n\nKqnwmdux, yqo gdsb hbkqhbh uglx zbxxdwb! Gbmb'x ugb xqcoulqn - ugb 4 nozrbmx rbxlhb zy hlxkqmh oxbm lh`);
                break;

            case '4219':
                await setWinner(msg, db);
                break;
            default: return;
        }
        // TODO //////////////////////////////////////////////

    }
};

if(msg.content === `${prefix}thisisbs`) {   
    msg.client.channels.get("652921170638798902").send(`Hey! Welcome to -- -- -- -- first puzzle. __I__** am new around here, so I may not know how __t__hings work around here. Ohwell, here's the __c__lue you've been waiting fo__r__:\n65 71 65 61 63 62 64 66 65 71 63 63 63 62 60 61 71 63\n Another one: 1234567__8__`);
}

async function setWinner(msg, db) {
    const puzzleGame = await db.collection('sessions').doc(sessionId).get();
    if (puzzleGame.data().winner) return msg.channel.send(`${puzzleGame.data().winner} already won the giveaway today! Check out the next session with the \`.puzzle\` command :wink:`);
    db.collection('sessions').doc(sessionId).update({
        winner: msg.author.tag
    });
    if (!debug) {
        msg.client.channels.get("441960813067239435").send(`Congratulations to <@${msg.author.id}> :tada:! They won the giveaway today! Good job to everyone who participated and make sure to use the \`.puzzle\` or \`.help\` command to know when the next giveaway will start :smiley:`);
    }
    msg.channel.send(`Congrats <@${msg.author.id}>! You're the winner, check your DM's to get your reward :tada:`);
    msg.author.send(`Congrats dear winner :tada: Here is your voucher code you can directly redeem ingame: \`${puzzleGame.data().voucher}\`! Make sure to use the \`.puzzle\` command to check out our next giveaway.`, { file: puzzleGame.data().rewardPromotion });
}
