import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from './pages/auth/Login';
import Leads from './pages/admin/Leads';
import Analytics from "./pages/admin/Analytics";
import Users from "./pages/admin/Users";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import Profile from "./pages/user/Profile";
import MyLeads from "./pages/user/MyLeads";

function App() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute allowedRoles={['STANDARD_USER', 'COMPANY_ADMIN']} />}>
          <Route element={<DashboardLayout />}>
            <Route 
              path="/" 
              element={user.role === 'COMPANY_ADMIN' ? <AdminDashboard /> : <UserDashboard />} 
            />
            <Route path="/profile" element={<Profile />} />
            <Route 
              path="/leads" 
              element={user.role === 'COMPANY_ADMIN' ? <Leads /> : <MyLeads />} 
            />
            {/* Routes Admin */}
            <Route path="/users" element={<Users />} />
            <Route path="/reports" element={<Analytics />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;