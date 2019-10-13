




const appParams = require('./app-params.json');
const lineReader = require('line-reader');
const fs = require('fs');
const http = require("http");
const PORT = process.env.PORT || 5000;
var spawn = require("child_process").spawn;
let pythonResponse
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    var process = spawn('python', ["./myfun.py"]);
    process.stdout.on('data', function (data) {
        pythonResponse = data.toString();
        res.end(pythonResponse);
    })
    //res.end("Hello World!\n");
}); server.listen(PORT, () => {
    console.log("Server running on " + PORT.toString());
});

// init vars
var followings = new Array(appParams.instagram.usernames.length);
var followers = new Array(appParams.instagram.usernames.length);
let currGet = [];
let plusDifference = [];
let minusDifference = [];
for (let i = 0; i < appParams.instagram.usernames.length; i++) {
    followings[i] = new Array();
    followers[i] = new Array();
}
// following or followers
var currF = 1;
const maxF = 2;
// username counter
var currU = 0;
const maxU = appParams.instagram.usernames.length;
var currIteration = 0;
var currFilename;
setInterval(function () {
    console.log("Start calling python script");
    var currUsername = appParams.instagram.usernames[currU];
    var currGetSetting = (currF == 0 ? "followings" : "followers");
    currFileName = "./out" + (currIteration++).toString() + ".txt";

    currUsername = appParams.instagram.usernames[currU];
    // followings

    console.log("Getting " + currGetSetting + " of " + currUsername + "...");
/*
    var processInstagram = spawn('python', ["./instabot/examples/get_followers_or_followings_to_file.py",
        '-u', 'edirafizade',
        '-p', 'ediediedi06',
        '-proxy', 'tecmint:123proxyinst@35.235.67.28:3128',
        '-user', currUsername,
        '-file', currFileName,
        '-get', currGetSetting,
        '-usernames'])
        */
    /*
processInstagram.on('exit', function () {
    */
    //read the file
    currGet = require('fs').readFileSync(currFileName, 'utf-8')
        .split('\n')
        .filter(Boolean);
    fs.unlink(currFileName, (err) => {
        if (err) throw err;
        console.log('successfully deleted ' + currFileName);
    });
    if (currGetSetting == "followings") {
        plusDifference = currGet.filter(x => !followings[currU].includes(x));
        minusDifference = followings[currU].filter(x => !currGet.includes(x));
        console.log("plus dif: " + plusDifference.length.toString());
        console.log("minus diff: " + minusDifference.length.toString());
        if (followings[currU].length != 0) {
            plusDifference.forEach(element => {
                console.log(currUsername + " started following " + element);
            });
            minusDifference.forEach(element => {
                console.log(currUsername + " stopped following " + element);
            });
        }
        followings[currU] = currGet;
    } else {
        plusDifference = currGet.filter(x => !followers[currU].includes(x));
        minusDifference = followers[currU].filter(x => !currGet.includes(x));
        console.log("plus diff: " + plusDifference.length.toString());
        console.log("minus diff: " + minusDifference.length.toString());
        if (followers[currU].length != 0) {
            plusDifference.forEach(element => {
                console.log(element + " started following " + currUsername);
            });
            minusDifference.forEach(element => {
                console.log(element + " stopped following " + currUsername);
            });
        }
        followers[currU] = currGet;
    }
    console.log("Got " + currGetSetting + " by " + currUsername);
    /*
})
*/
    currU++;
    if (currU == maxU) currU = 0;
    currF++;
    if (currF == maxF) currF = 0;
}, appParams.period)

