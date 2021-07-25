const mongoose = require('mongoose');



const lokacijaShema = new mongoose.Schema({
    mesto: {type: String},
    naslov: {type: String, required: true},
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
const repWeightShema = new mongoose.Schema({
    reps1: {type: Number, default:0},
    weight1: {type: Number, default:0},
    reps2: {type: Number, default:0},
    weight2: {type: Number, default:0},
    reps3: {type: Number, default:0},
    weight3: {type: Number, default:0},
    reps4: {type: Number, default:0},
    weight4: {type: Number, default:0},
    reps5: {type: Number, default:0},
    weight5: {type: Number, default:0},

});
const vajeShema = new mongoose.Schema({
    naslov: {type: String},
    placeholder:{type: Number},
    repsWeight: [repWeightShema],
});
const programShema = new mongoose.Schema({
    naslov: {type: String},
    visibility:{type: String},
    difficulty: {type: String, default:"Personal"},
    vaje: [vajeShema],
});
const exerciseShema = new mongoose.Schema({
    naslov: {type: String},
    mainBodyPart:{type: String},
});
const uporabnikShema = new mongoose.Schema({
    email: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    datum: {type: Date},
    vloga: {type: String},
    workouts: [programShema],
    priljubljeni:{type:[]},
    ocena: {type: Number, default: 0},
    skupnaOcena:{type:Number,default: 0},
    totalKgLifted:{type:Number}
});
mongoose.model('Dogodek', dogodekShema, 'Dogodek');
mongoose.model("Uporabnik", uporabnikShema, "Uporabnik");
mongoose.model("Lokacija", lokacijaShema, "Lokacija");
mongoose.model("Oglas", oglasShema, "Oglas");
mongoose.model("Program", programShema, "Program");
mongoose.model("Vaje", vajeShema, "Vaje");
mongoose.model("RepWeight", repWeightShema, "RepWeight");
mongoose.model("Exercise", exerciseShema, "Exercise");



