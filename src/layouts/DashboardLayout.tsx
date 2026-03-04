import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-200">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet /> {/* Les composants enfants définis dans App.tsx s'afficheront ici */}
      </main>
    </div>
  );
};

export default DashboardLayout;