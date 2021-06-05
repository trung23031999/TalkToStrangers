const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    user_id: String,
    user_name: String,
    join_time: String,
    leave_time: String,
    number_of_send: Number,
    number_of_receive: Number
});

module.exports = mongoose.model("User", userSchema);