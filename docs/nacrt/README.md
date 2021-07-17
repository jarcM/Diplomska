# Načrt sistema

|                             |                                                         |
| :-------------------------- | :------------------------------------------------------ |
| **Naziv projekta**          | Dog walkers                                |
| **Člani projektne skupine** | Amadej Šenk Juh, Klemen Krsnik, Miha Jarc, Jan Dominik Bohak in Luka Tomažič |
| **Kraj in datum**           | Ljubljana, April 2021                                   |

## Povzetek

V okviru načrta arhitekture se nahaja logični in razvojni pogled, katera osvetlita splošno zgradbo spletne aplikacija oziroma našega IS iz večjih perspektiv. Uporabljali smo MVC arhitekturo za logični pogled in komponentni diagram za razvojni pogled. Za lažje razumevanje smo dodali tudi splošnejši diagram komunikacije, ki je razdeljen nad podsisteme našega IS.
V okviru načrta strukture smo zasnovali razredni diagram, ki je prikazoval 3 tip razredov - mejne, kontrolne in poslovne. Na njem smo prikazali tudi načrtovalske vzorce, ki smo jih uporabili tekom razvoja načrta. Razredni diagram je posledica narejenih diagramov zaporedja (občasno potrebujem tudi diagram komunikacije za natančnejšo opredelitev). Sledijo opisi razredov, ki vsebujejo atribute in nesamoumevne metode razreda. Nesamoumevne metode so sestavljene iz opisa, rešitve problemske domene in tipa rezultata ter morebitne interpretacije slednjih. 
V zadnjem delu dokumenta smo obravnavali diagrame zaporedje, s katerimi smo natančneje, bolj iz tehničnega vidika, prikazali tok dogodkov. Tok dogodkov smo udejanili z metodami in sporočilo o povratni informaciji (angl. *feedback*).  

## 1. Načrt arhitekture

V tem podpoglavju sta z diagrami predstavljena **logični** in **razvojni** pogled na arhitekturo sistema. Namen tega podpoglavja je prikazati sistem kot organiziran sklop sodelujočih komponent. Slednja dva pogleda sta ključna za podrobnejšo opredelitev in dokumentacijo arhitekture našega sistema. Pogledi obravnavajo področja, kot so, kako je naš sistem razčlenjen na module in kako procesi med izvajanjem medsebojno delujejo.

### 1.1 Logični pogled

**Logični pogled** prikazuje ključne abstrakcije v sistemu v obliki objektov oz. razredov. Predstavljene entitete logičnega pogleda mora biti mogoče povezati s sistemskimi zahtevami. Slednji diagram prikazuje združeno shemo vseh podsistemov, pri čemer upoštevamo komponente, kot so **krmnilniki** (upravitelj uporabniške interakcije), **modeli** (upravitelj sistemskih podatkov in na njih izvajajočih operacij), **pogledi** (opredelitelj in upravitelj načina predstavitve podatkov uporabniku) in še dodatno **zunanji vmesniki** (vmesniki, kot so denimo API-ji ipd.). Prve tri naštete komponente povezujemo v vzorec **model-pogled-krmnilnik (MVC)** . 
**Krmilnik avtentikacije** je krmilnik-paket, ki združuje krmilnike registracije, prijave in pozabljenega gesla (sinonim - ponastavitev gesla).
**Krmilnik oglasov** je prav tako krmilnik-paket, ki združuje krmilnike objave oglasov, urejanja oglasov, prikaza seznama oglasov, pregleda oglasa.
**Krmilnik za obdelavo HTTP povezav** je krmilnik za upravljanje zunanjih vmesnikov našega sistema.

![slikaarhitekture](../img/BlankDiagram.png)

Vsi podsistemi kot tudi skupni sistem so povezani preko **brskalnika**, saj sicer ne moremo dostopati do naše spletne aplikacije.

* #### Podsistem 1 - Avtentikacija
Podsistem Avtentikacija vključuje upravljanje s tremi različnimi pogledi - **registracijski**, **prijavni**, **pozabljeno geslo obrazec**.
**Krmilnik avtentikacije** pošlje zahtevo po prikazu obrazca, v katerega uporabniki vnesejo svoje pripadajoče podatke. Pogledi pa v zameno pošljejo zahtevo po izvedbi dane funkcionalnosti, s katero upravljajo krmilnik avtentikacije. Po izvedeni funkcionalnosti se podatki pretekajo skozi **model Uporabnik**, kateri z njimi naprej upravlja. Model prav tako vrne status o pravilni prijavi. Prej omenjeni krmilnik pošlje zahtevo po avtentikaciji zunanjemu sistemu reCAPTCHA preko **zunanjega vmesnika reCAPTCHA API**. Le-ta mu vrne status o uspešnosti oziroma o morebitni neuspešnosti avtentikacije.
V našem podsistemu so zunanji vmesniki napisani prosto in ne kot del krmilnika za obdelavo HTTP povezav. Želeli smo pokazati vmesno mesto interakcije z zunanjim svetom. 

![krmilnikavtentikacije](../img/krmilnikavtentikacije.png)
* #### Podsistem 2 - Oglasi
Podsistem Oglasi vključuje upravljanje s štirimi različnimi pogledi - **objava oglasa**, **urejanje oglasa**, **seznam oglasov**, **pregled oglasov**. 
**Krmilnik oglasov** pošlje zahtevo po prikazu obrazca, v katerega uporabniki vnesejo svoje pripadajoče podatke. Po izvedeni funkcionalnosti se podatki pretekajo skozi **model Oglasi**, kateri z njimi naprej upravlja. Model komunicira z **zunanjimi vmesniki** GoogleMaps API, OpenWeatherMap API, Facebook API. Seveda smo tukaj ponovno izpustili krmilnik za obdelavo HTTP povezav iz zgoraj omenjenega razloga. Preko teh zunanjih vmesnikov pridobimo podatke oziroma objekte - zemljevid in vreme. V okviru podsistema je možno tudi na spletni stran deliti oglas na družbeno omrežje Facebook.

