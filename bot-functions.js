const appParams = require("./app-params.json")
var spawn = require("child_process").spawn;

function isMessageValid(botMessage) {
    //TODO: code with regexp

    /*
    var r = new RegExp("/^(new |delete )instagram:");
    let boolret = r.test(botMessage);
    //return r.test(botMessage)
    return boolret;
    */

    let a = botMessage.includes("add ");
    let b = botMessage.includes("delete ");
    let c = botMessage.includes("instagram:");
    let e = botMessage.includes("list")
    let d = (a || b) && c;
    return (d || e);
    //( (botMessage.includes("new ")) || (botMessage.includes("delete")) ) && (botMessage.includes("instagram:"));
}

function processMessage(msg) {
    // parse the message
    var picked;
    global.jobs;
    words = msg.text.split(/ |:/);
    switch (words[0]) {
        case "add":
            // add the job
            jobs.push(
                {
                    "medium": words[1],
                    "username": words[2],
                    "chatId": msg.chat.id,
                    "followers": [],
                    "followings": []
                }
            )
            return ("new " + words[1] + " job added.")
        case "delete":
            // delete the job
            picked = jobs.find(x => ((x["medium"] === words[1]) & x["username"] == words[2]));
            jobs = jobs.splice(picked, 1)
            return ("deleted " + words[1] + " job.")
        case "list":
            // list jobs
            var str = [];
            jobs.forEach(element => {
                str += element.medium + " " + element.username + " " + element.chatId + "\n";
            });
            return str;
    }
}

function instagramCheck(job, getSetting) {
    var string = [];
    currFileName = generateTextFilename();
    var processInstagram = spawn('python', ["./instabot-master/examples/get_followers_or_followings_to_file.py",
        '-u', appParams["app-instagram"].username,
        '-p', appParams["app-instagram"].password,
        '-proxy', appParams["app-instagram"].proxy,
        '-user', job.username,
        '-file', currFileName,
        '-get', getSetting,
        '-usernames'])
    processInstagram.on('exit', function () {
        currGet = require('fs').readFileSync(currFileName, 'utf-8')
            .split('\n')
            .filter(Boolean);
        fs.unlink(currFileName, (err) => {
            if (err) throw err;
            console.log('successfully deleted ' + currFileName);
        });
        if (job[getSetting].length == 0) {
            job[getSetting] = currGet;
        } else {
            var plusDifference = currGet.filter(x => !job[getSetting].includes(x));
            var minusDifference = job[getSetting].filter(x => !currGet.includes(x));
        }
        console.log("plus dif: " + plusDifference.length.toString());
        console.log("minus diff: " + minusDifference.length.toString());
        if (followings[currU].length != 0) {
            plusDifference.forEach(element => {
                console.log(currUsername + " started " + getSetting + " " + element);
                string += job.username + " started " + getSetting + " " + element + "\n";
            });
            minusDifference.forEach(element => {
                console.log(currUsername + " stopped " + getSetting + " " + element);
                string += job.username + " stopped " + getSetting + " " + element + "\n";
            });
        }
    })
    // send string
    global.bot;
    if (string == 0) {
        // do nothing
    } else {
        bot.sendMessage(job.chatId, string);
    }
}

function instagramCheckFollowings(job) {
    instagramCheck(job, "followings")
}

function instagramCheckFollowers(job) {
    instagramCheck(job, "followers")
}

function processJobs() {
    global.jobs;

    if (jobs.length == 0) {
        // do nothing
    } else {

        global.jobInd;
        var currJob = jobs[jobInd];
        var s1 = instagramCheck(currJob, "followers");

        var s2 = instagramCheck(currJob, "followings");

        // increase index
        jobInd++;
        if (jobInd == jobs.length) {
            jobInd = 0;
        }
    }
}

function generateTextFilename() {
    return ("./" + makeid(appParams.filenameLength) + '.txt');
    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}

exports.processMessage = processMessage;
exports.isMessageValid = isMessageValid;
exports.processJobs = processJobs;