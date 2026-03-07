import { useEffect, useState } from 'react';
import { Users, TrendingUp, PhoneIncoming, CheckCircle2, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../../api/axios'; 

const STAGE_COLORS: { [key: string]: string } = {
  DISCOVERY: '#3b82f6',
  PROPOSAL: '#a855f7',
  NEGOTIATION: '#f97316',
  CLOSED_WON: '#10b981',
  CLOSED_LOST: '#ef4444',
  UNKNOWN: '#64748b'
};

const StatCard = ({ title, value, icon: Icon, color, loading, trend }: any) => (
  <div className="bg-slate-900 shadow-sm p-6 border border-slate-800 rounded-2xl">
    <div className="flex justify-between items-center mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {/* On affiche le trend uniquement si on ne charge pas et s'il existe */}
      {!loading && trend !== undefined && (
        <span className={`font-medium text-sm px-2 py-0.5 rounded-full ${trend >= 0 ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </span>
      )}
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

function AdminDashboard() {
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
      <div className="p-8">
        <header className="mb-8">
          <h1 className="font-bold text-white text-3xl">Overview</h1>
          <p className="text-slate-400">Real-time business insights</p>
        </header>

        {/* Stats Grid */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Leads" 
            value={stats?.totalLeads} 
            icon={Users} 
            color="bg-blue-600" 
            loading={loading}
            trend={stats?.growthRate}
          />
          <StatCard 
            title="Active Calls" 
            value={stats?.activeCalls} 
            icon={PhoneIncoming} 
            color="bg-purple-600" 
            loading={loading}
            trend={stats?.growthRate}
          />
          <StatCard 
            title="Conversions" 
            value={stats?.conversions} 
            icon={CheckCircle2} 
            color="bg-emerald-600" 
            loading={loading}
            trend={stats?.growthRate}
          />
          <StatCard 
            title="Revenue Growth" 
            value={`${stats?.growthRate}%`} 
            icon={TrendingUp} 
            color="bg-amber-600" 
            loading={loading}
            trend={stats?.growthRate}
          />
        </div>

        {/* Placeholder for Charts */}
        <div className="gap-6 grid grid-cols-1 lg:grid-cols-3 mt-8">
          <div className="lg:col-span-2 bg-slate-900 p-6 border border-slate-800 rounded-2xl">
            <h3 className="mb-4 font-bold text-white">Pipeline Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.pipelineStats || []}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="stage"
                    // Fix: Use 'name' instead of 'stage' and handle undefined percent
                    label={({ name, percent }: any) => 
                      `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`
                    }
                  >
                    {stats?.pipelineStats?.map((entry: any, index: number) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={STAGE_COLORS[entry.stage.toUpperCase()] || STAGE_COLORS.UNKNOWN} 
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} /> 
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex flex-col bg-slate-900 p-6 border border-slate-800 rounded-2xl h-80">
            <h3 className="mb-4 font-bold text-white">Recent Activity</h3>
            <div className="flex-1 space-y-3 pr-2 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="w-6 h-6 text-slate-500 animate-spin" />
                </div>
              ) : stats?.recentLeads?.length > 0 ? (
                stats.recentLeads.map((lead: any) => (
                  <div key={lead.id} className="flex flex-col bg-slate-800/40 p-3 border border-slate-700/50 hover:border-slate-600 rounded-xl transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="max-w-[120px] font-semibold text-white text-sm truncate">{lead.name}</span>
                      <span 
                        className="px-1.5 py-0.5 rounded font-bold text-[9px] uppercase"
                        style={{ 
                          backgroundColor: `${STAGE_COLORS[lead.stage?.toUpperCase()] || '#64748b'}20`, 
                          color: STAGE_COLORS[lead.stage?.toUpperCase()] || '#64748b' 
                        }}
                      >
                        {lead.stage}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>{lead.assignedTo ? `Agent: ${lead.assignedTo.name}` : 'Unassigned'}</span>
                      <span>{new Date(lead.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col justify-center items-center h-full text-slate-500 text-sm italic">
                  <p>No recent activity detected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}

export default AdminDashboard;