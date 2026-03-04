import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/auth/Login';
import Dashboard from './pages/admin/Dashboard';
import Leads from './pages/admin/Leads';
import Analytics from "./pages/admin/Analytics";
import Users from "./pages/admin/Users";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = !!localStorage.getItem('token');
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element ={<Login />} />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/leads" element={
          <ProtectedRoute>
            <Leads />
          </ProtectedRoute>
        } />

        <Route path="/reports" element={<Analytics />} />
        <Route path="/users" element={<Users />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App;