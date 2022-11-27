"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    nickName: {
        type: String,
        required: true,
        unique: true
    },
    userEmail: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    contacts: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Users"
        }]
});
UserSchema.plugin(require("mongoose-autopopulate"));
exports.Users = (0, mongoose_1.model)('Users', UserSchema);
