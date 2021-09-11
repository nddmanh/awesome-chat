function videoChat(divId) {
    $(`#video-chat-${divId}`).unbind("click").on("click", function() {
        let targetId = $(this).data("chat");
        let callerName = $("#navbar-username").text();

        let dataToEmit = {
            listenerId: targetId,
            callerName: callerName
        };

        // Step 01 of caller
        socket.emit("caller-check-listener-online-or-not", dataToEmit);
    });
}

$(document).ready(function () {
    // Step 02 of caller
    socket.on("sever-send-listener-is-offline", function () {
        alertify.notify("Người dùng không online.", "error", 7);
    });
    
    let getPeerId = "";
    const peer = new Peer();
    peer.on("open", function (peerId) {
        getPeerId = peerId
    })
    // Step 03 of listener
    socket.on("server-request-peer-id-of-listener", function (response) {
        let listenerName = $("#navbar-username").text();
        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerName: listenerName,
            listenerPeerId: getPeerId
        };
    
        // Step 04 of listener
        socket.emit("listener-emit-peer-id-tp-server", dataToEmit);
    });
    
    // Step 05 of caller
    socket.on("server-send-peer-id-of-listener-to-caller", function (response) {
        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerName: response.listenerName,
            listenerPeerId: response.listenerPeerId
        };
    
        // Step 06 of caller
        socket.emit("caller-request-call-to-server", dataToEmit);

        let timerInterval;
        Swal.fire({
            title: `Đang gọi cho <b style="color: #2ecc71">${response.listenerName}</b> &nbsp; <i class="fa fa-volume-control-phone"></i>`,
            html: 
                `Thời gian: <b style="color: #d43f3a"></b> giây. <br/> <br/>
                <audio loop style=display:none;" id='call_recordings' controls autoplay='autoplay'>" + '<source src="audio/callerMusic.mp3" type="audio/mpeg">' + "</audio>
                <button id="btn-cancel-call" class="btn btn-danger">
                    Hủy cuộc gọi
                </button>`,
            backdrop: "rgba(85, 85, 85, 0.4)",
            width: "52 rem",
            allowOutsideClick: false,
            timer: 60000,
            didOpen: () => {
                $("#btn-cancel-call").unbind("click").on("click", function () {
                    Swal.close();
                    clearInterval(timerInterval);

                    // Step 07 of caller
                    socket.emit("caller-cancel-request-call-to-server", dataToEmit);
                });

                Swal.showLoading()
                timerInterval = setInterval(() => {
                    const content = Swal.getHtmlContainer()
                    if (content) {
                        const b = content.querySelector("b")
                        if (b) {
                            b.textContent = Math.ceil(Swal.getTimerLeft() / 1000) ;
                        }
                    }
                }, 100)

                // Step 12 of caller
                socket.on("server-send-reject-call-to-caller", function(response) {
                    Swal.close();
                    clearInterval(timerInterval);

                    Swal.fire({
                        type: "info",
                        title: ` <b style="color: #2ecc71">${response.listenerName}</b> từ chối cuộc gọi.`,
                        backdrop: "rgba(85, 85, 85, 0.4)",
                        width: "52 rem",
                        allowOutsideClick: false,
                        confirmButtonColor: "#2ECC71",
                        confirmButtonText: "Xác nhận",
                    });
                });

                // Step 13 of caller
                socket.on("server-send-accept-call-to-caller", function(response) {
                    Swal.close();
                    clearInterval(timerInterval);
                    console.log("da goi oke");
                });
            },
            willClose: () => {
                clearInterval(timerInterval);
            },
        }).then((result) => {
            return false;
        });
    });

    // Step 08 of listener
    socket.on("server-send-request-call-to-listener", function (response) {
        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerName: response.listenerName,
            listenerPeerId: response.listenerPeerId
        };

        socket.emit("caller-request-call-to-server", dataToEmit);

        let timerInterval;
        Swal.fire({
            title: `<b style="color: #2ecc71">${response.callerName}</b> đang gọi cho bạn &nbsp; <i class="fa fa-volume-control-phone"></i>`,
            html: 
                `Thời gian: <b style="color: #d43f3a"></b> giây. <br/> <br/>
                <audio loop style=display:none;" id='call_recordings' controls autoplay='autoplay'>" + '<source src="audio/listenerMusic.mp3" type="audio/mpeg">' + "</audio>
                <button id="btn-accept-call" class="btn btn-success">
                    Đồng ý
                </button>
                <button id="btn-reject-call" class="btn btn-danger">
                    Từ chối cuộc gọi
                </button>`,
            backdrop: "rgba(85, 85, 85, 0.4)",
            width: "52 rem",
            allowOutsideClick: false,
            timer: 60000,
            didOpen: () => {
                // Step 09 of caller
                socket.on("server-send-cancel-request-call-to-listener", function(response) {
                    Swal.close();
                    clearInterval(timerInterval);
                });

                $("#btn-reject-call").unbind("click").on("click", function () {
                    Swal.close();
                    clearInterval(timerInterval);

                    // Step 10 of listener
                    socket.emit("listener-reject-request-call-to-server", dataToEmit);
                });
                
                $("#btn-accept-call").unbind("click").on("click", function () {
                    Swal.close();
                    clearInterval(timerInterval);

                    // Step 11 of listener
                    socket.emit("listener-accept-request-call-to-server", dataToEmit);
                });

                Swal.showLoading()
                timerInterval = setInterval(() => {
                    const content = Swal.getHtmlContainer()
                    if (content) {
                        const b = content.querySelector("b")
                        if (b) {
                            b.textContent = Math.ceil(Swal.getTimerLeft() / 1000) ;
                        }
                    }
                }, 100);
            },
            didRender: () => {
                // Step 14 of listener
                socket.on("server-send-accept-call-to-listener", function(response) {
                    Swal.close();
                    clearInterval(timerInterval);
                    console.log("da nghe oke");
                });
            },
            willClose: () => {
                clearInterval(timerInterval);
            },
        }).then((result) => {
            return false;
        });
    });


});