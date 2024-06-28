require("dotenv").config();
const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const app=express()
const cors = require("cors");
const DATABASE=process.env.DATABASE
const PORT=process.env.PORT || 8081


mongoose.connect(DATABASE,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log("Connect with MongoDb")
}).catch((e)=>{
    console.log(e)
})

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())

app.listen(PORT,()=>{
    console.log(`Server is running on localhost://${PORT}`)
})
const todoSchema=new mongoose.Schema({
    title:{type:String,required:true},
    description:String,
    dateCreated:String
})

const todo=new mongoose.model("todoList",todoSchema)

app.post("/api/v1/new",async(req,res)=>{
    const {title,desc}=req.body

      try {
        const dateCreated= new Date().toLocaleString()
        // const newtodoAdded=new todo({title:title,description:desc,dateCreated:dateCreated})
        // const todoResult= await newtodoAdded.save() 
        const todoResult = await  todo.create({title:title,description:desc,dateCreated:dateCreated})
      
        res.status(200).json({
          success:true,todoResult,
          message:"Successfully Added"
        })        
      } catch (error) {
       
      }

})

app.get("/api/v1/",async (req,res)=>{

    try {
        const todoresult =await todo.find({})
        res.status(200).json({
            todoresult
        })
    } catch (error) {
        res.status(400).json({
            errorMsg:error
        })
    }
       
})

app.put("/api/v1/updateproduct/:id",async (req,res)=>{
    try {
        let todoupdateresult=await todo.findById(req.params.id)
        if(!todoupdateresult){
            res.send(400).json({
                success:false,
                message:"Product not found"
            })
        }

        todoupdateresult=await todo.findByIdAndUpdate(req.params.id,req.body,{new:true,useFindAndModify:true,runValidators:true})
    
        res.status(200).json({
            message:"Successfully Updated",
            todoupdateresult
        })
            
    } catch (error) {
        res.status(400).json({
            errorMsg:error
        })
    }
    
})

app.delete('/api/v1/deleteproduct/:id',async(req,res)=>{
    console.log(req.params)
    try {
        let todoupdateresult=await todo.findById(req.params.id)

        if(!todoupdateresult){
            res.status(400).json({
                success:false,
                message:"Product not found"
            })
        }

        await todoupdateresult.deleteOne({ _id: req.params.id})
    
        res.status(200).json({
            message:"Successfully deleted"    
        })
            
    } catch (error) {
        console.log(error)
        res.status(400).json({
            errorMsg:error
        })
    }    
})


