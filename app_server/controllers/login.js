/* Vrni stran s podrobnostmi */
var prijava = (req, res) => {
    res.render("prijava", {layout: 'layoutlogin',title:"Prijava"});
};
var registracija = (req, res) => {
    res.render("registracija", {layout: 'layoutlogin',title:"Registracija"});
};
var pozabljenogeslo = (req, res) => {
    res.render("pozabljenogeslo", {layout: 'layoutlogin'});
};
var pozabljenogeslo2 = (req, res) => {
    res.render("pozabljenoGeslo2", {
        layout: 'layoutlogin',
        idKoda:req.params.idUporabnika
    } );
};
var splosnipogoji = (req, res) => {
    res.render('index', {
        layout: 'layoutlogin',
        title: 'Splošni pogoji',
        vnesi: 'Splošni pogoji poslovanja in uporabe spletne strani Slogodki.si so sestavljeni v skladu z Zakonom o varstvu potrošnikov (ZVPot), Zakonom o varstvu osebnih podatkov (ZVOP-1) ter Zakonom o elektronskem poslovanju na trgu (ZEPT)'
    });
};

module.exports = {
    prijava,
    registracija,
    pozabljenogeslo,
    splosnipogoji,
    pozabljenogeslo2
};
