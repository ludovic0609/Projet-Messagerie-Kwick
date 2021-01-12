



(() => {
    let expirationTime = window.localStorage.getItem(LOCALE_STORAGE_NAME);
    if (expirationTime) {
        location.href = "tchat.html";
    }
})(); // Si l'utilisateur quitte la page sans se deconnecter et que le local storage est toujours en cours on le remet sur le tchat.




$(document).ready(function () {
    //Se connecter / Login
    $('#login_form').submit(function (event) {

        username = $('#username_login').val();
        password = $('#password_login').val();

        requestAjax('login/' + username + '/' + password, function (e) {
            if (e.result.status == "failure") {
                //console.log(e);

                $('#password_login').val('');
                $span_error_form_login.css("color", "#C31010");


                $span_error_form_login.text("Nom d'utilisateur ou mot de passe est incorrect.");


            } else {   //Quand l'utilsateur se connect / initialisation de la session.
                (() => {



                    let expirationTime = window.localStorage.getItem(LOCALE_STORAGE_NAME);

                    const $timerSessionCtnr = document.getElementById('timer-session-ctnr');


                    let interval = null;
                    if (expirationTime) {

                        interval = TIMER_HANDLER($timerSessionCtnr, expirationTime);

                    }

                    if (interval) {

                        window.clearInterval(interval);
                        window.localStorage.removeItem(LOCALE_STORAGE_NAME);
                        interval = null;



                    } else {

                        interval = TIMER_HANDLER($timerSessionCtnr, null);


                    }

                })();


                //console.log(e);

                localStorage.setItem("token", e.result.token);

                localStorage.setItem("id", e.result.id);
                localStorage.setItem("username", username);

                user_token = localStorage.getItem("token");

                local_user_name = localStorage.getItem("username");
                id_user = localStorage.getItem("id");
                location.href = "tchat.html";





            }
        });


        event.preventDefault();
    });
    //Inscription / Sign up
    $('#form_registrer').submit(function (event) {

        username = $('#username_registrer').val();
        password = $('#password_registrer').val();

        requestAjax('signup/' + username + '/' + password, function (e) {
            if (e.result.status == "failure") {
                // console.log(e);
                $('#username_registrer').val('');
                $('#password_registrer').val('');
                $('#strengthMessage').removeClass().text("");

                $span_error_form_registrer.css("color", "#C31010");

                $span_error_form_registrer.text("L'utilisateur " + username + " existe déjà.");


            } else {
                //console.log(e);

                localStorage.setItem("token", e.result.token);

                localStorage.setItem("id", e.result.id);

                $span_error_form_registrer.text("");

                $span_sucess_form_registrer.css("color", "#046017");
                $span_sucess_form_registrer.text("Inscription réussi.");
                $('#username_registrer').val('');
                $('#password_registrer').val('');
                $('#strengthMessage').removeClass().text("");




            }
        });

        event.preventDefault();
    });

});


// Sécurité du mot de passe en fonction du mot de passe

$(document).ready(function () {
    $('#password_registrer').keyup(function () {
        if ($('#password_registrer').val().length > 0) {
            $('#strengthMessage').text(checkStrength($('#password_registrer').val()))
        } else {
            $('#strengthMessage').removeClass().text("");

        }
    })

});

// Montrer le password
$('.toggle-password').on('click', function () {
    $(this).toggleClass('fa-eye fa-eye-slash');

    // let input = $($(this).attr('toggle'));
    let input = $('#password_registrer');
    if (input.attr('type') == 'password') {
        input.attr('type', 'text');
    }
    else {
        input.attr('type', 'password');
    }
});









































