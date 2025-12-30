import jwt from "jsonwebtoken"
import {User} from '../model/user.model.js'
export const protect =async (req,res,next)=>{
    console.log("🍪 Raw headers cookie:", req.headers.cookie);
  console.log("🍪 Parsed:", req.cookies);
  const token = req.cookies.token||
  req.headers.authorization?.split(" ")[1] || null
  console.log("token",token)
  if(!token) return res.status(401).json({message:"Not authorized"});
  try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    console.log("decoded",decoded)
    const user = await User.findById(decoded.id).select("role isBanned");
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: "Account is banned" });
    }
     req.userId = decoded.id;
     req.role=decoded.role;
    //req.user = { id: decoded.id, role: decoded.role };
    next()
  }catch(error){
    return res.status(401).json({message:"Invalid token"});
  }
}