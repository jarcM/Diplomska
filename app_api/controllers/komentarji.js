const mongoose = require('mongoose');
const Dogodek = mongoose.model('Dogodek');
const Uporabnik = mongoose.model('Uporabnik');


var apiParametri = {
    streznik: 'http://localhost:' + (process.env.PORT || 3000)
};
if (process.env.NODE_ENV === 'production') {
    apiParametri.streznik = 'https://dogwalkers12.herokuapp.com/';
}
const axios = require('axios').create({
    baseURL: apiParametri.streznik,
    timeout: 5000
});

const komentarjiKreiraj = (req, res) => {
    const idUporabnika = req.params.idUporabnika;
    if (idUporabnika) {
        Uporabnik
            .findById(idUporabnika)
            .select('komentarji')
            .exec((napaka, uporabnik) => {
                if (napaka) {
                    console.log(napaka);
                    res.status(400).json(napaka);
                } else {
                    dodajKomentar(req, res, uporabnik, req.body);

                }
            });
    } else {
        res.status(400).json({
            "sporočilo":
                "Ne najdem uporabnika, idUporabnika je obvezen parameter."
        });
    }
};



const dodajKomentar = (req, res, uporabnik) => {
    if (!uporabnik) {
        res.status(404).json({"sporočilo": "Ne najdem dogodka."});
    } else {
        uporabnik.komentarji.push({
            vsebina: req.body.vsebina,
            ocena: req.body.ocena

        });
        uporabnik.save((napaka, uporabnik) => {
            if (napaka) {
                res.status(400).json(napaka);
            } else {
                posodobiPovprecnoOceno(uporabnik);
                const dodaniKomentar = uporabnik.komentarji.slice(-1).pop();
                res.status(201).json(dodaniKomentar);
            }
        });
    }
};

const posodobiPovprecnoOceno = (idUporabnika) => {
    Uporabnik
        .findById(idUporabnika)
        .select('ocena komentarji skupnaOcena')
        .exec((napaka, uporabnik) => {
            if (!napaka)
                izracunajPovprecnoOceno(uporabnik);
        });
};

const izracunajPovprecnoOceno = (uporabnik) => {
    if (uporabnik.komentarji && uporabnik.komentarji.length >= 0) {
        const steviloKomentarjev = uporabnik.komentarji.length;
        const skupnaOcena = uporabnik.komentarji.reduce((vsota, {ocena}) => {
            return vsota + ocena;
        }, 0);
        var ocena = skupnaOcena / steviloKomentarjev;
        uporabnik.ocena = ocena;
        const elo=1/uporabnik.komentarji.length*3
        const elo2=ocena*elo*420/69
        uporabnik.skupnaOcena=Math.ceil(uporabnik.skupnaOcena) + Math.ceil(elo2)
        uporabnik.save((napaka) => {
            if (napaka) {
                //console.log(napaka);
            } else {
                console.log(`Povprečna ocena je posodobljena na ${uporabnik.ocena}.`);
                console.log(`Skupna ocena je posodobljena na ${uporabnik.skupnaOcena}.`);

            }
        });
    }
};

// const shraniKomentar = (req, res) => {};

module.exports = {
    komentarjiKreiraj,
    dodajKomentar,
    // shraniKomentar
};