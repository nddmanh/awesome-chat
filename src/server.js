import express from "express";
import ConnectDB from "./config/connectDB";
import ConfigViewEngine from "./config/viewEngine" ;
import expressEjsExtend from "express-ejs-extend"; 
import initRouters from "./routers/web";
import path from "path";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import configSession from "./config/session";
import cookiaParser from "cookie-parser";

// Init app
let app = express();

// Connect to MongoDB
ConnectDB();

// Config session
configSession(app);

// Config view engine
app.engine("ejs", expressEjsExtend);
app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.static(path.join(__dirname, 'public')));

// Enable post data for request
app.use(bodyParser.urlencoded({extended: true}));

// Enable flash messages
app.use(connectFlash());

// Init all router
initRouters(app);

app.listen(process.env.APP_PORT , process.env.APP_HOST , () =>  {
    console.log(`Xin chao Duc Manh, server running at ${process.env.APP_HOST }:${process.env.APP_PORT }`);
});