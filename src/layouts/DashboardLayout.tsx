import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  BarChart3,
  PhoneCall
} from 'lucide-react';
import { authService } from '../api/authService';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-200">
      {/* Sidebar */}
      <aside className="bg-slate-900/50 backdrop-blur-xl border-slate-800 border-r w-64">
        <div className="flex items-center gap-3 p-6">
          <div className="flex justify-center items-center bg-blue-600 rounded-lg w-8 h-8">
            <PhoneCall className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-xl tracking-tight">CallNest</span>
        </div>

        <nav className="space-y-2 mt-6 px-4">
          <Link to="/" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg text-slate-400 hover:text-white transition-all">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link to="/leads" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg text-slate-400 hover:text-white transition-all">
            <Users className="w-5 h-5" />
            Leads
          </Link>
          <Link to="/reports" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg text-slate-400 hover:text-white transition-all">
            <BarChart3 className="w-5 h-5" />
            Analytics
          </Link>
        </nav>

        <div className="bottom-0 absolute p-4 border-slate-800 border-t w-64">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="flex justify-center items-center bg-slate-700 rounded-full w-8 h-8 font-bold text-xs uppercase">
              {user.email?.substring(0, 2)}
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-white text-sm truncate">{user.email}</p>
              <p className="text-slate-500 text-xs uppercase">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 hover:bg-red-900/20 px-4 py-2 rounded-lg w-full text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;