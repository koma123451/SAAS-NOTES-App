import asyncHandler from "express-async-handler";
import { getAuditLogsService } from "../services/audit-log.service.js";

export const getAuditLogs = asyncHandler(async (req, res) => {
  const { page, limit, actorId, action, targetType } = req.query;

  const result = await getAuditLogsService({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    actorId: actorId as string | undefined,
    action: action as string | undefined,
    targetType: targetType as string | undefined,
  });

  res.status(200).json({
    success: true,
    data: result.logs,
    pagination: result.pagination,
  });
});
