export const transValidation = {
    email_incorrect: "Email phai co dang example@abc.com",
    gender_incorrect: "Sai gioi tinh",
    password_incorrect: "Mat khau phai chua it nhat 8 ky tu, bao gom chu hoa, chu thuong, chu so va ky tu dac biet",
    passsword_confirmation_incorrect: "Mat khau nhap lai khong khop"
};

export const transErrors = {
    account_in_use: "Email nay da duoc su dung.",
    account_removed: "Email nay da bi xoa.",
    account_not_active: "Email nay chua duoc kich hoat.",
    token_undefined: "Token khong ton tai",
    login_failed: "Sai tai khoan hoac mat khau!",
    server_error: "Server dang bi loi, thu lai sau.",
};

export const transSuccess = {
    userCreated: (userEmail) => {
        return `Tai khoan <strong>${userEmail}</strong> da duoc tao, vui long kiem tra lai Email cua ban de active tai khoan truoc khi dang nhap`;
    },
    account_actived: "Kich hoat tai khoan thanh cong, ban da co the dang nhap vao ung dung.",
    loginSuccess: (username) => {
        return `Xin chao ${username}, chuc ban mot ngay tot lanh! `
    },
    logout_success: "Dang xuat tai khoan thanh cong.",
};

export const transMail = {
    subject: "Awesome Chat: Xac nhan kich hoat tai khoan.",
    template: (linkVerify) => {
        return `
            <h2> Ban nhan duoc email nay vi da dang ky tai khoan tren ung dung Awesome chat </h2>
            <h3> Vui long click vao lien ket ben duoi de xac nhan kich hoat tai khoan </h3>
            <h3> ${linkVerify} </h3>
            <h4> Neu cam thay email nay nham lan hay bo qua no. Tran trong hehe </h4>
        `;
    },
    send_failed: "Xay ra loi trong qua trinh gui Email. Vui long lien he voi bo phan ky thuat de duoc ho tro."
};