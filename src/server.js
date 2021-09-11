import express from "express";
import ConnectDB from "./config/connectDB";
import ConfigViewEngine from "./config/viewEngine" ;
import expressEjsExtend from "express-ejs-extend"; 
import initRouters from "./routers/web";
import path from "path";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import session from "./config/session";
import passport from "passport";
import http from "http";
import socketio from "socket.io";
import initSockets from "./sockets/index";
import cookieParser from "cookie-parser";
import configSocketIo from "./config/socketio";
import events from "events";
import * as configApp from "./config/app";
// Init app
let app = express();

// Set max connection event listeners
events.EventEmitter.defaultMaxListeners = configApp.app.max_event_listeners;

// Init server with socket.io & express app
let server = http.createServer(app);
let io = socketio(server);

// Connect to MongoDB
ConnectDB();

// Config session
session.config(app);

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

// Config socket.io
configSocketIo(io, cookieParser, session.sessionStore);

// Init all sockets
initSockets(io);

server.listen(process.env.APP_PORT , process.env.APP_HOST , () =>  {
    console.log(`Xin chao Duc Manh, server running at ${process.env.APP_HOST }:${process.env.APP_PORT }`);
});


// import pem from "pem";
// import https from "https";

// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//     if (err) {
//       throw err
//     }
    
//     // Init app
//     let app = express();

//     // Connect to MongoDB
//     ConnectDB();

//     // Config session
//     configSession(app);

//     // Config view engine
//     app.engine("ejs", expressEjsExtend);
//     app.set("view engine", "ejs");
//     app.set("views", "./src/views");
//     app.use(express.static(path.join(__dirname, 'public')));

//     // Enable post data for request
//     app.use(bodyParser.urlencoded({extended: true}));

//     // Enable flash messages
//     app.use(connectFlash());

//     // Config cookie parser
//     app.use(cookieParser());

//     // Config passport js
//     app.use(passport.initialize());
//     app.use(passport.session());

//     // Init all router
//     initRouters(app);
  
//     https.createServer({ key: keys.clientKey, cert: keys.certificate }, app).listen(process.env.APP_PORT , process.env.APP_HOST , () =>  {
//         console.log(`Xin chao Duc Manh, server running at ${process.env.APP_HOST }:${process.env.APP_PORT }`);
//     });
// });