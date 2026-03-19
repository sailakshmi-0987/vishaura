import mongoose from "mongoose";

const surpriseSchema = new mongoose.Schema({

creator:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

birthdayPerson:{
type:String,
required:true
},

birthdayDate:{
type:Date,
required:true
},

coverImage:{
type:String,
default:""
},

theme:{
type:String,
default:"Classic Birthday"
},

inviteCode:{
type:String,
unique:true
},
unlockTime:{
type:Date
},
message:{
type:String
},

createdAt:{
type:Date,
default:Date.now
}

});

export default mongoose.model("Surprise",surpriseSchema);