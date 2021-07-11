const router = require('express').Router();
const User = require('../model/user.model');
const bcrypt = require('bcrypt');
const {token, validateToken} = require('../JWT/jsonwebtoken')


router.route('/').get((req,res)=>{
    User.find()
    .then((users)=>{
        res.json(users)
    })
    .catch((err)=>{
        res.json("Exception "+err)
    })
})

router.route('/userdata').get(validateToken,(req,res)=>{
    let email = req.user.email;
    res.json({
        email
    })
})

router.route('/signup').post((req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    User.find({email:email})
    .exec()
    .then((user)=>{
        if(user.length>=1){
            return res.json({
                err:"User already exist"
            })
        }
        else{
            bcrypt.hash(password, 10, (err, hash)=>{
                if(err){
                    return res.json({
                        err:err
                    })
                }
                else{
                    const newUser = new User({
                        email:email,
                        password:hash
                    })
                
                    newUser.save()
                    .then(()=>{
                        res.json("User Created")
                    })
                    .catch((err)=>{
                        res.json("Exception "+err)
                    })
                }
        })
        }
    })

})

router.route('/signin').post((req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email:email})
    .exec()
    .then((user)=>{
        if(!user){
            return res.json({
                err:"User doesn't exist"
            })
        }
            console.log("userdata",user)
            bcrypt.compare(password, user.password, (err, result)=>{
                if(err){
                    return res.json({
                        err:"Wrong email and password combination"
                    })
                }
                if(result){
                    const accessToken = token(user)
                    console.log(accessToken)
                    return res.json({
                        message:"Auth Successfull",
                        token:accessToken
                    })
                }
                return res.json({
                    err:"Wrong email and password combination"
                })
        })
    })

})

router.route('/delete/:id').post((req,res)=>{
    User.deleteOne({_id:req.params.id})
    .exec()
    .then((result)=>{
        return res.status(200).json("User Deleted")
    })
    .catch((err)=>{
        return res.status(500).json({
            error:err
        })
    })
})

module.exports=router;