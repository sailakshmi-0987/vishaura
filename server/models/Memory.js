import mongoose from "mongoose";

const memorySchema = new mongoose.Schema({

surprise:{
type:mongoose.Schema.Types.ObjectId,
ref:"Surprise",
required:true
},

type:{
type:String,
enum:["image","video","audio","letter"],
required:true
},

fileUrl:{
type:String
},

message:{
type:String
},

createdAt:{
type:Date,
default:Date.now
}

});

export default mongoose.model("Memory",memorySchema);