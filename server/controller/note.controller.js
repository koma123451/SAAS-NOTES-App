import {Note} from '../model/note.model.js'
import asyncHandler from "express-async-handler";
import AppError from '../utils/AppError.js'

export const createNote= asyncHandler(async(req,res)=>{
 const {title,content} = req.body;
 if(!title||!content){
  throw new AppError("Title and content required",400)
 }
 const exist = await Note.findOne({
  title,
  userId:req.userId
})
  if(exist){
    throw new AppError("Duplicate Title",409)
  }
  const note = await Note.create({title,content,userId:req.userId})
  //拿到socket.io实例
  const io = req.app.get("io");
  //发送一个实时事件
  io.emit("note:created",{id:note._id,})

  res.status(201).json({
    success:true,
    data:note
  })
}
)
export const getNotes = asyncHandler(async (req, res) => {
  console.log("typeof",typeof req.userId, req.userId);

  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 3, 10);
  const skip = (page - 1) * limit;

  const search = req.query.search || "";
  const sortParam = req.query.sort || "createdAt:desc";

  // 排序解析
  const [sortField, sortOrder] = sortParam.split(":");
  const sort = {
    [sortField]: sortOrder === "asc" ? 1 : -1,
    _id:sortOrder === "asc"? 1:-1, //如果createdAt时间几乎一样，这个是兜底
  };

  // 查询条件
  const filter = {
    userId: req.userId,
    ...(search && {
      title: { $regex: search, $options: "i" }, // 模糊搜索
    }),
  };

  const [notes, total] = await Promise.all([
    Note.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Note.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: notes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});


export const getNoteById =asyncHandler( async (req, res) => {
  const {id}=req.params;
  const note = await Note.findById(id)
  if(!note) throw new AppError("note not found",404)
  res.status(200).json({
    success:true,
    data:note
  })
}
)
export const updateNote = asyncHandler (async (req, res) => {
  const {title,content}=req.body
  const {id} = req.params;
  const note = await Note.findById(id)
  if(!note) throw new AppError("note not found",404)
  if(note.userId.toString()!==req.userId) throw new AppError("Not Allowed",403)
  if(title&&title!==note.title){
    const exist = await Note.findOne({
      title,
      userId:req.userId,
      _id:{$ne:id}
    })
    if(exist) throw new AppError("Duplicate title",409)
  }
    const updatedNote =await Note.findByIdAndUpdate(id,{title,content},{new:true})
  res.status(200).json({
    success:true,
    data:updatedNote
  })})


export const deleteNote =asyncHandler (async (req, res) => {
  const {id}=req.params;
  const note = await Note.findOneAndDelete({_id:id,userId:req.userId});
  if(!note) throw new AppError("Note not found",404)
  if(note.userId.toString()!==req.userId) throw new AppError("Not Allowed",403)
  res.status(200).json({
    success:true,
    data:note  
  })
})