![krmilnikoglasov](../img/krmilnikoglasov.png)
* #### Podsistem 3 - Profil
Podsistem Profil vključuje upravljanje s pogledom **Pregled profila**. **Krmilnik profila** pošlje zahtevo po prikazu podatkov profila, v katerega uporabniki vnesejo svoje pripadajoče podatke. Po izvedeni funkcionalnosti se podatki pretekajo skozi **modele Oglasi, Uporabnik, Komentarj in Ocene**, kateri z njimi naprej upravljajo. V okviru tega podsistema nimamo opravka z nobenimim zunanjim vmesnikom.

![krmilnikprofila](../img/krmilnikprofila.png)
* #### Podsistem 4 - Lestvica rangiranja
Podsistem Profil vključuje upravljanje s pogledom **Top 10**. Top 10 predstavlja lestvico 10 najboljše ovrednotenih ponudnikov storitev. **Krmilnik za Top 10** pošlje zahtevo po prikazu 10 ponudnikov z najvišjim elotom. Po izvedeni funkcionalnosti se podatki pretekajo skozi **model Uporabniki in Ocene**, kateri z njimi naprej upravljajo. V okviru tega podsistema nimamo opravka z nobenimim zunanjim vmesnikom.  

![krmilniktop10](../img/krmilniktop10.png)
* #### Podsistem 5 - Domača stran
Podsistem Domača stran vključuje upravljanje s pogledom **Domača stran**. Domača stran je prva stran, ki je na voljo uporabnikom naše spletne aplikacije. **Krmilnik za domačo stran** pošlje zahtevo po prikazu slik in tweetov. V okviru tega podsistema imamo opravka z zunanjim vmesnikom Twitter API, od katerega pridobimo podatke o tweetih, denimo naslov objave, grafično gradivo, anotacije, opis objave ipd.

![krmilnikdomacastran](../img/krmilnikdomacastran.png)
* #### Podsistem 6 - Brisanje
Podsistem Brisanje vključuje upravljanje s pogledom **Brisanje oglasov - admin**. Podsistem je nekoliko unikaten in le dostopen s strani uporabniške vloge - moderator spletne strani (oziroma admin). **Krmilnik za brisanje oglasov** pošlje zahtevo po prikazu oglasov, na katero lahko moderator spletne strani odgovori z zahtevo po izbrisu oglasa. Po izvedeni funkcionalnosti se podatki pretekajo skozi **model Oglasi**, kateri z njim naprej upravlja. V okviru tega podsistema nimamo opravka z nobenimim zunanjim vmesnikom.  

![krmilnikzabrisanje](../img/krmilnikzabrisanje.png)

Zgoraj omenjeni podsistemi ne predstavljajo poenostavitve kateregakoli kasneje sledečega diagrama, vendar le podsisteme našega IS in njihovo nekoliko bolj podrobno komunikacijo z namenom, da bralec lažje razpozna vlogo posameznih elementov v nadaljevanju dokumenta.

### 1.2 Razvojni pogled
Razvojni pogled sistema je predstavljen s **komponentnim diagramom**. Le-ta predstavlja največje in najpomembnejše komponente glede na vlogo v spletni aplikaciji. V okviru IS Dog Walkers se nahajata dva tipa podatkovnih baz, **relacijska**(MySQL) in **nerelacijska podatkovna baza**(MongoDB). Prvo bomo uporabljali za hranjenje podatkov o uporabniku in ocenah, saj so relacijske baze zelo varne za podatkovne transakcije. Omogoča nam tudi, da opravljamo zahtevnejše SQL poizvedbe za podatkovne analize (angl. *data analysis*). Slike psov bomo prav tako shranili v relacijsko podatkovno bazo. Nerelacijske podatkovne baze so zelo uspešne pri shranjevanju in operacijah nad velikimi količinami podatkov. So veliko bolj primerne za podatkovne modele, kot so Oglasi in Komentarji, katerih jih bo zelo veliko. Razmerje teh bo 1:n z uporabnikom, pri čemer bo uporabnik lahko napisal n-število oglasov. Tukaj bomo uporabili dokumetno-orientiran pristop (JSON datoteka) z MongoDB. S tem načinom distribucije podatkovnih baz bi radi povečali hitrost agregacije podatkov in s tem zmogljivost IS.

Podatkovni modeli so različno obarvani v primerjavi z ostalimi komponentami, saj se od le-teh bistveno razlikujejo po vlogi (shranjevanje podatkov). 

**Črtkana črta** predstavlja odvisnost (angl. *dependency*), primer: Avtentikacija je odvisna od Domače strani, saj do nje ne moremo dostopati, kot pa da še prej dostopamo do domače strani.

![razvojniPogled](../img/razvojni_pogled-1.png)

## 2. Načrt strukture

### 2.1 Načrtovalski vzorci

* #### Decorator

V sklopu našega IS bomo uporabili **krmilnik Avtentikacija**, ki je nadrazred skupine krmilnikov: krmilnikRegistracija, krmilnikPrijava, krmilnikPonastavitevGesla. Zaradi prekrivajočih se elementov in metod uporabimo nadrazred Avtentikacija. S tem poenostavimo uporabo krmilnika pri naših primerih uporabe. Na razrednem diagramu je ta predel označen z rumeno ploskvijo.

**Vloga:** Pripne dodatne odgovornosti objektu, ne da bi se spremenil njegov vmesnik. Dekatorji zagotavljajo fleksibilno alternativo podrazredom za dodajanje dodatnih funkcionalnosti.

* #### Singletone

V sklopu načrta našega IS bomo uporabili tudi načrtovalski vzorec Singletone - edinec. Pri nas se to odraža pri razredih, kot so denimo: ZMRegistracija, ZMPrijava, ZMPonastavitevGesla itd. Vsi ti razredi imajo zgolj eno instanco, torej le en objekt, ki se ne spremeni tekom časa. Ta vzorec rešuje problem povezavo s podatkovno bazo in enovitnosti dostopa do določenega vira.

**Vloga:** Poskrbi, da imajo razredi samo eno instanco in priskrbi globalno točko dostopa do nje.


### 2.2 Razredni diagram

