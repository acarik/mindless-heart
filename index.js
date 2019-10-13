const http = require("http");
const PORT = process.env.PORT || 5000;
const spawn = require("child_process").spawn;
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    var process = spawn('python', ["./myfun.py"]);
    process.stdout.on('data', function(data){
        pythonResponse = data.toString();
        res.end(pythonResponse);
    })
});
server.listen(PORT, () => {
    console.log("Server running on " + PORT.toString())
})