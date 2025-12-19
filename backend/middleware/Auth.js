import jwt from 'jsonwebtoken'

const authUser = async (req,res,next)=>{

    const {token} = req.headers;

    if(!token)
    {
        return res.json({success:false,message:"Not Authorides Login again"})
    }

    try {
        const token_decode = jwt.verify(token,process.env.jwt_SECRET)
        req.user = token_decode;

        req.body.userId = token_decode.id
        next()        
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:error.message})
    }

        
}
export default authUser