Razredni diagram vsebuje **mejne**, **kontrolne** in **poslovne** razrede. Med njimi se nahajajo tudi ustrezne povezave, ki denimo ponazarjajo odvisnosti ali pa zgolj asociacijo z neko kardinalno odvisnostjo - razmerje. Med mejne razrede v našem razrednem diagramu uvrščamo **zaslonske maske** (ZM) in **sistemske vmesnike** (SV). V okviru razrednega ne uporabljam vmesnikov do naprav ali na kratko VN. Poslovni razredi med seboj nimajo usmerjene povezave. V našem razrednem diagramu nismo ponazorili metod in atributov, saj bi to zmanjšalo preglednost razrednega diagrama. Vključili smo le atribute in metode, ki so del načrtovalskih vzorcev, tj. Singletone ali Decorator.

![razredniDiagram](../img/razredniDiagramBogPomagi-3.png)

### 2.3 Opis razredov

V okviru te točke so navedeni in opisani vsi razredi podrobno. V okviru opisov metod ne bomo upoštevali metode načrtovalskih vzorcev, saj so le-te že predstavljene v zgornjem razdelku in na razrednem diagramu. 
Metode onChange(), onClick(), onCheck() spadajo med trivialne metode, saj je njihov pomen jasen, zato se v okviru nesamoumevnih metod ne pojasnjujejo.

* #### ZMRegistracija
ZMRegistracija predstavlja mejni razred, tipa zaslonska maska (ZM). V okviru našega IS predstavlja registracijski obrazec, v katerega neregistriran uporabnik vnese podatke potrebne za registracijo. Ta razred neposredno komunicira s krmilnikom za registracijo.

#### Atributi

Ta razred ne vsebuje atributov.

#### Nesamoumnevne metode

Ta razred ne vsebuje nesamoumevnih metod.

---

* #### KrmilnikRegistracija
ZMRegistracija predstavlja mejni razred, tipa zaslonska maska (ZM). V okviru našega IS predstavlja registracijski obrazec, v katerega neregistriran uporabnik vnese podatke potrebne za registracijo. Ta razred neposredno komunicira s krmilnikom za registracijo.

#### Atributi

Ta razred ne vsebuje atributov.

#### Nesamoumnevne metode

- preveriOblikoEmaila(String email):
  - Opis: Metoda preveri, ali je oblika vnešenega e-poštnega naslova ustrezna. Za to uporablja regularni izraz. 
  - Tip rezultata: boolean (TRUE, če je oblika pravila sicer FALSE)

- prikažiVeljavenEmail():
  - Opis: Metoda prikaže glifikon kljukice, ki nakazuje, da je oblika e-poštnega naslova ustrezna.
  - Tip rezultata: void

**POZOR:** Vse funkcije, ki se začnejo z prikažiVeljavenX(), pri čemer je X stvar preverbe, se končajo s prikazom glifikona kljukice. Nasprotno, pri prikažiNeveljavenX() se končajo s prikazom glifikona križec ali ustreznim sporočilom o napaki.

- preveriOblikoUpImena(String ime):
  - Opis: Metoda preveri, ali je oblika vnešenega uporabniškega imena ustrezna. Za to uporablja regularni izraz. Uporabniško ime mora biti dolgo med 4 in 15 znakov.
  - Tip rezultata: boolean (TRUE, če je oblika pravila sicer FALSE)

- preveriObstojoUpIme(String ime):
  - Opis: Metoda preveri, ali uporabnik z navedenim uporabniškim imenom že obstaja v podatkovni bazi.
  - Tip rezultata: boolean (TRUE, če uporabnik ne obstaja sicer FALSE)

- preveriOblikoGesla(String geslo):
  - Opis: Metoda preveri, ali je oblika vnešenega gesla ustrezna. Za to uporablja regularni izraz. Geslo mora biti dolgo med 8 in 30 znakov, vsebovati mora vsaj 1 veliko črko, vsaj 1 poseben znak in vsaj 1 števko.
  - Tip rezultata: boolean (TRUE, če je oblika pravila sicer FALSE)

- preveriUjemanjeGesla(String geslo1, String geslo 2):
  - Opis: Metoda preveri ujemanje dveh nizov znakov s funkcijo strcmp() oziroma na daljše - angl. *String compare*.
  - Tip rezultata: boolean (TRUE, če se niza ujemata sicer FALSE)
 
- preveriReCAPTCHA(Human uporabnik):
  - Opis: Metoda preveri avtentičnost uporabnik z preverbo objekta tipa Human. Preverjanje poteka na strani zunanjega sistema.
  - Tip rezultata: boolean (TRUE, če je uporabnik človek sicer FALSE)

- preveriObstojEmaila(String email):
  - Opis: Metoda preveri, ali uporabnik z navedenim e-poštnim naslovom že obstaja v podatkovni bazi.
  - Tip rezultata: boolean (TRUE, če uporabnik ne obstaja sicer FALSE)

---

* #### SVReCAPTCHA API
SVReCAPTCHA API predstavlja mejni razred, tipa sistemski vmesnik (SV). V okviru našega IS predstavlja sistemski vmesnik med našim IS in zunanjim sistemom.

#### Atributi

Ta razred ne vsebuje atributov.

#### Nesamoumnevne metode

- preveriReCAPTCHA(Human uporabnik):
  - Opis: Metoda preveri avtentičnost uporabnik z preverbo objekta tipa Human. Preverjanje poteka na strani zunanjega sistema.
  - Tip rezultata: boolean (TRUE, če je uporabnik človek sicer FALSE)

---

* #### ZMSeznamPovpraševanj
ZMSeznamPovpraševanj predstavlja mejni razred, tipa zaslonska maska (ZM). V okviru našega IS predstavlja registracijski obrazec, v katerega neregistriran uporabnik vnese podatke potrebne za registracijo. Ta razred neposredno komunicira s krmilnikom za registracijo.

#### Atributi

Ta razred ne vsebuje atributov.

#### Nesamoumnevne metode

Razred ne vsebuje nobenih nesamoumevnih metod.

---
  
* #### KrmilnikPregledOglasa
Krmilnik pregled oglasa se uporablja pri pregledovanju podrobnosti oglasov.

#### Atributi

Ta razred ne vsebuje atributov.

#### Nesamoumnevne metode

- vrniPovprasevanja(Oglas oglas)
  - Opis: Metoda vrne objekt oglasov.
  - tip rezultata: seznam Oglas
  
