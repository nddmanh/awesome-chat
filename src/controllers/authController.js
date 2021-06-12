let getLoginRegister =  (req, res) => {
    return res.render("auth/master");
};

let getLogout =  (req, res) => {
    // return res.render("main/master");
};

module.exports = {
    getLoginRegister: getLoginRegister,
    getLogout: getLogout,
};