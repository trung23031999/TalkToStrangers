const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    message: String,
    send_time: String,
    sender: String,
    sender_id: String,
    receiver: Number,
    reicever_id: Number
});

module.exports = mongoose.model("Message", messageSchema);