import { useEffect, useState, useMemo } from 'react'; // Ajout de useMemo
import { Building2, Globe, Search, Plus, MoreHorizontal,Settings2 } from 'lucide-react'; // Ajout de Search et Plus
import api from '../../api/axios';
import { useFormState } from 'react-hook-form';
import { stringify } from 'postcss';

interface Company {
    id: number;
    name: string;
    schemaName: string;
    createdAt: string;
}

function SystemDashboard() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionMessage, setActionMessage] = useState<{text: string, type: 'info' | 'warning'} | null>(null);
    
    const handleActionClick = (actionName: string) => {
        setActionMessage({ text: `Feature "${actionName}" is coming soon for production deployment.`, type: 'info' });
        setTimeout(() => setActionMessage(null), 3000);
    };

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

    // dynamic filter for the companies
    const filteredCompanies = useMemo(() => {
        return companies.filter(company => 
            company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.schemaName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [companies, searchTerm]);

    return (
        <div className="relative space-y-8 p-8">
        
            {/* Toast Notification System */}
            {actionMessage && (
                <div className="top-8 right-8 slide-in-from-right-full z-50 fixed animate-in duration-300">
                <div className="flex items-center gap-3 bg-slate-900 shadow-2xl p-4 border border-blue-500/50 border-l-4 border-l-blue-500 rounded-xl text-white">
                    <Settings2 className="w-5 h-5 text-blue-500 animate-spin-slow" />
                    <div>
                    <p className="font-bold text-sm">System Action</p>
                    <p className="text-slate-400 text-xs">{actionMessage.text}</p>
                    </div>
                </div>
                </div>
            )}

            <header className="flex md:flex-row flex-col justify-between md:items-center gap-4">
                <div>
                <h1 className="font-bold text-white text-3xl tracking-tight">System Administration</h1>
                <p className="mt-1 text-slate-400">Manage all tenants and database instances.</p>
                </div>
                <button 
                onClick={() => handleActionClick("Register New Company")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 shadow-blue-900/20 shadow-lg px-4 py-2 rounded-lg font-bold text-white text-sm transition-all"
                >
                <Plus size={18} />
                Register New Company
                </button>
            </header>

            {/* filter and search bar */}
            <div className="relative max-w-md">
                <Search className="top-1/2 left-3 absolute w-5 h-5 text-slate-500 -translate-y-1/2" />
                <input 
                type="text" 
                placeholder="Search by company name or schema..." 
                className="bg-slate-900 py-3 pr-4 pl-11 border border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 w-full text-white placeholder:text-slate-600 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* entreprises table */}
            <div className="bg-slate-900 shadow-xl border border-slate-800 rounded-2xl overflow-hidden">
                <div className="flex justify-between items-center p-6 border-slate-800 border-b">
                <h2 className="font-bold text-white text-xl">Registered Companies</h2>
                <span className="bg-slate-800 px-3 py-1 rounded-full font-mono text-slate-400 text-xs">
                    {filteredCompanies.length} result(s)
                </span>
                </div>
                
                <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-950/50 text-[10px] text-slate-500 uppercase tracking-[0.2em]">
                        <th className="px-6 py-4 font-bold">ID</th>
                        <th className="px-6 py-4 font-bold">Company Name</th>
                        <th className="px-6 py-4 font-bold">Postgres Schema</th>
                        <th className="px-6 py-4 font-bold">Status</th>
                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                    {loading ? (
                        <tr>
                        <td colSpan={5} className="px-6 py-12 text-slate-500 text-center italic">
                            Loading database records...
                        </td>
                        </tr>
                    ) : filteredCompanies.length > 0 ? (
                        filteredCompanies.map((company) => (
                        <tr key={company.id} className="group hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4 font-mono text-slate-500 text-xs">#{company.id}</td>
                            <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex justify-center items-center bg-blue-500/10 rounded-lg w-8 h-8 font-bold text-blue-500 text-xs">
                                {company.name.substring(0, 2).toUpperCase()}
                                </div>
                                <span className="font-bold text-white">{company.name}</span>
                            </div>
                            </td>
                            <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <Globe size={14} className="text-blue-500" />
                                <span className="font-mono">{company.schemaName}</span>
                            </div>
                            </td>
                            <td className="px-6 py-4">
                            <span className="bg-emerald-500/10 px-3 py-1 rounded-full font-bold text-[10px] text-emerald-500 uppercase tracking-wider">
                                Active
                            </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                            <button 
                                onClick={() => handleActionClick(`Manage Instance ${company.name}`)}
                                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg font-bold text-blue-500 text-sm transition-all"
                            >
                                <Settings2 size={14} />
                                Manage
                            </button>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan={5} className="px-6 py-12 text-slate-500 text-center">
                            No companies match your search.
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
}

export default SystemDashboard;