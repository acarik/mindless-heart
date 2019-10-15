const appParams = require("./app-params.json")
const http = require("http");
const PORT = process.env.PORT || 5000;
const spawn = require("child_process").spawn;
const TelegramBot = require('node-telegram-bot-api')
const botFunctions = require('./bot-functions.js')
global.jobs = [];
global.jobInd = 0;

    // test
    jobs = [];
    jobs.push({
        "medium": "instagram",
        "username": "lepke5790",
        "chatId": 16401208,
        "followers": [],
        "followings": []
    })
    jobs.push({
        "medium": "instagram",
        "username": "edirafizade",
        "chatId": 16401208,
        "followers": [],
        "followings": []
    })

let startTime;
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    var process = spawn('python', ["./myfun.py"]);
    process.stdout.on('data', function (data) {
        startTime = startTime || data.toString();
        res.end("mindless-heart, up since " + startTime);
    })
});

server.listen(PORT, () => {
    console.log("Server running on " + PORT.toString())
})

const bot = new TelegramBot(appParams["telegram-bot-token"], { polling: true });
global.bot
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (botFunctions.isMessageValid(msg.text))
    {
        var outStr = botFunctions.processMessage(msg)
        bot.sendMessage(chatId, outStr);
    }else{
        bot.sendMessage(chatId, 'Invalid.');
    }
});

setInterval(botFunctions.processJobs, appParams.period);
