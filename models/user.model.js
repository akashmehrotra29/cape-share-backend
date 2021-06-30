const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: { type: String, required: ["name field can not be empty"] },
    username: { type: String, unique: true, required: ["username field can not be empty"] },
    email: { type: String, unique: true, required: ["email field can not be empty"] },
    password: { type: String },
    photo: { type: String },
    bio: { type: String },
    followerCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    lastLogin: { type: Date },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    registeredAt: { type: Date, required: ["registeredAt field can not be empty"] },
}, { timestamps: true })

const User = mongoose.model('User', UserSchema);

module.exports = User;