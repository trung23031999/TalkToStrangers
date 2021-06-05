var socket = io("http://localhost:3000");

socket.on("server-send-register-fail", function(){
    alert("Username da duoc dang ky");
});

socket.on("server-send-register-success", function(data){
    $("#currentUser").html(data);
    $("#loginForm").hide(2000);
    $("#listForm").show(1000);
});

socket.on("server-send-user-list", function(data){
    $("#listUser").html("");
    data.forEach(function(i){
        $("#listUser").append("<div class='user'>" + i + "</div>");
    })
});

socket.on("server-send-room-list", function(data){
    $("#listRoom").html("");
    data.forEach(function(i){
        $("#listRoom").append('<input type="button" class="joinroom" value="' + i + '"/>');
    });
    $(".joinroom").click(function(){
        var input = $(".joinroom").val();
        socket.emit("client-join-room", input);
    });
});

socket.on("server-found-room-name", function(data){
    $("#listRoom").html("");
    $("#listRoom").append('<input type="button" class="findroom" value="' + data + '"/>');
    $(".findroom").click(function(){
        var input = $(".findroom").val();
        socket.emit("client-join-room", input);
    });
});

socket.on("server-not-found-room-name", function(){
    alert("Room khong ton tai");
});

socket.on("server-create-room-success", function(){
    $("#listForm").hide(2000);
    $("div.ms-single, div.ms-broadcast, div.listMessage").remove();
    $("#chatForm").append('<div class="listMessage"><div class="messages"></div></div>');
    $("#chatForm").show(1000);
})

socket.on("server-accept-join", function(){
    $("#listForm").hide(2000);
    $("div.ms-single, div.ms-broadcast, div.listMessage").remove();
    $("#chatForm").append('<div class="listMessage"><div class="messages"></div></div>');
    $("#chatForm").show(1000);
});

socket.on("someone-join", function(){
    $(".messages").append('<div class="noti">Someone has joined the chat</div>');
});

socket.on("someone-leave", function(){
    $(".messages").append('<div class="noti">Someone has left the chat</div>');
});

socket.on("server-send-message-single", function(data){
    $(".messages").append("<div class='ms-single'>" + data.un + "<div class='nd'>" + data.nd + "</div>" + "</div>");
});

socket.on("server-send-message-broadcast", function(data){
    $(".messages").append("<div class='ms-boardcast'>" + data.un + "<div class='nd'>" + data.nd + "</div>" + "</div>");
});



// socket.on("someone-typing", function(data){
//     $("#thongbao").html("<img src='typing.gif'>" + data);
// })

// socket.on("stop-typing", function(){
//     $("#thongbao").html("");
// })

$(document).ready(function(){
    $("#loginForm").show();
    $("#listForm").hide();
    $("#chatForm").hide();

    $("#btnRegister").click(function(){
        socket.emit("client-send-username", $("#txtUsername").val());
    });

    $("#loginForm").keypress(function(event){
        if (event.keyCode == 13 || event.which == 13){
            socket.emit("client-send-username", $("#txtUsername").val());
            $("#txtUsername").val('');
        }
    });

    $("#btnLogout").click(function(){
        socket.emit("logout");
        $("#listForm").hide(2000);
        $("#loginForm").show(1000);
    });

    $("#btnSendMessage").click(function(){
        socket.emit("user-send-message", $("#txtMessage").val());
    });

    $("#chatForm").keypress(function(event){
        if (event.keyCode == 13 || event.which == 13){
            socket.emit("user-send-message", $("#txtMessage").val());
            $("#txtMessage").val('');
        }
    });

    $("#btnFindRoom").click(function(){
        socket.emit("client-find-room-name", $("#txtRoom").val());
    });

    $("#listForm").keypress(function(event){
        if (event.keyCode == 13 || event.which == 13){
            socket.emit("client-find-room-name", $("#txtRoom").val());
            $("#txtRoom").val('');
        }
    });

    $("#btnCreateRoom").click(function(){
        socket.emit("client-create-room-name", $("#txtRoom").val());
        $("#txtRoom").val('');
    });

    $("#btnLeaveRoom").click(function(){
        socket.emit("client-leave-room");
        $("#chatForm").hide(2000);
        $("#listForm").show(1000);
    });
    
    // $("#txtMessage").focusin(function(){
    //     socket.emit("typing");
    // });

    // $("#txtMessage").focusout(function(){
    //     socket.emit("stop-typing");
    // });
});