- vrniPodatkeOOglasu(Oglas oglas)
  - Opis: Metoda vrne objekt oglasov.
  - tip rezultata: Oglas

- vrniPodatkeoVremenu(Vreme vreme)
  - Opis: Metoda vrne objekt vremena.
  - tip rezultata: Vreme
  
- vrniPodatkeoLokaciji(Lokacija lokacija)
  - Opis: Metoda vrne objekt lokacija.
  - tip rezultata: Lokacija

---
 
* #### ZMObjavaOglasa
Zaslonska maska objava oglasa vsebuje pogled, kjer uporabnik vpise vse potrebne vrednosti in objavi oglas, povezana je z krmilnikom Objava oglasa.
#### Atributi

Ta razred ne vsebuje atributov.

#### Nesamoumnevne metode

Razred ne vsebuje nobenih nesamoumevnih metod.
 
---
 
* #### KrmilnikObjavaOglasa
Krmilnik objava oglasa se uporablja pri objavljanju oglasa in vnosu vrednosti, sodeluje pri komunikaciji med zaslonsko masko in modelom Oglas
#### Atributi

Ta razred ne vsebuje atributov.

#### Nesamoumnevne metode

- objaviOglas(Oglas oglas)
  - Opis: Metoda, ki prepošlje oglas tipa Oglas
  - tip rezultata: void
  
---

* #### Oglas
Model uporabnik, vsebuje vse podatke , ki jih sistem rabi za shranjevanje oglasov.
#### Atributi

Ta razred ne vsebuje atributov.

#### Nesamoumnevne metode

- shraniOglas(Oglas oglas)
  - tip rezultata: void

- vrniPovprasevanja(Oglas oglas)
  - tip rezultata: seznam Oglas
  
- vrniPodatkeOOglasu(Oglas oglas)
  - tip rezultata: Oglas
  
- zbrisiOglas(Oglas oglas)
  - tip rezultata: void
  - ob klicu metode se zbrise oglas z atributiom oglas
  
- onemogočiZaDruge(Oglas oglas)
  - tip rezultata: void
  - ob klicu metoda oglas označi in onemogoči rezervacijo drugim uporabnikom


---

* #### ZMProfil
Zaslonska maska profil se uporablja za prikaz profila.
#### Atributi

Ta razred ne vsebuje atributov.

#### Nesamoumnevne metode

- vrniProfil()
  - tip rezultata: Profil
  - metoda vrne objekt Profil 
  - Namen te metode je da izpostavi objekt Profil na zaslonski maski.

- prikaziPodrobnostiProfila()
  - tip rezultata: void
  - Namen te metode je, da uporabniku prikaže podrobnosti profila.

---
  
* #### KrmilnikPregledProfila

Krmilnik pregled profila se uporablja pri prikazu vseh podatkov o profilu, ki jih pridobi iz modela Uporabnik

#### Atributi

Ta razred ne vsebuje atributov.

#### Nesamoumnevne metode

- vrniProfil()
  - tip rezultata: Profil
  - metoda vrne objekt Profil 
  - Namen te metode je da izpostavi objekt Profil na zaslonski maski.

---

* #### ZMUrejanjeOglasa
Zaslonska maska urejanje oglasa se uporablja za prikaz pogleda urejanje oglasa, kjer uporabnik lahko ureja že obstoješ oglas.
#### Atributi

Ta razred ne vsebuje atributov.

#### Nesamoumnevne metode

- vnesiAliPopraviNaslov(String Naslov)
  - tip rezultata: void
  - če je vpisan nov naslov ga shrani v podatkovno bazo

- vnesiAliPopraviDatumInCas(DateTime datumInCas)
  - tip rezultata: void
  - če je vpisan nov datum in čas ga shrani v podatkovno bazo

  
- vnesiAliPopraviTrajanje(String trajanje)
  - tip rezultata: void
  - če je vpisano novo trajanje ga shrani v podatkovno bazo

  
- vnesiAliPopraviKraj(String kraj)
  - tip rezultata: void
  - če je vpisan nov kraj ga shrani v podatkovno bazo

  
- vnesiAliPopraviKontakt(String kontakt)
  - tip rezultata: void
  - če je vpisan nov kontakt ga shrani v podatkovno bazo

---
  
* #### KrmilnikUrejanjeOglasa

Krmilnik urejanje oglasa se uporablja pri urejanju oglasov, pridobi podatke oglasov iz modela Oglas in jih po potrebi zamenja z novo vnesenimi podatki.

#### Atributi

Ta razred ne vsebuje atributov.

#### Nesamoumnevne metode

- preveriOblikoKontakta(String kontakt)
  - Opis: Preveri telefonsko število kontakta z uporabo regularnega izraza. Telefonska števila mora vsebovati 9 mest.
  - tip rezultata: boolean (TRUE, če je pravilna telefonska številka sicer FALSE)

---

* #### ZMTop10
Zaslonska maska top 10 prikazuje deset najvišje ocenjenih ponudnikov storitev.
#### Atributi

Ta razred ne vsebuje atributov.

#### Nesamoumnevne metode

- zacniPregledNajPonudnikov(String Naslov)
  - tip rezultata: void

---
  
* #### KrmilnikTop10
Krmilnik Top 10 se uporablja pri prikazovanju deset najbolje ocenjenih uporabnikov, in pridobi podatke iz modela Ocene.
#### Atributi

Ta razred ne vsebuje atributov.

#### Nesamoumnevne metode

- vrniNajPonudnike()
  - tip rezultata: Ponudniki[] 
  
---

* #### ZMPrijava
Zaslonska maska za prijavo.

#### Atributi

Ta razred ne vsebuje atributov.

#### Nesamoumnevne metode

- zacniPrijavo()
  - tip rezultata: void

- prikazEmailaAliGesloNapacno()
  - tip rezultata: void,
  - Namen te metode je prikaz sporočila, da so vpisni podatki napačni.

---

* #### KrmilnikPrijava
Krmilnik za prijavo.
#### Atributi

Ta razred ne vsebuje atributov.

#### Nesamoumnevne metode

- ponastaviGeslo()
  - tip rezultata: void,
  - Namen te metode je izbris trenutnega gesla uporabnika.

