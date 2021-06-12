import express from "express";
import ConnectDB from "./config/connectDB";
import ConfigViewEngine from "./config/viewEngine" ;
import expressEjsExtend from "express-ejs-extend"; 
import path from "path";

//Init app
let app = express();
console.log("init app ok");

// Connect to MongoDB
ConnectDB();
console.log("connect db ok");

// Config view engine
app.engine("ejs", expressEjsExtend);
app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.static(path.join(__dirname, 'public')));

console.log("config view ok");


app.get("/", (req, res) => {
    return res.render("main/master");
});

app.get("/login-register", (req, res) => {
    return res.render("auth/loginRegister");
});

app.listen(process.env.APP_PORT , process.env.APP_HOST , () =>  {
    console.log(`Xin chao Duc Manh, server running at ${process.env.APP_HOST }:${process.env.APP_PORT }`);
});