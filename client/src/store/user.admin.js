import {create} from 'zustand'
import {apiRequest} from '../service/api.js'
export const useAdminUserStore = create((set, get) => ({
  users: [],
  loading: false,
  initialized: false,
  pagination:{
    page:1,
    total:0,
    totalPages:1
  },
  fetchAllUsers: async (params={}) => {
    try {
      set({ loading: true });
      const query = new URLSearchParams(params).toString();
      const res = await apiRequest(`/admin/allusers?${query}`, { method: "GET" });
      if (res.ok) {
        set({ users: res.data.data,pagination:res.data.pagination });
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
