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
                }
            }
        });
    });
}