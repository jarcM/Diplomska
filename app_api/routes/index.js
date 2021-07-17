const express = require('express');
const router = express.Router();
const ctrlDogodki = require('../controllers/dogodki');
const ctrlKomentarji = require('../controllers/komentarji');
const ctrlUporabniki = require('../controllers/uporabniki');
const ctrlLokacije = require('../controllers/lokacije');
const ctrlMain=require('../../app_server/controllers/main')



/* Dogodki */
router.get('/dogodki',
    ctrlDogodki.dogodkiSeznam);
router.post('/dogodki',
    ctrlDogodki.dogodekKreiraj);
router.post('/oglasi',
    ctrlDogodki.oglasKreiraj);
router.get('/dogodki/:idDogodka',
    ctrlDogodki.dogodkiPreberiIzbrano);
router.get('/uporabniki/:idUporabnika',
    ctrlDogodki.uporabnikiPreberiIzbrano);
router.put('/dogodki/:idDogodka',
    ctrlDogodki.dogodkiPosodobiIzbrano);
router.delete('/dogodki/:idDogodka',
    ctrlDogodki.dogodkiIzbrisiIzbrano);

/* Komentarji */
router.post('/uporabniki/:idUporabnika/komentarji',
    ctrlKomentarji.komentarjiKreiraj);
router.post('/uporabniki/:idUporabnika/priljubljeni/:idDogodka',
    ctrlMain.priljubljeniKreiraj);

/* Uporabniki */
router.get('/seja', ctrlUporabniki.vrniSejo);

router.get('/uporabniki',
    ctrlUporabniki.oceneSeznam);
router.post('/uporabniki',
    ctrlUporabniki.uporabnikiKreiraj);
router.delete('/uporabniki/:idUporabnika',
    ctrlUporabniki.uporabnikiIzbrisiIzbrano);
router.get('/uporabniki/test/:email',
    ctrlUporabniki.pridobiUporabnikId)
/* Lokacije */

router.get('/lokacije',
    ctrlLokacije.lokacijeSeznam);
router.post('/lokacije',
    ctrlLokacije.lokacijeKreiraj);
router.delete('/lokacije/:idUporabnik',
    ctrlLokacije.lokacijeIzbrisiIzbrano);
module.exports = router;
