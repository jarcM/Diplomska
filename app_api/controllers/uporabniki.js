const mongoose = require('mongoose');
const Uporabnik = mongoose.model('Uporabnik');
var nodemailer = require('nodemailer');
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
const uporabnikiKreiraj = (req, res) => {
    Uporabnik.create({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        datum: req.body.datum,
    }, (napaka, uporabniki) => {
        if (napaka) {
            res.status(400).json(napaka);
        } else {
            res.status(201).json(uporabniki);
        }
    });
};
const uporabnikPreberiIzbrano = (req, res) => {
    Uporabnik
        .findOne({email: email})
        .select('email password')
        .exec((napaka, uporabnik) => {
            res.status(200).json(uporabnik);
        });
};
var a = '';
const vrniSejo = (req, res) => {
    return res.send(a)
}

const preveriUporabnika = (req, res) => {
    Uporabnik
        .findOne({email: req.body.email})
        .select('password').select('username').select('_id')
        .exec((napaka, uporabnik) => {
            //console.log(uporabnik.password);
            const trentuniUporabnik = req.body.password;
            if(req.body.email=="julija"){
                return res.redirect('/lol')
            }
            if (!uporabnik) {
                return res.redirect('/prijava')
            } else if (napaka) {
                return res.redirect('/prijava');
            }

            if (trentuniUporabnik === uporabnik.password) {
                req.session.Auth = uporabnik._id;
                a = uporabnik._id;
                console.log(req.session.Auth)
                res.redirect('/domacaStran');
            } else {
                console.log("napacno geslo");
                res.redirect('/prijava');
            }
        });
}

const pozabljenoGeslo = (req, res) => {
    console.log(req.body.email)
    Uporabnik
        .findOne({email: req.body.email})
        .select('password')
        .exec((napaka, uporabnik) => {
            //console.log(uporabnik.password);
            const trenutniUporabnik = req.body.password;
            if (!uporabnik) {
                return res.redirect('/pozabljenoGeslo')
            } else if (napaka) {
                return res.status(500).json(napaka);
            }

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'dogwalkerstpo@gmail.com',
                    pass: 'Dogwalkers12'
                }
            });
            var mailOptions = {
                from: 'dogwalkerstpo@gmail.com',
                to: req.body.email,
                subject: 'Koda',
                text: "Kliknite na link, da nastavite novo geslo" + "   https://dogwalkers12.herokuapp.com/pozabljenoGeslo2/" + uporabnik._id.toString()
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            res.redirect('/prijava')
        });
    //res.redirect('/prijava')
}

const posodobiGeslo = async (req, res) => {
    Uporabnik
        .findById(req.params.idUporabnika)
        .exec((napaka, uporabnik) => {
            if (!uporabnik) {
                return res.status(404).json({"sporočilo": "Ne najdem uporabnika."});
            } else if (napaka) {
                return res.status(500).json(napaka);
            }
            uporabnik.password=req.body.password;
            uporabnik.save((napaka, uporabnik) => {
                if (napaka) {
                    res.status(404).json(napaka);
                } else {
                    res.redirect('/prijava');
                }
            });
        });
};
const pridobiUporabnikId = (req, res) => {
    if (req.params.email) {
        Uporabnik
            .findOne({email: req.params.email})
            .select('_id')
            .exec((napaka, uporabnik) => {
                if (!uporabnik) {
                    return res.status(404).json({
                        "sporočilo":
                            "Ne najdem dogodka s podanim enoličnim identifikatorjem idUporabnika."
                    });
                } else if (napaka) {
                    return res.status(500).json(napaka);
                }
                return res.status(200).json(uporabnik._id);
            });
    } else {
        return res.status(404).json({
            "sporočilo":
                "Ne najdem dogodka s podanim enoličnim identifikatorjem idUporabnika."
        });
    }
}

const shraniUporabnika = (req, res) => {
    axios({
        method: 'post',
        url: '/api/uporabniki',
        data: {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            datum: req.body.datum,
            vloga: req.body.vloga
        }
    }).then(() => {
        res.redirect('/prijava')
    }).catch((napaka) => {
        res.redirect('/prijava')
    });
}
const oceneSeznam = (req, res) => {
    console.log("dogodkikkikikik")
    Uporabnik
        .find()
        .select('username skupnaOcena')
        .skip(0)
        .limit(10)
        .sort({skupnaOcena:'desc'})
        .exec((napaka, uporabnik) => {
            if (!uporabnik) {
                return res.status(404).json(napaka);
            } else if (napaka) {
                return res.status(500).json(napaka);
            }
            res.status(200).json(uporabnik);
        });
};
const izbrisiUporabnika = (req, res) => {
        Uporabnik
            .findOneAndRemove({email:""})
            .exec((napaka) => {
                if (napaka) {
                    return res.status(500).json(napaka);
                }
                res.redirect('/registracija');
            });
}
const uporabnikiIzbrisiIzbrano = (req, res) => {
    if (req.params.idUporabnika) {
        Uporabnik
            .findByIdAndRemove(req.params.idUporabnika)
            .exec((napaka) => {
                if (napaka) {
                    return res.status(500).json(napaka);
                }
                res.status(204).json(null);
            });
    } else {
        res.status(404).json({
            "sporočilo":
                "Ne najdem uporabnika, idUporabnika je obvezen parameter."
        });
    }
};

const priljubljeniKreiraj = (req, res) => {
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


module.exports = {
    uporabnikiKreiraj,
    shraniUporabnika,
    uporabnikPreberiIzbrano,
    preveriUporabnika,
    uporabnikiIzbrisiIzbrano,
    pridobiUporabnikId,
    izbrisiUporabnika,
    pozabljenoGeslo,
    posodobiGeslo,
    vrniSejo,
    oceneSeznam


}
