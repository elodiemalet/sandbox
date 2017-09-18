var socket = io.connect('http://localhost:8080');
var hash = getCookie('hash');

socket.on('hash', function (hash) {

    setCookie('hash', hash, 2);
});

socket.emit('login', hash);

socket.on('pseudo', function (message) {

    $('#pseudo').html(message);
});

socket.on('message', function (message) {

    writeMsg(message.msg, message.pseudo);
});

socket.on('connected', function (message) {

    writeMsg(message.msg, message.client, 'i');
});

socket.on('info', function (message) {

    writeMsg(message.msg, '', 'i');
});

$(function () {

$('#send').on('click', function (e) {

    e.preventDefault();
    var msg = ' : ' + $('#msg').val();

    socket.emit('message', {msg, hash});

    writeMsg(msg, 'me');
    $('#msg').val('');
});

$('#pseudoEdit').on('click', function () {

    var np = $('#newpseudo').val();

    socket.emit('editperso', {np, hash});

        $('#pseudo').html($('#newpseudo').val());
    });
});

function writeMsg(message, pseudo, style) {

    var html = '<p>' + pseudo + ' ' + message + '</p>';

    if (style != null ) {

        if (style == 'i') {

            html = '<i>' + html + '<i>';
        } else if (style == 'b') {

            html = '<b>' + html + '<b>';
        }
    }

    $('#chat').append(html);
}

function getCookie(cname) {

    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');

    for (var i = 0; i < ca.length; i++) {

        var c = ca[i];

        while (c.charAt(0) == ' ') {

            c = c.substring(1);
        }

        if (c.indexOf(name) == 0) {

            return c.substring(name.length, c.length);
        }
    }

    return false;
}

function setCookie(cname, cvalue, exdays) {

    var d = new Date();

    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));

    var expires = "expires=" + d.toUTCString();

    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}