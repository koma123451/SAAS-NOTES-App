import { create } from "zustand";
import { apiRequest } from "../service/api";

export const useNoteStore = create((set, get) => ({
  notes: [],
  loading: false,
  currentNote: null, // For single note (view / edit)
  pagination:{
    page:1,
    totalPages:1
  },

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
        await get().getNotes(); // Auto refresh list
      }

    } catch (err) {
      console.error("Create note error:", err);
    } finally {
      set({ loading: false });
    }
  },

  // -----------------------------
  // GET ALL NOTES
  // -----------------------------
  getNotes: async (params={}) => {
    try {
      set({ loading: true });
      const query = new URLSearchParams(params).toString();
      const { ok, data } = await apiRequest(`/notes?${query}`, {
        method: "GET",
      });
      if (ok) {
        set({ notes: data.data ,pagination:data.pagination});
      }

    } catch (err) {
      console.error("Get notes error:", err);
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
        set({ currentNote: data.note }); // Store single note
      }

    } catch (err) {
      console.error("Get note by ID error:", err);
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
      console.error("Update note error:", err);
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
      console.error("Delete note error:", err);
    } finally {
      set({ loading: false });
    }
  },
  // store/note.js
  resetNotes: () => {
  set({
    notes: [],
    pagination: { page: 1, totalPages: 1 },
    loading: false,
    currentNote: null,
  });
},

}));
