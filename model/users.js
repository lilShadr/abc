const mongoose = require("mongoose");

const User = mongoose.model("user", new mongoose.Schema({
    username: String,
    password: String
}))
module.exports = User;

//curl -X POST http://localhost:3001/users -H 'Content-Type: application/json' -d '{\"username\":\"nisse\",\"password\":\"password\"}'
