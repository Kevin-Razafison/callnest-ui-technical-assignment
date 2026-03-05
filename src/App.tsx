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
import SystemDashboard from "./pages/system/SystemDashboard";

/**
 * Dynamic Home Redirector
 * Checks user role from localStorage on every render to avoid stale data issues.
 */
const HomeRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.role === 'SYSTEM_ADMIN') return <SystemDashboard />;
  return user.role === 'COMPANY_ADMIN' ? <AdminDashboard /> : <UserDashboard />;
};

/**
 * Dynamic Leads Redirector
 * Routes to Admin Leads or Agent's MyLeads based on the current user role.
 */
const LeadsRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.role === 'SYSTEM_ADMIN') return <Navigate to="/" replace />;
  return user.role === 'COMPANY_ADMIN' ? <Leads /> : <MyLeads />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes Wrapper - On ajoute SYSTEM_ADMIN ici */}
        <Route element={<ProtectedRoute allowedRoles={['STANDARD_USER', 'COMPANY_ADMIN', 'SYSTEM_ADMIN']} />}>
          <Route element={<DashboardLayout />}>
            
            {/* DYNAMIC PATHS */}
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/leads" element={<LeadsRedirect />} />
            
            {/* Common Routes */}
            <Route path="/profile" element={<Profile />} />

            {/* Routes réservées au COMPANY_ADMIN (Tenant Admin) */}
            <Route element={<ProtectedRoute allowedRoles={['COMPANY_ADMIN']} />}>
              <Route path="/users" element={<Users />} />
              <Route path="/reports" element={<Analytics />} />
            </Route>

            {/* Routes réservées au SYSTEM_ADMIN (Platform Owner) */}
            <Route element={<ProtectedRoute allowedRoles={['SYSTEM_ADMIN']} />}>
               {/* Si tu as une page spécifique pour lister les entreprises au delà du dashboard */}
               <Route path="/system-companies" element={<SystemDashboard />} />
            </Route>
            
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;