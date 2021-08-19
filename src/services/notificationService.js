import NotificationModel from "./../models/notificationModel";
import UserModel from "./../models/userModel";

const LIMIT_NUMBER_TAKEN = 10;

let getNotifications = (currentUserId) => {
    return new Promise( async (resolve, reject) => {
        try {
            let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId, LIMIT_NUMBER_TAKEN);
            
            let getNotiContents = notifications.map( async (notification) => {
                let sender = await UserModel.findUserById(notification.senderId);
                return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar)
            });

            resolve(await Promise.all(getNotiContents) );
        } catch (error) {
            reject(error);
        }
    }); 
};

/**
 * Count all notifications unread
 * @param {string} currentUserId 
 * @returns 
 */
let countNotifUnread = (currentUserId) => {
    return new Promise( async (resolve, reject) => {
        try {
            let notificationsUnread = await NotificationModel.model.countNotifUnread(currentUserId);
            resolve(notificationsUnread);
        } catch (error) {
            reject(error);
        }
    }); 
};

/**
 * Read more notifications, max 10 items one time
 * @param {string} currentUserId 
 * @param {number} skipNumberNotification 
 */
let readMore = (currentUserId, skipNumberNotification) => {
    return new Promise( async (resolve, reject) => {
        try {
            let newNotifications = await NotificationModel.model.readMore(currentUserId, skipNumberNotification, LIMIT_NUMBER_TAKEN);

            let getNotiContents = newNotifications.map( async (notification) => {
                let sender = await UserModel.findUserById(notification.senderId);
                return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
            });

            resolve(await Promise.all(getNotiContents));
        } catch (error) {
            reject(error);
        }
    }); 
};

/**
 * Mark notifications as read
 * @param {string} currentUserId 
 * @param {array} targetUsers 
 * @returns 
 */
let markAllAsRead = (currentUserId, targetUsers) => {
    return new Promise( async (resolve, reject) => {
        try {
           await NotificationModel.model.markAllAsRead(currentUserId, targetUsers);
           resolve(true);
        } catch (error) {
            console.log(`Error when mark notifications as read: ${error}`);
            reject(false);
        }
    }); 
};

module.exports = {
    getNotifications: getNotifications,
    countNotifUnread: countNotifUnread,
    readMore: readMore,
    markAllAsRead: markAllAsRead
};