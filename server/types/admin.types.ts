import { 
    PaginationOptions,
    UserSummary,
    ActorContext,
    Pagination,
    AdminNoteSummary, } from "../types/common.types.js";

export interface getAllUsersInput extends PaginationOptions
{   user:ActorContext
    search?:string;
    sort?:string;
}
export interface getAllUsersResult
{
    users:UserSummary[];
    pagination:Pagination;   
}

export interface getUserByIdInput{
    user:ActorContext;
    targetUserId:string;
}
export interface toggleBanUserInput{
    user:ActorContext;
    targetUserId:string;
}

export interface getAllNotesInput extends PaginationOptions
{
    user:ActorContext;
    search?:string;
    sort?:string;
}
export interface getAllNotesResult
{
    notes:AdminNoteSummary[];
    pagination:Pagination;   
}