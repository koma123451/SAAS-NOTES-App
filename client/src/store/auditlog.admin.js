import { create } from "zustand";
import { apiRequest } from "../service/api.js";

export const useAdminAuditLogStore = create((set) => ({
  logs: [],
  loading: false,

  pagination: {
    page: 1,
    totalPages: 1,
  },

  getAuditLogs: async (params = {}) => {
    try {
      set({ loading: true });

      const query = new URLSearchParams(params).toString();

      const { ok, data } = await apiRequest(
        `/admin/audit-logs?${query}`,
        { method: "GET" }
      );

      if (ok) {
        set({
          logs: data.data || [],
          pagination: data.pagination || {
            page: 1,
            totalPages: 1,
          },
        });
      }
    } catch (err) {
      console.error("Fetch audit logs failed:", err);
    } finally {
      set({ loading: false });
    }
  },

  clearAuditLogs: () =>
    set({
      logs: [],
      pagination: {
        page: 1,
        totalPages: 1,
      },
    }),
}));
