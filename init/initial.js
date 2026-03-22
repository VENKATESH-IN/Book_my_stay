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
 await listing.deleteMany({});
 initData.data =initData.data.map((obj)=>({...obj,owner:'69bf8e1845d56c8d5e7ba297'}))
 await listing.insertMany(initData.data);
}
