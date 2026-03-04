import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from './pages/auth/Login';
import Dashboard from './pages/admin/Dashboard';
import Leads from './pages/admin/Leads';
import Analytics from "./pages/admin/Analytics";
import Users from "./pages/admin/Users";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element ={<Login />} />

        {/* Protected Routes */}
        <Route element = {<ProtectedRoute allowedRoles={['STANDARD_USER','COMPANY_ADMIN']} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
        </Route>

        {/*Route only fot the Admins */}
        <Route element={<ProtectedRoute allowedRoles={['COMPANY_ADMIN']} />}>
          <Route path="/users" element={<Users />} />
          <Route path="/reports" element={<Analytics />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App;