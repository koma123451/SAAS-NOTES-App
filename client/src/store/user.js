import {create} from 'zustand'
import {apiRequest} from '../service/api.js'
import {useNoteStore} from './note.js'
export const useUserStore = create((set,get)=>({
  user:null,
  loading:false,
  initialized: false,

  fetchUser:async(force=false)=>{
    if (get().initialized&&!force) return;
    try{
      set({loading:true})
      const res = await apiRequest("/auth/me",{method:"GET"})
      console.log("dataa",res.data)
      if(res.ok){
      set({user:res.data})
      }else{
        set({user:null})
      }
    }catch(err){
      set({user:null})
    }finally{
      set({loading:false,initialized: true})
    }
  },

  login:async(email,password)=>{
    try{
      set({loading:true})
      await apiRequest("/auth/login",{method:"POST",body:JSON.stringify({email,password})});
      await useUserStore.getState().fetchUser(true);
      
    }catch(err){
      console.log("login error:",err)
    }
    finally{
      set({loading:false})
    }
  },
  logout:async()=>{
   const logout= await apiRequest("/auth/logout",{method:"POST"})
   console.log("logout:",logout)
    set({user:null,initialized: true})
    useNoteStore.getState().resetNotes()
  },
  register:async(username,email,password)=>{
    const{ok,data}  = await apiRequest("/auth/register",{
      method:"POST",
      body:JSON.stringify({username,email,password})
    })
    if(ok){
      set({user:data.user})
      return{success:true}
    }
    return{success:false,message:data?.message||"Registeration failed"}
   

  },






}))