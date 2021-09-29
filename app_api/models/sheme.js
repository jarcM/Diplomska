const mongoose = require('mongoose');


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
    datumWorkout:{type:String},


});
const vajeShema = new mongoose.Schema({
    naslov: {type: String},
    placeholder:{type: Number},
    repsWeight: [repWeightShema],
});
const programShema = new mongoose.Schema({
    naslov: {type: String},
    difficulty: {type: String, default:"intermediate"},
    datumWorkout:{type:String},
    vaje: [vajeShema],
    idMainProgram:{type:String}
});
const exerciseShema = new mongoose.Schema({
    naslov: {type: String},
    mainBodyPart:{type: String},
});
const weightShema=new mongoose.Schema({
    weight:{type:Number},
    date:{type:String},

})
const friendsShema=new mongoose.Schema({
    username:{type:String},

})
const uporabnikShema = new mongoose.Schema({
    email: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    datum: {type: String},
    vloga: {type: String},
    workouts: [programShema],
    priljubljeni:{type:[]},
    weight:[weightShema],
    totalKgLifted:{type:Number},
    friends:[friendsShema],
    program:[programShema]
});
mongoose.model('Dogodek', dogodekShema, 'Dogodek');
mongoose.model("Uporabnik", uporabnikShema, "Uporabnik");
mongoose.model("Oglas", oglasShema, "Oglas");
mongoose.model("Program", programShema, "Program");
mongoose.model("Vaje", vajeShema, "Vaje");
mongoose.model("RepWeight", repWeightShema, "RepWeight");
mongoose.model("Exercise", exerciseShema, "Exercise");
mongoose.model("Weight", weightShema, "Weight");
mongoose.model("Friends", friendsShema,"Friends");



