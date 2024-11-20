const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username: {type: String, maxLength:25},
    }
);

const ExerciseSchema = new mongoose.Schema(
    {
        user_id: {type: String, required:true},
        description: {type: String, maxLength:60},
        duration:  {type: Number},
        date: {type: Date},        
    }
);

const User = mongoose.model('User', UserSchema);
const Exercise = mongoose.model('Exercise', ExerciseSchema);


exports.User = User;
exports.Exercise = Exercise;