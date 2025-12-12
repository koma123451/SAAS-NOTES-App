import {create} from 'zustand'
import {apiRequest} from '../service/api.js'
export const useUserStore = create((set)=>({
  user:null,
  loading:false,

  fetchUser:async()=>{
    try{
      set({loading:true})
      const res = await apiRequest("/auth/me",{method:"Get"})
      set({user:res.data})
    }catch(err){
      set({user:null})
    }finally{
      set({loading:false})
    }
  },

  login:async(email,password)=>{
    try{
      set({loading:true})
      await apiRequest("/auth/login",{method:"POST",body:JSON.stringify({email,password})});
      await useUserStore.getState().fetchUser();
      
    }catch(err){
      console.log("login error:",err)
    }
    finally{
      set({loading:false})
    }
  },
  logout:async()=>{
    await apiRequest("/auth/logout",{method:"POST"})
    set({user:null})
  },






}))