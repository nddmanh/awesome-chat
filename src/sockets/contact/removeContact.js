import { pushSocketToArray, emitNotifyToArray, removeSocketIdFromArray } from "../../helpers/socketHelper";

/**
 * @param io from socket.io lbrary
 */

 let removeContact = (io) => {
    let clients = {};
    io.on("connection", (socket) => {
        clients = pushSocketToArray(clients, socket.request.user._id, socket.id );

        socket.on("remove-contact", (data) => {
            let currentUser = {
                id: socket.request.user._id,
            };

            if (clients[data.contactId]) {
                emitNotifyToArray(clients, data.contactId, socket, "response-remove-contact", currentUser);
            }
        });

        socket.on("disconnect", () => {
            clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
        });
    });
}

module.exports = removeContact;