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

app.use(cors({origin:true}));
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})
const todoSchema=new mongoose.Schema({
    title:{type:String,required:true},
    description:String,
    dateCreated:String,
    id:{type:String}
})

const todo=new mongoose.model("todoList",todoSchema)

//ADDING NEW TODOS

app.post("/api/v1/new",async(req,res)=>{
   
    const {title,description,id}=req.body

      try {
        const dateCreated= new Date().toLocaleString()
        // const newtodoAdded=new todo({title:title,description:description,dateCreated:dateCreated})
        // const todoResult= await newtodoAdded.save() 
        const todoResult = await  todo.create({title:title,description:description,dateCreated:dateCreated,id:id})
      
        res.status(200).json({
          success:true,addedtodo:todoResult,
          message:"Successfully Added"
        })        
      } catch (error) {
       
      }

})
// GETTING ALL TODOS
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

//UPDATING TODOS

app.put("/api/v1/updateproduct/:id",async (req,res)=>{
    try {
        let todoupdateresult=await todo.findById(req.params.id)
        if(!todoupdateresult){
            res.send(400).json({
                success:false,
                message:"Product not found"
            })
        }
        const dateUpdated= new Date().toLocaleString()
        const {title,description,id}=req.body

        todoupdateresult=await todo.findByIdAndUpdate(req.params.id,{title:title,description:description,dateCreated:dateUpdated,id:id},{new:true,useFindAndModify:true,runValidators:true})
    
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
//DELETE ALL TODOS

app.delete('/api/v1/deleteproduct/:uniid',async(req,res)=>{
    console.log(req.params)
    const {uniid}=req.params
    try {
        let todoupdateresult=await todo.findById(uniid)

        if(!todoupdateresult){
            res.status(400).json({
                success:false,
                message:"Product not found"
            })
        }

        await todoupdateresult.deleteOne({_id: uniid})
    
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