- preveriReCAPTCHA()
  - tip rezultata: boolean 
  - True če je vpisana reCAPTCHA pravilna, false če ni,
  - Namen te metode je preveriti če je vpisana reCAPTCHA. Metoda na ta način prepreči registracijo brez, z napačno vpisano reCAPTCHO.

- preveriUporabnika(String email, String geslo)
  - tip rezultata: boolean,
  - True če so podatki o uporabniku pravilni, false če niso,
  - Namen te metode je preveriti če so vpisni podatki za uporabnika pravilni.

- vrniUporabnika()
  - tip rezultata: Uporabnik,
  - Namen te metode je da vrne objekt Uporabnik.

---

* #### ZMPonastavitevGesla

Zaslonska maska za ponastavitev gesla.

#### Atributi

Ta razred ne vsebuje atributov.

#### Nesamoumnevne metode

- zacniPonastavitevGesla()
  - tip rezultata: void

---

* #### KrmilnikPonastavitevGesla

Krmilnik za ponastavitev gesla.

#### Atributi

Ta razred ne vsebuje atributov.

#### Nesamoumnevne metode

- preveriObstojEmaila(String email)
  - tip rezultata: boolean,
  - True če podani email obstaja, false če ne.
  
- posljiPovezavoZaNovoGeslo(String email)
  - tip rezultata: void,
  - Namen te metode je da na podan elektronski naslov pošlje povezavo za zamenjavo gesla.

- vrniStatusEmaila()
  - tip rezultata: boolean
  - True če email obstaja, false če ne,
  - Namen te metode je preveriti če v bazi obstaja podani email.

- preveriGeslo(String geslo)
  - tip rezultata: boolean 
  - True če je geslo ustrezno, false če je neustrezno,
  - Namen te metode je preveriti ustreznost oblike gesla. Metoda na ta način prepreči registracijo z geslom neveljavne oblike.

- preveriUjemanje(String geslo1, String geslo2)
  - tip rezultata: boolean 
  - True če sta gesla identična, false če nista,
  - Namen te metode je preveriti identičnosti gesel. Metoda na ta način prepreči registracijo z ne identičnima neveljavne oblike.

- potrdiNovoGeslo()
  - tip rezultata: boolean,
  - True, če je geslo vredu, false če ni
  - Namen te metode je da sistemu sporoči naj danemu uporabniku dodeli novo geslo.

---

* #### ZMNastavitevNovegaGesla
Zaslonska maska za nastavitev novega gesla.
#### Atributi

Ta razred ne vsebuje atributov.

#### Nesamoumnevne metode

- prikaziVeljavnoGeslo()
  - tip rezultata: void,
  - Namen te metode je da uporabniku prikaže zahteve za veljavno geslo (npr. zadostno število znakov, velike, male črke,...).

- prikaziUjemanje()
  - tip rezultata: void,
  - Namen te metode je da uporabniku prikaže ali se podani gesli ujemata.

---

* #### SVGMail API
Gmail API je zunanji sistem za potrjevanje in ponastavljanje gesla.
#### Atributi

#### Nesamoumnevne metode

- posljiPovezavoZaNovoGeslo()
  - tip rezultata: void,
  - Namen te metode je da uporabniku preko elektronske pošte pošlje povezavo za pridobitev novega gesla.

---
* #### ZMDomačaStran
Zaslonska maska domača stran prikazuje domačo stran.
#### Atributi

Ta razred ne vsebuje atributov.

#### Nesamoumnevne metode

Ta razred ne vsebuje nesamoumevnih metod.


---
* #### SVFacebook API
Zunanji vmeskik Facebook API se uporablja za deljenje oglasov na facebook profil.
#### Atributi

Ta razred ne vsebuje atributov.

#### Nesamoumnevne metode

Razred ne vsebuje nesamoumevnih metod.

---
* #### ZMDomačaStran

Zaslonska maska za domačo stran.

#### Atributi

Ta razred ne vsebuje atributov.

#### Nesamoumnevne metode

- zacniPonastavitevGesla()
  - tip rezultata: void



---

* #### KrmilnikDomačaStran
Krmilnik domača stran se uporablja pri prikazu domače strani, na kateri so prikazane slike psov in pa novice iz twitterja.
#### Atributi

#### Nesamoumnevne metode

- premikSlike(void)
  - tip rezultata: void,
  - ob klicu metode se slike iz galerije premaknejo levo ali desno. 

---

* #### KrmilnikSkrbniškiČin
Krmilnik skrbniški čin se uporablja za izračun elota.
#### Atributi

#### Nesamoumnevne metode

- prištejŠeEnoAktivnost(Uporabnik uporabnik)
  - tip rezultata: void,
  - uporabniku prišteje še eno opravljeno aktivnost.  
 
- izračunajElo(Uporabnik uporabnik)
  - tip rezultata: void,
  - uporabniku prebere ocene in število aktivnosti in mu izračuna elo.
  
- razvrstiVRazred()
  - tip rezultata: void,
  - uporabnika razvrsti v razred glede na njegov elo.
  
- vrniOcene(Uporabnik uporabnik)
  - tip rezultata: void,
  - ob klicu metode iz modela Ocene pridobi vse ocene uporabnika.
  
---

* #### KrmilnikOcenjevanjePonudnikov

Ta razred predstavlja krmilnik, ki upravlja s primerom uporae ocenjevanje ponudnikov. 

#### Atributi

Ta razred ne vsebuje atributov.

#### Nesamoumnevne metode

- shraniOcenoInKOmentar(Ocena ocena, String komentar):
  - Opis: Metoda, ki zgolj posreduje oceno in komentar modelu Ocene in Komentarji.
  - Tip rezultata: void

--- 

* #### Uporabnik

Uporabnik je poslovni razred znotraj našega IS. Uporablja se za shranjevanje in upravljanje s podatki v zvezi z uporabniki.

#### Atributi
  - uporabniskoIme : String
  - gesloHash : Integer
  - Email : String
  - rojstniDatum : Date
  - vloge : Vloge[]
  - jePotrjen : boolean
  - jeModerator: boolean
  - priljubljeni : Uporabniki[]

#### Nesamoumnevne metode

Poslovni razred Uporabnik ne vsebuje nesamoumevnih metod.

---

* #### Oglasi

