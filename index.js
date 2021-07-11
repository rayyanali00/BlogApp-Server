const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')
const cookieParser = require('cookie-parser');

require('dotenv').config();
const PORT = process.env.PORT || 3001;
app.use('/uploads', express.static('uploads'));

app.use(cookieParser())
app.use(cors())
app.use(express.json())

app.use('/user', userRoute)
app.use('/blog', blogRoute)

const uri = process.env.ATLAS_URL;
mongoose.connect(uri, {useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology: true});
const connect = mongoose.connection;
connect.once('open', ()=>{
    console.log("MOngoose connected successfully")
})

app.get('/',(req,res)=>{
    res.send("Server Running")
})

app.listen(PORT)