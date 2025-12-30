import {create} from 'zustand'
import {apiRequest} from '../service/api.js'
export const useAdminUserStore = create((set, get) => ({
  users: [],
  loading: false,
  initialized: false,

  fetchAllUsers: async () => {
    try {
      set({ loading: true });
      const res = await apiRequest("/admin/allusers", { method: "GET" });
      if (res.ok) {
        set({ users: res.data.data });
      }
    } catch (err) {
      console.log(err);
    } finally {
      set({ loading: false, initialized: true });
    }
  },

  banUser: async (id) => {
    try {
      const { ok, data } = await apiRequest(
        `/admin/users/${id}/ban`,
        { method: "PATCH" }
      );
      if (!ok) return;

      set((state) => ({
        users: state.users.map((user) =>
          user._id === id
            ? { ...user, isBanned: data.isBanned }
            : user
        ),
      }));
    } catch (err) {
      console.log(err);
    }
  },
}));