Oglasi je poslovni razred znotraj našega IS. Uporablja se za shranjevanje in upravljanje s podatki v zvezi z oglasi uporabnikov.

#### Atributi
  - naslov oglasa : String
  - datumInCas : Date & Time
  - trajanje : Integer
  - kraj : String
  - posta : Integer
  - ulica : String
  - hisnaSt : String
  - kontakt : String
  - opis zahtev : String
  - jePovpraševanje : boolean
  - jeStoritev: boolean

#### Nesamoumnevne metode

Poslovni razred Oglasi ne vsebuje nesamoumevnih metod.

---

* #### Ocene

Ocene je poslovni razred znotraj našega IS. Uporablja se za shranjevanje in upravljanje s podatki v zvezi z ocenami uporabnikov.

#### Atributi
  - povpOcena : Integer
  - sumOcena : Integer
  - stOcen : Integer
  - elo : Integer

#### Nesamoumnevne metode

Poslovni razred Oglasi ne vsebuje nesamoumevnih metod.

---

* #### Komentarji

Komentarji je poslovni razred znotraj našega IS. Uporablja se za shranjevanje in upravljanje s podatki v zvezi z komentarji ocen.

#### Atributi
  - IdOdUporabnik : Integer
  - IdDoUporabnik : Integer
  - vsebinaKomentarja : String
  - idKomentarja : Integer

#### Nesamoumnevne metode

Poslovni razred Komentarji ne vsebuje nesamoumevnih metod.

---

* #### Slike psov

Slike psov je poslovni razred znotraj našega IS. Uporablja se za shranjevanje in upravljanje s slikami psov za prikaz na domači strani spletne aplikacije.

#### Atributi
  - slikePsa: Slika[]

#### Nesamoumnevne metode

Poslovni razred Slike psov ne vsebuje nesamoumevnih metod.

---

* #### KrmilnikGalerijapsov

KrmilnikGalerijapsov je krmilnik, ki upravlja z galerijo na domači strani spletne aplikacije

#### Atributi
Nima atributov

#### Nesamoumnevne metode

Razred ne vsebuje nesamoumevnih metod.

---

* #### KrmilnikPregledNovic

KrmilnikPregledNovic je krmilnik, ki upravlja s Twitter novicami na domači strani spletne aplikacije.

#### Atributi
Nima atributov

#### Nesamoumnevne metode

Razred ne vsebuje nesamoumevnih metod.

---

* #### KrmilnikIzbrisOglasa

KrmilnikIzbrisOglasa je krmilnik, ki upravlja s brisanjem oglasov. Do tega primera uporabe dostopa le moderator spletne strani.

#### Atributi
Nima atributov

#### Nesamoumnevne metode

Razred ne vsebuje nobenih nesamoumevnih metod.

---

* #### KrmilnikFiltriranjaInSortiranje

KrmilnikFiltriranjaInSortiranje je krmilnik, ki upravlja s filtriranjem in sortiranjem seznama oglasov. Do tega primera uporabe dostopajo lahko vsi registrirani uporabniki spletne aplikacije.

#### Atributi
Nima atributov

#### Nesamoumnevne metode

- vrniFiltriraneOglase(Oglas[] oglasi):
  - Opis: Vrne seznam filtriranih oglasov.
  - Tip rezultata: Oglas[]

---

* #### KrmilnikDelitevOglasov

KrmilnikDelitevOglasov je krmilnik, ki upravlja s deljenjem oglasov na družbeno omrežje Facebook. Do tega dostopajo registrirani uporabniki.

#### Atributi
Nima atributov

#### Nesamoumnevne metode

Razred ne vsebuje nobenih nesamoumevnih metod.

---

* #### KrmilnikRezervacija

KrmilnikRezervacija je krmilnik, ki upravlja z rezervacijo terminov posameznih oglasov bodisi povpraševanj bodisi storitev. Do tega primera uporabe dostopajo registrirani uporabniki.

#### Atributi
Nima atributov

#### Nesamoumnevne metode

- onemogočiZaRezervacijo(Oglas oglas, id oglasa):
  - Opis: Metoda, ki poskrbi, da ni moč rezervirati termina danega oglasa. To se zgodi v primeru, da ga je nekdo že predhodno rezerviral ali pa je lastnik oglasa oglas umaknil.
  - Tip rezultata: boolean (TRUE, če je zaseden sicer FALSE)

---

* #### KrmilnikDodajanjaMedPriljubljene

KrmilnikDodajanjaMedPriljubljene je krmilnik, ki upravlja z dodajanjem ponudnikov storitev med priljubljene. Do tega primera uporabe tega krmilnika dostopajo lahko le lastniki psov.

#### Atributi
Nima atributov

#### Nesamoumnevne metode

- shraniPonudnikaMedPriljubljene(String upIme):
  - Opis: Metoda shrani v model Uporabnik uporabnika z uporabniškim imenom upIme.
  - Tip rezultata: void

---

* #### ZMSeznamStoritev

ZMSeznamStoritev predstavlja mejni razred, tipa zaslonska maska (ZM). 

#### Atributi
Nima atributov

#### Nesamoumnevne metode

Razred ne vsebuje nesamoumevnih metod.

---

* #### ZMPregledOglasa

ZMPregledOglasov predstavlja mejni razred, tipa zaslonska maska (ZM). 

#### Atributi
Nima atributov

#### Nesamoumnevne metode

- rezervirajOglas(Oglas oglas):
  - Opis : Metoda poskuša rezervirati oglas za izbranega ponudnika. Pri tem preveri, ali je oglas že zaseden.
  - Tip rezultata: boolean (TRUE, če je rezerviran sicer FALSE)

- prikažiAliŽeliDeliti():
  - Opis: Metoda, ki prikaže pogovorno okno, če želi uporabnik deliti oglas.
  - Tip rezultat: void

---

* #### ZMOcenjevanjePonudnikov

ZMOcenjevanjePonudnikov predstavlja mejni razred, tipa zaslonska maska (ZM). 

#### Atributi
Nima atributov

#### Nesamoumnevne metode

onemogočiVnosOceneInKomentarja():

  - Opis: Ko uporabnik označi, da se storitev ni izvedla, se onemogoči vnos ocene komentarja.
  - Tip rezultat: void


---
     
## 3. Načrt obnašanja

