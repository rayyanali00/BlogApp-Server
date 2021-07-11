const jwt = require('jsonwebtoken')

// const token = jwt.sign({
//     email:email,
//     userid:userid
// },
// "secretkey",
// {
//     expiresIn:'1h'
// }
// )
const token = (user) =>{
    const accessToken = jwt.sign(
        {email:user.email, id:user._id},
        'jsonsecretkey',
        {
            expiresIn:'1h'
        }
        )
        return accessToken
}

const validateToken = (req,res,next) =>{
    const accessToken = req.header("accessToken")
    if(!accessToken) return res.json({err:"User not logged in"})
    try {
        let validToken = jwt.verify(accessToken,'jsonsecretkey')
        req.user = validToken;
        if(validToken){
            return next()
        }
    } catch (error) {
        return res.json({err:error})
    }
}
module.exports = {token, validateToken};