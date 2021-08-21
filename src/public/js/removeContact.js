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
                        // sau nay lam chuc nang o phan chat thi xoa tiep user o phan chat
    
                        decreaseNumberNotiContact('count-contacts'); // js/calculateNotifContact.js
            
                        socket.emit("remove-contact", {contactId: targetId});
                    }
                }
            });
        });

        
    });
}

socket.on("response-remove-contact", function (user) {
    $("#contacts").find(`ul li[data-uid = ${user.id}]`).remove();
    // sau nay lam chuc nang o phan chat thi xoa tiep user o phan chat

    decreaseNumberNotiContact('count-contacts'); // js/calculateNotifContact.js
});

$(document).ready(function () {
    removeContact();
});