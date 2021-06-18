import express from "express";
import ConnectDB from "./config/connectDB";
import ConfigViewEngine from "./config/viewEngine" ;
import expressEjsExtend from "express-ejs-extend"; 
import initRouters from "./routers/web";
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectFlash from "connect-flash";
import configSession from "./config/session";
import passport from "passport";

import pem from "pem";
import https from "https";

pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
    if (err) {
      throw err
    }
    
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

    // Config cookie parser
    app.use(cookieParser());

    // Config passport js
    app.use(passport.initialize());
    app.use(passport.session());

    // Init all router
    initRouters(app);
  
    https.createServer({ key: keys.clientKey, cert: keys.certificate }, app).listen(process.env.APP_PORT , process.env.APP_HOST , () =>  {
        console.log(`Xin chao Duc Manh, server running at ${process.env.APP_HOST }:${process.env.APP_PORT }`);
    });
});

// // Init app
// let app = express();

// // Connect to MongoDB
// ConnectDB();

// // Config session
// configSession(app);

// // Config view engine
// app.engine("ejs", expressEjsExtend);
// app.set("view engine", "ejs");
// app.set("views", "./src/views");
// app.use(express.static(path.join(__dirname, 'public')));

// // Enable post data for request
// app.use(bodyParser.urlencoded({extended: true}));

// // Enable flash messages
// app.use(connectFlash());

// // Config cookie parser
// app.use(cookieParser());

// // Config passport js
// app.use(passport.initialize());
// app.use(passport.session());

// // Init all router
// initRouters(app);

// app.listen(process.env.APP_PORT , process.env.APP_HOST , () =>  {
//     console.log(`Xin chao Duc Manh, server running at ${process.env.APP_HOST }:${process.env.APP_PORT }`);
// });