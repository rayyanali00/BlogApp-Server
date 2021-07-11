const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const BlogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    createdby: {
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true
    },
    image:{
        type:String,
        required:true
    }
},
    {
        timestamps:true
})

const newBlog = mongoose.model('BlogData', BlogSchema);

module.exports=newBlog;