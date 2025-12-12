import { create } from "zustand";
import { apiRequest } from "../service/api";

export const useNoteStore = create((set, get) => ({
  notes: [],
  loading: false,
  currentNote: null, // 用于单个 note（查看 / 编辑）

  // -----------------------------
  // CREATE
  // -----------------------------
  createNote: async (title, content) => {
    try {
      set({ loading: true });

      const { ok } = await apiRequest("/notes", {
        method: "POST",
        body: JSON.stringify({ title, content }),
      });

      if (ok) {
        await get().getNotes(); // 自动刷新列表
      }

    } catch (err) {
      console.log("Create note error:", err);
    } finally {
      set({ loading: false });
    }
  },

  // -----------------------------
  // GET ALL NOTES
  // -----------------------------
  getNotes: async () => {
    try {
      set({ loading: true });

      const { ok, data } = await apiRequest("/notes", {
        method: "GET",
      });

      if (ok) {
        set({ notes: data.notes });
      }

    } catch (err) {
      console.log("Get notes error:", err);
    } finally {
      set({ loading: false });
    }
  },

  // -----------------------------
  // GET SINGLE NOTE
  // -----------------------------
  getNoteById: async (id) => {
    try {
      set({ loading: true });

      const { ok, data } = await apiRequest(`/notes/${id}`, {
        method: "GET",
      });

      if (ok) {
        set({ currentNote: data.note }); // 存一条
      }

    } catch (err) {
      console.log("Get note by ID error:", err);
    } finally {
      set({ loading: false });
    }
  },

  // -----------------------------
  // UPDATE NOTE
  // -----------------------------
  updateNote: async (id, title, content) => {
    try {
      set({ loading: true });

      const { ok } = await apiRequest(`/notes/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ title, content }),
      });

      if (ok) {
        await get().getNotes();
      }

    } catch (err) {
      console.log("Update note error:", err);
    } finally {
      set({ loading: false });
    }
  },

  // -----------------------------
  // DELETE NOTE
  // -----------------------------
  deleteNote: async (id) => {
    try {
      set({ loading: true });

      const { ok } = await apiRequest(`/notes/${id}`, {
        method: "DELETE",
      });

      if (ok) {
        await get().getNotes();
      }

    } catch (err) {
      console.log("Delete note error:", err);
    } finally {
      set({ loading: false });
    }
  },
}));
