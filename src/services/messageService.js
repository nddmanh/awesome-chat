import UserModel from "./../models/userModel";
import ContactModel from "./../models/contactModel";
import ChatGroupModel from "./../models/chatGroupModel";
import MessageModel from "./../models/messageModel";
import _ from "lodash";
import { transErrors } from "../../lang/vi";
import { app } from "./../config/app";
import fsExtra from "fs-extra";

const LIMIT_CONVERSATIONS_TAKEN = 15;
const LIMIT_MESSAGES_TAKEN = 30;

/**
 * get all conversations
 * @param {string} currentUserId 
 */
let getAllConversationItems = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContacts(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
            let userConversationsPromise = contacts.map( async (contact) => {
                if (contact.contactId == currentUserId) {
                    let getUserContact = await UserModel.getNormalUserDataById(contact.userId);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                } else {
                    let getUserContact = await UserModel.getNormalUserDataById(contact.contactId);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                }
            });
            let userConversations = await Promise.all(userConversationsPromise);
            let groupConversations = await ChatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
            
            let allConversations = userConversations.concat(groupConversations);
            
            allConversations = _.sortBy(allConversations, (item) => {
                return -item.updatedAt;
            });

            // Get messages to apply in screen chat
            let allConversationWithMessagesPromise = allConversations.map(async (conversation) => {
                conversation = conversation.toObject();
                if (conversation.members) {
                    let getMessages = await MessageModel.model.getMessagesInGroup(conversation._id, LIMIT_MESSAGES_TAKEN);
                    conversation.messages = _.reverse(getMessages);
                } else {
                    let getMessages = await MessageModel.model.getMessagesInPersonal(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);
                    conversation.messages = _.reverse(getMessages);
                }
                
                return conversation;
            });

            let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);
            // sort by updatedAt desending
            allConversationWithMessages = _.sortBy(allConversationWithMessages, (item) => {
                return -item.updatedAt;
            });
            
            resolve({
                allConversationWithMessages: allConversationWithMessages
            });

        } catch (error) {
            reject(error);
        }
    });
};

/**
 * add new message text and emoji
 * @param {object} sender 
 * @param {string} receiverId 
 * @param {string} messageVal 
 * @param {boolean} isChatGroup 
 */
let addNewTextEmoji = (sender, receiverId, messageVal, isChatGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (isChatGroup) {
                let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
                if (!getChatGroupReceiver) {
                    return reject(transErrors.conversation_not_found);
                };

                let receiver = {
                    id: getChatGroupReceiver._id,
                    name: getChatGroupReceiver.name,
                    avatar: app.general_avatar_group_chat
                };

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationTypes.GROUP,
                    messageType: MessageModel.messageTypes.TEXT,
                    sender: sender,
                    receiver: receiver,
                    text: messageVal,
                    createdAt: Date.now()
                };

                // Create new message
                let newMessage = await MessageModel.model.createNew(newMessageItem);
                // Update group chat
                await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1);

                resolve(newMessage);
            } else {
                let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
                if (!getUserReceiver) {
                    return reject(transErrors.conversation_not_found);
                };

                let receiver = {
                    id: getUserReceiver._id,
                    name: getUserReceiver.username,
                    avatar: getUserReceiver.avatar
                };

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationTypes.PERSONAL,
                    messageType: MessageModel.messageTypes.TEXT,
                    sender: sender,
                    receiver: receiver,
                    text: messageVal,
                    createdAt: Date.now()
                };
                // Create new message
                let newMessage = await MessageModel.model.createNew(newMessageItem);
                // Update contact
                await ContactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);

                resolve(newMessage);
            }
        } catch (error) {
            reject(error)
        }
    });
};

/**
 * add new message image
 * @param {object} sender 
 * @param {string} receiverId 
 * @param {file} messageVal 
 * @param {boolean} isChatGroup 
 */
let addNewImage = (sender, receiverId, messageVal, isChatGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (isChatGroup) {
                let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
                if (!getChatGroupReceiver) {
                    return reject(transErrors.conversation_not_found);
                };

                let receiver = {
                    id: getChatGroupReceiver._id,
                    name: getChatGroupReceiver.name,
                    avatar: app.general_avatar_group_chat
                };

                let imageBuffer = await fsExtra.readFile(messageVal.path);
                let imageContentType = messageVal.mimetype;
                let imageName = messageVal.originalname;

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationTypes.GROUP,
                    messageType: MessageModel.messageTypes.IMAGE,
                    sender: sender,
                    receiver: receiver,
                    file: {data: imageBuffer, contentType: imageContentType, fileName: imageName},
                    createdAt: Date.now()
                };

                // Create new message
                let newMessage = await MessageModel.model.createNew(newMessageItem);
                // Update group chat
                await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1);

                resolve(newMessage);
            } else {
                let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
                if (!getUserReceiver) {
                    return reject(transErrors.conversation_not_found);
                };

                let receiver = {
                    id: getUserReceiver._id,
                    name: getUserReceiver.username,
                    avatar: getUserReceiver.avatar
                };

                let imageBuffer = await fsExtra.readFile(messageVal.path);
                let imageContentType = messageVal.mimetype;
                let imageName = messageVal.originalname;

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationTypes.PERSONAL,
                    messageType: MessageModel.messageTypes.IMAGE,
                    sender: sender,
                    receiver: receiver,
                    file: {data: imageBuffer, contentType: imageContentType, fileName: imageName},
                    createdAt: Date.now()
                };
                // Create new message
                let newMessage = await MessageModel.model.createNew(newMessageItem);
                // Update contact
                await ContactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);

                resolve(newMessage);
            }
        } catch (error) {
            reject(error)
        }
    });
};

/**
 * add new message attachment
 * @param {object} sender 
 * @param {string} receiverId 
 * @param {file} messageVal 
 * @param {boolean} isChatGroup 
 */
let addNewAttachment = (sender, receiverId, messageVal, isChatGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (isChatGroup) {
                let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
                if (!getChatGroupReceiver) {
                    return reject(transErrors.conversation_not_found);
                };

                let receiver = {
                    id: getChatGroupReceiver._id,
                    name: getChatGroupReceiver.name,
                    avatar: app.general_avatar_group_chat
                };

                let attachmentBuffer = await fsExtra.readFile(messageVal.path);
                let attachmentContentType = messageVal.mimetype;
                let attachmentName = messageVal.originalname;

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationTypes.GROUP,
                    messageType: MessageModel.messageTypes.FILE,
                    sender: sender,
                    receiver: receiver,
                    file: {data: attachmentBuffer, contentType: attachmentContentType, fileName: attachmentName},
                    createdAt: Date.now()
                };

                // Create new message
                let newMessage = await MessageModel.model.createNew(newMessageItem);
                // Update group chat
                await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1);

                resolve(newMessage);
            } else {
                let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
                if (!getUserReceiver) {
                    return reject(transErrors.conversation_not_found);
                };

                let receiver = {
                    id: getUserReceiver._id,
                    name: getUserReceiver.username,
                    avatar: getUserReceiver.avatar
                };

                let attachmentBuffer = await fsExtra.readFile(messageVal.path);
                let attachmentContentType = messageVal.mimetype;
                let attachmentName = messageVal.originalname;

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationTypes.PERSONAL,
                    messageType: MessageModel.messageTypes.FILE,
                    sender: sender,
                    receiver: receiver,
                    file: {data: attachmentBuffer, contentType: attachmentContentType, fileName: attachmentName},
                    createdAt: Date.now()
                };
                // Create new message
                let newMessage = await MessageModel.model.createNew(newMessageItem);
                // Update contact
                await ContactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);

                resolve(newMessage);
            }
        } catch (error) {
            reject(error)
        }
    });
};

/**
 * Read more personal and group chat
 * @param {string} currentUserId 
 * @param {number} skipPersonal 
 * @param {number} skipGroup 
 */
let readMoreAllChat = (currentUserId, skipPersonal, skipGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Handle skip personal chat
            let contacts = await ContactModel.readMoreContacts(currentUserId, skipPersonal, LIMIT_CONVERSATIONS_TAKEN);
            let userConversationsPromise = contacts.map( async (contact) => {
                if (contact.contactId == currentUserId) {
                    let getUserContact = await UserModel.getNormalUserDataById(contact.userId);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                } else {
                    let getUserContact = await UserModel.getNormalUserDataById(contact.contactId);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                }
            });
            let userConversations = await Promise.all(userConversationsPromise);
            
            // Handle skip group chat
            let groupConversations = await ChatGroupModel.readMoreChatGroup(currentUserId, skipGroup, LIMIT_CONVERSATIONS_TAKEN);
            
            let allConversations = userConversations.concat(groupConversations);
            
            allConversations = _.sortBy(allConversations, (item) => {
                return -item.updatedAt;
            });

            // Get messages to apply in screen chat
            let allConversationWithMessagesPromise = allConversations.map(async (conversation) => {
                conversation = conversation.toObject();
                if (conversation.members) {
                    let getMessages = await MessageModel.model.getMessagesInGroup(conversation._id, LIMIT_MESSAGES_TAKEN);
                    conversation.messages = _.reverse(getMessages);
                } else {
                    let getMessages = await MessageModel.model.getMessagesInPersonal(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);
                    conversation.messages = _.reverse(getMessages);
                }
                
                return conversation;
            });

            let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);
            // sort by updatedAt desending
            allConversationWithMessages = _.sortBy(allConversationWithMessages, (item) => {
                return -item.updatedAt;
            });
            
            resolve(allConversationWithMessages);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Read more message
 * @param {string} currentUserId 
 * @param {number} skipMessage 
 * @param {string} targetId 
 * @param {boolean} chatInGroup
 */
let readMoreMessage = (currentUserId, skipMessage, targetId, chatInGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            // message in group
            if (chatInGroup) {
                let getMessages = await MessageModel.model.readMoreMessagesInGroup(targetId, skipMessage, LIMIT_MESSAGES_TAKEN);
                getMessages= _.reverse(getMessages);
                return resolve(getMessages);
            }

            // message in personal
            let getMessages = await MessageModel.model.readMoreMessagesInPersonal(currentUserId, targetId, skipMessage, LIMIT_MESSAGES_TAKEN);
            getMessages = _.reverse(getMessages);

            return resolve(getMessages);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    getAllConversationItems: getAllConversationItems,
    addNewTextEmoji: addNewTextEmoji,
    addNewImage: addNewImage,
    addNewAttachment: addNewAttachment,
    readMoreAllChat: readMoreAllChat,
    readMoreMessage: readMoreMessage
};
