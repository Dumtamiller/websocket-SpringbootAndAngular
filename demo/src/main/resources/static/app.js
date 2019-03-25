var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);

        stompClient.subscribe('/topic/greetings', greeting =>  {
            $("#chat").append(`<tr><td> ${greeting.body} join in chatroom </td></tr>`)
        });

        stompClient.subscribe('/topic/chatroom', chatroom =>  {
            const data = JSON.parse(chatroom.body)
            $("#chat").append(`<tr><td> ${data.name}  Say : ${data.content}</td></tr>`)
        });

        stompClient.subscribe('/topic/bye', userDisconnect =>  {
            $("#chat").append(`<tr><td> ${userDisconnect.body} left from chatroom</td></tr>`)
        }); 


        stompClient.send("/app/hello", {}, $("#name").val());
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.send("/app/bye", {}, $("#name").val());
        stompClient.disconnect();
    }
    setConnected(false);
}


$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#sendMessage" ).click(function() { 
        const data = {
            name : $("#name").val(),
            content : $("#message").val(),
        }
        stompClient.send("/app/message", {}, JSON.stringify(data));
    });
});