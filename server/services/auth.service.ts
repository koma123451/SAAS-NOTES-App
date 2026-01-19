import {
     LoginInput,
     LoginResult,
     RegisterInput,
     RegisterResult } from "../types/user.types.js";
import { User } from "../model/user.model.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt.js";
import { IUser } from "../model/user.model.js";
import {createAuditLog} from './audit-log.service.js'
export async function loginUserService(
  input: LoginInput
): Promise<LoginResult> {

  const { email, password } = input;

  const user = await User.findOne({ email })
    .select("+password role isBanned");

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  if (user.isBanned) {
    throw new AppError("Account is banned", 403);
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = signToken({
    id: user._id.toString(),
    role: user.role,
  });

  try {
  // audit log
  await createAuditLog({
  actorId: user._id.toString(),
  actorRole: user.role,
  action: "LOGIN",
  targetType: "user",
  targetId: user._id.toString(),
});

  } catch (err) {
    console.error("audit failed", err);
  }


  return {
    token,
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
}
export async function registerUserService(input: RegisterInput): Promise<RegisterResult> {
    const { username, email, password } = input;
    if(password.length < 6) {
        throw new AppError("Password must be at least 6 characters", 400);
      }
      
      const exists = await User.findOne({email});
      if(exists) {
        throw new AppError("Email already exists", 400);
      }
      
      const user = await User.create({username,email,password});
      const token = signToken({
        id: user._id.toString(),
        role: user.role,
      });

      try {
            // audit log
    await createAuditLog({
      actorId: user._id.toString(),
      actorRole: user.role,
      action: "REGISTER",
      targetType: "user",
      targetId: user._id.toString(),
    });
    } catch (err) {
      console.error("audit failed", err);
    }



    return {
    token,
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
}

export async function getCurrentUser(
  userId: string
) : Promise<IUser | null> {
  return User.findById(userId).select("-password");
}
