import { Routes, Route } from "react-router-dom";
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Navbar from './components/Navbar.jsx'
import NotesList from './pages/NotesList.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminUserNotes from './pages/AdminUserNotes.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import {useUserStore} from './store/user.js'
import {useEffect} from 'react'
import "../realtime/socket.js"
function App() {
  const { fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <Navbar />

      <Routes>
        {/* 普通用户 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <NotesList />
            </ProtectedRoute>
          }
        />

        {/* admin 路由组 */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route
            path="/admin/users/:userId/notes"
            element={<AdminUserNotes />}
          />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}


export default App
