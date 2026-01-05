import {create} from 'zustand'
import {apiRequest} from '../service/api.js'

export const useAdminNoteStore=create((set,get)=>({
  notes:[],
  loading: false,
  pagination:{
    page:1,
    totalPages:1
  },
  getAllNotes:async()=>{
    console.log("Request hit getAllNotes")
    try{
      set({loading:true})
      const{ok,data} = await apiRequest("/admin/notes",{method:"GET"})
      console.log("ok",ok)
      if(ok){
        set({notes:data.data})
      }

    }catch(err){
      console.log("err",err)
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
      console.log("err: ",err)
    }finally{
      set({loading:false})
    }
  }
}))