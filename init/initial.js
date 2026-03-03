const mongoose=require("mongoose")
const listing =require("../models/model.js")
const initData =require("./data.js")
main().then(()=>{
    console.log("connect successfull")
}).catch((err)=>{
    console.log(err)
})

async function main() {
 await mongoose.connect('mongodb://127.0.0.1:27017/BMSTAY');
}
initial().then(()=>{
    console.log("initial data is inserted successfully")
}).catch((err)=>{
    console.log(err)
})

async function initial(){
 await listing.insertMany(initData.data);
}
