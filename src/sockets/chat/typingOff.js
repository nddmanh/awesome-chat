import {pushSocketToArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper";
/**
 * 
 * @param io from socket.io lbrary
 */

let typingOff = (io) => {
    let clients = {};
    io.on("connection", (socket) => {
        clients = pushSocketToArray(clients, socket.request.user._id, socket.id );
        socket.request.user.chatGroupIds.forEach(group => {
            clients = pushSocketToArray(clients, group._id, socket.id );
        });

        socket.on("user-is-not-typing", (data) => {
            if (data.groupId) {
                let response = {
                    currentGroupId: data.groupId,
                    currentUserId: socket.request.user._id
                };
                if (clients[data.groupId]) {
                    emitNotifyToArray(clients, data.groupId, socket, "response-user-is-not-typing", response);
                }
            }
            if (data.contactId) {
                let response = {
                    currentUserId: socket.request.user._id
                };
                if (clients[data.contactId]) {
                    emitNotifyToArray(clients, data.contactId, socket, "response-user-is-not-typing", response);
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

module.exports = typingOff;