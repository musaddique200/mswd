const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username!"],
        unique: [true, "Username exists"],
    },
    email: {
        type: String,
        required: [true, "Please provide an email!"],
        unique: [true, "Email exists"],
        match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password!"],
        minlength: [8, "Password must be at least 8 characters long"],
    }
});

module.exports = mongoose.model("Users", UserSchema);
