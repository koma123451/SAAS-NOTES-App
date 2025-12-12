import {Note} from '../model/note.model.js'

export const createNote= async(req,res)=>{
  
  try{
  const {title,content} = req.body;
  if (!title || !content) {
      return res.status(400).json({ message: "Title and content required" });
    }
  const exist = await Note.findOne({title});
  if(exist) return res.status(409).json({message:"duplicate title"})
    const note =await Note.create({
        title,
        content,
        userId:req.userId
      })
    res.status(201).json({success:true,note})
}catch(error){
  console.error("Create note error:",error)
}
}
export const getNotes= async(req,res)=>{
  try{
    const notes = await Note.find({userId:req.userId}).sort({createdAt:-1})
    res.status(201).json({success:true,notes})
  }catch(error){
    console.error("get notes error",error)
  }
}
export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find note
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // 2. 权限检查
    if (note.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // 3. 返回结果
    return res.status(200).json({ success: true, note });

  } catch (error) {
    console.log("Get note error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { id } = req.params;

    // 1. 找到 note
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // 2. 权限验证（必须在更新之前）
    if (note.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // 3. 执行更新
    const updated = await Note.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );

    return res.status(200).json({ success: true, note: updated });

  } catch (err) {
    console.log("Update note error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const deleteNote= async(req,res)=>{
    const{id} = req.params;
    const note = await Note.findById(id);
    if(!note) return res.status(404).json({message:"note not found"});
    if(note.userId.toString()!==req.userId)
      return res.status(403).json({message:"Not allowed"})
    await Note.findByIdAndDelete(id);
    res.status(200).json({message:"Deleted"})

}