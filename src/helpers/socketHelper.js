export let pushSocketToArray = (clients, userId, socketId) => {
    if (clients[userId]) {
        clients[userId].push(socketId);
    } else {
        clients[userId] = [socketId];
    }
    return clients;
}
export let emitNotifyToArray = (clients, userId, socket, eventName, data) => {
    clients[userId].forEach( socketId => socket.to(socketId).emit(eventName, data));

}
export let removeSocketIdFromArray = (clients, userId, socket) => {
    clients[userId] = clients[userId].filter( socketId => socketId !== socket.id);
    if (!clients[userId].length) {
        delete clients[userId];
    }
    return clients;
}