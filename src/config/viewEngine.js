import express from "express";
import expressEjsExtend from "express-ejs-extend"; 
import ejs from "ejs";

/**
 * Config view engine for app
 */

let ConfigViewEngine = (app) => {
    app.use(express.static("./scr/public"));
    app.engine("ejs", expressEjsExtend);
    app.set("view engine", "ejs");
    app.set("views", "./src/views");
};

module.export = ConfigViewEngine;