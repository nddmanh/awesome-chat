var express = require ("express");
var app = express();

var hostname = "localhost";
var port = 8017;

app.get("/helloworld", (req, res) => {
    res.send("<h1> Hello World </h1>");
});

app.listen(port, hostname, () =>  {
    console.log(`Xin chao Duc Manh, server running at ${hostname}:${port}`);
})