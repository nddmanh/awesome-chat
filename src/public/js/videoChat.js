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

function playVideoStream(videoTagId, stream) {
    let video = document.getElementById(videoTagId);
    video.srcObject = stream;
    video.onloadeddata = function () {
        video.play();
    };
}

function closeVideoStream(stream) {
    return stream.getTracks().forEach(track => track.stop());
}

$(document).ready(function () {
    // Step 02 of caller
    socket.on("sever-send-listener-is-offline", function () {
        alertify.notify("Người dùng không online.", "error", 7);
    });
    
    let getPeerId = "";
    const peer = new Peer({
        key: "peerjs",
        host: "peerjs-server-trungquandev.herokuapp.com",
        secure: true,
        port: 443,
        debug: 3
    });
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
    
    let timerInterval;
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

                if (Swal.getHtmlContainer().querySelector !== null) {
                    Swal.showLoading()
                    timerInterval = setInterval(() => {
                        const content = Swal.getHtmlContainer()
                        if (content) {
                            const b = content.querySelector("b")
                            if (b) {
                                b.textContent = Math.ceil(Swal.getTimerLeft() / 1000) ;
                            }
                        }
                    }, 1000);
                }

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

                if (Swal.getHtmlContainer().querySelector !== null) {
                    Swal.showLoading()
                    timerInterval = setInterval(() => {
                        const content = Swal.getHtmlContainer()
                        if (content) {
                            const b = content.querySelector("b")
                            if (b) {
                                b.textContent = Math.ceil(Swal.getTimerLeft() / 1000) ;
                            }
                        }
                    }, 1000);
                }
            },
            willClose: () => {
                clearInterval(timerInterval);
            },
        }).then((result) => {
            return false;
        });
    });

    // Step 13 of caller
    socket.on("server-send-accept-call-to-caller", function(response) {
        console.log("da nhan dc emit nay 1 caller");

        Swal.close();
        clearInterval(timerInterval);
        let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);

        getUserMedia({video: true, audio: true}, function(stream) {
            // Show modal streaming
            $("#streamModal").modal("show");

            // Play video stream in local (of caller)
            playVideoStream("local-stream", stream);

            // Call to listener
            let call = peer.call(response.listenerPeerId, stream);
            
            // listen & play stream of listener
            call.on("stream", function(remoteStream) {
                // Play video stream (of listener)
                playVideoStream("remote-stream", remoteStream);
            });

            // Close modal: remove stream
            $("#streamModal").on("hiden.bs.modal", function () {
                closeVideoStream(stream);
                Swal.fire({
                    type: "info",
                    title: `Đã kết thúc cuộc gọi với  <b style="color: #2ecc71">${response.listenerName}</b>.`,
                    backdrop: "rgba(85, 85, 85, 0.4)",
                    width: "52 rem",
                    allowOutsideClick: false,
                    confirmButtonColor: "#2ECC71",
                    confirmButtonText: "Xác nhận",
                });
            });
        }, function(err) {
                if (err.toString() === "NotAllowedError: Permission denied") {
                    alertify.notify("Ứng dụng không được cấp quyền truy cập camera trên thiết bị của bạn.", "error", 7);
                }
                if (err.toString() === "NotFoundError: Requested device not found") {
                    alertify.notify("Camera không hoạt động.", "error", 7);
                }
        });
    });

    // Step 14 of listener
    socket.on("server-send-accept-call-to-listener", function(response) {
        console.log("da nhan dc emit nay 1");
        Swal.close();
        clearInterval(timerInterval);

        let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);

        peer.on("call", function(call) {
            getUserMedia({video: true, audio: true}, function(stream) {
                // Show modal streaming
                $("#streamModal").modal("show");

                // Play video stream in local (of listener)
                playVideoStream("local-stream", stream);

                call.answer(stream); // Answer the call with an A/V stream.
                call.on("stream", function(remoteStream) {
                    // Play video stream (of caller)
                    playVideoStream("remote-stream", remoteStream);
                });
                // Close modal: remove stream
                $("#streamModal").on("hiden.bs.modal", function () {
                    closeVideoStream(stream);
                    Swal.fire({
                        type: "info",
                        title: `Đã kết thúc cuộc gọi với <b style="color: #2ecc71">${response.callerName}</b>.`,
                        backdrop: "rgba(85, 85, 85, 0.4)",
                        width: "52 rem",
                        allowOutsideClick: false,
                        confirmButtonColor: "#2ECC71",
                        confirmButtonText: "Xác nhận",
                    });
                });
            }, function(err) {
                if (err.toString() === "NotAllowedError: Permission denied") {
                    alertify.notify("Ứng dụng không được cấp quyền truy cập camera trên thiết bị của bạn.", "error", 7);
                }
                if (err.toString() === "NotFoundError: Requested device not found") {
                    alertify.notify("Camera không hoạt động.", "error", 7);
                }
            });
        });
    });
});