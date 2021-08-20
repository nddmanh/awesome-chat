function removeRequestContactReceived() {
    $(".user-remove-request-contact-received").unbind("click").on("click", function () {
        let targetId = $(this).data("uid");
        $.ajax({
            type: "delete",
            url: "/contact/remove-request-contact-received",
            data: {uid: targetId},
            success: function (data) {
                if (data.success) {
                    // Chuc nang nay thuc hien sau
                    // $(".noti_content").find(`div[data-uid="${user.id}"]`).remove();  // popup notification
                    // $("ul.list-notifications").find(`li>div[data-uid="${user.id}"]`).parent().remove();  // Modal notificaiton
                    // decreaseNumberNotification("noti_counter", 1); // js/caculateNotification.js

                    decreaseNumberNotification("noti_contact_counter", 1); // js/caculateNotification.js

                    decreaseNumberNotiContact("count-request-contact-received"); // js/caculateNotifContact.js

                    // Xóa ở Modal tab yêu cầu kết bạn
                    $("#request-contact-received").find(`li[data-uid = ${targetId}]`).remove();

                    socket.emit("remove-request-contact-received", {contactId: targetId});
                }
            }
        });
    });
}

socket.on("response-remove-request-contact-received", function (user) {
    $("#find-user").find(`div.user-remove-request-contact-received[data-uid = ${user.id}]`).hide();
    $("#find-user").find(`div.user-add-new-contact[data-uid = ${user.id}]`).css("display", "inline-block");

    // Xóa ở Modal tab đang chờ xác nhận
    $("#request-contact-sent").find(`li[data-uid = ${user.id}]`).remove();
    
    decreaseNumberNotiContact("count-request-contact-sent");
    
    decreaseNumberNotification("noti_contact_counter", 1); // js/caculateNotification.js
});

$(document).ready(function () {
    removeRequestContactReceived();
});