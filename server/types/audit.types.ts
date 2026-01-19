export type AuditAction =
  | "CREATE_NOTE"
  | "UPDATE_NOTE"
  | "DELETE_NOTE"
  | "BAN_USER"
  | "UNBAN_USER"
  | "LOGIN"
  | "REGISTER";


export type AuditTargetType = "note" | "user";

export interface CreateAuditLogInput {
  actorId: string;
  actorRole: "user" | "admin";
  action: AuditAction;
  targetType: AuditTargetType;
  targetId?: string;
  metadata?: Record<string, any>;
}
