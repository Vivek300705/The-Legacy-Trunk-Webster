import mongoose from "mongoose";

const RelationSchema = new mongoose.Schema({
// the user who sents the req 
requester:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
},
// the user who will receive the request 
recipient:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
},
// the relationshio from the requester's pov 
relationshipType:{
    type:String,
    enum:['Parent','Child','Spouse','Sibling','Grandparent','GrandChild'],
    required:true
},
status:{
    type:String,
    enum:['pending','approved','rejected'],
    default:'pending',
}
},{timestamps:true});

const Relation = mongoose.model('Relation',RelationSchema);

export default Relation;