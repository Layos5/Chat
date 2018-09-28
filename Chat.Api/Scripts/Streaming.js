(function () {
    var _myConnection, _myMediaStream;

    var hub = $.connection.streaming;
    $.connection.hub.url = '/signalr/hubs';
    $.connection.hub.start(function () {
        console.log('connected to signal server.');
        init();
    });

    function _createConnection() {
        console.log('creating RTCPeerConnection...');

        var connection = new RTCPeerConnection(null);

        connection.onicecandidate = function (event) {
            if (event.candidate) {
                hub.server.send(JSON.stringify({ "candidate": event.candidate }));
            }
        };

        connection.onaddstream = function (event) {
            var newVideoElement = document.createElement('video');
            newVideoElement.className = 'video';
            newVideoElement.autoplay = 'autoplay';

            newVideoElement.src = window.URL.createObjectURL(event.stream);
            newVideoElement.play();

            document.querySelector('#videoStream').appendChild(newVideoElement);

            document.querySelector('#startBtn').setAttribute('disabled', 'disabled');
        };

        return connection;
    }

    hub.client.MessageReceived = function (data) {
        var message = JSON.parse(data),
            connection = _myConnection || _createConnection(null);

        if (message.sdp) {
            connection.setRemoteDescription(new RTCSessionDescription(message.sdp), function () {
                if (connection.remoteDescription.type == 'offer') {
                    console.log('received offer, sending answer...');

                    connection.addStream(_myMediaStream);

                    connection.createAnswer(function (desc) {
                        connection.setLocalDescription(desc, function () {
                            hub.server.send(JSON.stringify({ 'sdp': connection.localDescription }));
                        });
                    }, function (error) { alert('Error creating session description: ' + error); });
                } else if (connection.remoteDescription.type == 'answer') {
                    console.log('got an answer');
                }
            });
        } else if (message.candidate) {
            console.log('adding ice candidate...');
            connection.addIceCandidate(new RTCIceCandidate(message.candidate));
        }

        _myConnection = connection;
    };

    function init() {
        navigator.getUserMedia(
            {
                video: true,
                audio: false
            },
            function (stream) {
                var videoElement = document.querySelector('.video.mine');

                _myMediaStream = stream;

                videoElement.src = window.URL.createObjectURL(stream);
                videoElement.play();

                document.querySelector('#startBtn').removeAttribute('disabled');
            },
            function (error) {
                alert(JSON.stringify(error));
            }
        );

        document.querySelector('#startBtn').addEventListener('click', function () {
            _myConnection = _myConnection || _createConnection(null);

            _myConnection.addStream(_myMediaStream);

            _myConnection.createOffer(function (desc) {
                _myConnection.setLocalDescription(desc, function () {
                    hub.server.send(JSON.stringify({ "sdp": desc }));
                });
            }, function (error) { alert('Error creating session description: ' + error); });
        });
    }
})();