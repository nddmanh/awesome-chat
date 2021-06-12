let getLoginRegister =  (req, res) => {
    return res.render("auth/loginRegister");
};

let getLogout =  (req, res) => {
    // return res.render("main/master");
};

module.exports = {
    getLoginRegister: getLoginRegister,
    getLogout: getLogout,
};