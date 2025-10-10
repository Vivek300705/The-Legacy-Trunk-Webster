import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
firebaseUID:{
    type:String,
    required:true,
    unique:true
},
name:{
    type:String,
    required:[true,'Please Provide Your Name.'],
    trim:true
},
email:{
    type:String,
    required:[true,'Please Provide Your Emai.'],
    trim:true,
    unique:true,
    lowercase:true
},
profilePicture:{
    type:String,
    default:'default.avatar.jpg'
},
familyCircle: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Family',
}
},{timestamps:true});

const User = mongoose.model('User',UserSchema);

export default User;