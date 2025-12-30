import { Routes, Route } from "react-router-dom";
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Navbar from './components/Navbar.jsx'
import NotesList from './pages/NotesList.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import {useUserStore} from './store/user.js'
import {useEffect} from 'react'
import "../realtime/socket.js"
function App() {
  const {fetchUser,loading} = useUserStore()
    useEffect(() => {
   fetchUser()
  }, []);

  return (
    <>
    <Navbar/>
  <Routes>
    <Route path="/" element={
      <ProtectedRoute>
      <NotesList/>
      </ProtectedRoute>
      }/>
      <Route path="/admin" element={
    //  <ProtectedRoute>
      <AdminDashboard/>
     // </ProtectedRoute>
      }/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    
  </Routes>
    </>
  )
}

export default App