V okviru načrta obnašanja smo dali **razširitvene točke** v celico **opt**.

* ### Diagram zaporedja - Registracija - Osnovni tok (akter: Neregistriran uporabnik, funkcionalnost: Registracija).
![dz-registracija-osnovni-tok](../img/dz-registracija-osnovni-tok.png)

---

* ### Diagram zaporedja - Registracija - Izjemni tok 1 - Neveljavna oblika e-poštnega naslova (akter: Neregistriran uporabnik, funkcionalnost: Registracija).
![dz-registracija-izjemni-tok-1](../img/dz-registracija-izjemni-tok-1.png)

---

* ### Diagram zaporedja - Registracija - Izjemni tok 2 - E-poštni naslov že obstaja (akter: Neregistriran uporabnik, funkcionalnost: Registracija).
![dz-registracija-izjemni-tok-2](../img/dz-registracija-izjemni-tok-2.png)

---

* ### Diagram zaporedja - Registracija - Izjemni tok 3 - Neveljavna oblika uporabniškega imena (akter: Neregistriran uporabnik, funkcionalnost: Registracija).
![dz-registracija-izjemni-tok-3](../img/dz-registracija-izjemni-tok-3.png)

---

* ### Diagram zaporedja - Registracija - Izjemni tok 4 - Uporabniško ime že obstaja (akter: Neregistriran uporabnik, funkcionalnost: Registracija).
![dz-registracija-izjemni-tok-4](../img/dz-registracija-izjemni-tok-4.png)

---

* ### Diagram zaporedja - Registracija - Izjemni tok 5 - Neveljavna oblika gesla (akter: Neregistriran uporabnik, funkcionalnost: Registracija).
![dz-registracija-izjemni-tok-5](../img/dz-registracija-izjemni-tok-5.png)

---

* ### Diagram zaporedja - Registracija - Izjemni tok 6 - Neujemanje potrditvenega gesla (akter: Neregistriran uporabnik, funkcionalnost: Registracija).
![dz-registracija-izjemni-tok-6](../img/dz-registracija-izjemni-tok-6.png)

---

* ### Diagram zaporedja - Registracija - Izjemni tok 7 - Ni izbrana nobena vloga (akter: Neregistriran uporabnik, funkcionalnost: Registracija).
![dz-registracija-izjemni-tok-7](../img/dz-registracija-izjemni-tok-7.png)

---

* ### Diagram zaporedja - Prijava - Osnovni tok (akter: Registriran uporabnik, funkcionalnost: Prijava).
![dz-prijava-osnovni-tok](../img/dz-prijava-osnovni-tok.png)

---

* ### Diagram zaporedja - Prijava - Izjemni tok - E-poštni naslov ali geslo napačno (akter: Registriran uporabnik, funkcionalnost: Prijava).
![dz-prijava-izjemni-tok](../img/dz-prijava-izjemni-tok.png)

---

* ### Diagram zaporedja - Ponastavitev gesla - Osnovni tok (akter: Registriran uporabnik, funkcionalnost: Ponastavitev gesla).
![dz-ponastavitev-gesla-osnovni-tok](../img/dz-ponastavitev-gesla-osnovni-tok.png)

---

* ### Diagram zaporedja - Ponastavitev gesla - Izjemni tok 1 - Uporabnik s tem e-poštnim naslovom ne obstaja (akter: Registriran uporabnik, funkcionalnost: Ponastavitev gesla).
![dz-ponastavitev-gesla-izjemni-tok-1](../img/dz-ponastavitev-gesla-izjemni-tok-1.png)

---

* ### Diagram zaporedja - Ponastavitev gesla - Izjemni tok 2 - Neveljavna oblika gesla (akter: Registriran uporabnik, funkcionalnost: Ponastavitev gesla).
![dz-ponastavitev-gesla-izjemni-tok-2](../img/dz-ponastavitev-gesla-izjemni-tok-2.png)

---

* ### Diagram zaporedja - Ponastavitev gesla - Izjemni tok 3 - Novo geslo in potrditveno geslo se ne ujemata (akter: Registriran uporabnik, funkcionalnost: Ponastavitev gesla).
![dz-ponastavitev-gesla-izjemni-tok-3](../img/dz-ponastavitev-gesla-izjemni-tok-3.png)

---


* ### Diagram zaporedja - Pregled oglasa - Osnovni tok 1 - Oglas povpraševanja (akter: Registriran uporabnik, funkcionalnost: Pregled oglasa).
![dz-pregled-oglasa-osnovni-tok-1](../img/dz-pregled-oglasa-osnovni-tok-1.png)

---

* ### Diagram zaporedja - Pregled oglasa - Osnovni tok 2 - Oglas storitve (akter: Registriran uporabnik, funkcionalnost: Pregled oglasa).
![dz-pregled-oglasa-osnovni-tok-2](../img/dz-pregled-oglasa-osnovni-tok-2.png)

---


* ### Diagram zaporedja - Objava oglasa - Osnovni tok 1 - Oglas povpraševanja (akter: Registriran uporabnik, funkcionalnost: Objava oglasa).
![dz-objava-oglasa-osnovni-tok-1](../img/dz-objava-oglasa-osnovni-tok-1.png)

---

* ### Diagram zaporedja - Objava oglasa - Osnovni tok 2 - Oglas storitve (akter: Registriran uporabnik, funkcionalnost: Objava oglasa).
![dz-objava-oglasa-osnovni-tok-2](../img/dz-objava-oglasa-osnovni-tok-2.png)

---


* ### Diagram zaporedja - Urejanje oglasa - Osnovni tok (akter: Registriran uporabnik, funkcionalnost: Urejanje oglasa).
![dz-urejanje-oglasa-osnovni-tok](../img/dz-urejanje-oglasa-osnovni-tok.png)

---

* ### Diagram zaporedja - Urejanje oglasa - Izjemni tok - Neveljavna oblika kontakta (akter: Registriran uporabnik, funkcionalnost: Urejanje oglasa).
![dz-urejanje-oglasa-izjemni-tok](../img/dz-urejanje-oglasa-izjemni-tok.png)

---


