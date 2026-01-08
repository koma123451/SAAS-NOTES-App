import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, "Username is required"],
    trim: true,
    minlength: [3, "Username must be at least 3 characters"],
    maxlength: [30, "Username cannot exceed 30 characters"]
  },
  email: { 
    type: String, 
    unique: true, 
    required: [true, "Email is required"],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"]
  },
  password: { 
    type: String, 
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false // Do not return password field by default
  },
  role: { 
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  isBanned: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

// Index optimization
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isBanned: 1 });

//hash the password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export const User = mongoose.model("User", userSchema);
