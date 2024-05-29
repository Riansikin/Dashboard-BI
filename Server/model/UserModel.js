const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    user_name: {
        type: String,
        required: true
    },
    email : {
        type : String,
        require: true,
        unique: true
    },
    password : {
        type: String,
        required: true,
    },
    refresh_token : {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['Super Admin', 'Admin', 'Vendor'],
        required: true
    },
    profile_picture: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    }
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;