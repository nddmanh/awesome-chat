import express from "express";
import {home, auth} from "./../controllers/index";

let router = express.Router();

/**
 * Init all router
 * param app from exactly express modules
 */

let initRouters = (app) => {
    router.get("/", home.getHome);
    router.get("/login-register", auth.getLoginRegister);

    return app.use("/", router); 
};

module.exports = initRouters;
