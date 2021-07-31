const mongoose = require('mongoose');
const Uporabnik = mongoose.model('Uporabnik');
const Dogodek = mongoose.model('Dogodek');
const Exercise = mongoose.model('Exercise');

var apiParametri = {
    streznik: 'https://diplomskafitnessapp.herokuapp.com/'
};
if (process.env.NODE_ENV === 'production') {
    apiParametri.streznik = 'https://diplomskafitnessapp.herokuapp.com/';
}

var cmd = require('node-cmd');

const axios = require('axios').create({
    baseURL: apiParametri.streznik,
    timeout: 5000
});


const db = (req, res) => {
    res.render('db');
}

const init = (req, res) => {

    cmd.run('npm run dogodki-init');
    cmd.run('npm run dogodki-init-uporabnik');
    res.redirect('/db');
}


const brisi = (req, res) => {
    cmd.run('npm run dogodki-zbrisi');
    cmd.run('npm run dogodki-zbrisi-uporabnik');
    res.redirect('/db')
}


const home2 = (req, res) => {

        res.render('domacaStran2', {
            layout: 'layout2',
            title: 'Predmet',
        });
};


/* GET home page */
const home = (req, res) => {
        Uporabnik
            .findById(req.session.Auth)
            .exec((napaka, uporabnik) => {
                if (!uporabnik) {
                    return res.redirect('/');
                } else if (napaka) {
                    return res.status(500).json(napaka);
                }
                var a="Neprijavljen"
                if(uporabnik.username){
                    a=uporabnik.username
                }
                res.render('domacaStran', {
                    username:a,
                    layout: 'layout',
                    title: 'Predmet',
                });
            });

};

const eventDetails = (req, res) => {
    axios
        .get('/api/dogodki/' + req.params.idDogodka)
        .then((odgovor) => {
            showEventDetails(req, res, odgovor.data);
        })
        .catch((napaka) => {
            prikaziNapako(req, res, napaka);
        });
};

const showEventDetails = (req, res, program) => {
    res.render('EventDetails', {
        title: "Podrobnosti dogodka",
        program
    });
};


const profil = (req, res) => {
    axios
        .get('/api/uporabniki/' + req.params.idUporabnika)
        .then((odgovor) => {
            showProfil(req, res, odgovor.data);
        })
        .catch((napaka) => {
            prikaziNapako(req, res, napaka);
        });
};

const trenutniProfil = (req, res) => {
    axios
        .get('/api/uporabniki/' + req.session.Auth)
        .then((odgovor) => {
            showTrenutniProfil(req, res, odgovor.data);
        })
        .catch((napaka) => {
            res.redirect('/')
        });
};
const showTrenutniProfil = (req, res, uporabnik) => {
    Exercise.find()
        .sort(({_id:1}))
        .exec((napaka, exercise) => {
            if (napaka) {
                console.log(napaka);
                res.status(400).json(napaka);
            } else {
                Exercise.find()
                    .sort(({_id:1}))
                res.render('trenutniProfil', {
                    title: "User profile",
                    uporabnik,
                    exercise

                })
        };
    })
};
const showProfil = (req, res, uporabnik) => {
    res.render('profil', {
        title: "Profil",
        uporabnik,
        ocena: uporabnik.ocena
    });
};
const eventRating = (req, res) => {
    axios
        .get('/api/dogodki/' + req.params.idDogodka)
        .then((odgovor) => {
            showEventRating(req, res, odgovor.data);
        })
        .catch((napaka) => {
            prikaziNapako(req, res, napaka);
        });
};


const showEventRating = (req, res, eventRating) => {
    res.render('eventRating', {
        _id: eventRating._id,
        title: "profil",
        ime_dogodka: eventRating.ime_dogodka,
        ocena: eventRating.ocena,
        organizator: eventRating.organizator,
        mesto: eventRating.mesto,
        datum: eventRating.datum,
        ura: eventRating.ura,
        cena: eventRating.cena,
        opis: eventRating.opis,
        komentarji: eventRating.komentarji,
    });
};


const myEvents = (req, res) => {
    axios
        .get('/api/dogodki/')
        .then((odgovor) => {
            showMyEvents(req, res, odgovor.data);
        })
        .catch((napaka) => {
            prikaziNapako(req, res, napaka);
        });
};

const showMyEvents = (req, res, dogodki) => {
    res.render('myEvents', {
        title: 'List oglasov',
        dogodki
    })
}
const servicesList = (req, res) => {
    axios
        .get('/api/dogodki/')
        .then((odgovor) => {
            showServicesList(req, res, odgovor.data);
        })
        .catch((napaka) => {
            prikaziNapako(req, res, napaka);
        });
};

const showServicesList = (req, res, programi) => {
    res.render('servicesList', {
        title: 'List oglasov',
        programi
    })
}
const getOceneSeznam = (req, res) => {
    axios
        .get('api/uporabniki')
        .then((odgovor) => {
            top10(req, res, odgovor.data)
        })
        .catch(() => {
            prikaziNapako(req, res, [], "Napaka API-ja pri iskanju dogodka.");
        });
}

const oglasi = (req, res) => {
    axios
        .get('/api/dogodki/')
        .then((odgovor) => {
            showOglasi(req, res, odgovor.data);
        })
        .catch((napaka) => {
            prikaziNapako(req, res, napaka);
        });
};

const showOglasi = (req, res, programi) => {
    res.render('oglasi', {
        title: 'Moji dogodki',
        programi
    })
}

const editEvent = (req, res) => {
    res.render('EventWizard/EditEvent', {
        title: 'Urejanje Dogodka',
        eventName: "Miti in resnice o odnosih",
        eventLocation: 'Narodni dom Maribor',
        eventCity: 'Maribor',
        eventOrganiser: 'Izidor Gašperlin',
        eventType: 'paid',
        eventPlace: 'outside',
        eventTime: '2020-12-10T18:00',
        eventPrice: '100',
        eventMaxParticipants: '50',
        eventTitle: 'Miti in resnice o odnosih',
        eventDescription: 'Večer v živo: slišali bomo veliko koristnih resnic in zmot o odnosih in o tem, kako ti ustvarjajo našo realnost.'
    });
};

const addEvent = (req, res) => {
    res.render('EventWizard/AddEvent', {title: 'Dodajanaje novega dogodka'});
};



const priljubljeniKreiraj = (req, res) => {
    const idUporabnika = req.params.idUporabnika;
    const idDogodka=req.params.idDogodka.toString();
    var imeDogodka="";
    if (idUporabnika) {
        Uporabnik
            .findById(idUporabnika)
            .select('priljubljeni')
            .exec((napaka, uporabnik) => {
                if (napaka) {
                    console.log(napaka);
                    res.status(400).json(napaka);
                } else {
                    Dogodek
                        .findById(idDogodka)
                        .select('naslovOglasa')
                        .exec((napaka, dogodek) => {
                            imeDogodka=dogodek.naslovOglasa
                            dodajPriljublene(req, res, uporabnik, idDogodka,imeDogodka);
                        })
                }
            });
    } else {
        res.status(400).json({
            "sporočilo":
                "Ne najdem uporabnika, idUporabnika je obvezen parameter."
        });
    }
};



const dodajPriljublene = (req, res, uporabnik, params,imeDogodka) => {
    if (!uporabnik) {
        res.status(404).json({"sporočilo": "Ne najdem dogodka."});
    } else {
        uporabnik.priljubljeni.push({
            priljubljeni:params,
            ime:imeDogodka
        });
        uporabnik.save((napaka, uporabnik) => {
            if (napaka) {
                res.status(400).json(napaka);
            } else {
                res.status(201).json("kul");
            }
        });
    }
};

const shraniPriljubljeni = (req, res) => {
    const idUporabnika = req.session.Auth;
    const idDogodka=req.params.idDogodka;
    axios({
        method: 'post',
        url: '/api/uporabniki/' + idUporabnika + '/priljubljeni/' + idDogodka,
        data: {
            priljubljeni:idDogodka
        }
    }).then(() => {
        res.redirect('/trenutniProfil');
    }).catch((napaka) => {
        prikaziNapako(req, res, napaka);
    });
};



const prikaziNapako = (req, res, napaka) => {
    let naslov = "Nekaj je šlo narobe!";
    let vsebina = napaka.isAxiosError ?
        "Napaka pri dostopu do oddaljenega vira preko REST API dostopa!" :
        undefined;
    vsebina = (
        vsebina != undefined &&
        napaka.response && napaka.response.data["sporočilo"]
    ) ? napaka.response.data["sporočilo"] : vsebina;
    vsebina = (
        vsebina != undefined &&
        napaka.response && napaka.response.data["message"]
    ) ? napaka.response.data["message"] : vsebina;
    vsebina = (vsebina == undefined) ?
        "Nekaj nekje očitno ne deluje." : vsebina;
    res.render('napaka', {
        title: naslov,
        vsebina: vsebina
    });
};

module.exports = {
    getOceneSeznam,
    servicesList,
    brisi,
    init,
    profil,
    db,
    oglasi,
    home,
    home2,
    eventDetails,
    eventRating,
    myEvents,
    editEvent,
    addEvent,
    trenutniProfil,
    dodajPriljublene,
    priljubljeniKreiraj,
    shraniPriljubljeni,
};
