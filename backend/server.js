
require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const cors = require('cors')
//express app
const app = express();

//middleware
app.use(express.json())
app.use(cors())
app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next()
})

//routes
app.use('/api/user',userRoutes)

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        app.listen(process.env.PORT, ()=> {
            console.log("connected to db & listening on port number",process.env.PORT);
        })
    })
    .catch(error=>{
        console.log(error)
    })

//listen for requests
