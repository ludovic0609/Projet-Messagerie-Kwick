// Variables globales

const LOCALE_STORAGE_NAME = 'charlierludovic060991';
const SESSION_DURATION_MS = 1200000;

const API_URL = "http://greenvelvet.alwaysdata.net/kwick/api/";
const FRENCH_DAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const FRENCH_MONTH = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

const DATE_DAY = new Date().getDate();
const DATE_MONTH = new Date().getMonth();

const $error_form_signin = document.getElementById('start-session-btn');

const $error_form_registrer = document.getElementById('start-session-btn');

const $span_error_form_login = $(".error-form-1 > span");

const $span_error_form_registrer = $(".error-form-2 > span");

const $span_sucess_form_registrer = $(".succes-form-2> span");



let username = "";
let password = "";
let user_token = "";
let local_user_name = "";
let id_user = "";




// pour convertir un timestamp en format date français.

const FRENCH_FORMATED_DATE = timeStamp => {
    timeStamp = timeStamp * 1000; // Pour convertir en millisecondes
    const date = new Date(timeStamp);


    let day = FRENCH_DAYS[date.getDay()];



    let dayNbr = date.getDate();
    if (dayNbr == 1) {
        dayNbr += 'er';
    }
    const month = FRENCH_MONTH[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    let minutes = date.getMinutes();
    const seconds = date.getSeconds();



    if (minutes < 10) {
        minutes = "0" + minutes;
    }




    switch (date.getDate()) {
        case DATE_DAY: // si le message est posté le jour même
            // code block
            return ` Aujourd'hui à ${hours}h${minutes} `;
            break;
        case (DATE_DAY - 1): // si le message est posté le jour d'avant
            // code block
            if (date.getMonth() === DATE_MONTH) {
                return ` Hier à ${hours}h${minutes} `;
            } else return ` ${day} ${dayNbr} ${month} ${year}  à ${hours}h${minutes}`;


            break;
        default: // et sinon afficher la date du message
            return ` ${day} ${dayNbr} ${month} ${year}  à ${hours}h${minutes}`;
        // code block
    }


};

// convertir les secondes en minutes secondes pour l'affichage


const CONVERT_SEC_TO_MIN_SEC = seconds => {
    let min = Math.floor(seconds / 60);
    if (min < 10) {
        min = '0' + min;
    }
    let sec = seconds % 60;
    if (sec < 10) {
        sec = '0' + sec;
    }
    return `${min}:${sec}`;
};

// pour decrementer le compte à rebours 
// si la session expire renvoi a l'index

const TIMER_HANDLER = ($timerSessionCtnr, expirationTime_) => {
    let expirationTime = expirationTime_;
    const now = new Date().getTime();
    if (!expirationTime) {
        expirationTime = now + SESSION_DURATION_MS;
        window.localStorage.setItem(LOCALE_STORAGE_NAME, expirationTime);
    }

    let remainingTime = expirationTime - now;
    let interval = window.setInterval(() => {
        remainingTime -= 1000;
        if (remainingTime < 1) {
            $timerSessionCtnr.innerText = `Session expirée`;
            window.clearInterval(interval);
            window.localStorage.removeItem("token");
            window.localStorage.removeItem(LOCALE_STORAGE_NAME);
            location.href = "index.html"; // service de pop up a mettre

        } else {
            $timerSessionCtnr.innerText = `Votre session expirera dans ${CONVERT_SEC_TO_MIN_SEC(Math.round(remainingTime / 1000))}`;

        }
    }, 1000);

    return interval;
}

//Ping du service Kwick 
// Savoir le si le service kwick est fonctionnel

var result_statut_server = $.ajax({
    type: "GET",
    dataType: "jsonp",
    url: API_URL + "ping",
    success: function (data) {
        // console.log("Le Service API de Kwick est fonctionnel.");
        return (data.result.ready);
        return true;
    },
    error: function (err) {
        //console.log("Le Service API est pour le moment indisponible.");

        return err.status;

    }
});








// Requete ajax 

function requestAjax(url, callback) {
    var request = $.ajax({

        type: 'GET',
        url: API_URL + url,
        dataType: 'jsonp'
    });

    request.done(callback)

    request.fail(function (e) {
        //console.log("Erreur de requete à l'API Kwick");
        //console.log(e);

    });
}







// Check la force du mot de passe pour l'inscription
// avec des expression régulières pour les caractères spéciaux les Majuscules ...



function checkStrength(password) {
    var strength = 0
    if (password.length < 6) {
        $('#strengthMessage').removeClass()
        $('#strengthMessage').addClass('Short')
        return 'Mot de passe trop court';
    }
    if (password.length > 7) strength += 1
    // If password contains both lower and uppercase characters, increase strength value.  
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1
    // If it has numbers and characters, increase strength value.  
    if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) strength += 1
    // If it has one special character, increase strength value.  
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
    // If it has two special characters, increase strength value.  
    if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
    // Calculated strength value, we can return messages  
    // If value is less than 2  
    if (strength < 2) {
        $('#strengthMessage').removeClass()
        $('#strengthMessage').addClass('Weak')
        return 'Mot de passe faible';
    } else if (strength == 2) {
        $('#strengthMessage').removeClass()
        $('#strengthMessage').addClass('Good')
        return 'Mot de passe bon';
    } else {
        $('#strengthMessage').removeClass()
        $('#strengthMessage').addClass('Strong')
        return 'Mot de passe fort';
    }
}  