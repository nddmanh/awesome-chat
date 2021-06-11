import express from "express";
let app = express();

let hostname = "localhost";
let port = 8017;

app.get("/helloworld", (req, res) => {
    res.send("<h1> Hello World </h1>");
});

app.listen(port, hostname, () =>  {
    console.log(`Xin chao Duc Manh, server running at ${hostname}:${port}`);
})