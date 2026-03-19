import Surprise from "../models/Surprise.js";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../utils/cloudinary.js";

export const createSurprise = async (req,res)=>{

try{

const {birthdayPerson,birthdayDate,message,theme} = req.body;

let coverImageUrl = "";

if(req.file){

const uploaded = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
resource_type: 'auto'
});

coverImageUrl = uploaded.secure_url;

}

const unlockTime = new Date(birthdayDate);
unlockTime.setHours(0,0,0,0);

const inviteCode = uuidv4();

const surprise = await Surprise.create({
creator:req.user,
birthdayPerson,
birthdayDate,
unlockTime,
inviteCode,
coverImage: coverImageUrl,
message,
theme
});

res.json(surprise);

}catch(error){

res.status(500).json({error:error.message});

}

};
export const getSurprise = async (req,res) => {

try{

const surprise = await Surprise.findById(req.params.id);

if(!surprise){
return res.status(404).json({message:"Surprise not found"});
}

res.json(surprise);

}catch(error){

res.status(500).json({error:error.message});

}

};
export const getUserSurprises = async (req,res) => {

try{

const surprises = await Surprise.find({
creator:req.user
});

res.json(surprises);

}catch(error){

res.status(500).json({error:error.message});

}

};
export const checkUnlock = async (req,res)=>{

try{

const surprise = await Surprise.findById(req.params.id);

if(!surprise){
return res.status(404).json({message:"Not found"});
}

const now = new Date();

const unlocked = now >= surprise.unlockTime;

res.json({
unlocked,
unlockTime:surprise.unlockTime
});

}catch(error){

res.status(500).json({error:error.message});

}

};
export const getByInviteCode = async (req,res)=>{

try{

const surprise = await Surprise.findOne({
inviteCode:req.params.code
});

if(!surprise){
return res.status(404).json({message:"Invalid link"});
}

res.json(surprise);

}catch(error){

res.status(500).json({error:error.message});

}

};