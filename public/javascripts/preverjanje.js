
function SprotnoPreverjanjeEmail(){
    let a = document.getElementById('email').value;
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (a.match(mailformat)){
        document.getElementById("checkEmail").style.display = "inline";
        document.getElementById("xEmail").style.display = "none";
        document.getElementById("email").style.border= "2px solid #76d600";
    }
    else{
        document.getElementById("xEmail").style.display = "inline";
        document.getElementById("checkEmail").style.display = "none";
        document.getElementById("email").style.border= "2px solid red";
    }
}

function SprotnoPreverjanjeUpIme(){
    let a = document.getElementById('username').value;
    var userformat = /^[0-9a-zA-Z]+$/;
    if (a.match(userformat) && a.length >= 4 && a.length <= 15){
        document.getElementById("checkUser").style.display = "inline";
        document.getElementById("xUser").style.display = "none";
        document.getElementById("username").style.border= "2px solid #76d600";
    }
    else{
        document.getElementById("xUser").style.display = "inline";
        document.getElementById("checkUser").style.display = "none";
        document.getElementById("username").style.border= "2px solid red";
    }
}

function SprotnoPreverjanjeGeslo(){
    let str = document.getElementById('password').value;
    if (str.match(/^[0-9a-zA-Z]+$/g) && str.length >= 4 && str.length <= 30){
        document.getElementById("checkPassword").style.display = "inline";
        document.getElementById("xPassword").style.display = "none";
        document.getElementById("password").style.border= "2px solid #76d600";
    }
    else{
        document.getElementById("xPassword").style.display = "inline";
        document.getElementById("checkPassword").style.display = "none";
        document.getElementById("password").style.border= "2px solid red";
    }
}

function SprotnoPreverjanjePonovitevGesla(){
    let str1 = document.getElementById('password').value;
    let str2 = document.getElementById('password2').value;

    if(str1 == str2){
        document.getElementById("checkPassword2").style.display = "inline";
        document.getElementById("xPassword2").style.display = "none";
        document.getElementById("password2").style.border= "2px solid #76d600";
    }
    else{
        document.getElementById("xPassword2").style.display = "inline";
        document.getElementById("checkPassword2").style.display = "none";
        document.getElementById("password2").style.border= "2px solid red";
    }

}

function checkPassword(form) {
    password = form.password.value;
    password2 = form.password2.value;
    // If password not entered
    if (password == '')
        alert ("Prosim vnesite geslo.");

    // If confirm password not entered
    else if (password2 == '')
        alert ("Prosim potrdite geslo.");

    // If Not same return False.
    else if (password != password2) {
        alert ("\nGesli se ne ujemata, preverite potrditev gesla.")
        return false;
    }
    else{
        console.log("TRUE match");
        return true;
    }
}

function ValidateEmail(form)
{
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(form.email.value.match(mailformat))
    {
        console.log("TRUE email format")
        return true;
    }
    else
    {
        alert("Vnesite pravilni email!");
        return false;
    }
}
function ValidatePassword(form) {
    var str = form.password.value;
    if (str.match(/[a-z]/g) && str.match(
        /[A-Z]/g) && str.match(
        /[0-9]/g) && str.match(
        /[^a-zA-Z\d]/g) && str.length >= 8 && str.length <= 30
        && str.match(/[!@#$%^&*(),.?":{}|<>]/g)){
        console.log("TRUE Password");
        return true;
    }
    else{
        alert("Geslo mora vsebovati vsaj eno številko, vsaj en posebni znak, eno malo črko, eno veliko črko in biti dolžine vsaj 8 znakov");
        return false;
    }
}
function ValidateUsername(form) {
    var a = form.username.value;
    if(a.match(/^[0-9a-zA-Z]+$/) && a.length >= 4 && a.length <= 15)
    {
        console.log("TRUE Username");
        return true;
    }else{
        alert("Uporabniško mora biti dolžine med 4 in 15 znakov!");
        return false;
    }
    return true;
}

function ValidateAddEventForm(form) {
    sth = form.ime_dogodka;
    if(sth.value == "") {
        alert("Vpišite ime vašega dogodka")
        sth.focus();
        return false;
    }
    sth = form.naslov;
    if(sth.value == "") {
        alert("Vpišite lokacijo vašega dogodka")
        sth.focus();
        return false;
    }
    sth = form.mesto;
    if(sth.value == "") {
        alert("Vpišite najbližje večje mesto vašega dogodka")
        sth.focus();
        return false;
    }
    sth = form.organizator;
    if(sth.value == "") {
        alert("Vpišite organizatorja vašega dogodka")
        sth.focus();
        return false;
    }

    sth = form.datum;

    time = Date.parse(sth.value);
    now = Date.now();
    if(sth.value == "") {
        alert("Vnesite čas dokodka.");
        sth.focus();
        return false;
    }
    if (time < now) {
        alert("Čas dogodka je v preteklosti. Vnesite pravilen čas dogodka");
        sth.focus();
        return false;
    }

    sth = form.opis;
    if(sth.value.length < 50) {
        alert("Vpišite podrobnejši opis vašega dogodka")
        sth.focus();
        return false;
    }

    alert("Dogodek uspešno dodan");
    return true;
}
