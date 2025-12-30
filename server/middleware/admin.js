import AppError from '../utils/AppError.js'
export const admin =(req,res,next)=>{
  if(req.role!=="admin"){
    throw new AppError ("Admin only",403)
  }
  next()
}