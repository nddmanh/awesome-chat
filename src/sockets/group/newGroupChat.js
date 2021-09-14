import {pushSocketToArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper";
/**
 * @param io from socket.io lbrary
 */

let newGroupChat = (io) => {
    let clients = {};
    io.on("connection", (socket) => {
        clients = pushSocketToArray(clients, socket.request.user._id, socket.id );
        socket.request.user.chatGroupIds.forEach(group => {
            clients = pushSocketToArray(clients, group._id, socket.id );
        });

        socket.on("new-group-created", (data) => {
            clients = pushSocketToArray(clients, data.groupChat._id, socket.id );

            let response = {
                groupChat: data.groupChat
            };

            data.groupChat.members.forEach(member => {
                if(clients[member.userId] && member.userId != socket.request.user._id) {
                    emitNotifyToArray(clients, member.userId, socket, "response-new-group-created", response);
                }
            });
        });

        socket.on("member-received-group-chat", (data) => {
            clients = pushSocketToArray(clients, data.groupChatId, socket.id );
        });

        socket.on("disconnect", () => {
            clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
            socket.request.user.chatGroupIds.forEach(group => {
                clients = removeSocketIdFromArray(clients, group._id, socket);
            });
        });
    });
}

module.exports = newGroupChat;