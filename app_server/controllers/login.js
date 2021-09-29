/* Vrni stran s podrobnostmi */
var login = (req, res) => {
    res.render("login", {layout: 'layoutlogin',title:"login"});
};
var registration = (req, res) => {
    res.render("registration", {layout: 'layoutlogin',title:"registration"});
};

var termsOfService = (req, res) => {
    res.render('index', {
        layout: 'layoutlogin',
        title: 'Terms of service',
        vnesi: 'There are no terms of service'
    });
};

module.exports = {
    login,
    registration,
    termsOfService,
};
