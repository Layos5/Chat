$(function () {

    var chatInput = $("#chat-input");
    var chatWindow = $("#chat-window");

    chatInput.keydown(function (e) {

        if (e.which === 13) {
            var text = chatInput.val();

            //empty the textbox
            chatInput.val("");

            //send the message to the server
            chat.server.sendMessage(userName, text);

            //focus cursor on the textbox for easy chatting!
            self.focus();
        }
    });

    var params = {
        // These are optional request parameters. They are set to their default values.
        "timezoneOffset": "0",
        "verbose": "false",
        "spellCheck": "false",
        "staging": "false",
    };

    $.ajax({        
        url: "https://westcentralus.api.cognitive.microsoft.com/luis/v2.0/apps/64a86a46-3bbe-461f-a4a5-dde43b51da96?q=" + message +""+ $.param(params),
        beforeSend: function (xhrObj) {
            // Request headers
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "fa9a3f6c026e466a8fd2a50aab7a6d4d");
        },
        type: "GET",
        // The request body may be empty for a GET request
        data: "{body}",
    })
    .done(function (data) {
        // Display a popup containing the top intent
        alert("Detected the following intent: " + data.topScoringIntent.intent);
    })
    .fail(function () {
        alert("error");
    });
});