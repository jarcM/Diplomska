const hbs = require('hbs');
const moment = require('moment');

hbs.registerHelper('setChecked', (value, currentValue) => {
    if (value == currentValue) {
        return 'checked';
    } else {
        return "";
    }
});


hbs.registerHelper('zvezdice', (ocena) => {
    let zvezdice = '';
    for (let i = 1; i <= 5; i++)
        zvezdice += '<i class="fa' + (ocena >= i ? 's' : 'r') + ' fa-star fa-3x"></i>';
    return zvezdice;
});
hbs.registerHelper('zasedenost', (max, trenutno) => {
    let zasedenost = trenutno / max * 100;
    return zasedenost;
});

hbs.registerHelper('anonimnost', (ime) => {
    if (ime == 'anonimno') {
        return '<td class= anonimno>' + ime + '</td>';
    } else {
        return '<td>' + ime + '</td>';
    }
});

hbs.registerHelper('datumIzpisVInputu', (datum) => {
    date = new Date(datum);
    return date.toISOString().slice(0, 16);
})

hbs.registerHelper('datumHome', (datum) => {
    ret = moment(datum).format('DD. MM. YYYY ob HH:mm')
    return ret;
})

hbs.registerHelper('isValid', (skupnaOcena) => {
    if(skupnaOcena === 0){
    return "img/pic_1.png"
    }
    else if(skupnaOcena>=0&&skupnaOcena<2500){
        return "img/pic_6.png"
    }
    else if(skupnaOcena>=2500&&skupnaOcena<5000){
        return "img/pic_5.png"
    }
    else if(skupnaOcena>=5000&&skupnaOcena<7500){
        return "img/pic_3.png"
    }
    else if(skupnaOcena>=7500&&skupnaOcena<10000){
        return "img/pic_2.png"
    }
    else if(skupnaOcena>=10000){
        return "img/pic_4.png"
    }
    return "img/pic_1.png"
});