const mongoose = require('mongoose');
const Dogodek = mongoose.model('Dogodek');
const Program = mongoose.model('Program');
const Exercise = mongoose.model('Exercise');

const Uporabnik = mongoose.model('Uporabnik');
const Oglas = mongoose.model('Oglas');
const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'opencage',
    apiKey: '598c97e958ab410abe126ee35ac3c995',
    formatter: null
};

const geocoder = NodeGeocoder(options);

var apiParametri = {
    streznik: 'http://localhost:' + (process.env.PORT || 3000)
};
if (process.env.NODE_ENV === 'production') {
    apiParametri.streznik = 'https://dogwalkers12.herokuapp.com//';
}
const axios = require('axios').create({
    baseURL: apiParametri.streznik,
    timeout: 5000
});

var sessionID = ''

const dogodkiSeznam = (req, res) => {
    Program
        .find()
        .exec((napaka, programek   ) => {
            if (!programek) {
                return res.status(404).json(napaka);
            } else if (napaka) {
                return res.status(500).json(napaka);
            }
            res.status(200).json(programek);
        });
};

const getDogodkiSeznam = (req, res) => {
    axios
        .get('api/dogodki')
        .then((odgovor) => {
            date = new Date();
            date = date.toISOString();
            odgovor = odgovor.data;
            for (var i = 0; i < odgovor.length; i++) {
                d1 = odgovor[i].datum
                if (d1 <= date) {
                    delete odgovor[i];
                }
            }
            dogodkiSeznamPrikaz(req, res, odgovor)
        })
        .catch(() => {
            dogodkiSeznamPrikaz(req, res, [], "Napaka API-ja pri iskanju dogodka.");
        });
}

const dogodkiSeznamPrikaz = (req, res, dogodki, sporocilo) => {
    res.render('domacaStran', {
        title: 'Predmet',
        dogodki,
        sporocilo: sporocilo
    });
}


const dogodekKreiraj = (req, res) => {
    Dogodek.create({
        title: "Dodaj dogodek",
        ime_dogodka: req.body.ime_dogodka,
        mesto: req.body.mesto,
        naslov: req.body.naslov,
        prostor: req.body.prostor,
        organizator: req.body.organizator,
        tip: req.body.tip,
        max_ljudi: req.body.max_ljudi,
        kreatorID: sessionID,
        prijavljeni: req.body.prijavljeni,
        datum: req.body.datum,
        ura: req.body.ura,
        vreme: req.body.vreme,
        cena: req.body.cena,
        opis: req.body.opis,
        komentarji: req.body.komentarji,
        koordinate: [
            parseFloat(req.body.lat),
            parseFloat(req.body.lng)
        ]
    }, (napaka, dogodek) => {
        if (napaka) {
            res.status(400).json(napaka);
        } else {
            res.status(201).json(dogodek);
        }
    });
};
const oglasKreiraj = (req, res) => {
    console.log("do sm prslo1")
    Program.create({
        naslov: req.body.naslov,
        visibility: req.body.visibility,
        difficulty: req.body.difficulty,
    }, (napaka, program) => {
        if (napaka) {
            res.status(400).json(napaka);
        } else {
            res.status(201).json(program);
        }
    });
};

const dogodkiPreberiIzbrano = (req, res) => {
    Program
        .findById(req.params.idDogodka)
        .exec((napaka, programek) => {
            if (!programek) {
                return res.status(404).json({
                    "sporočilo":
                        "Ne najdem dogodka s podanim enoličnim identifikatorjem idDogodka."
                });
            } else if (napaka) {
                return res.status(500).json(napaka);
            }
            res.status(200).json(programek);
        });
};
const uporabnikiPreberiIzbrano = (req, res) => {
    Uporabnik
        .findById(req.params.idUporabnika)
        .exec((napaka, uporabnik) => {
            if (!uporabnik) {
                return res.status(404).json({
                    "sporočilo":
                        "Ne najdem dogodka s podanim enoličnim identifikatorjem idUporabnika."
                });
            } else if (napaka) {
                return res.status(500).json(napaka);
            }
            res.status(200).json(uporabnik);
        });
};

const dogodkiPosodobiIzbrano = (req, res) => {
    console.log("tuki")
    if (!req.params.idDogodka) {
        return res.status(404).json({
            "sporočilo":
                "Ne najdem dogodka, idDogodka je obvezen parameter."
        });
    }
    Dogodek
        .findById(req.params.idDogodka)
        .exec((napaka, dogodek) => {
            if (!dogodek) {
                return res.status(404).json({"sporočilo": "Ne najdem dogodka."});
            } else if (napaka) {
                return res.status(500).json(napaka);
            }
            dogodek.naslovOglasa = req.body.naslovOglasa;
            dogodek.kraj = req.body.kraj;
            dogodek.posta = req.body.posta;
            dogodek.ulica = req.body.ulica;
            dogodek.hisnaSt = req.body.hisnaSt;
            dogodek.kontakt = req.body.kontakt;
            dogodek.vreme = req.body.vreme;
            dogodek.opisZahtev = req.body.opisZahtev;
            dogodek.datum = req.body.datum;
            dogodek.trajanje = req.body.trajanje;
            dogodek.opisZahtev = req.body.opisZahtev;
            dogodek.save((napaka, dogodek) => {
                if (napaka) {
                    res.status(404).json(napaka);
                } else {
                    res.status(200).json(dogodek);
                }
            });
        });
};

const dogodkiIzbrisiIzbrano = (req, res) => {
    const {idDogodka} = req.params;
    if (idDogodka) {
        Dogodek
            .findByIdAndRemove(idDogodka)
            .exec((napaka) => {
                if (napaka) {
                    return res.status(500).json(napaka);
                }
                res.status(204).json(null);
            });
    } else {
        res.status(404).json({
            "sporočilo":
                "Ne najdem dogodka, idDogodka je obvezen parameter."
        });
    }
};

const urediDogodek = (req, res) => {
    axios
        .get('api/dogodki/' + req.params.idDogodka)
        .then((odgovor) => {
            Dogodek
                .findById(req.params.idDogodka)
                .exec((napaka,dogodek)=>{
                    axios
                        .get('api/seja')
                        .then((odgovor1)=>{
                            if(dogodek.kreatorID===odgovor1.data){
                                urediDogodekPrikaz(req, res, odgovor.data);

                            }else{
                                res.redirect('/domacaStran')
                            }
                        })
                })

        })
        .catch(() => {
            urediDogodekPrikaz(req, res, [], "Napaka API-ja pri iskanju dogodka.");
        });
    ;
}
const rezervirajDogodek = (req, res) => {
    if (!req.params.idDogodka) {
        return res.status(404).json({
            "sporočilo":
                "Ne najdem dogodka, idDogodka je obvezen parameter."
        });
    }
    Dogodek
        .findById(req.params.idDogodka)
        .exec((napaka, dogodek) => {
            if (!dogodek) {
                return res.status(404).json({"sporočilo": "Ne najdem dogodka."});
            } else if (napaka) {
                return res.status(500).json(napaka);
            }
            dogodek.jeRezerviran = "true";
            dogodek.save((napaka, dogodek) => {
                if (napaka) {
                    res.status(404).json(napaka);
                } else {
                    res.redirect('/eventDetails/' + req.params.idDogodka);
                }
            });
        });
}

const urediDogodekPrikaz = (req, res, dogodek, sporocilo) => {
    res.render('EventWizard/EditEvent', {
        title: 'Urejanje dogodka',
        dogodek,
        sporocilo: sporocilo
    });
}
const lol = (req, res) => {
    res.render('lol',{
        title:'addExercise',
    })
}

const dodajDogodek = (req, res) => {
    prikaziObrazecZaDogodek(req, res);
}

const prikaziObrazecZaDogodek = (req, res) => {
    res.render('EventWizard/AddEvent', {
        title: 'Nov Dogodek'
    })
}
const dodajOglas = (req, res) => {
    prikaziObrazecZaOglas(req, res);
}
const dodajVaje = (req, res) => {
    Program.findOne()
        .sort(({_id:-1}))
        .exec((napaka, program) => {
            if (napaka) {
                console.log(napaka);
                res.status(400).json(napaka);
            } else {
                console.log(program.naslov)
                Exercise.find()
                    .sort(({_id:1}))
                    .exec((napaka, exercise) => {
                        if (napaka) {
                            console.log(napaka);
                            res.status(400).json(napaka);
                        } else {
                            Exercise.find()
                                .sort(({_id:1}))
                            res.render('dodajVaje',{
                                title:'dodajVaje2',
                                program,
                                exercise

                            })
                        }
                    });
            }
        });
}
const addExercise = (req, res) => {
    res.render('addExercise',{
        title:'addExercise',
                })
}

const prikaziObrazecZaOglas = (req, res) => {
    res.render('objava', {
        title: 'Nov oglas'
    })
}


async function getgeo(naslov) {
    const geodata = await geocoder.geocode(naslov);
    return geodata;
}

const shraniDogodek = async (req, res) => {
    var lati = 0;
    var longi = 0;
    var cena = 0;
    if (req.body.prostor != "online") {
        req.body.mesto = " " + req.body.mesto;
        const geodata = await getgeo(req.body.naslov.concat(req.body.mesto)).catch(null);
        lati = geodata[0].latitude;
        longi = geodata[0].longitude;
    }
    if (req.body.tip != "free") {
        cena = req.body.cena;
    }
    axios({
        method: 'post',
        url: '/api/dogodki',
        data: {
            lat: lati,
            lng: longi,
            title: "Dodaj dogodek",
            ime_dogodka: req.body.ime_dogodka,
            mesto: req.body.mesto,
            naslov: req.body.naslov,
            prostor: req.body.prostor,
            organizator: req.body.organizator,
            tip: req.body.tip,
            max_ljudi: req.body.max_ljudi,
            max_ljudi: req.body.max_ljudi,
            kreatorID: sessionID,
            prijavljeni: req.body.prijavljeni,
            datum: req.body.datum,
            ura: req.body.ura,
            vreme: req.body.vreme,
            cena: cena,
            opis: req.body.opis,
            komentarji: req.body.komentarji,
        }
    }).then(() => {
        res.redirect('/myEvents');
    }).catch((napaka) => {
        console.log(napaka);
    });
}
const shraniOglas = async (req, res) => {
    console.log("do sm prslo2")
    axios({
                method: 'post',
                url: '/api/program',
                data: {
                    naslov: req.body.naslov,
                    visibility: req.body.visibility,
                    difficulty: req.body.difficulty,
                }
            }).then(() => {
                res.redirect('/dodajVaje');
            }).catch((napaka) => {
                console.log(napaka);
            });
}
const shraniVaje = async (req, res, program) => {
    if (!program) {
        res.status(404).json({"sporočilo": "Ne najdem dogodka."});
    } else {
        program.vaje.push({
            naslov: req.body.naslov,
            repsWeight:{
                reps1:req.body.reps1,
                reps2:req.body.reps2,
                reps3:req.body.reps3,
                reps4:req.body.reps4,
                reps5:req.body.reps5,
            },
        });
        program.save((napaka, program) => {
            if (napaka) {
                res.status(400).json(napaka);
            } else {
                res.redirect('/dodajVaje')
            }
        });
    }
}
const exerciseKreiraj = (req, res) => {
    console.log("do sm prslo1")
    Exercise.create({
        naslov: req.body.naslov,
        mainBodyPart: req.body.bodyPart,
    }, (napaka, workout) => {
        if (napaka) {
            res.status(400).json(napaka);
        } else {
            res.redirect('/addExercise')
        }

    });

};
const vajeKreiraj = (req, res) => {
    Program.findOne()
        .sort(({_id:-1}))
        .select('vaje')
        .exec((napaka, program) => {
            if (napaka) {
                console.log(napaka);
                res.status(400).json(napaka);
            } else {
                console.log(program._id)
                shraniVaje(req,res,program, req.body)
            }
        });

};
const odjavi = (req, res) => {
    if (!req.params.idDogodka) {
        return res.status(404).json("ne");
    }
    Dogodek
        .findById(req.params.idDogodka)
        .exec((napaka, dogodek) => {
            if (!dogodek) {
                return res.status(404).json({"sporočilo": "Ne najdem dogodka."});
            } else if (napaka) {
                return res.status(500).json(napaka);
            }
            dogodek.prijavljeni -= 1;

            dogodek.save((napaka, dogodek) => {
                if (napaka) {
                    res.status(404).json(napaka);
                } else {
                    res.redirect('/myEvents');
                }
            });
        });
};

const prijavi = (req, res) => {
    console.log("HERE");
    if (!req.params.idDogodka) {
        return res.status(404).json({
            "sporočilo":
                "Ne najdem dogodka, idDogodka je obvezen parameter."
        });
    }
    Dogodek
        .findById(req.params.idDogodka)
        .exec((napaka, dogodek) => {
            if (!dogodek) {
                return res.status(404).json({"sporočilo": "Ne najdem dogodka."});
            } else if (napaka) {
                return res.status(500).json(napaka);
            }
            dogodek.prijavljeni += 1;

            dogodek.save((napaka, dogodek) => {
                if (napaka) {
                    res.status(404).json(napaka);
                } else {
                    res.redirect('/eventDetails/' + req.params.idDogodka);
                }
            });
        });
};

const izbrisi = (req, res) => {
    const idDogodka = req.params.idDogodka;
    if(idDogodka){
        Dogodek
            .findById(idDogodka)
            .exec((napaka,dogodek)=>{
                axios
                    .get('api/seja')
                    .then((odgovor) => {
                        console.log(odgovor.data)
                        sessionID = odgovor.data;
                        if(sessionID!=='60a920d3676c112d742b2e1b'){
                            return res.redirect('/domacaStran')
                        }else{
                            if (idDogodka) {
                                Dogodek
                                    .findByIdAndRemove(idDogodka)
                                    .exec((napaka) => {
                                        if (napaka) {
                                            return res.status(500).json(napaka);
                                        }
                                        res.redirect('/servicesList');
                                    });
                            } else {
                                res.status(404).json({
                                    "sporočilo":
                                        "Ne najdem dogodka, idDogodka je obvezen parameter."
                                });
                            }
                        }
                        }).catch((napaka) => {
                            console.log(napaka);
                        });
                    })
            }
    }

const posodobiDogodek = async (req, res) => {
    console.log("tuki2")
    if (!req.params.idDogodka) {
        return res.status(404).json({
            "sporočilo":
                "Ne najdem dogodka, idDogodka je obvezen parameter."
        });
    }
    var lati = 0;
    var longi = 0;
    req.body.kraj = " " + req.body.kraj;
    const geodata = await getgeo(req.body.ulica.concat(req.body.kraj)).catch(null);
    console.log(req.body.kraj)
    console.log(req.body.ulica)
    lati = geodata[0].latitude;
    console.log(lati)
    longi = geodata[0].longitude;
    Dogodek
        .findById(req.params.idDogodka)
        .exec((napaka, dogodek) => {
            if (!dogodek) {
                return res.status(404).json({"sporočilo": "Ne najdem dogodka."});
            } else if (napaka) {
                return res.status(500).json(napaka);
            }
            dogodek.naslovOglasa = req.body.naslovOglasa;
            dogodek.kraj = req.body.kraj;
            dogodek.posta = req.body.posta;
            dogodek.ulica = req.body.ulica;
            dogodek.vreme = req.body.vreme;
            dogodek.hisnaSt = req.body.hisnaSt;
            dogodek.kontakt = req.body.kontakt;
            dogodek.opisZahtev = req.body.opisZahtev;
            dogodek.datum = req.body.datum;
            dogodek.trajanje = req.body.trajanje;
            dogodek.opisZahtev = req.body.opisZahtev;
            dogodek.koordinate = [lati, longi]

            dogodek.save((napaka, dogodek) => {
                if (napaka) {
                    res.status(404).json(napaka);
                } else {
                    res.redirect('/servicesList');
                }
            });
        });
};

module.exports = {
    dogodkiSeznam,
    getDogodkiSeznam,
    dogodekKreiraj,
    oglasKreiraj,
    dogodkiPreberiIzbrano,
    uporabnikiPreberiIzbrano,
    dogodkiPosodobiIzbrano,
    dogodkiIzbrisiIzbrano,
    urediDogodek,
    dodajDogodek,
    dodajOglas,
    shraniOglas,
    shraniVaje,
    shraniDogodek,
    odjavi,
    prijavi,
    dodajVaje,
    izbrisi,
    posodobiDogodek,
    rezervirajDogodek,
    vajeKreiraj,
    addExercise,
    exerciseKreiraj,
    lol
};
