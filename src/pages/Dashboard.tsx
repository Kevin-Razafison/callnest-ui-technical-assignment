import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Users, TrendingUp, PhoneIncoming, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../api/axios'; // Ton instance axios configurée

const StatCard = ({ title, value, icon: Icon, color, loading }: any) => (
  <div className="bg-slate-900 shadow-sm p-6 border border-slate-800 rounded-2xl">
    <div className="flex justify-between items-center mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {!loading && <span className="font-medium text-green-400 text-sm">+12%</span>}
    </div>
    <h3 className="font-medium text-slate-400 text-sm">{title}</h3>
    <div className="flex items-center mt-1">
      {loading ? (
        <Loader2 className="w-5 h-5 text-slate-500 animate-spin" />
      ) : (
        <p className="font-bold text-white text-2xl">{value}</p>
      )}
    </div>
  </div>
);

function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-8">
        <header className="mb-8">
          <h1 className="font-bold text-white text-3xl">Overview</h1>
          <p className="text-slate-400">Real-time business insights from your database.</p>
        </header>

        {/* Stats Grid */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Leads" 
            value={stats?.totalLeads} 
            icon={Users} 
            color="bg-blue-600" 
            loading={loading}
          />
          <StatCard 
            title="Active Calls" 
            value={stats?.activeCalls} 
            icon={PhoneIncoming} 
            color="bg-purple-600" 
            loading={loading}
          />
          <StatCard 
            title="Conversions" 
            value={stats?.conversions} 
            icon={CheckCircle2} 
            color="bg-emerald-600" 
            loading={loading}
          />
          <StatCard 
            title="Revenue Growth" 
            value={`${stats?.growthRate}%`} 
            icon={TrendingUp} 
            color="bg-amber-600" 
            loading={loading}
          />
        </div>

        {/* Placeholder for Charts */}
        <div className="gap-6 grid grid-cols-1 lg:grid-cols-3 mt-8">
          <div className="flex justify-center items-center lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl h-80 text-slate-500 italic">
            Chart: Lead Generation over time (Coming soon)
          </div>
          <div className="flex justify-center items-center bg-slate-900 p-6 border border-slate-800 rounded-2xl h-80 text-slate-500 text-center italic">
            Recent Activity Feed
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;