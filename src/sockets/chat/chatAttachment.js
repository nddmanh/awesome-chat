import {pushSocketToArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper";
/**
 * 
 * @param io from socket.io lbrary
 */

let chatAttachment = (io) => {
    let clients = {};
    io.on("connection", (socket) => {
        clients = pushSocketToArray(clients, socket.request.user._id, socket.id );
        socket.request.user.chatGroupIds.forEach(group => {
            clients = pushSocketToArray(clients, group._id, socket.id );
        });

        // When has new group chat
        socket.on("new-group-created", (data) => {
            clients = pushSocketToArray(clients, data.groupChat._id, socket.id );
        });
        socket.on("member-received-group-chat", (data) => {
            clients = pushSocketToArray(clients, data.groupChatId, socket.id );
        });

        socket.on("chat-attachment", (data) => {
            if (data.groupId) {
                let response = {
                    currentGroupId: data.groupId,
                    currentUserId: socket.request.user._id,
                    message: data.message
                };
                if (clients[data.groupId]) {
                    emitNotifyToArray(clients, data.groupId, socket, "response-chat-attachment", response);
                }
            }
            if (data.contactId) {
                let response = {
                    currentUserId: socket.request.user._id,
                    message: data.message
                };
                if (clients[data.contactId]) {
                    emitNotifyToArray(clients, data.contactId, socket, "response-chat-attachment", response);
                }
            }
        });

        socket.on("disconnect", () => {
            clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
            socket.request.user.chatGroupIds.forEach(group => {
                clients = removeSocketIdFromArray(clients, group._id, socket);
            });
        });
    });
}

module.exports = chatAttachment;