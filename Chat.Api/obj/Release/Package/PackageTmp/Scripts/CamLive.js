var video = document.querySelector('video');
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var localStream = null;

var videoSelect = document.getElementById("sVideo");
var btnStart = document.getElementById("play");
var btnStop = document.getElementById("stop");

btnStart.addEventListener('click', videoStart);
btnStop.addEventListener('click', videoStop);

function videoStart() {
    var errBack = function (e) {
        alert('Opps.. no se puede utilizar la cámara' + e, e);
    };

    var constraints = {
        video: {
            optional: [{
                sourceId: videoSelect.value
            }]
        },
        audio: false
    };

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
            video.src = window.URL.createObjectURL(stream);
            video.play();
            localStream = stream;
            dFrame();
        }, errBack);
    }
    else if (navigator.getUserMedia) { // Standard
        navigator.getUserMedia(constraints, function (stream) {
            video.src = window.URL.createObjectURL(stream);
            video.play();
            localStream = stream;
        }, errBack);
    } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
        navigator.webkitGetUserMedia(constraints, function (stream) {
            video.src = window.URL.createObjectURL(stream);
            video.play();
            localStream = stream;
        }, errBack);
    } else if (navigator.mozGetUserMedia) { // Mozilla-prefixed
        navigator.mozGetUserMedia(constraints, function (stream) {
            video.src = window.URL.createObjectURL(stream);
            video.play();
            localStream = stream;
        }, errBack);
    }
}

function videoStop() {
    video.src = "";
    localStream.getTracks()[0].stop();
}


function dFrame() {
    if (localStream) {
        ctx.drawImage(video, 0, 0);
        var dataUrl = canvas.toDataURL('image/jpeg', 0.2);

        window.requestAnimationFrame(function () {
            dFrame()
        })
    }
}

window.addEventListener("DOMContentLoaded", function () {
    navigator.mediaDevices.enumerateDevices().then(function (devices) {
        devices.forEach(function (device) {
            if (device.kind === 'videoinput') {
                var option = document.createElement('option');
                option.value = device.deviceId;
                option.text = device.label;
                videoSelect.appendChild(option);
            }
        });
    })
    .catch(function (err) {
        alert(err.name);
    });
}, true);