$(document).ready(function () {
    $("#link-read-more-all-chat").bind("click", function (e) {
        let skipPersonal = $("#all-chat").find("li:not(.group-chat)").length;
        let skipGroup = $("#all-chat").find("li.group-chat").length;
        console.log(skipGroup);
        console.log(skipPersonal);

        $("#link-read-more-all-chat").css("display", "none");
        $(".read-more-all-chat-loader").css("display", "inline-block");

        setTimeout(() => {
            $.get(`/message/read-more-all-chat?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}`, function (data) {
                if (data.leftSideData.trim() === "") {
                    alertify.notify("Bạn không còn cuộc trò chuyện nào để xem.", "error", 7);
                    return false;
                }

                // Step 01: Handle leftSide
                $("#all-chat").find("ul").append(data.leftSideData);

                // Step 02: Handle scroll left
                resizeNiceScrollLeft();
                niceScrollLeft();

                // Step 03: handle rightSide
                $("#screen-chat").append(data.rightSideData);

                // Step 04: Call function changeScreenChat
                changeScreenChat();

                // Step 05: Convert Emoiji
                convertEmoji();

                // Step 06: Handle imageModal
                $("body").append(data.imageModalData);

                // Step 07: Call function gridPhotos
                gridPhotos(5); 

                // Step 08: Handle attachmentModal
                $("body").append(data.attachmentModalData);

                // Step 09: Update online
                socket.emit("check-status");

                // Step 10: Remove loading
                $("#link-read-more-all-chat").css("display", "inline-block");
                $(".read-more-all-chat-loader").css("display", "none");

                // Step 11: Call readMoreMessage
                readMoreMessage();

                // Extra
                zoomImageChat();
                userTalk();
            });
        }, 1000);
        
    });
});