var express = require('express');
var router = express.Router();
var ctrlLogin = require("../controllers/login");
const ctrlMain = require('../controllers/main');
const ctrlDogodki = require('../../app_api/controllers/dogodki');
const ctrlUporabniki = require('../../app_api/controllers/uporabniki');
const ctrlMail = require('../controllers/mail')

router.get('/db', ctrlMain.db);
router.get('/db/init', ctrlMain.init);
router.get('/db/brisi', ctrlMain.brisi);
router.get('/eventDetails/:idDogodka', ctrlMain.eventDetails);
router.get('/eventRating/:idDogodka', ctrlMain.eventRating);
router.get('/profil/:idUporabnika', ctrlMain.profil);
router.post('/eventDetails/:idDogodka',ctrlDogodki.addWorkoutToUser);
router.get('/currentWorkout/:counter',ctrlDogodki.currentWorkout);
router.post('/currentWorkout/:counter',ctrlDogodki.currentWorkout2);
router.get('/previousWorkouts/:idDogodka', ctrlDogodki.previousWorkouts);



router.get('/AddEvent', ctrlDogodki.dodajDogodek);
router.get('/objava', ctrlDogodki.dodajOglas);
router.get('/dodajVaje', ctrlDogodki.dodajVaje);
router.get("/lol", ctrlDogodki.lol);
router.post("/lol", ctrlDogodki.lol);


router.get('/addExercise',ctrlDogodki.addExercise)
router.post('/addExercise',ctrlDogodki.exerciseKreiraj)

router.post("/AddEvent", ctrlDogodki.shraniDogodek);

router.post("/objava", ctrlDogodki.shraniOglas);
router.post("/dodajVaje", ctrlDogodki.vajeKreiraj);
router.get('/EditEvent', ctrlMain.editEvent);
router.get('/EditEvent/:idDogodka', ctrlDogodki.urediDogodek);
router.get('/rezervirajDogodek/:idDogodka', ctrlDogodki.rezervirajDogodek);
router.get('/myEvents', ctrlMain.myEvents);
router.get('/servicesList', ctrlMain.servicesList)
router.get('/prijava', ctrlLogin.prijava);
router.post('/pozabljenOgeslo', ctrlUporabniki.pozabljenoGeslo);
router.get('/registracija', ctrlLogin.registracija);
router.get('/pozabljenOgeslo', ctrlLogin.pozabljenogeslo);
router.get('/pozabljenoGeslo2/:idUporabnika', ctrlLogin.pozabljenogeslo2);
router.get('/splosnipogoji', ctrlLogin.splosnipogoji);
router.post('/registracija', ctrlUporabniki.shraniUporabnika);
router.post('/prijava', ctrlUporabniki.preveriUporabnika);
router.get('/profil', ctrlMain.profil);
router.get('/trenutniProfil', ctrlMain.trenutniProfil);
router.get('/servicesList', ctrlMain.servicesList);
router.get('/oglasi', ctrlMain.oglasi);
router.post('/uporabniki/izbrisiUporabnika', ctrlUporabniki.izbrisiUporabnika);
router.get('/seja', ctrlUporabniki.vrniSejo);

router.get('/sendMail', ctrlMail.sendMail)
router.get('/dogodki/:idDogodka', ctrlMain.eventRating);
router.get('/domacaStran', ctrlMain.home)
router.get('/', ctrlMain.home2)

router.post('/uporabniki/priljubljeni/:idDogodka', ctrlMain.shraniPriljubljeni);

router.post('/dogodki/:idDogodka/prijavi', ctrlDogodki.prijavi);
router.post('/dogodki/:idDogodka/odjavi', ctrlDogodki.odjavi);
router.post('/dogodki/:idDogodka/izbrisi', ctrlDogodki.izbrisi);
router.post('/dogodki/:idDogodka/posodobi', ctrlDogodki.posodobiDogodek);
router.post('/uporabniki/posodobi/:idUporabnika', ctrlUporabniki.posodobiGeslo);


module.exports = router;
router.get('/dogodki/:idDogodka', ctrlMain.eventRating);


module.exports = router;
