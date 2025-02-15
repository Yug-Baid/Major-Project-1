const initData = require("./data.js")
const mongoose = require("mongoose")
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
const Listing = require("../models/listing.js")

main().
catch(err => console.log(err))
.then((res)=>{
    console.log("Connected to db")
})

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async ()=>{
    await Listing.deleteMany({})
    initData.data = initData.data.map((obj)=>({...obj,  owner : "67a39d9a728e596af856aeb5"}))
    await Listing.insertMany(initData.data)
    console.log("Data Saved")
}

initDB()
