import { useEffect, useState } from 'react';
import { Building2, Globe } from 'lucide-react';
import api from '../../api/axios';

interface Company {
    id: number;
    name: string;
    schemaName: string;
    createdAt: string;
}

function SystemDashboard() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSystemData = async () => {
            try {
                const res = await api.get('/system/companies');
                setCompanies(res.data);
            } catch (err) {
                console.error("System Data Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSystemData();
    }, []);

    return (
        <div className="space-y-8 p-8">
            <header>
                <h1 className="font-bold text-white text-3xl tracking-tight">System Administration</h1>
                <p className="mt-1 text-slate-400">Platform-wide overview of all tenants and instances.</p>
            </header>

            {/* Global KPIs */}
            <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
                <div className="bg-slate-900 p-6 border border-slate-800 rounded-2xl">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-slate-500 text-sm">Total Companies</p>
                            <p className="mt-1 font-bold text-white text-2xl">{companies.length}</p>
                        </div>
                        <Building2 className="opacity-20 w-8 h-8 text-blue-500" />
                    </div>
                </div>
                {/* Ajoutez d'autres stats ici (Active Users, etc.) */}
            </div>

            {/* Companies Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-slate-800 border-b">
                    <h2 className="font-bold text-white text-xl">Registered Companies</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/50 text-slate-500 text-xs uppercase tracking-widest">
                                <th className="px-6 py-4 font-bold">ID</th>
                                <th className="px-6 py-4 font-bold">Company Name</th>
                                <th className="px-6 py-4 font-bold">Postgres Schema</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {companies.map((company) => (
                                <tr key={company.id} className="group hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 font-mono text-slate-500 text-xs">#{company.id}</td>
                                    <td className="px-6 py-4 font-medium text-white">{company.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                                            <Globe size={14} className="text-blue-500" />
                                            {company.schemaName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-emerald-500/10 px-3 py-1 rounded-full font-bold text-[10px] text-emerald-500 uppercase">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="font-bold text-blue-500 hover:text-blue-400 text-sm">
                                            Manage Instance
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default SystemDashboard;