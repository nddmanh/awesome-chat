import express from "express";
import ConnectDB from "./config/connectDB";
import ContactModel from "./models/contact.model";

let app = express();

ConnectDB();

app.get("/test-db", async (req, res) => {
    try {
        let item = {
            userId: "174589632",
            contactId: "4aaaa8952",
        };
        let contact = await ContactModel.createNew(item);
        res.send(contact);
    } catch (err) {
        console.log(err);
    }
});

app.listen(process.env.APP_PORT , process.env.APP_HOST , () =>  {
    console.log(`Xin chao Duc Manh, server running at ${process.env.APP_HOST }:${process.env.APP_PORT }`);
})