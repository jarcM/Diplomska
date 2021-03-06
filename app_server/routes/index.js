var express = require('express');
var router = express.Router();
var ctrlLogin = require("../controllers/login");
const ctrlMain = require('../controllers/main');
const ctrlDogodki = require('../../app_api/controllers/dogodki');
const ctrlUporabniki = require('../../app_api/controllers/uporabniki');

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
router.get('/addWorkoutProgram', ctrlDogodki.dodajOglas);
router.post('/addWeight', ctrlDogodki.addWeight);

router.get('/addExerciseToWorkout', ctrlDogodki.addExerciseToWorkout);
router.get("/lol", ctrlDogodki.lol);
router.post("/lol", ctrlDogodki.lol);


router.get('/addExercise',ctrlDogodki.addExercise)
router.post('/addExercise',ctrlDogodki.exerciseKreiraj)

router.post("/AddEvent", ctrlDogodki.shraniDogodek);

router.post("/addWorkoutProgram", ctrlDogodki.shraniOglas);
router.post("/addExerciseToWorkout", ctrlDogodki.vajeKreiraj);
router.get('/EditEvent', ctrlMain.editEvent);
router.get('/EditEvent/:idDogodka', ctrlDogodki.urediDogodek);
router.get('/rezervirajDogodek/:idDogodka', ctrlDogodki.rezervirajDogodek);
router.get('/myEvents', ctrlMain.myEvents);
router.get('/programsList', ctrlMain.programsList)
router.get('/login', ctrlLogin.login);
router.get('/registration', ctrlLogin.registration);
router.get('/termsOfService', ctrlLogin.termsOfService);
router.post('/registration', ctrlUporabniki.shraniUporabnika);
router.post('/login', ctrlUporabniki.preveriUporabnika);
router.get('/profil', ctrlMain.profil);
router.get('/addWeight', ctrlDogodki.getAddWeight);
router.get('/1rmcalculator', ctrlDogodki.get1rmcalculator);
router.get('/bmrcalculator', ctrlDogodki.bmrcalculator);


router.get('/myProfile', ctrlMain.myProfile);
router.get('/programsList', ctrlMain.programsList);
router.get('/myProgramsList', ctrlDogodki.myProgramsList);
router.post('/uporabniki/izbrisiUporabnika', ctrlUporabniki.izbrisiUporabnika);
router.get('/seja', ctrlUporabniki.vrniSejo);

router.get('/dogodki/:idDogodka', ctrlMain.eventRating);
router.get('/domacaStran', ctrlMain.home)
router.get('/', ctrlMain.home2)
router.get('/profile/:username',ctrlMain.myProfile2)
router.post('/myProfile', ctrlDogodki.addFriend);

router.post('/uporabniki/priljubljeni/:idDogodka', ctrlMain.shraniPriljubljeni);

router.post('/dogodki/:idDogodka/prijavi', ctrlDogodki.prijavi);
router.post('/dogodki/:idDogodka/odjavi', ctrlDogodki.odjavi);
router.post('/dogodki/:idDogodka/izbrisi', ctrlDogodki.izbrisi);
router.post('/dogodki/:idDogodka/posodobi', ctrlDogodki.posodobiDogodek);


module.exports = router;
router.get('/dogodki/:idDogodka', ctrlMain.eventRating);


module.exports = router;
