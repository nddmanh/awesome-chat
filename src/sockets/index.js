import addNewContact from "./contact/addNewContact";

/**
 * 
 * @param io from socket.io lbrary
 */
let initSockets = (io) => {
    addNewContact(io);
}

module.exports = initSockets;