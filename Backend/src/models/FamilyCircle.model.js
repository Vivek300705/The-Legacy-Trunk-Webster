import mongoose from "mongoose";

const FamilySchema = new mongoose.Schema({
name:{
    type:String,
    required:[true,'A family circle must have a name'],
    trim:true,
},
admin:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
},
member:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
}]
},{timestamps:true});

const Family = mongoose.model('Family',FamilySchema);

export default Family;