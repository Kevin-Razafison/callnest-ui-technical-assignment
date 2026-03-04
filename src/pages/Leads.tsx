import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { Plus, X, Loader2, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Pencil, Trash2 } from "lucide-react";
import { Search } from "lucide-react";

function Leads() {
    const [leads, setLeads] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [editingLead, setEditingLead] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const handleDelete = async (id: number) => {
        if(window.confirm("Are you sure you want to delete this lead?")) {
            try {
                await api.delete(`/leads/${id}`);
                fetchLeads();
            } catch (err) {
                console.error("Delete failed", err);
            }
        }
    }

    const filteredLeads = leads.filter((lead: any) => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm)
    );

    const openEditModal = (lead: any) => {
        setEditingLead(lead);
        setIsModalOpen(true);
        reset(lead);
    }

    const fetchLeads = () => {
        api.get('/leads')
            .then(res => setLeads(res.data))
            .catch(err => console.error("Failed to fetch leads", err));
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (editingLead) {
                // Mode Edition : call PUT
                await api.put(`/leads/${editingLead.id}`, data);
            } else {
                // Mode Création : call POST
                await api.post('/leads', { ...data, status: 'NEW' });
            }
            
            setIsModalOpen(false);
            setEditingLead(null);
            reset();
            fetchLeads();
        } catch (err) {
            console.error("Operation failed", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="bg-slate-950 p-8 min-h-screen text-white">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="font-bold text-white text-3xl tracking-tight">Leads Management</h1>
                        <p className="mt-1 text-slate-400">Manage and track your business opportunities.</p>
                    </div>
                    
                    <button 
                        onClick={() => { setEditingLead(null); reset({name: '', email: '', phone: ''}); setIsModalOpen(true); }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 shadow-blue-900/20 shadow-lg px-4 py-2 rounded-lg font-semibold text-white transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Add Lead
                    </button>
                </div>
                {/* Search Bar */}
                <div className="relative mb-6 max-w-md">
                    <Search className="top-1/2 left-3 absolute w-5 h-5 text-slate-500 -translate-y-1/2" />
                    <input 
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-900 py-3 pr-4 pl-11 border border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 w-full text-white text-sm transition-all"
                    />
                </div>

                {/* Table Container */}
                <div className="bg-slate-900 shadow-xl border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800/50 border-slate-800 border-b">    
                            <tr>
                                <th className="p-4 font-medium text-slate-400">Name</th>
                                <th className="p-4 font-medium text-slate-400">Email</th>
                                <th className="p-4 font-medium text-slate-400">Phone</th>
                                <th className="p-4 font-medium text-slate-400">Status</th>
                                <th className="p-4 font-medium text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredLeads.length > 0 ? filteredLeads.map((lead: any) => (
                                <tr key={lead.id} className="group hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4 font-medium">{lead.name}</td>
                                    <td className="p-4 text-slate-300">{lead.email}</td>
                                    <td className="p-4 text-slate-300">{lead.phone}</td>
                                    <td className="p-4">
                                        <span className="bg-blue-900/30 px-3 py-1 border border-blue-800/50 rounded-full font-bold text-blue-400 text-xs uppercase tracking-wider">
                                            {lead.status}
                                        </span>
                                    </td>
                                    {/* Nouvelle cellule pour les Actions */}
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => openEditModal(lead)}
                                                className="hover:bg-slate-700 p-2 rounded-lg text-slate-400 hover:text-blue-400 transition-all"
                                                title="Edit lead"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(lead.id)}
                                                className="hover:bg-red-900/20 p-2 rounded-lg text-slate-400 hover:text-red-500 transition-all"
                                                title="Delete lead"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    {/* Attention : n'oublie pas de passer colSpan à 5 car on a ajouté des colonnes */}
                                    <td colSpan={5} className="p-12 text-slate-500 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <UserPlus className="w-12 h-12 text-slate-700" />
                                            <p>No leads found. Start by adding one!</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal Overlay */}
                {isModalOpen && (
                    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-slate-900 shadow-2xl border border-slate-800 rounded-2xl w-full max-w-md animate-in duration-200 fade-in zoom-in">
                            <div className="flex justify-between items-center p-6 border-slate-800 border-b">
                                <h2 className="font-bold text-xl">{editingLead ? "Edit Lead" : "New Lead"}</h2>
                                <button onClick={() => { setIsModalOpen(false); setEditingLead(null); }} className="text-slate-400 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
                                <div>
                                    <label className="block mb-1 font-medium text-slate-400 text-sm">Full Name</label>
                                    <input 
                                        {...register("name", { required: true })}
                                        className="bg-slate-950 p-3 border border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 w-full"
                                        placeholder="e.g Razafison Kevin Fithaiana"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium text-slate-400 text-sm">Email Address</label>
                                    <input 
                                        {...register("email", { required: true })}
                                        type="email"
                                        className="bg-slate-950 p-3 border border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 w-full"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium text-slate-400 text-sm">Phone Number</label>
                                    <input 
                                        {...register("phone", { required: "Phone is required" })}
                                        type="tel"
                                        className={`w-full bg-slate-950 border ${errors.phone ? 'border-red-500' : 'border-slate-800'} rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-600`}
                                        placeholder="+261 34 XX XXX XX"
                                    />
                                    {errors.phone && <span className="mt-1 text-red-500 text-xs">This field is required</span>}
                                </div>
                                
                                <button 
                                    disabled={isSubmitting}
                                    type="submit" 
                                    className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 mt-4 py-3 rounded-lg w-full font-bold"
                                >
                                   {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        editingLead ? "Save Changes" : "Create Lead" // Texte dynamique
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default Leads;