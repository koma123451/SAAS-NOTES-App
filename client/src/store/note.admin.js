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
    try{
      set({loading:true})
      const{ok,data} = await apiRequest("/admin/allnotes",{method:"GET"})
   
      if(ok){
        set({notes:data.data})
      }

    }catch(err){
      console.log("err",err)
    }finally{
      set({loading:false})
    }
  }

}))