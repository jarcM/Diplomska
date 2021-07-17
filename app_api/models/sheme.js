const mongoose = require('mongoose');
const komentarjiShema = new mongoose.Schema({
    ime: String,
    ocena: Number,
    vsebina: String
});


const lokacijaShema = new mongoose.Schema({
    mesto: {type: String},
    naslov: {type: String, required: true},
});

const uporabnikShema = new mongoose.Schema({
    email: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    datum: {type: Date, required: true},
    vloga: {type: String, required: true},
    komentarji: [komentarjiShema],
    priljubljeni:{type:[]},
    ocena: {type: Number, default: 0},
    skupnaOcena:{type:Number,default: 0}
});

const dogodekShema = new mongoose.Schema({
    naslovOglasa: {type: String},
    kraj: {type: String},
    posta: {type: Number},
    ulica: {type: String},
    hisnaSt: {type: String},
    kontakt: {type: String},
    jeRezerviran: {type: String},
    opisZahtev: {type: String},
    jePovprasevanje: {type: String},
    vreme: {type: String},
    kreatorID: {type: String},
    prijavljeni: {type: Number},
    koordinate: {type: [Number], index: '2dsphere'},
    datum: {type: Date},
    trajanje: {type: Number},
});
const oglasShema = new mongoose.Schema({
    naslovOglasa: {type: String},
    kraj: {type: String},
    posta: {type: Number},
    ulica: {type: String},
    hisnaSt: {type: String},
    kontakt: {type: String},
    opis: {type: String},
    jePovprasevanje: {type: Boolean},
    kreatorID: {type: String},
    lat: {type: Number},
    lng: {type: Number},
    prijavljeni: {type: Number},
    datum: {type: Date},
    trajanje: {type: Number},
});
mongoose.model('Komentar', komentarjiShema, 'Komentar');
mongoose.model('Dogodek', dogodekShema, 'Dogodek');
mongoose.model("Uporabnik", uporabnikShema, "Uporabnik");
mongoose.model("Lokacija", lokacijaShema, "Lokacija");
mongoose.model("Oglas", oglasShema, "Oglas");
