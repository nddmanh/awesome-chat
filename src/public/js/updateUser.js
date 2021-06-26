let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};
let userUpdatePassword = {};

function callLogout() {
    let timerInterval;
    Swal.fire({
        position: "top-end",
        title: "Tự động đăng xuất sau 5 giây!",
        html: "Thời gian: <b></b>",
        timer: 5000,
        didOpen: () => {
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
        },
        willClose: () => {
            clearInterval(timerInterval);
        },
    }).then((result) => {
        $.get("/logout", function () {
            location.reload();
        })
    });
}

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
        let username = $(this).val();
        let regexUsername = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/)

        if (!regexUsername.test(username) || username.length < 3 || username.length > 17 ) {
            alertify.notify("Username giới hạn trong khoảng 3 - 17 ký tự và không được phép chứa những ký tự đặc biệt.", "error", 7);
            $(this).val((originUserInfo.username));
            delete userInfo.username;
            return false;
        }

        userInfo.username = username;
    });

    $("#input-change-gender-male").bind("click", function (e) {
        let gender = $(this).val();
        
        if (gender !== "male") {
            alertify.notify("Oops! Dữ liệu giới tính có vấn đề, đừng có nghịch ngợm nhé!", "error", 7);
            $(this).val((originUserInfo.gender));
            delete userInfo.gender;
            return false;
        }

        userInfo.gender = gender;
    });
    
    $("#input-change-gender-female").bind("click", function (e) {
        let gender = $(this).val();
        
        if (gender !== "female") {
            alertify.notify("Oops! Dữ liệu giới tính có vấn đề, đừng có nghịch ngợm nhé!", "error", 7);
            $(this).val((originUserInfo.gender));
            delete userInfo.gender;
            return false;
        }

        userInfo.gender = gender;
    });

    $("#input-change-address").bind("change", function (e) {
        let address = $(this).val();

        if (address.length < 3 || address.length > 30) {
            alertify.notify("Địa chỉ giới hạn trong khoảng 3-30 ký tự.", "error", 7);
            $(this).val((originUserInfo.address));
            delete userInfo.address;
            return false;
        }

        userInfo.address = address;
    });

    $("#input-change-phone").bind("change", function (e) {
        let phone = $(this).val();
        let regexPhone = new RegExp(/^(0)[0-9]{9}$/);

        if (!regexPhone.test(phone)) {
            alertify.notify("Số điện thoại bắt đầu bằng số 0 và chỉ có 10 ký tự.", "error", 7);
            $(this).val((originUserInfo.phone));
            delete userInfo.phone;
            return false;
        }

        userInfo.phone = phone;
    });

    $("#input-change-current-password").bind("change", function (e) {
        let currentPassword = $(this).val();
        let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);

        if (!regexPassword.test(currentPassword)) {
            alertify.notify("Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt.", "error", 7);
            $(this).val((null));
            delete userUpdatePassword.currentPassword;
            return false;
        }

        userUpdatePassword.currentPassword = currentPassword;
    });

    $("#input-change-new-password").bind("change", function (e) {
        let newPassword = $(this).val();
        let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);

        if (!regexPassword.test(newPassword)) {
            alertify.notify("Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt.", "error", 7);
            $(this).val((null));
            delete userUpdatePassword.newPassword;
            return false;
        }

        userUpdatePassword.newPassword = newPassword;
    });
    
    $("#input-change-confirm-new-password").bind("change", function (e) {
        let confirmNewPassword = $(this).val();

        if (!userUpdatePassword.newPassword) {
            alertify.notify("Bạn chưa nhập mật khẩu mới.", "error", 7);
            $(this).val((null));
            delete userUpdatePassword.confirmNewPassword;
            return false;
        }

        if (confirmNewPassword !== userUpdatePassword.newPassword) {
            alertify.notify("Mật khẩu nhập lại chưa chính xác.", "error", 7);
            $(this).val((null));
            delete userUpdatePassword.confirmNewPassword;
            return false;
        }

        userUpdatePassword.confirmNewPassword = confirmNewPassword;
    });
}

function callUpdateUserAvatar() {
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
}

function callUpdateUserInfo() {
    $.ajax({
        type: "put",
        url: "/user/update-info",
        data: userInfo,
        success: function (result) {
            console.log(result);
            //Display Success
            $(".user-modal-alert-success").find("span").text(result.message);
            $(".user-modal-alert-success").css("display", "block");

            // update originUserInfo
            originUserInfo = Object.assign(originUserInfo, userInfo);

            // update username at navbar
            $('#navbar-username').text(originUserInfo.username);

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
}

function callUpdateUserPassword() { 
    $.ajax({
        type: "put",
        url: "/user/update-password",
        data: userUpdatePassword,
        success: function (result) {
            console.log(result);
            //Display Success
            $(".user-modal-password-alert-success").find("span").text(result.message);
            $(".user-modal-password-alert-success").css("display", "block");

            // reset all
            $("#input-btn-cancel-update-user-password").click();

            // Loggout after change password success
            callLogout();
        },
        error: function (error) {
            //Display Error
            $(".user-modal-password-alert-error").find("span").text(error.responseText);
            $(".user-modal-password-alert-error").css("display", "block");

            // reset all
            $("#input-btn-cancel-update-user-password").click();
        },
    });
}


$(document).ready(function () {
    originAvatarSrc = $("#user-modal-avatar").attr("src");
    originUserInfo = {
        username: $("#input-change-username").val(),
        gender: ($("#input-change-gender-male").is(":checked")) ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val(),
        address: $("#input-change-address").val(),
        phone: $("#input-change-phone").val(),
    };
    
    // update userInfo after change value to update
    updateUserInfo();

    $("#input-btn-update-user").bind("click", function (e) {
        if ($.isEmptyObject(userInfo) && !userAvatar) {
            alertify.notify( "Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu.", "error", 7);
            return false;
        }
        if (userAvatar) {
            callUpdateUserAvatar();
        }
        if (!$.isEmptyObject(userInfo)) {
            callUpdateUserInfo();
        }

    });
    
    $("#input-btn-cancel-update-user").bind("click", function (e) {
        userAvatar = null;
        userInfo = {};
        $("#input-change-avatar").val(null);
        $("#user-modal-avatar").attr("src", originAvatarSrc);

        $("#input-change-username").val(originUserInfo.username);
        (originUserInfo.gender === "male") ? $("#input-change-gender-male").click() : $("#input-change-gender-female").click();
        $("#input-change-address").val(originUserInfo.address);
        $("#input-change-phone").val(originUserInfo.phone);
    });

    $("#input-btn-update-user-password").bind("click", function (e) {
        if (!userUpdatePassword.currentPassword || !userUpdatePassword.newPassword || !userUpdatePassword.confirmNewPassword ) {
            alertify.notify("Bạn phải nhập đầy dủ thông tin.", "error", 7);
            return false;
        }

        Swal.fire({
            title: "Bạn có chắc chắn thay đổi mật khẩu?",
            text: "Bạn sẽ không thể hoàn tác lại quá trình này",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#2ECC71",
            cancelButtonColor: "#FF7675",
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Hủy",
          }).then((result) => {
                if (!result.value) {
                    $("#input-btn-cancel-update-user-password").click();
                return false;
            }
            callUpdateUserPassword();
          });
    });

    $("#input-btn-cancel-update-user-password").bind("click", function (e) {
        userUpdatePassword = {};
        $("#input-change-current-password").val(null);
        $("#input-change-new-password").val(null);
        $("#input-change-confirm-new-password").val(null);
    });

});