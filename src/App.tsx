import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from './pages/auth/Login';
import Leads from './pages/admin/Leads';
import Analytics from "./pages/admin/Analytics";
import Users from "./pages/admin/Users";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import Profile from "./pages/user/Profile";

function App() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Routes for all connected User */}
        <Route element={<ProtectedRoute allowedRoles={['STANDARD_USER', 'COMPANY_ADMIN']} />}>
          <Route 
            path="/" 
            element={user.role === 'COMPANY_ADMIN' ? <AdminDashboard /> : <UserDashboard />} 
          />
          <Route path="/profile" element={<Profile />} />
          
          {/* Redirection /leads */}
          <Route 
            path="/leads" 
            element={user.role === 'COMPANY_ADMIN' ? <Leads /> : <MyLeads />} 
          />
        </Route>

        {/* Routes Admins only */}
        <Route element={<ProtectedRoute allowedRoles={['COMPANY_ADMIN']} />}>
          <Route path="/users" element={<Users />} />
          <Route path="/reports" element={<Analytics />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
export default App;