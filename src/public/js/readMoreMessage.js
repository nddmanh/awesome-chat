function readMoreMessage() {
    $(".right .chat").scroll(function () {
        // get the first message
        let firstMessage = $(this).find(".bubble:first");
        // get position of first message
        let currentOffset = firstMessage.offset().top - $(this).scrollTop();

        if ($(this).scrollTop() === 0) {
            let messageLoading = `<img src="images/chat/message-loading.gif" class="message-loading" />`;
            $(this).prepend(messageLoading);

            let targetId = $(this).data("chat");
            let skipMessage = $(this).find("div.bubble").length;
            let chatInGroup = $(this).hasClass("chat-in-group") ? true : false;

            let thisDom = $(this);
            $.get(`/message/read-more-message?skipMessage=${skipMessage}&targetId=${targetId}&chatInGroup=${chatInGroup}`, function(data) {
                if (data.rightSideData.trim() === "") {
                    setTimeout(() => {
                        alertify.notify("Bạn không còn tin nhắn nào để xem.", "error", 7);
                        thisDom.find("img.message-loading").remove();
                    }, 500);
                    return false;
                }

                // Step 01: Handle rightSide
                $(`.right .chat[data-chat=${targetId}]`).prepend(data.rightSideData);

                // Step 02: Prevent scroll
                $(`.right .chat[data-chat=${targetId}]`).scrollTop(firstMessage.offset().top - currentOffset);

                // Step 03: Convert emoji
                convertEmoji();

                // Step 04: Handle imageModal
                $(`#imageModal_${targetId}`).find("div.all-images").append(data.imageModalData);

                // Step 05: Call function gridPhotos
                gridPhotos(5);

                // Step 06: Handle attachmentModal
                $(`#attachmentsModal_${targetId}`).find("ul.list-attachments").append(data.attachmentModalData);

                // Step 07: Remove message loading
                thisDom.find("img.message-loading").remove();
            });
        }
    });
}

$(document).ready(function () {
    readMoreMessage();
});