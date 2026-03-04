import { useEffect, useState } from 'react';
import axios from '../../api/axios'; 
import type { Lead } from '../../types/leads';
const MyLeads = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyLeads = async () => {
            try {
                // On appelle le endpoint qui filtre par utilisateur connecté
                const response = await axios.get('/api/v1/leads/my');
                setLeads(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération de mes leads", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyLeads();
    }, []);

    if (loading) return <div className="p-8 text-white">Chargement de vos prospects...</div>;

    return (
        <div className="bg-slate-900 p-6 min-h-screen text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="font-bold text-2xl">Mes Prospects</h1>
                <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
                    {leads.length} Leads assignés
                </span>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-700 text-slate-300 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Statut</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {leads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4 font-medium">{lead.name}</td>
                                <td className="px-6 py-4 text-slate-400">{lead.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        lead.status === 'NEW' ? 'bg-blue-900 text-blue-300' : 
                                        lead.status === 'CONTACTED' ? 'bg-yellow-900 text-yellow-300' : 'bg-green-900 text-green-300'
                                    }`}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="mr-3 text-blue-400 hover:text-blue-300">Détails</button>
                                    <button className="text-slate-400 hover:text-white">Appeler</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {leads.length === 0 && (
                    <div className="p-10 text-slate-500 text-center">
                        No assigned prospects for now
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLeads;