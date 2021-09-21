const mongoose = require('mongoose');
const Dogodek = mongoose.model('Dogodek');
const Program = mongoose.model('Program');
const Exercise = mongoose.model('Exercise');
const Weight=mongoose.model('Weight')
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
    apiParametri.streznik = 'https://diplomskafitnessapp.herokuapp.com/';
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
        difficulty: req.body.difficulty,
    }, (napaka, program) => {
        if (napaka) {
            res.status(400).json(napaka);
        } else {
            res.status(201).json(program);
        }
    });
    axios
        .get('api/seja')
        .then((odgovor1)=>{
            if(odgovor1){
                console.log(odgovor1.data)
                Uporabnik.findById(odgovor1.data)
                    .exec((napaka,uporabnik)=>{
                        if(napaka){
                            console.long(napaka)
                        }else{
                            Program.findOne()
                                .sort(({_id:-1}))
                                .exec((napaka, program) => {
                                    if (napaka) {
                                        console.log(napaka);
                                        res.status(400).json(napaka);
                                    } else {
                                        console.log(program.naslov)
                                        uporabnik.program.push({
                                            naslov: req.body.naslov,
                                            difficulty: req.body.difficulty,
                                            idMainProgram:program._id

                                        })
                                        uporabnik.save((napaka,uporabnik)=>{
                                            if (napaka) {
                                                res.status(400).json(napaka);
                                            } else {
                                                console.log("kekss")

                                            }
                                        })
                                    }
                                });
                            console.log(uporabnik.username)
                        };
                    })
            }else{
                res.redirect('/domacaStran')
            }
        })
};
const addWeight = (req, res) => {
    axios
        .get('/api/uporabniki/' + req.session.Auth)
        .then((odgovor1)=>{
            if(odgovor1.data){
                const kek=odgovor1.data;
                Uporabnik.findById(odgovor1.data)
                    .exec((napaka,uporabnik)=>{
                        if(napaka){
                            console.long(napaka)
                        }else{
                            console.log("kekwwww")
                            var today=new Date()
                            var date=today.getDate()+"/"+today.getMonth()+"/"+today.getFullYear()
                            uporabnik.weight.push({
                                weight:req.body.naslov,
                                date:date
                            })
                            uporabnik.save((napaka,uporabnik)=>{
                                if (napaka) {
                                    res.status(400).json(napaka);
                                } else {
                                    console.log("kekss")
                                    res.redirect('/trenutniProfil')
                                }
                            })
                        };
                    })
            }else{
                res.redirect('/prijava')
            }
        })
};
const addFriend = (req, res) => {
    axios
        .get('/api/uporabniki/' + req.session.Auth)
        .then((odgovor1)=>{
            if(odgovor1.data){
                const kek=odgovor1.data;
                Uporabnik.findById(odgovor1.data)
                    .exec((napaka,uporabnik)=>{
                        if(napaka){
                            console.long(napaka)
                        }else{
                            console.log(req.body.addFriend)
                            Uporabnik.findOne({username: req.body.addFriend})
                                .exec((napaka2,uporabnikUsername)=>{
                                if(!uporabnikUsername){
                                    res.redirect('/trenutniProfil')
                                }else{
                                    uporabnik.friends.push({
                                    username:req.body.addFriend
                                })
                                    uporabnik.save((napaka,uporabnik)=>{
                                        if (napaka) {
                                            res.status(400).json(napaka);
                                        } else {
                                            console.log("kekss")
                                            res.redirect('/trenutniProfil')
                                        }
                                    })
                                }
                            })

                        };
                    })
            }else{
                res.redirect('/prijava')
            }
        })
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
const previousWorkouts = (req, res) => {
    axios
        .get('api/seja')
        .then((odgovor1)=>{
            if(odgovor1.data){
                const kek=odgovor1.data;
                Uporabnik.findById(odgovor1.data)
                    .exec((napaka,uporabnik)=>{
                        if(napaka){
                            console.long(napaka)
                        }else{
                            console.log(uporabnik.workouts[req.params.idDogodka].vaje.length)
                            console.log("kek")
                            var stevec=0;
                            for (let i=0;i<uporabnik.workouts[req.params.idDogodka].vaje.length;i++){
                                console.log(stevec)
                                if(uporabnik.workouts[req.params.idDogodka].vaje[i].repsWeight[0].reps1!=null) {
                                    stevec = stevec + parseInt(uporabnik.workouts[req.params.idDogodka].vaje[i].repsWeight[0].reps1) *
                                        parseInt(uporabnik.workouts[req.params.idDogodka].vaje[i].repsWeight[0].weight1);
                                }
                                if(uporabnik.workouts[req.params.idDogodka].vaje[i].repsWeight[0].reps2!=null) {
                                    stevec = stevec + parseInt(uporabnik.workouts[req.params.idDogodka].vaje[i].repsWeight[0].reps2) *
                                        parseInt(uporabnik.workouts[req.params.idDogodka].vaje[i].repsWeight[0].weight2);
                                }
                                if(uporabnik.workouts[req.params.idDogodka].vaje[i].repsWeight[0].reps3!=null) {
                                    stevec = stevec + parseInt(uporabnik.workouts[req.params.idDogodka].vaje[i].repsWeight[0].reps3) *
                                        parseInt(uporabnik.workouts[req.params.idDogodka].vaje[i].repsWeight[0].weight3);
                                }
                                if(uporabnik.workouts[req.params.idDogodka].vaje[i].repsWeight[0].reps4!=null) {
                                    stevec = stevec + parseInt(uporabnik.workouts[req.params.idDogodka].vaje[i].repsWeight[0].reps4) *
                                        parseInt(uporabnik.workouts[req.params.idDogodka].vaje[i].repsWeight[0].weight4);
                                }
                                if(uporabnik.workouts[req.params.idDogodka].vaje[i].repsWeight[0].reps5!=null) {
                                    stevec = stevec + parseInt(uporabnik.workouts[req.params.idDogodka].vaje[i].repsWeight[0].reps5) *
                                        parseInt(uporabnik.workouts[req.params.idDogodka].vaje[i].repsWeight[0].weight5);
                                }
                            }
                            res.render('previousWorkouts',{
                                program:uporabnik.workouts[req.params.idDogodka],
                                counter:stevec
                            })
                        }
                    });
            }else{
                res.redirect('/prijava')
            }
        })
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
        layout: false
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
const addWorkoutToUser = (req, res) => {
    const counter=0;
    axios
        .get('api/seja')
        .then((odgovor1)=>{
            if(odgovor1.data){
                const kek=odgovor1.data;
        Program.findById(req.params.idDogodka)
            .exec((napaka, program) => {
                if (napaka) {
                    console.log(napaka);
                    res.status(400).json(napaka);
                } else {
                    Uporabnik.findById(odgovor1.data)
                        .exec((napaka,uporabnik)=>{
                            if(napaka){
                                console.long(napaka)
                            }else{
                                console.log("kek")
                                var datum1=new Date()
                                var datum2=datum1.getDate()+"/"+datum1.getMonth()+"/"+datum1.getFullYear()
                                 uporabnik.workouts.push({
                                     naslov:program.naslov,
                                     difficulty:program.difficulty,
                                     vaje:program.vaje,
                                     datumWorkout:datum2
                                 })
                                uporabnik.save((napaka,uporabnik)=>{
                                    if (napaka) {
                                        res.status(400).json(napaka);
                                    } else {
                                        console.log("kekss")
                                        res.redirect('/currentWorkout/'+counter)
                                    }
                                })
                            };
                        })
                }
            });
            }else{
                res.redirect('/prijava')
            }
        })
}
const currentWorkout = (req, res) => {
    axios
        .get('api/seja')
        .then((odgovor1)=>{
            if(odgovor1.data){
                const kek=odgovor1.data;
                Uporabnik.findById(odgovor1.data)
                    .exec((napaka,uporabnik)=>{
                        if(napaka){
                            console.long(napaka)
                        }else{
                            var stevec=uporabnik.workouts.length
                            console.log(uporabnik.workouts[stevec-1].vaje.length)
                            if(parseInt(req.params.counter)==uporabnik.workouts[stevec-1].vaje.length){
                                res.redirect('/trenutniProfil')
                            }else{
                            console.log(uporabnik.workouts.length)
                            var stevecWorkoutov=uporabnik.workouts.length-2;
                            var stevecVaj=0;
                            var array=new Array()
                            while(stevecWorkoutov!=-1){
                                for(var i=0;i<uporabnik.workouts[stevecWorkoutov].vaje.length;i++){
                                    if(uporabnik.workouts[stevecWorkoutov].vaje[i].naslov==
                                        uporabnik.workouts[stevec-1].vaje[req.params.counter].naslov){
                                        array[stevecVaj]=uporabnik.workouts[stevecWorkoutov].vaje[i]
                                        stevecVaj++;
                                    }
                                }
                                stevecWorkoutov--;
                            }
                            console.log(array)
                            res.render('currentWorkout',{
                                program:uporabnik.workouts[stevec-1],
                                counter:req.params.counter,
                                vaje:uporabnik.workouts[stevec-1].vaje[req.params.counter],
                                last:array
                            })
                        }
                        };
                    })
            }else{
                res.redirect('/prijava')
            }
        })
}
const currentWorkout2 = (req, res) => {
    axios
        .get('api/seja')
        .then((odgovor1)=>{
            if(odgovor1.data){
                const kek=odgovor1.data;
                Uporabnik.findById(odgovor1.data)
                    .exec((napaka,uporabnik)=>{
                        if(napaka){
                            console.long(napaka)
                        }else{
                            var stevec=uporabnik.workouts.length
                            console.log(stevec)
                            var counter=parseInt(req.params.counter) +1
                            console.log(uporabnik.workouts[stevec-1].vaje[req.params.counter].repsWeight[0].reps1)
                            uporabnik.workouts[stevec-1].vaje[req.params.counter].repsWeight[0].reps1=req.body.reps1,
                            uporabnik.workouts[stevec-1].vaje[req.params.counter].repsWeight[0].reps2=req.body.reps2,
                            uporabnik.workouts[stevec-1].vaje[req.params.counter].repsWeight[0].reps3=req.body.reps3,
                            uporabnik.workouts[stevec-1].vaje[req.params.counter].repsWeight[0].reps4=req.body.reps4,
                            uporabnik.workouts[stevec-1].vaje[req.params.counter].repsWeight[0].reps5=req.body.reps5,
                            uporabnik.workouts[stevec-1].vaje[req.params.counter].repsWeight[0].weight1=req.body.weight1,
                            uporabnik.workouts[stevec-1].vaje[req.params.counter].repsWeight[0].weight2=req.body.weight2,
                            uporabnik.workouts[stevec-1].vaje[req.params.counter].repsWeight[0].weight3=req.body.weight3,
                            uporabnik.workouts[stevec-1].vaje[req.params.counter].repsWeight[0].weight4=req.body.weight4,
                            uporabnik.workouts[stevec-1].vaje[req.params.counter].repsWeight[0].weight5=req.body.weight5
                            var weight1=req.body.reps1*req.body.weight1
                            var weight2=req.body.reps2*req.body.weight2
                            var weight3=req.body.reps3*req.body.weight3
                            var weight4=req.body.reps4*req.body.weight4
                            var weight5=req.body.reps5*req.body.weight5

                            uporabnik.totalKgLifted=uporabnik.totalKgLifted+weight1+weight2+weight3+weight4+weight5
                            uporabnik.save((napaka, uporabnik) => {
                                if (napaka) {
                                    res.status(404).json(napaka);
                                } else {
                                    res.redirect('/currentWorkout/'+counter)
                                }
                            });
                        };
                    })
            }else{
                res.redirect('/prijava')
            }
        })
}
const dodajVaje = (req, res) => {-
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
                            Uporabnik.find()
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
                    difficulty: req.body.difficulty,
                }
            }).then(() => {
                res.redirect('/dodajVaje');
            }).catch((napaka) => {
                console.log(napaka);
            });
}
const shraniVaje = async (req, res, program,uporabnik) => {
    console.log("AAAAAAAAAAAAAAAAA")
    console.log(program)
    console.log("AAAAAAAAAAAAAAAAA")
    console.log(uporabnik.program[uporabnik.program.length-1])
    console.log("AAAAAAAAAAAAAAAAA")
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
        uporabnik.program[uporabnik.program.length-1].vaje.push({
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
            }
        });
        uporabnik.save((napaka, uporabnikProgram) => {
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
                axios
                    .get('api/seja')
                    .then((odgovor1)=>{
                        if(odgovor1){
                            console.log(odgovor1.data)
                            Uporabnik.findById(odgovor1.data)
                                .exec((napaka,uporabnik)=>{
                                    if(napaka){
                                        console.long(napaka)
                                    }else{
                                        shraniVaje(req,res,program,uporabnik, req.body)
                                            }
                                })
                        }else{
                            res.redirect('/domacaStran')
                        }
                    })
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
const getAddWeight = (req, res) => {
    console.log(req.session.Auth)
    axios
        .get('/api/uporabniki/' + req.session.Auth)
        .then((odgovor) => {
            showAddWeight(req, res, odgovor.data);
        })
        .catch((napaka) => {
            res.redirect('/')
        });
};
const get1rmcalculator = (req, res) => {
    res.render('1rmcalculator',{
        title: '1 Rep max calculator'
    })
};
const bmrcalculator = (req, res) => {
    res.render('bmrcalculator',{
        title: 'BMR calculator'
    })
};
const showAddWeight = (req, res, uporabnik1) => {
    console.log("prslodosm")
    Uporabnik.findById(uporabnik1)
        .exec((napaka,uporabnik)=>{
            if(napaka){
                console.long(napaka)
            }else{
                res.render('addWeight', {
                    title: 'Add weight',
                    weight:uporabnik.weight
                });
            };
        })
};
const oglasi = (req, res, programi) => {
    axios
        .get('api/seja')
        .then((odgovor1)=>{
            if(odgovor1){
                console.log(odgovor1.data)
                Uporabnik.findById(odgovor1.data)
                    .exec((napaka,uporabnik)=>{
                        if(napaka){
                            console.log(napaka)
                        }else{
                            res.render('oglasi', {
                                title: 'Moji dogodki',
                                programi:uporabnik.program
                            })
                        };
                    })
            }else{
                res.redirect('/domacaStran')
            }
        })
}
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
    lol,
    addWorkoutToUser,
    currentWorkout,
    currentWorkout2,
    previousWorkouts,
    addWeight,
    getAddWeight,
    addFriend,
    oglasi,
    get1rmcalculator,
    bmrcalculator
};
