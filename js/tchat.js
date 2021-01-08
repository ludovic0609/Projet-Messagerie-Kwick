// initialisation du tchat 


$(document).ready(function () {
    user_token = localStorage.getItem("token");
    local_user_name=localStorage.getItem("username");
    id_user=localStorage.getItem("id");
    let local_storage = window.localStorage.getItem(LOCALE_STORAGE_NAME);

    if (user_token && local_storage) {
        $("#username").text(local_user_name);
        getUsers();
        getMessage();

    }
    else {

        localStorage.removeItem("token");
        location.href = "index.html";

    }


});


(() => {
    let expirationtime = window.localStorage.getItem(LOCALE_STORAGE_NAME);
    const $timerSessionCtnr = document.getElementById('timer-session-ctnr');
    if (expirationtime) {
        TIMER_HANDLER($timerSessionCtnr, expirationtime);
    }
})();


// Fonction pour deconnecter l'utilisateur
function deconnexion(user_token, id_user) {




    requestAjax('logout/' + user_token + '/' + id_user, function (e) {
        //console.log(e);
        localStorage.removeItem("token");
        localStorage.removeItem(LOCALE_STORAGE_NAME);
        localStorage.removeItem("username");
        location.href = "index.html";
    });
}


// Logout / Déconnexion
$('#logout').on('click', function (e) {

    

    user_token = localStorage.getItem("token");
    id_user = localStorage.getItem("id");
    deconnexion(user_token, id_user);
});


//Users connected / Utilisateurs connectés
//Afficher les utilisateurs connectés
function getUsers() {

    user_token = localStorage.getItem("token");
    local_user_name=localStorage.getItem("username");
    requestAjax('user/logged/' + user_token, function (e) {
        if (e.result.status == "failure") {
           // console.log(e);
            $('#userco').append('<li>Erreur de chargement</li>');
        } else {

        
            //console.log(e);
            $('#users-count').text((e.result.user).length);
            $('#userco').empty();

            for (var i = 0; i < (e.result.user).length; i++) {
                if (i === 0) {
                    $('#userco').append('<li>' + (e.result.user).length +   ' Utilisateurs connecté(s)' + '</li>');
                }
                if(local_user_name===e.result.user[i]){
                    $('#userco').append('<li style="font-weight:bold;">' + e.result.user[i] + ' (vous)' +  '</li>');
                }else{
                    $('#userco').append('<li>' + e.result.user[i]  +  '</li>');
                }
                


            }

        }

        //console.log(e);

    });

}

// Afficher les messages des  utilisateurs
function getMessage() {
    user_token = localStorage.getItem("token");
    local_user_name=localStorage.getItem("username");
    requestAjax('talk/list/' + user_token + '/0', function (e) {
        

        if (e.result.status == "failure") {
            //console.log(e);

            $('#messages').append('<li>Erreur de chargement des messages</li>');


        } else {
            //console.log(e);
            for (var i = 0; i < e.result.talk.length; i++) {


                if(local_user_name===e.result.talk[i].user_name){
                    $('#messages').prepend('<li class="user">' + '<span class="username_name">' + e.result.talk[i].user_name + ' : ' + '</span>' + '<span class="username_content">' + e.result.talk[i].content + '</span>' + '<timer class="timer">' + FRENCH_FORMATED_DATE(e.result.talk[i].timestamp) + '</timer>' + '</li>');
                 
                }
                else{
                    $('#messages').prepend('<li>' + '<span class="username_name">' + e.result.talk[i].user_name + ' : ' + '</span>' + '<span class="username_content">' + e.result.talk[i].content + '</span>' + '<timer class="timer">' + FRENCH_FORMATED_DATE(e.result.talk[i].timestamp) + '</timer>' + '</li>');
                }

            }
        }



    });
}



// Send Message  /  Poster un message
$('#form_send_message').submit(function (e) {
    
    user_token = localStorage.getItem("token");
    id_user = localStorage.getItem("id");
    local_user_name=localStorage.getItem("username");
    let message = $('#message').val();

    
    if(message.length < 140 && message !== ''){
        let messageEncode = encodeURIComponent(message); // Encode le message 
  
  



    requestAjax('say/' + user_token + '/' + id_user + '/' + messageEncode, function (e) {
      
       
        if (e.result.status === "failure") {
            //console.log(e);

        }else{
            
           // console.log(e);
            
        }
    });
}

});



