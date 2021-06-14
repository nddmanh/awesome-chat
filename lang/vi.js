export const transValidation = {
    email_incorrect: "Email phai co dang example@abc.com",
    gender_incorrect: "Sai gioi tinh",
    password_incorrect: "Mat khau phai chua it nhat 8 ky tu, bao gom chu hoa, chu thuong, chu so va ky tu dac biet",
    passsword_confirmation_incorrect: "Mat khau nhap lai khong khop"
};

export const transErrors = {
    account_in_use: "Email nay da duoc su dung.",
    account_removed: "Email nay da bi xoa.",
    account_not_active: "Email nay chua duoc kich hoat."
};

export const transSuccess = {
    userCreated: (userEmail) => {
        return `Tai khoan <strong>${userEmail}</strong> da duoc tao, vui long kiem tra lai Email cua ban de active tai khoan truoc khi dang nhap`;
    }
};