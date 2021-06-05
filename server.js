var express = require("express");
var app = express();
var mongoose = require("mongoose");
var Message = require('./models/message');
var Room = require('./models/room');
var User = require('./models/user');

app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

var listUser=["Hải", "Hưng", "Yến", "My", "Phong", "Dương", "Toàn", "Nam", "Quỳnh", "Linh", "Lâm"];
var listRoom=["test", "Tâm sự", "Talking to strangers", "Make some new friends"];

mongoose.connect('mongodb+srv://trung23031999:izggzgzzz1@cluster0-g6swt.mongodb.net/project2?retryWrites=true&w=majority', function(err){
    if(err){
        console.log(err);
    } else {
        console.log("Connected to database");
    }
});

// Hàm này có tác dụng chuyển những số bé hơn 10 thành dạng 01, 02, 03, ...
function checkTime(i) 
{
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

// Hàm khởi tạo đồng hồ
function dateTime() 
{
    // Lấy Object ngày hiện tại
    var today = new Date();
 
    // Giờ, phút, giây hiện tại
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
 
    // Chuyển đổi sang dạng 01, 02, 03
    h = checkTime(h)
    m = checkTime(m);
    s = checkTime(s);
    
    return h + ":" + m + ":" + s;
}

io.on("connection", function(socket){
    var count = 0;
    var join, leave, send, create;
    socket.on("client-send-username", function(data){
        if(listUser.indexOf(data)>=0){
            socket.emit("server-send-register-fail")
        } else {
            join = dateTime();
            console.log("co nguoi ket noi luc " + join + " voi ID: " + socket.id);        
            listUser.push(data);
            socket.Username = data;
            socket.emit("server-send-register-success", data);
            io.sockets.emit("server-send-user-list", listUser);
            io.sockets.emit("server-send-room-list", listRoom);

        }
    });

    socket.on("client-find-room-name", function(data){
        if (data == ""){
            socket.emit("server-send-room-list", listRoom);
        }
        else if(listRoom.indexOf(data)>=0){
            socket.emit("server-found-room-name", data);
        } else {
            socket.emit("server-not-found-room-name");
        }
    });

    socket.on("client-create-room-name", function(data){
        if(listRoom.indexOf(data)>=0){
            socket.emit("server-create-room-fail");
        } else {
            create = dateTime();
            var room = new Room({
                room_name: data,
                user_create: socket.Username,
                create_time: create
            });
            room.save(function(err){
                if (err){
                    console.log(err);
                } else {
                    console.log("saved room");
                }
            });
            listRoom.push(data);
            socket.Roomname = data;
            socket.emit("server-create-room-success");
            io.sockets.emit("server-send-room-list", listRoom);
        }
    });

    socket.on("client-join-room", function(data){
        socket.join(data);
        socket.Roomname = data
        socket.emit("server-accept-join");
        socket.broadcast.in(socket.Roomname).emit("someone-join");
    });

    socket.on("client-leave-room", function(){
        socket.broadcast.in(socket.Roomname).emit("someone-leave");
        socket.leave(socket.Roomname);
        socket.Roomname = "";
    })
    
    socket.on("user-send-message", function(data){
        send = dateTime();
        var message = new Message({
            message: data,
            send_time: send,
            sender: socket.Username
        });
        message.save(function(err){
            if (err){
                console.log(err);
            } else {
                console.log("saved message");
            }
        });
        count = count + 1;
        socket.emit("server-send-message-single", {un:socket.Username, nd:data});
        socket.broadcast.in(socket.Roomname).emit("server-send-message-broadcast", {un:socket.Username, nd:data});
    });

    socket.on("logout", function(){
        leave = dateTime()
        console.log("co nguoi logout luc " + leave);
        listUser.splice(listUser.indexOf(socket.Username), 1);
        socket.broadcast.emit("server-send-user-list", listUser);
        var user = new User({
            user_name: socket.Username, 
            join_time: join,
            leave_time: leave,
            number_of_send: count
        });
        user.save(function(err){
            if (err){
                console.log(err);
            } else {
                console.log("saved user");
            }
        });
    });

    // socket.on("typing", function(){
    //    var s = socket.Username + " is typing";
    //     io.sockets.emit("someone-typing", s);
    // });

    // socket.on("stop-typing", function(){
    //     io.sockets.emit("stop-typing");
    // });
});

app.get("/", function(req, res){
    res.render("homepage");
});

console.log("Server started!!!");