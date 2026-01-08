import {create} from 'zustand'
import {apiRequest} from '../service/api.js'

export const useAdminNoteStore=create((set,get)=>({
  notes:[],
  loading: false,
  pagination:{
    page:1,
    totalPages:1
  },
  getAllNotes:async(params={})=>{
    try{
      set({loading:true})
      const query = new URLSearchParams(params).toString();
      const{ok,data} = await apiRequest(`/admin/notes?${query}`,{method:"GET"})
      if(ok){
        set({
          notes: data.data || [],
          pagination: data.pagination || { page: 1, totalPages: 1 }
        })
      }
    }catch(err){
      console.error("Get all notes error:", err)
    }finally{
      set({loading:false})
    }
  },
  getUserNotes:async(userId,params={})=>{
    try{
      set({loading:true})
      const query = new URLSearchParams(params).toString();
      const {ok,data} = await apiRequest(`/admin/users/${userId}/notes?${query}`,{method:"GET"})
      if(ok){
        set({notes:data.data,
            pagination:data.pagination
        })
        
      }
    }catch(err){
      console.error("Get user notes error:", err)
    }finally{
      set({loading:false})
    }
  }
}))