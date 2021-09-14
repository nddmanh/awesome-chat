export const transValidation = {
    email_incorrect: "Email phải có dạng example@abc.com",
    gender_incorrect: "Sai giới tính",
    password_incorrect: "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt.",
    passsword_confirmation_incorrect: "Mật khẩu nhập lại không khớp",
    update_username: "Username giới hạn trong khoảng 3 - 17 ký tự và không được phép chứa những ký tự đặc biệt.",
    update_gender: "Oops! Dữ liệu giới tính có vấn đề, đừng có nghịch ngợm nhé!",
    update_address: "Địa chỉ giới hạn trong khoảng 3-30 ký tự.",
    update_phone: "Số điện thoại bắt đầu bằng số 0 và chỉ có 10 ký tự.",
    keyword_find_user: "Tên người dùng không chứa những ký tự đặc biệt.",
    message_text_emoji_incorrect: "Tin nhắn không hợp lệ. Đảm bảo tối thiểu 1 ký tự, tối đa 400 ký tự.",
    add_new_group_users_incorrect: "Một nhóm chat có tối thiểu 3 thành viên.",
    add_new_group_name_incorrect: "Tên cuộc trò chuyện giới hạn từ 5 đến 25 ký tự và không chứa các ký tự đặc biệt.",
};

export const transErrors = {
    account_in_use: "Email này đã được sử dụng.",
    account_removed: "Email này đã bị xóa.",
    account_not_active: "Email này chưa được kích hoạt.",
    account_undefined: "Tài khoản này không tồn tại.",
    token_undefined: "Token không tồn tại",
    login_failed: "Sai tài khoản hoặc mật khẩu!",
    server_error: "Server đang bị lỗi, thử lại sau.",
    avatar_type: "Kiếu file không hợp lệ, chỉ chấp nhận jpg & png.",
    avatar_size: "Ảnh upload tối đa là 1MB.",
    user_current_password_failed: "Mật khẩu hiện tại không chính xác.",
    conversation_not_found: "Cuộc trò chuyện không tồn tại",
    image_message_type: "Kiếu file không hợp lệ, chỉ chấp nhận jpg & png.",
    image_message_size: "Ảnh upload tối đa là 1MB.",
    attachment_message_size: "File tối đa là 1MB.",
};

export const transSuccess = {
    userCreated: (userEmail) => {
        return `Tài khoản <strong>${userEmail}</strong> đã được tạo, vui lòng kiểm tra lại Email của bạn để active tài khoản trước khi đăng nhập`;
    },
    account_actived: "Kích hoạt tài khoản thành công, bạn đã có thể đăng nhập vào ứng dụng.",
    loginSuccess: (username) => {
        return `Xin chào ${username}, chúc bạn một ngày tốt lành! `
    },
    logout_success: "Đăng xuất tài khoản thành công.",
    user_info_updated: "Cập nhật thông tin người dùng thành công.",
    user_password_update: "Cập nhật mật khẩu thành công!",
};

export const transMail = {
    subject: "Awesome Chat by @nddmanh: Xác nhận kích hoạt tài khoản.",
    template: (linkVerify) => {
        return `
            <h2> Bạn nhận được Email này vì đã đăng ký tài khoản trên Awesome chat </h2>
            <h3> Vui lòng click vào link bên dưới để xác nhận kích hoạt tài khoản </h3>
            <h3> ${linkVerify} </h3>
            <h4> Nếu cảm thấy email này nhầm lẫn, hãy bỏ qua nó. Trân trọng! </h4>
        `;
    },
    send_failed: "Xảy ra lỗi trong quá trình gửi Email. Vui lòng liên hệ với @nddmanh để được hỗ trợ."
};