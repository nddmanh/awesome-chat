function removeContact() {
    $(".user-remove-contact").unbind("click").on("click", function () {
        let targetId = $(this).data("uid");
        let username = $(this).parent().find("div.user-name p").text();

        Swal.fire({
            title: `Bạn có chắc chắn muốn xóa ${username} ra khỏi danh bạ?`,
            text: "Bạn sẽ không thể hoàn tác lại quá trình này",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2ECC71",
            cancelButtonColor: "#FF7675",
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (!result.value) {
                return false;
            }
            $.ajax({
                type: "delete",
                url: "/contact/remove-contact",
                data: {uid: targetId},
                success: function (data) {
                    if (data.success) {
                        $("#contacts").find(`ul li[data-uid = ${targetId}]`).remove();
                        decreaseNumberNotiContact('count-contacts'); // js/calculateNotifContact.js
            
                        socket.emit("remove-contact", {contactId: targetId});

                        // All stepd handle chat after remove contact
                        // Step 0: Check active
                        let checkActive = $("#all-chat").find(`li[data-chat = ${targetId}]`).hasClass("active");

                        // Step 01: remove leftSide.ejs
                        $("#all-chat").find(`ul a[href = "#uid_${targetId}"]`).remove();
                        $("#user-chat").find(`ul a[href = "#uid_${targetId}"]`).remove();

                        // Step 02: remove rightSide.ejs
                        $("#screen-chat").find(`div#to_${targetId}`).remove();

                        // Step 03: remove imageModal
                        $("body").find(`div#imagesModal_${targetId}`).remove();

                        // Step 04: remove attachmentModal
                        $("body").find(`div#attachmentsModal_${targetId}`).remove();

                        // Step 05: click first conversation
                        if (checkActive) {
                            $("ul.people").find("a")[0].click();
                        }
                    }
                }
            });
        });

        
    });
}

socket.on("response-remove-contact", function (user) {
    $("#contacts").find(`ul li[data-uid = ${user.id}]`).remove();
    decreaseNumberNotiContact('count-contacts'); // js/calculateNotifContact.js

    // All stepd handle chat after remove contact
    // Step 0: Check active
    let checkActive = $("#all-chat").find(`li[data-chat = ${user.id}]`).hasClass("active");
    
    // Step 01: remove leftSide.ejs
    $("#all-chat").find(`ul a[href = "#uid_${user.id}"]`).remove();
    $("#user-chat").find(`ul a[href = "#uid_${user.id}"]`).remove();

    // Step 02: remove rightSide.ejs
    $("#screen-chat").find(`div#to_${user.id}`).remove();

    // Step 03: remove imageModal
    $("body").find(`div#imagesModal_${user.id}`).remove();

    // Step 04: remove attachmentModal
    $("body").find(`div#attachmentsModal_${user.id}`).remove();
    
    // Step 05: click first conversation
    if (checkActive) {
        $("ul.people").find("a")[0].click();
    }
});

$(document).ready(function () {
    removeContact();
});