import mongoose from "mongoose";

const StorySchema = new mongoose.Schema({
title:{
    type:String,
    required:[true,'A story must have a title.'],
    trim:true
},
content:{
    type:String,
    required:[true,'A storuy cannot be empty'],
},
author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
},
familyCircle:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Family',
    required:true
},
eventDate:{
    type:Date,
}
},{timestamps:true});

const Story = mongoose.model('Story',StorySchema);

export default Story;