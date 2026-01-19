// services/audit-log.service.ts

import { AuditLog } from "../model/auditLog.model.js";
import { CreateAuditLogInput } from "../types/audit.types.js";
import { normalizePagination } from "./_shared/pagination.js";
import { parseSort } from "./_shared/sort.js";

interface GetAuditLogsInput {
  page?: number;
  limit?: number;
  actorId?: string;
  action?: string;
  targetType?: string;
}

/* ----------------------------------
   CREATE AUDIT LOG
----------------------------------- */
export async function createAuditLog(
  input: CreateAuditLogInput
) {
  return AuditLog.create({
    ...input,
    createdAt: new Date(),
  });
}

/* ----------------------------------
   GET AUDIT LOGS (ADMIN)
----------------------------------- */
export async function getAuditLogsService({
  page,
  limit,
  actorId,
  action,
  targetType,
}: GetAuditLogsInput) {

  const { page: safePage, limit: safeLimit, skip } =
    normalizePagination(page, limit, 20);

  const filter: Record<string, any> = {};

  if (actorId) filter.actorId = actorId;
  if (action) filter.action = action;
  if (targetType) filter.targetType = targetType;

  const sortQuery = parseSort("createdAt:desc");

  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(safeLimit),

    AuditLog.countDocuments(filter),
  ]);

  return {
    logs,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
}
