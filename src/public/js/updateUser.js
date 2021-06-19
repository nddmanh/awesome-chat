let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;

function updateUserInfo() {
    $("#input-change-avatar").bind("change", function() {
        let fileData = $(this).prop("files")[0];
        let math = ["image/png", "image/jpg", "image/jpeg"];
        let limit = 1048576; // byte = 1MB

        if ($.inArray(fileData.type, math) === -1) {
            alertify.notify( "Kiếu file không hợp lệ, chỉ chấp nhận jpg & png.", "error", 7);
            $(this).val(null);
            return false;
        }
        
        if ( fileData.size > limit) {
            alertify.notify( "Ảnh upload tối đa là 1MB.", "error", 7);
            $(this).val(null);
            return false;
        }
        
        if (typeof (FileReader) != "undefined") {
            let imagePreview = $("#image-edit-profile");
            imagePreview.empty();

            let fileReader = new FileReader();
            fileReader.onload = function(element) {
                $("<img>", {
                    "src": element.target.result,
                    "class": "avatar img-circle",
                    "id": "user-modal-avatar",
                    "alt": "avatar"
                }).appendTo(imagePreview);
            }
            imagePreview.show();
            fileReader.readAsDataURL(fileData);

            let formData = new FormData();
            formData.append("avatar", fileData);

            userAvatar = formData;
        } else {
            alertify.notify("Trình duyệt của bạn không hỗ trợ FileReader", "error", 7);
        }
    });

    $("#input-change-username").bind("change", function (e) {
        userInfo.username = $(this).val();
    });

    $("#input-change-gender-male").bind("click", function (e) {
        userInfo.gender = $(this).val();
    });
    
    $("#input-change-gender-female").bind("click", function (e) {
        userInfo.gender = $(this).val();
    });

    $("#input-change-address").bind("change", function (e) {
        userInfo.address = $(this).val();
    });

    $("#input-change-phone").bind("change", function (e) {
        userInfo.phone = $(this).val();
    });

}

$(document).ready(function () {
    updateUserInfo();

    originAvatarSrc = $("#user-modal-avatar").attr("src");
    
    $("#input-btn-update-user").bind("click", function (e) {
        if ($.isEmptyObject(userInfo) && !userAvatar) {
            alertify.notify( "Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu.", "error", 7);
            return false;
        }
        $.ajax({
            type: "put",
            url: "/user/update-avatar",
            cache: false,
            contentType: false,
            processData: false,
            data: userAvatar,
            success: function (result) {
                console.log(result);
                //Display Success
                $(".user-modal-alert-success").find("span").text(result.message);
                $(".user-modal-alert-success").css("display", "block");

                // Update avatar at navbar
                $("#navbar-avatar").attr("src", result.imageSrc);

                // Update origin avatar src
                originAvatarSrc = result.imageSrc;

                // reset all
                $("#input-btn-cancel-update-user").click();
            },
            error: function (error) {
                //Display Error
                $(".user-modal-alert-error").find("span").text(error.responseText);
                $(".user-modal-alert-error").css("display", "block");

                // reset all
                $("#input-btn-cancel-update-user").click();
            },
        });

    });
    
    $("#input-btn-cancel-update-user").bind("click", function (e) {
        userAvatar = null;
        userInfo = {};
        $("#input-change-avatar").val(null);
        $("#user-modal-avatar").attr("src", originAvatarSrc);
    });
});