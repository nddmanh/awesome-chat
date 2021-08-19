import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
    userId: String,
    contactId: String,
    status: {type: Boolean, default: false},
    createdAt: {type: Number, default: Date.now},
    updateAt: {type: Number, default: null},
    deleteAt: {type: Number, default: null}
});

ContactSchema.statics = {
    createNew(item) {
        return this.create(item);
    },

    /**
     * Find all items that related with user
     * @param {string} userId 
     */
    findAllByUser(userId) {
        return this.find({
            $or: [
                {"userId": userId},
                {"contactId": userId}
            ]
        });
    },

    checkExists(userId, contactId) {
        return this.findOne({
            $or: [
                {$and:[
                    {"userId": userId},
                    {"contactId": contactId},
                ]},
                {$and:[
                    {"userId": contactId},
                    {"contactId": userId},
                ]},
            ]
        }).exec();
    },
    
    removeRequestContact(userId, contactId) {
        return this.remove({
            $and: [
                {"userId": userId},
                {"contactId": contactId},
            ],
        }).exec();
    },
    
    /**
     * Get Contacts by userId and limit
     * @param {string} userId 
     * @param {number} limit 
     */
    getContacts(userId, limit) {
        return this.find({ 
            $and: [
                {$or: [
                    {"userId": userId},
                    {"contactId": userId}
                ]},
                {"status": true}
            ]
        }).sort({ "createdAt": -1 }).limit(limit).exec();
    },
    
    /**
     * Get Contacts sent by userId and limit
     * @param {string} userId 
     * @param {number} limit 
     */
     getContactsSent(userId, limit) {
        return this.find({ 
            $and: [
                {"userId": userId},
                {"status": false}
            ]
        }).sort({ "createdAt": -1 }).limit(limit).exec();
    },
    
    /**
     * Get Contacts received by userId and limit
     * @param {string} userId 
     * @param {number} limit 
     */
     getContactsReceived(userId, limit) {
        return this.find({ 
            $and: [
                {"contactId": userId},
                {"status": false}
            ]
        }).sort({ "createdAt": -1 }).limit(limit).exec();
    },
    
    /**
     * Count Contacts by userId and limit
     * @param {string} userId 
     */
     countAllContacts(userId) {
        return this.count({ 
            $and: [
                {$or: [
                    {"userId": userId},
                    {"contactId": userId}
                ]},
                {"status": true}
            ]
        }).exec();
    },
    
    /**
     * Count Contacts sent by userId and limit
     * @param {string} userId 
     */
     countAllContactsSent(userId) {
        return this.count({ 
            $and: [
                {"userId": userId},
                {"status": false}
            ]
        }).exec();
    },
    
    /**
     * Count Contacts received by userId and limit
     * @param {string} userId 
     */
     countAllContactsReceived(userId) {
        return this.count({ 
            $and: [
                {"contactId": userId},
                {"status": false}
            ]
        }).exec();
    },

};

module.exports = mongoose.model("contact", ContactSchema);