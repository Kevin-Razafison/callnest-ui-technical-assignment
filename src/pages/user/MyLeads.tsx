import { useEffect, useState } from 'react';
import { Search, Filter, Phone, Eye, CheckCircle, Loader2 } from 'lucide-react';
import api from '../../api/axios'; 
import type { Lead } from '../../types/leads';

const MyLeads = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<number | null>(null); // Track which lead is being updated
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const fetchMyLeads = async () => {
        try {
            const response = await api.get('/leads/my');
            setLeads(response.data);
        } catch (error) {
            console.error("Error fetching leads:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyLeads();
    }, []);

    // NEW: Handle Status Change Logic
    const handleStatusChange = async (lead: Lead, newStatus: string) => {
        setUpdatingId(lead.id);
        try {
            // We send the current lead data but with the updated status
            await api.put(`/leads/${lead.id}`, {
                ...lead,
                status: newStatus
            });
            // Refresh the list to show updated status
            await fetchMyLeads();
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Could not update status. Please try again.");
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             lead.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) return (
        <div className="flex justify-center items-center bg-slate-950 min-h-screen text-white">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
    );

    return (
        <div className="bg-slate-950 p-8 min-h-screen text-white">
            <div className="flex md:flex-row flex-col justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="font-bold text-white text-white text-3xl tracking-tight">My Leads</h1>
                    <p className="mt-1 text-slate-400 text-sm">Update the status of your prospects as you progress.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="bg-blue-600/10 px-4 py-2 border border-blue-500/20 rounded-xl font-bold text-blue-400 text-sm">
                        {filteredLeads.length} Assigned Leads
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div className="gap-4 grid grid-cols-1 md:grid-cols-3 mb-6">
                <div className="relative md:col-span-2">
                    <Search className="top-1/2 left-3 absolute w-5 h-5 text-slate-500 -translate-y-1/2" />
                    <input 
                        type="text"
                        placeholder="Search by name or email..."
                        className="bg-slate-900 py-3 pr-4 pl-10 border border-slate-800 focus:border-blue-500 rounded-xl focus:outline-none w-full text-white text-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <Filter className="top-1/2 left-3 absolute w-5 h-5 text-slate-500 -translate-y-1/2" />
                    <select 
                        className="bg-slate-900 py-3 pr-4 pl-10 border border-slate-800 focus:border-blue-500 rounded-xl focus:outline-none w-full text-white text-sm transition-all appearance-none cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="QUALIFIED">Qualified</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>
            </div>

            {/* Leads Table */}
            <div className="bg-slate-900 shadow-2xl border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800/50 font-bold text-[11px] text-slate-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Lead Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Quick Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredLeads.map((lead) => (
                                <tr key={lead.id} className="group hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-slate-200">{lead.name}</td>
                                    <td className="px-6 py-4 text-slate-400 text-sm">{lead.email}</td>
                                    <td className="px-6 py-4">
                                        {updatingId === lead.id ? (
                                            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                                        ) : (
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                                lead.status === 'NEW' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                                                lead.status === 'CONTACTED' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                                                'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            }`}>
                                                {lead.status}
                                            </span>
                                        )}
                                    </td>
                                   <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            {/* On convertit en majuscules pour la comparaison */}
                                            {lead.status?.toUpperCase() === 'NEW' && (
                                                <button 
                                                    onClick={() => handleStatusChange(lead, 'CONTACTED')}
                                                    className="flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg font-bold text-amber-400 text-xs transition-all"
                                                >
                                                    <Phone className="w-3 h-3" />
                                                    Mark Contacted
                                                </button>
                                            )}

                                            {lead.status?.toUpperCase() === 'CONTACTED' && (
                                                <button 
                                                    onClick={() => handleStatusChange(lead, 'QUALIFIED')}
                                                    className="flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg font-bold text-emerald-400 text-xs transition-all"
                                                >
                                                    <CheckCircle className="w-3 h-3" />
                                                    Qualify
                                                </button>
                                            )}

                                            {/* Bouton de secours si le statut est autre ou vide */}
                                            {(!lead.status || lead.status?.toUpperCase() === 'QUALIFIED') && (
                                                <button className="hover:bg-slate-800 p-2 rounded-lg text-slate-400 transition-all">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyLeads;