const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Air-bnb');
}
main().then(()=>{
    console.log("connection successfull");
})
.catch(err => console.log(err));


const initDB = async () =>{
   await Listing.deleteMany({});
   initData.data = initData.data.map((obj)=>({
    ...obj,
    owner: "682442d47a7dec3982d26f16",
   }));
   await Listing.insertMany(initData.data);
   console.log("inserted to db"); 
}
initDB();