const mongoose = require('mongoose');
const Uporabnik = mongoose.model('Uporabnik');


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


