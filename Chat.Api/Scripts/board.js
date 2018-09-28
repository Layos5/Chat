var pizarra_canvas = document.getElementById("canvas");
var pizarra_context = pizarra_canvas.getContext("2d");
var boardHub;
var img = new Image();
var Trazo = {
    "Puntos": []
}

window.onload = function () {

    boardHub = $.connection.board;
    $.connection.hub.url = '/signalr/hubs';

    boardHub.client.MessageReceived = function (data) {
        pizarra_context.beginPath();
        pizarra_context.moveTo(data.Puntos[0].x, data.Puntos[0].y);
        for (var i = 1; i < data.Puntos.length; i++) {
            pizarra_context.lineTo(data.Puntos[i].x, data.Puntos[i].y);
            pizarra_context.stroke();
        }
    };

    boardHub.client.ResetBoard = function () {
        pizarra_canvas.width = pizarra_canvas.width;

        if (img.src) {
            img.src = img.src;

            img.onload = function () {
                pizarra_context.drawImage(img, 0, 0, pizarra_canvas.offsetWidth, pizarra_canvas.offsetHeight);
            }
        }
    };

    boardHub.client.ResetImage = function () {
        pizarra_canvas.width = pizarra_canvas.width;

        img.src = "";
    };

    boardHub.client.BoardImage = function (data) {
        img.src = data;

        img.onload = function () {
            pizarra_context.drawImage(img, 0, 0, pizarra_canvas.offsetWidth, pizarra_canvas.offsetHeight);
        }
    };

    $.connection.hub.start(); //Inicializamos la conexion al signalr

    pizarra_context.strokeStyle = "#000";
    pizarra_canvas.addEventListener("mousedown", empezarPintar, false); //agregamos el evento empezar a pinta cuando damos click en el canvas
    pizarra_canvas.addEventListener("mouseup", terminarPintar, false); //agregamos el evento terminar a pinta cuando soltamos el click en el canvas
    pizarra_canvas.addEventListener("touchstart", empezarPintarTouch, false); //agregamos el evento empezar a pinta cuando presionamos el tactil sobre el canvas (Dispositivos móviles)
    pizarra_canvas.addEventListener("touchend", terminarPintar, false); //agregamos el evento terminar a pinta cuando soltamos el tactil sobre el canvas (Dispositivos móviles)
}

function empezarPintar(e) {
    pizarra_context.beginPath();

    var puntox = e.clientX - pizarra_canvas.offsetLeft;
    var puntoy = e.clientY - pizarra_canvas.offsetTop;

    pizarra_context.moveTo(puntox, puntoy);
    pizarra_canvas.addEventListener("mousemove", pintar, false);

    Trazo.Puntos.length = 0;

    var punto = { "x": puntox, "y": puntoy };

    Trazo.Puntos.push(punto);
}

function terminarPintar(e) {
    pizarra_canvas.removeEventListener("mousemove", pintar, false);

    $.connection.hub.start().done(function () {
        boardHub.server.sendMessage(Trazo);
    });
}

function empezarPintarTouch(e) {
    e.preventDefault();

    pizarra_context.beginPath();

    var puntox = e.changedTouches[0].clientX - pizarra_canvas.offsetLeft;
    var puntoy = e.changedTouches[0].clientY - pizarra_canvas.offsetTop;

    pizarra_context.moveTo(puntox, puntoy);
    pizarra_canvas.addEventListener("touchmove", pintarTouch, false);

    Trazo.Puntos.length = 0;

    var punto = { "x": puntox, "y": puntoy };

    Trazo.Puntos.push(punto);
}

function terminarPintarTouch(e) {
    pizarra_canvas.removeEventListener("touchmove", pintarTouch, false);

    $.connection.hub.start().done(function () {
        boardHub.server.sendMessage(Trazo);
    });
}

function pintar(e) {

    var puntox = e.clientX - pizarra_canvas.offsetLeft;
    var puntoy = e.clientY - pizarra_canvas.offsetTop;

    pizarra_context.lineTo(puntox, puntoy);
    pizarra_context.stroke();

    var punto = { "x": puntox, "y": puntoy };

    Trazo.Puntos.push(punto);
}

function pintarTouch(e) {

    var puntox = e.changedTouches[0].clientX - pizarra_canvas.offsetLeft;
    var puntoy = e.changedTouches[0].clientY - pizarra_canvas.offsetTop;

    pizarra_context.lineTo(puntox, puntoy);
    pizarra_context.stroke();

    var punto = { "x": puntox, "y": puntoy };

    Trazo.Puntos.push(punto);
}

function previewFile(control) {
    var file = control.files[0];
    var reader = new FileReader();

    reader.onloadend = function () {
        img.src = reader.result;

        img.onload = function () {
            pizarra_context.drawImage(img, 0, 0, pizarra_canvas.offsetWidth, pizarra_canvas.offsetHeight);
        }


        $.connection.hub.start().done(function () {
            boardHub.server.boardImages(reader.result);
        }).fail(function (error) {
            console.log('newContosoChatMessage error: ' + error)
        });



    }

    if (file) {
        reader.readAsDataURL(file);
        control.value = "";
    }
}

document.getElementById("reset").onclick = function () {
    pizarra_canvas.width = pizarra_canvas.width;

    if (img.src) {
        img.src = img.src;

        img.onload = function () {
            pizarra_context.drawImage(img, 0, 0, pizarra_canvas.offsetWidth, pizarra_canvas.offsetHeight);
        }
    }

    $.connection.hub.start().done(function () {
        boardHub.server.resetBoard();
    });
}

document.getElementById("resetImg").onclick = function () {
    pizarra_canvas.width = pizarra_canvas.width;

    img.src = "";


    $.connection.hub.start().done(function () {
        boardHub.server.resetImage();
    });
}