* ### Diagram zaporedja - Pregled profila - Osnovni tok 1 - Preko oglasa povpraševanja (akter: Registriran uporabnik, funkcionalnost: Pregled profila).
![dz-pregled-profila-osnovni-tok-1](../img/dz-pregled-profila-osnovni-tok-1.png)

---

* ### Diagram zaporedja - Pregled profila - Osnovni tok 2 - Preko oglasa storitve (akter: Registriran uporabnik, funkcionalnost: Pregled profila).
![dz-pregled-profila-osnovni-tok-2](../img/dz-pregled-profila-osnovni-tok-2.png)

---

* ### Diagram zaporedja - Pregled najboljših ponudnikov - Osnovni tok (akter: Registriran uporabnik, funkcionalnost: Pregled najboljših ponudnikov).
![dz-pregled-najboljsih-ponudnikov-osnovni-tok](../img/dz-pregled-najboljsih-ponudnikov-osnovni-tok.png)


* ### Diagram zaporedja - Ocenjevanje ponudnikov - Osnovni tok (akter: Lastnik psa, funkcionalnost: Ocenjevanje ponudnikov).
![dz-ocenjevanje-osnovni-tok](../img/dz-ocenjevanje-osnovni-tok.png)

* ### Diagram zaporedja - Ocenjevanje ponudnikov - Alternativni tok (akter: Lastnik psa, funkcionalnost: Ocenjevanje ponudnikov).
![dz-ocenjevanje-alternativni-tok](../img/dz-ocenjevanje-alternativni-tok.png)


* ### Diagram zaporedja - Rezervacija - Osnovni tok 1 - Rezervacija lastnika psa (akter: Lastnik psa, funkcionalnost: Rezervacija).
![dz-rezervacija-osnovni-tok-1](../img/dz-rezervacija-osnovni-tok-1.png)

* ### Diagram zaporedja - Rezervacija - Osnovni tok 2 - Rezervacija ponudnika storitev (akter: Ponudnik storitev, funkcionalnost: Rezervacija).
![dz-rezervacija-osnovni-tok-2](../img/dz-rezervacija-osnovni-tok-2.png)

* ### Diagram zaporedja - Rezervacija - Izjemni tok (akter: Ponudnik storitev, funkcionalnost: Rezervacija).
![dz-rezervacija-izjemni-tok](../img/dz-rezervacija-izjemni-tok.png)


* ### Diagram zaporedja - Razvrstitev skrbniškega čina - Osnovni tok (akter: Lastnik psa, funkcionalnost: Razvrstitev skrbniškega čina).
![dz-razvrstitev-osnovni-tok](../img/dz-razvrstitev-osnovni-tok.png)

* ### Diagram zaporedja - Razvrstitev skrbniškega čina - Alternativni tok (akter: Ponudnik storitev, funkcionalnost: Razvrstitev skrbniškega čina).
![dz-razvrstitev-alternativni-tok](../img/dz-razvrstitev-alternativni-tok.png)


* ### Diagram zaporedja - Dodajanje med priljubljene - Osnovni tok (akter: Lastnik psa, funkcionalnost: Dodajanje med priljubljene).
![dz-priljubljeni-osnovni-tok](../img/dz-priljubljeni-osnovni-tok.png)

* ### Diagram zaporedja - Dodajanje med priljubljene - Izjemni tok (akter: Lastnik psa, funkcionalnost: Dodajanje med priljubljene).
![dz-priljubljeni-izjemni-tok](../img/dz-priljubljeni-izjemni-tok.png)


* ### Diagram zaporedja - Filtriranje in sortiranje oglasov - Osnovni tok 1 - Filtriranje (akter: Registriran uporabnik, funkcionalnost: Filtriranje in sortiranje oglasov).
![dz-filtriranje-in-sortiranje-osnovni-tok-1](../img/dz-filtriranje-in-sortiranje-osnovni-tok-1.png)

* ### Diagram zaporedja - Filtriranje in sortiranje oglasov - Osnovni tok 2 - Filtriranje preko iskalne vrstice (akter: Registriran uporabnik, funkcionalnost: Filtriranje in sortiranje oglasov).
![dz-filtriranje-in-sortiranje-osnovni-tok-2](../img/dz-filtriranje-in-sortiranje-osnovni-tok-2.png)

* ### Diagram zaporedja - Filtriranje in sortiranje oglasov - Osnovni tok 3 - Sortiranje (akter: Registriran uporabnik, funkcionalnost: Filtriranje in sortiranje oglasov).
![dz-filtriranje-in-sortiranje-osnovni-tok-3](../img/dz-filtriranje-in-sortiranje-osnovni-tok-3.png)



* ### Diagram zaporedja - Pregled novic v svetu psov - Osnovni tok (akter: Uporabnik, funkcionalnost: Pregled novic v svetu psov).
![dz-pregled-novic-osnovni-tok](../img/dz-pregled-novic-osnovni-tok.png)


* ### Diagram zaporedja - Pregled najlepših fotografij iz sveta psov - galerija - Osnovni tok (akter: Uporabnik, funkcionalnost: Pregled najlepših fotografij iz sveta psov).
![dz-pregled-fotografij-osnovni-tok](../img/dz-pregled-fotografij-osnovni-tok.png)


* ### Diagram zaporedja - Brisanje oglasov - Osnovni tok (akter: Moderator spletne strani, funkcionalnost: Brisanje oglasov).
![dz-brisanje-oglasa-osnovni-tok](../img/dz-brisanje-oglasa-osnovni-tok.png)

* ### Diagram zaporedja - Brisanje oglasov - Alternativni tok (akter: Moderator spletne strani, funkcionalnost: Brisanje oglasov).
![dz-brisanje-oglasa-alternativni-tok](../img/dz-brisanje-oglasa-alternativni-tok.png)



* ### Diagram zaporedja - Delitev oglasa - Osnovni tok (akter: Registriran uporabnik, funkcionalnost: Delitev oglasa).
![dz-delitev-oglasa-osnovni-tok](../img/dz-delitev-oglasa-osnovni-tok.png)

* ### Diagram zaporedja - Delitev oglasa - Alternativni tok (akter: Registriran uporabnik, funkcionalnost: Delitev oglasa).
![dz-delitev-oglasa-alternativni-tok](../img/dz-delitev-oglasa-alternativni-tok.png)
