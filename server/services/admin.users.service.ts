import AppError from "../utils/AppError.js";
import {getAllUsersInput,getAllUsersResult,getUserByIdInput,toggleBanUserInput} from "../types/admin.types.js"
import {User,IUser} from '../model/user.model.js';
import type { SortOrder } from "mongoose";
import { UserSummary } from "../types/common.types.js";
import mongoose from "mongoose";
export async function getAllUsersService({page,limit,user,search,sort}:getAllUsersInput):Promise<getAllUsersResult> 
{   
    if(user.userRole!=="admin"){
        throw new AppError("Unauthorized",403)
    }
    const safePage = Math.max(page ?? 1, 1);
    const safeLimit = Math.min(limit ?? 3, 10);
    const skip = (safePage - 1) * safeLimit;
    const sortParam = sort || "createdAt:desc";
 //Parse sort parameters
    const [sortField, sortOrder] = sortParam.split(":");
    const sortQuery: Record<string, SortOrder> = {
    [sortField]: sortOrder === "asc" ? 1 : -1,
    _id: sortOrder === "asc" ? 1 : -1,
    };
    // Query filter
      const filter = {
    ...(search && {
      email: { $regex: search, $options: "i" }, // Case-insensitive search
    }),
  };
  const [users, total] = await Promise.all([
          User.find(filter)
          .select("_id username email role createdAt isBanned")
          .sort(sortQuery)
          .skip(skip)
          .limit(safeLimit),
        User.countDocuments(filter),
      ]);
    return{
        users,
        pagination:{
            page:safePage,
            limit:safeLimit,
            total,
            totalPages: Math.ceil(total / safeLimit),
        }
    }
}
export async function getUserByIdService(
  input: getUserByIdInput
): Promise<UserSummary> {
  const { user, targetUserId } = input;

  // ObjectId validation（service 再做一次）
  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    throw new AppError("Invalid user id", 400);
  }

  // 权限校验：只能看自己，或 admin
  if (
    user.userRole !== "admin" &&
    user.userId !== targetUserId
  ) {
    throw new AppError("Forbidden", 403);
  }

  const found = await User.findById(targetUserId).select(
    "_id username email role isBanned createdAt"
  );

  if (!found) {
    throw new AppError("User not found", 404);
  }

  return {
    id: found._id.toString(),
    username: found.username,
    email: found.email,
    role: found.role,
    isBanned: found.isBanned,
    createdAt: found.createdAt,
  };
}

export async function toggleBanUserService(input :toggleBanUserInput)
:Promise<UserSummary>{ 

    const {user,targetUserId}=input;
      // Input validation
      if(!targetUserId || !(targetUserId as string).match(/^[0-9a-fA-F]{24}$/)) {
        throw new AppError("Invalid user ID", 400);
      }
        if(user.userId.toString() === targetUserId) {
          throw new AppError("You cannot ban yourself", 400);
        }

        const targetUser = await User.findById(targetUserId);
          if(!targetUser) {
            throw new AppError("User not found", 404);
          }

            // Prevent banning other admins
            if(targetUser.role === "admin" && user.userId.toString() !== targetUserId) {
              throw new AppError("Cannot ban another admin", 403);
            }
            targetUser.isBanned = !targetUser.isBanned;
            await targetUser.save();

            return {
                id: targetUser._id.toString(),
                username: targetUser.username,
                email: targetUser.email,
                role: targetUser.role,
                isBanned: targetUser.isBanned,
                createdAt: targetUser.createdAt,
            }

   

}