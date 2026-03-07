import { useEffect, useState } from 'react';
import { PhoneIncoming, Star, Clock, CheckCircle2, Calendar1Icon } from 'lucide-react';
import { type Lead, type UserStats as DashboardCounts } from '../../types/leads';
import type { LucideIcon } from 'lucide-react';
import api from '../../api/axios';

// 1.  interfaces definition for TypeScript
interface StatItem {
    name: string;
    value: string;
    icon: LucideIcon;
    color: string;
    bg: string;
}



function UserDashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [priorityLeads, setPriorityLeads] = useState<Lead[]>([]); 
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<any[]>([]); 
    
    const [counts, setCounts] = useState<DashboardCounts>({
        total: 0,
        new: 0,
        closed: 0,
        goal: 0
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [leadsRes, statsRes, tasksRes] = await Promise.all([
                    api.get('/leads/my-priority'),
                    api.get('/leads/my-stats'),
                    api.get('/tasks/my') // Ajout de l'appel pour les tâches
                ]);
                setPriorityLeads(leadsRes.data);
                setCounts(statsRes.data);
                setTasks(tasksRes.data); // On stocke les vraies tâches
            } catch (err) {
                console.error("Erreur Data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const stats: StatItem[] = [
        { name: 'My Leads', value: counts.total.toString(), icon: PhoneIncoming, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'To Follow Up', value: counts.new.toString(), icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { name: 'Closed Deals', value: counts.closed.toString(), icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { name: 'My Rating', value: '4.9', icon: Star, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    ];

    return (
            <div className="space-y-8 p-8">
                {/* Header */}
                <div>
                    <h1 className='font-bold text-white text-3xl tracking-tight'>
                        Hello, <span className="text-blue-500">{user.email?.split('@')[0]}</span> !
                    </h1>
                    <p className='mt-1 text-slate-400'>Ready to convert some leads today?</p>
                </div>

                {/* Stats Grid */}
                <div className='gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
                    {stats.map((stat) => (
                        <div key={stat.name} className='flex justify-between items-center bg-slate-900 p-6 border border-slate-800 hover:border-slate-700 rounded-2xl transition-colors'>
                            <div>
                                <p className='font-medium text-slate-400 text-sm'>{stat.name}</p>
                                <p className="mt-1 font-bold text-white text-2xl">{stat.value}</p>
                            </div>
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                                <stat.icon className='w-6 h-6' />
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Section Action : next leads to call */}
                <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
                    <div className="lg:col-span-2 bg-slate-900 p-6 border border-slate-800 rounded-2xl">
                        <h2 className="mb-6 font-bold text-white text-xl">Priority Leads to Call</h2>
                        <div className="space-y-4">
                            {loading ? (
                                <p className="text-slate-500 text-sm italic">Loading your leads...</p>
                            ) : priorityLeads.length > 0 ? (
                                priorityLeads.map((lead) => (
                                    <div key={lead.id} className="group flex justify-between items-center bg-slate-950 p-4 border border-slate-800 hover:border-blue-500/50 rounded-xl transition-all cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="flex justify-center items-center bg-slate-800 rounded-full w-10 h-10 font-bold text-blue-400 text-xs">
                                                ID {lead.id}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white group-hover:text-blue-400 transition-colors">
                                                    {lead.name} {/* CHANGED: from firstName/lastName to name */}
                                                </p>
                                                <p className="text-slate-500 text-xs uppercase tracking-wide">
                                                    Added on: {new Date(lead.createdAt).toLocaleDateString()} {/* Affiche la date */}
                                                </p>
                                                <p className="text-slate-500 text-xs uppercase tracking-wide">Priority Lead</p>
                                            </div>
                                        </div>
                                        <button className="bg-slate-800 hover:bg-blue-600 px-4 py-2 rounded-lg font-bold text-white text-sm transition-colors">
                                            Call Now
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-sm italic">No priority leads assigned to you yet.</p>
                            )}
                        </div>
                    </div>
                    {/* --- Section Calendrier & Objectifs --- */}
                    <div className="space-y-6">
                        {/* Mini Calendar / Upcoming Tasks */}
                        <div className="bg-slate-900 p-6 border border-slate-800 rounded-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="flex items-center gap-2 font-bold text-white">
                                    <Calendar1Icon className="w-5 h-5 text-blue-500" />
                                    Upcoming Tasks
                                </h3>
                                <span className="text-blue-500 text-xs hover:underline cursor-pointer">View all</span>
                            </div>
                            
                            <div className="space-y-3">
                                {tasks.length > 0 ? (
                                    tasks.slice(0, 3).map((task) => ( // On affiche les 3 premières
                                        <div key={task.id} className="bg-slate-950 p-3 border-blue-600 border-l-4 rounded-r-xl">
                                            <p className="font-medium text-white text-sm">{task.title}</p>
                                            <p className="mt-1 text-slate-500 text-xs">
                                                {new Date(task.dueDate).toLocaleString('fr-FR', { 
                                                    weekday: 'long', hour: '2-digit', minute: '2-digit' 
                                                })}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-500 text-sm italic">No tasks for today.</p>
                                )}
                            </div>
                        </div>
                    {/* Goal Card */}
                    <div className="flex flex-col justify-center items-center bg-blue-600/5 p-6 border border-blue-500/20 rounded-2xl text-center">
                        <div className="relative flex justify-center items-center mb-4 w-20 h-20">
                            <svg className="absolute w-full h-full -rotate-90">
                                <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
                                <circle
                                    cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="6" fill="transparent"
                                    strokeDasharray={219.8}
                                    strokeDashoffset={219.8 - (219.8 * (counts.goal || 0)) / 100}
                                    className="text-blue-600 transition-all duration-1000"
                                />
                            </svg>
                            <span className="relative font-bold text-white text-xl">{counts.goal || 0}%</span>
                        </div>
                        <h3 className="font-bold text-white text-sm">Daily Goal</h3>
                    </div>
                    <h3 className="font-bold text-white text-lg">Daily Goal</h3>
                    <p className="mt-2 text-slate-400 text-sm">
                        {counts.goal && counts.goal >= 100 
                            ? "Objective reached! Great job! 🎯" 
                            : "Almost there! Reach your daily objective."}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;