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
import Register from "./pages/auth/Register";

/**
 * Dynamic Home Redirector
 * Checks user role from localStorage on every render to avoid stale data issues.
 */
const HomeRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role === 'COMPANY_ADMIN' ? <AdminDashboard /> : <UserDashboard />;
};

/**
 * Dynamic Leads Redirector
 * Routes to Admin Leads or Agent's MyLeads based on the current user role.
 */
const LeadsRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role === 'COMPANY_ADMIN' ? <Leads /> : <MyLeads />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes Wrapper */}
        <Route element={<ProtectedRoute allowedRoles={['STANDARD_USER', 'COMPANY_ADMIN']} />}>
          <Route element={<DashboardLayout />}>
            
            {/* DYNAMIC PATHS 
                Using redirect components ensures the role is re-evaluated 
                after login/logout without requiring a manual page refresh.
            */}
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/leads" element={<LeadsRedirect />} />
            
            {/* Common Routes */}
            <Route path="/profile" element={<Profile />} />

            {/* Strict Admin Routes */}
            <Route path="/users" element={<Users />} />
            <Route path="/reports" element={<Analytics />} />
          </Route>
        </Route>

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;