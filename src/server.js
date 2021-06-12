import express from "express";
import ConnectDB from "./config/connectDB";
import ConfigViewEngine from "./config/viewEngine" ;
import expressEjsExtend from "express-ejs-extend"; 
import path from "path";

import initRouters from "./routers/web";

//Init app
let app = express();

// Connect to MongoDB
ConnectDB();

// Config view engine
app.engine("ejs", expressEjsExtend);
app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.static(path.join(__dirname, 'public')));

//Init all router
initRouters(app);

app.listen(process.env.APP_PORT , process.env.APP_HOST , () =>  {
    console.log(`Xin chao Duc Manh, server running at ${process.env.APP_HOST }:${process.env.APP_PORT }`);
});