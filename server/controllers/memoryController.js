import Memory from "../models/Memory.js";

export const createMemory = async (req,res)=>{

try{

const {surprise,type,message} = req.body;

let fileUrl = "";

if(req.file){

const result = await cloudinary.uploader.upload_stream(
{resource_type:"auto"},
async (error,uploaded)=>{
if(error) return res.status(500).json(error);

fileUrl = uploaded.secure_url;

const memory = await Memory.create({
surprise,
type,
fileUrl,
message
});

res.json(memory);
}
);

result.end(req.file.buffer);

}else{

const memory = await Memory.create({
surprise,
type,
message
});

res.json(memory);

}

}catch(error){

res.status(500).json({error:error.message});

}

};