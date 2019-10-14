const appParams = require('app-params.json')
const http = require("http");
const PORT = process.env.PORT || 5000;
const spawn = require("child_process").spawn;

global.dummySayac = 0;
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    var process = spawn('python', ["./myfun.py"]);
    process.stdout.on('data', function(data){
        pythonResponse = data.toString();
        pythonResponse = pythonResponse + global.dummySayac.toString();
        res.end(pythonResponse);
    })
});
server.listen(PORT, () => {
    console.log("Server running on " + PORT.toString())
})

setInterval(myFunc, 500);
function myFunc(){
    console.log(global.dummySayac.toString());
    global.dummySayac++;
}

console.log("deneme");

setInterval(instagramCheckFollowers, appParams.period);
setInterval(instagramCheckFollowings, appParams.period);