const router = require('express').Router();
const Blog = require('../model/blog.model');
const multer = require('multer');
const path = require('path')
const {validateToken} = require('../JWT/jsonwebtoken');

const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, './uploads/')
    },
    filename:function(req, file, cb){
        cb(null, file.originalname)
        // cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
})

console.log(__dirname)

const filefilter = (req, file, cb) =>{
    if(file.mimetype=='image/jpg' || file.mimetype=='image/png' ||  file.mimetype=='image/jpeg'){
        cb(null, true)
    }
    else{
        cb("Invalid file type", false)
    }
}

const upload = multer({
    storage:storage,
    limits:{
        fileSize:1024*1024*10,
    },
    fileFilter:filefilter
})

router.route('/').get(validateToken,(req,res)=>{
    Blog.find()
    .then((data)=>{
        let email = req.user.email;
        res.json({
            data,
            email
        })
    })
    .catch((err)=>{
        res.json("Exception "+err)
    })
})

router.route('/:id').get(validateToken,(req,res)=>{
    Blog.findById(req.params.id)
    .then((users)=>{
        res.json(users)
    })
    .catch((err)=>{
        res.json("Exception "+err)
    })
})

router.route('/:id').delete(validateToken,(req,res)=>{
    Blog.findByIdAndDelete(req.params.id)
    .then((users)=>{
        res.json(users)
    })
    .catch((err)=>{
        res.json("Exception "+err)
    })
})

router.route('/update/:id').post(validateToken,upload.single('image'),(req,res)=>{
    Blog.findById(req.params.id)
    .then((data)=>{
        console.log(req.file)
        data.title=req.body.title;
        data.description=req.body.description;
        data.image=req.file.path;
        data.createdby=req.body.createdby;
        data.save()
        .then(() => res.json("Data updated"))
        .catch((err) => res.status(400).json('Error' + err))
    })
    .catch((err)=>{
        res.json("Exception "+err)
    })
})


router.route('/createblogs').post(validateToken,upload.single('image'),(req,res)=>{
    console.log(req.file)
    const title = req.body.title;
    const description = req.body.description;
    const image = req.file.path;
    const createdby = req.body.createdby
    const newBlog = new Blog({
        title:title,
        description:description,
        image:image,
        createdby:createdby

    })
    newBlog.save()
    .then((result)=>{
        res.json({
            message:"Blog Saved",
            data:result
        })
    })
    .catch((err)=>{
        res.json("Exception "+err)
    })
})



module.exports=router;