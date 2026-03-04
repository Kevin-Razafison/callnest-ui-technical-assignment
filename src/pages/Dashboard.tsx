import DashboardLayout from '../layouts/DashboardLayout';
import { Users, TrendingUp, PhoneIncoming, CheckCircle2 } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-slate-900 shadow-sm p-6 border border-slate-800 rounded-2xl">
    <div className="flex justify-between items-center mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="font-medium text-green-400 text-sm">+12%</span>
    </div>
    <h3 className="font-medium text-slate-400 text-sm">{title}</h3>
    <p className="mt-1 font-bold text-white text-2xl">{value}</p>
  </div>
);

function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <header className="mb-8">
          <h1 className="font-bold text-white text-3xl">Overview</h1>
          <p className="text-slate-400">Welcome to your CallNest administration panel.</p>
        </header>

        {/* Stats Grid */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Leads" value="1,284" icon={Users} color="bg-blue-600" />
          <StatCard title="Active Calls" value="42" icon={PhoneIncoming} color="bg-purple-600" />
          <StatCard title="Conversions" value="156" icon={CheckCircle2} color="bg-emerald-600" />
          <StatCard title="Revenue Growth" value="+24%" icon={TrendingUp} color="bg-amber-600" />
        </div>

        {/* Placeholder for Charts/Recent Activity */}
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