import jwt from "jsonwebtoken"

export const protect =(req,res,next)=>{
    console.log("🍪 Raw headers cookie:", req.headers.cookie);
  console.log("🍪 Parsed:", req.cookies);
  const token = req.cookies.token||
  req.headers.authorization?.split(" ")[1] || null
  console.log("token",token)
  if(!token) return res.status(401).json({message:"Not authorized"});
  try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    console.log("decoded",decoded)
     req.userId = decoded.id;
    req.user = { id: decoded.id, role: decoded.role };
    next()
  }catch(error){
    return res.status(401).json({message:"Invalid token"});
  }
}