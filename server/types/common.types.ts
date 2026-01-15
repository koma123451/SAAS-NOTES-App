export interface ActorContext {
  userId: string
  userRole: 'user' | 'admin'
}

export interface Pagination { 
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export interface PaginationOptions { 
    page?: number;
    limit?: number;
}

export interface UserSummary {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  isBanned: boolean;
  createdAt: Date;
}
export interface NoteSummary {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface AdminNoteSummary {
  id: string;
  title: string;
  content: string;
  userId: string;        // admin 
  isDeleted?: boolean;    // admin 
  createdAt: Date;
  updatedAt: Date;
}
