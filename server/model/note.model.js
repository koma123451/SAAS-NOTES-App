import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"]
    },
    content: { 
      type: String, 
      required: [true, "Content is required"],
      maxlength: [10000, "Content cannot exceed 10000 characters"]
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: [true, "User ID is required"],
      index: true
    }
  },
  { timestamps: true }
);

// Index optimization - improve query performance
noteSchema.index({ userId: 1, createdAt: -1 });
noteSchema.index({ userId: 1, title: 1 }); // For duplicate title checking
noteSchema.index({ title: "text", content: "text" }); // Text search index (optional)

export const Note = mongoose.model("Note", noteSchema);
