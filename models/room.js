const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
    room_name: String,
    room_id: String,
    user_create: String,
    create_time: String,
    delete_time: String,
    run_time: String
});

module.exports = mongoose.model("Room", roomSchema);