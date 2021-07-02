function removeRequestContact() {
    $(".user-remove-request-contact").bind("click", function () {
        let targetId = $(this).data("uid");
        $.ajax({
            type: "delete",
            url: "/contact/remove-request-contact",
            data: {uid: targetId},
            success: function (data) {
                if (data.success) {  
                    $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).hide();
                    $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display", "inline-block");
                    decreaseNumberNotiContact("count-request-contact-sent");

                    socket.emit("remove-request-contact", {contactId: targetId});

                }
            }
        });
    });
}

socket.on("response-remove-request-contact", function (user) {
    $(".noti_content").find(`div[data-uid="${user.id}"]`).remove();  // popup notification
    $("ul.list-notifications").find(`li>div[data-uid="${user.id}"]`).parent().remove();  // Modal notificaiton
    // Xoa o modal yeu cua ket ban
    
    decreaseNumberNotiContact("count-request-contact-received");
    
    decreaseNumberNotification("noti_contact_counter");
    decreaseNumberNotification("noti_counter");
});