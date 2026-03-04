import { useEffect, useState } from "react";
import api from "../api/axios";

function Leads() {
    const [leads, setLeads] = useState([]);

    useEffect(() => {
        api.get('/leads')
            .then(res => setLeads(res.data))
            .catch(err => console.error("Failed to fetch leads", err));
        
    }, []);

    return (
        <div className="bg-slate-900 p-8 min-h-screen text-white">
            <h1 className="mb-6 font-bold text-blue-400 text-3xl">Leads Management</h1>
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="ng-slate-700/50">    
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.length > 0? leads.map((lead: any) => (
                            <tr key={lead.id} className="hover:bg-slate-700/30 border-slate-700 border-t">
                                <td className="p-4">{lead.name}</td>
                                <td className="p-4">{lead.email}</td>
                                <td className="p-4 text-sm">
                                    <span className="bg-blue-900/50 px-2 py-1 rounded text-blue-400">{lead.status}</span>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={3} className="p-4 text-slate-500 tet-center">No leads found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Leads;