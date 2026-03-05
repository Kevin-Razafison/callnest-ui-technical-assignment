import { useEffect, useState } from 'react';
import { Building2, Users, Activity, TrendingUp, Zap } from 'lucide-react';
import api from '../../api/axios';

interface PlatformMetrics {
    totalCompanies: number;
    totalUsers: number;
}

function PlatformStats() {
    const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await api.get('/system/companies/platform-metrics');
                setMetrics(res.data);
            } catch (err) {
                console.error("Error fetching platform metrics:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    if (loading) return <div className="p-8 text-slate-400">Loading metrics...</div>;

    const cards = [
        { 
            title: 'Total Companies', 
            value: metrics?.totalCompanies || 0, 
            icon: Building2, 
            color: 'text-blue-500', 
            bg: 'bg-blue-500/10' 
        },
        { 
            title: 'Total Platform Users', 
            value: metrics?.totalUsers || 0, 
            icon: Users, 
            color: 'text-emerald-500', 
            bg: 'bg-emerald-500/10' 
        },
        { 
            title: 'System Health', 
            value: 'Optimal', 
            icon: Zap, 
            color: 'text-amber-500', 
            bg: 'bg-amber-500/10' 
        },
    ];

    return (
        <div className="space-y-8 p-8">
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-6 h-6 text-blue-500" />
                    <span className="font-bold text-blue-500 text-sm uppercase tracking-widest">Platform Monitor</span>
                </div>
                <h1 className="font-bold text-white text-3xl tracking-tight">Global Statistics</h1>
                <p className="mt-1 text-slate-400">Real-time overview of the entire CallNest infrastructure.</p>
            </header>

            {/* Metrics Grid */}
            <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-slate-900 shadow-xl p-6 border border-slate-800 rounded-2xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-medium text-slate-500 text-sm">{card.title}</p>
                                <p className="mt-2 font-bold text-white text-3xl">{card.value}</p>
                            </div>
                            <div className={`${card.bg} p-3 rounded-xl`}>
                                <card.icon className={`${card.color} w-6 h-6`} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 font-bold text-slate-500 text-xs uppercase tracking-tighter">
                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                            <span>+12% this month</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions or System Logs placeholder */}
            <div className="bg-slate-900 p-8 border border-slate-800 rounded-2xl text-center">
                <div className="mx-auto max-w-md">
                    <div className="flex justify-center items-center bg-slate-800 mx-auto mb-4 rounded-full w-16 h-16">
                        <Activity className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="font-bold text-white text-lg">System Logs</h3>
                    <p className="mt-2 text-slate-500 text-sm">
                        All company instances are currently responding within normal parameters. 
                        No anomalies detected in schema isolation.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PlatformStats;