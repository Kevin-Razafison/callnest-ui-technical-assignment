import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  PhoneCall,
  ShieldCheck, 
  LogOut 
} from 'lucide-react';
import { authService } from '../api/authService';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Leads', path: '/leads', icon: Users },
    { name: 'Analytics', path: '/reports', icon: BarChart3 },
    { name: 'Team', path: '/users', icon: ShieldCheck },
  ];

  return (
    <aside className="top-0 sticky flex flex-col bg-slate-900/50 backdrop-blur-xl border-slate-800 border-r w-64 h-screen">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 p-6">
        <div className="flex justify-center items-center bg-blue-600 rounded-lg w-8 h-8">
          <PhoneCall className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-white text-xl tracking-tight">CallNest</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 mt-6 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.name}
              to={item.path} 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout Section */}
      <div className="p-4 border-slate-800 border-t">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="flex justify-center items-center bg-slate-700 rounded-full w-8 h-8 font-bold text-white text-xs uppercase">
            {user.email?.substring(0, 2)}
          </div>
          <div className="overflow-hidden">
            <p className="font-medium text-white text-sm truncate">{user.email}</p>
            <p className="font-bold text-[10px] text-slate-500 uppercase tracking-widest">{user.role}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 hover:bg-red-900/20 px-4 py-2 rounded-lg w-full font-medium text-red-400 text-sm transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;