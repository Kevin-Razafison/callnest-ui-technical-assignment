import { useEffect, useState } from 'react';
import { Search, Filter, Phone, Eye, MoreHorizontal } from 'lucide-react';
import api from '../../api/axios'; 
import type { Lead } from '../../types/leads';

const MyLeads = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    
    // States for filtering and searching
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
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

        fetchMyLeads();
    }, []);

    // Logic for filtering leads locally
    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             lead.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    if (loading) return (
        <div className="flex justify-center items-center bg-slate-950 min-h-screen text-white">
            <p className="animate-pulse">Loading your leads...</p>
        </div>
    );

    return (
        <div className="bg-slate-950 p-8 min-h-screen text-white">
            {/* Header Section */}
            <div className="flex md:flex-row flex-col justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="font-bold text-white text-3xl tracking-tight">My Leads</h1>
                    <p className="mt-1 text-slate-400">Manage and track your assigned prospects.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="bg-blue-600/10 px-4 py-2 border border-blue-500/20 rounded-xl font-bold text-blue-400 text-sm">
                        {filteredLeads.length} Leads found
                    </span>
                </div>
            </div>

            {/* Controls Section: Search & Filter */}
            <div className="gap-4 grid grid-cols-1 md:grid-cols-3 mb-6">
                <div className="relative md:col-span-2">
                    <Search className="top-1/2 left-3 absolute w-5 h-5 text-slate-500 -translate-y-1/2" />
                    <input 
                        type="text"
                        placeholder="Search by name or email..."
                        className="bg-slate-900 py-3 pr-4 pl-10 border border-slate-800 focus:border-blue-500 rounded-xl focus:outline-none w-full text-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <Filter className="top-1/2 left-3 absolute w-5 h-5 text-slate-500 -translate-y-1/2" />
                    <select 
                        className="bg-slate-900 py-3 pr-4 pl-10 border border-slate-800 focus:border-blue-500 rounded-xl focus:outline-none w-full text-sm transition-all appearance-none cursor-pointer"
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

            {/* Table Section */}
            <div className="bg-slate-900 shadow-2xl border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800/50 font-bold text-[11px] text-slate-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredLeads.map((lead) => (
                                <tr key={lead.id} className="group hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-slate-200">{lead.name}</td>
                                    <td className="px-6 py-4 text-slate-400 text-sm">{lead.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                            lead.status === 'NEW' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                                            lead.status === 'CONTACTED' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        }`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end items-center gap-2">
                                            <button className="hover:bg-slate-800 p-2 rounded-lg text-blue-400 transition-all" title="View Details">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="hover:bg-slate-800 p-2 rounded-lg text-emerald-400 transition-all" title="Call Lead">
                                                <Phone className="w-4 h-4" />
                                            </button>
                                            <button className="hover:bg-slate-800 p-2 rounded-lg text-slate-500 transition-all">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredLeads.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="flex justify-center items-center bg-slate-800 mx-auto mb-4 rounded-full w-16 h-16">
                            <Search className="w-8 h-8 text-slate-600" />
                        </div>
                        <p className="font-medium text-slate-500">No leads found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLeads;