import { Routes, Route } from "react-router-dom";
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Navbar from './components/Navbar.jsx'
import NotesList from './pages/NotesList.jsx'
function App() {


  return (
    <>
    <Navbar/>
  <Routes>
    <Route path="/" element={<NotesList/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    
  </Routes>
    </>
  )
}

export default App
