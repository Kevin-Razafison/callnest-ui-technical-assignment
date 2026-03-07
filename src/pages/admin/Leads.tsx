import { useEffect, useState } from "react";
import api from "../../api/axios";
import { 
  Plus, X, Loader2, UserPlus, UserCheck, 
  Pencil, Trash2, Search, CheckSquare, Calendar as CalendarIcon
} from "lucide-react";
import { useForm } from "react-hook-form";

const getStageColor = (stage: string) => {
  switch(stage) {
    case 'DISCOVERY': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    case 'PROPOSAL': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
    case 'NEGOTIATION': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    case 'CLOSED_WON': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
    case 'CLOSED_LOST': return 'bg-red-500/20 text-red-400 border-red-500/50';
    default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
  }
}

function Leads() {
    // Main data states
    const [leads, setLeads] = useState([]);
    const [agents, setAgents] = useState<any[]>([]); // To store the list of available agents
    
    // UI and Form states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingLead, setEditingLead] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const [selectedLeadForTasks, setSelectedLeadForTasks] = useState<any>(null);
    const [leadTasks, setLeadTasks] = useState<any[]>([]);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    // Fetch all leads for the admin view
    const fetchLeads = () => {
        api.get('/leads')
            .then(res => setLeads(res.data))
            .catch(err => console.error("Failed to fetch leads", err));
    };

    // Fetch available agents to populate the assignment dropdown
    const fetchAgents = () => {
        api.get('/users') 
            .then(res => setAgents(res.data))
            .catch(err => console.error("Failed to fetch agents", err));
    };

    const fetchLeadTasks = async (leadId: number) => {
        try {
            const res = await api.get(`/tasks/lead/${leadId}`); // Assure-toi d'avoir cet endpoint ou utilise un filtre
            setLeadTasks(res.data);
        } catch (err) {
            console.error("Failed to fetch tasks", err);
        }
    };

    const openTaskModal = (lead: any) => {
        setSelectedLeadForTasks(lead);
        fetchLeadTasks(lead.id);
        setIsTaskModalOpen(true);
    };

    useEffect(() => {
        fetchLeads();
        fetchAgents();
    }, []);

    // Handle create or update logic
    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const payload = {
                id: editingLead?.id, 
                name: data.name,
                email: data.email,   
                phone: data.phone,
                status: editingLead ? editingLead.status : 'NEW',
                assignedTo: data.assignedToId ? { id: parseInt(data.assignedToId) } : null
            };

            console.log("Sending payload:", payload); 

            if (editingLead) {
                await api.put(`/leads/${editingLead.id}`, payload);
            } else {
                await api.post('/leads', payload);
            }
            
            setIsModalOpen(false);
            setEditingLead(null);
            reset();
            fetchLeads();
        } catch (err: any) {
            // Pour voir exactement quel champ pose problème
            console.error("Validation Error Details:", err.response?.data);
            alert("Check fields: " + JSON.stringify(err.response?.data));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if(window.confirm("Are you sure you want to delete this lead?")) {
            try {
                await api.delete(`/leads/${id}`);
                fetchLeads();
            } catch (err) {
                console.error("Delete failed", err);
            }
        }
    };

    const openEditModal = (lead: any) => {
        setEditingLead(lead);
        setIsModalOpen(true);
        // Pre-fill form with existing data and current assignment
        reset({
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            assignedToId: lead.assignedTo?.id || ""
        });
    };

    // Client-side filtering logic
    const filteredLeads = leads.filter((lead: any) => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm)
    );

    return (
            <div className="bg-slate-950 p-8 min-h-screen text-white">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="font-bold text-white text-white text-3xl tracking-tight">Leads Management</h1>
                        <p className="mt-1 text-slate-400">Manage, track, and assign your business opportunities.</p>
                    </div>
                    
                    <button 
                        onClick={() => { 
                            setEditingLead(null); 
                            reset({name: '', email: '', phone: '', assignedToId: ''}); 
                            setIsModalOpen(true); 
                        }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 shadow-blue-900/20 shadow-lg px-4 py-2 rounded-lg font-semibold text-white transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Add Lead
                    </button>
                </div>

                {/* Search Bar with Icon */}
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
                    <table className="w-full text-white text-left">
                        <thead className="bg-slate-800/50 border-slate-800 border-b">    
                            <tr>
                                <th className="p-4 font-medium text-slate-400">Name</th>
                                <th className="p-4 font-medium text-slate-400">Email</th>
                                <th className="p-4 font-medium text-slate-400">Assigned Agent</th>
                                <th className="p-4 font-medium text-slate-400">Status</th>
                                <th className="p-4 font-medium text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredLeads.length > 0 ? filteredLeads.map((lead: any) => (
                                <tr key={lead.id} className="group hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4 font-medium">{lead.name}</td>
                                    <td className="p-4 text-slate-300">{lead.email}</td>
                                    <td className="p-4">
                                        {lead.assignedTo ? (
                                            <div className="flex items-center gap-2 text-emerald-400 text-sm">
                                                <UserCheck className="w-4 h-4" />
                                                <span className="font-medium">{lead.assignedTo.email.split('@')[0]}</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-500 text-xs italic italic">Pending Assignment</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 border rounded-full font-bold text-[10px] uppercase tracking-wider ${getStageColor(lead.stage)}`}>
                                            {lead.stage || lead.status}
                                        </span>
                                    </td>
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
                                                onClick={() => openTaskModal(lead)}
                                                className="hover:bg-slate-700 p-2 rounded-lg text-slate-400 hover:text-emerald-400 transition-all"
                                                title="Manage tasks"
                                            >
                                                <CheckSquare className="w-4 h-4" />
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
                                    <td colSpan={5} className="p-12 text-slate-500 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <UserPlus className="w-12 h-12 text-slate-700" />
                                            <p>No leads found. Match your search or add a new lead.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal for Creation and Editing */}
                {isModalOpen && (
                    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-slate-900 shadow-2xl border border-slate-800 rounded-2xl w-full max-w-md animate-in duration-200 fade-in zoom-in">
                            <div className="flex justify-between items-center p-6 border-slate-800 border-b">
                                <h2 className="font-bold text-white text-xl">{editingLead ? "Edit Lead" : "New Lead"}</h2>
                                <button onClick={() => { setIsModalOpen(false); setEditingLead(null); }} className="text-slate-400 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block mb-1 font-medium text-slate-400 text-sm">Full Name</label>
                                        <input 
                                            {...register("name", { required: true })}
                                            className="bg-slate-950 p-3 border border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 w-full text-white"
                                            placeholder="Lead Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium text-slate-400 text-sm">Email Address</label>
                                        <input 
                                            {...register("email", { required: true })}
                                            type="email"
                                            className="bg-slate-950 p-3 border border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 w-full text-white"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium text-slate-400 text-sm">Phone Number</label>
                                        <input 
                                            {...register("phone", { required: "Phone is required" })}
                                            type="tel"
                                            className={`w-full bg-slate-950 border ${errors.phone ? 'border-red-500' : 'border-slate-800'} rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-600 text-white`}
                                            placeholder="+261 34 XX XXX XX"
                                        />
                                    </div>
                                    
                                    {/* Agent Assignment Selection */}
                                    <div>
                                        <label className="block mb-1 font-medium text-slate-400 text-sm">Assign to Agent</label>
                                        <select 
                                            {...register("assignedToId")}
                                            className="bg-slate-950 p-3 border border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 w-full text-white appearance-none cursor-pointer"
                                        >
                                            <option value="">-- No Assignment --</option>
                                            {agents.map((agent: any) => (
                                                <option key={agent.id} value={agent.id}>
                                                    {agent.email} ({agent.role})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                
                                <button 
                                    disabled={isSubmitting}
                                    type="submit" 
                                    className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 mt-6 py-3 rounded-lg w-full font-bold text-white transition-all"
                                >
                                   {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        editingLead ? "Save Changes" : "Create Lead"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {isTaskModalOpen && (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-slate-900 p-6 border border-slate-800 rounded-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-white text-xl">Tasks for {selectedLeadForTasks?.name}</h2>
                <button onClick={() => setIsTaskModalOpen(false)} className="text-slate-400 hover:text-white"><X /></button>
            </div>

            {/* Liste des tâches existantes */}
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {leadTasks.length > 0 ? leadTasks.map((task: any) => (
                    <div key={task.id} className="flex justify-between items-center bg-slate-950 p-3 border border-slate-800 rounded-lg">
                        <div>
                            <p className={`text-sm font-medium ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>{task.title}</p>
                            <p className="text-slate-500 text-xs">{new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>
                        <input 
                            type="checkbox" 
                            checked={task.completed} 
                            onChange={() => api.put(`/tasks/${task.id}/complete`).then(() => fetchLeadTasks(selectedLeadForTasks.id))}
                            className="w-5 h-5 accent-blue-600"
                        />
                    </div>
                )) : <p className="text-slate-500 text-sm text-center italic">No tasks scheduled yet.</p>}
            </div>

            {/* Formulaire rapide pour ajouter une tâche */}
            <form onSubmit={async (e: any) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                await api.post('/tasks', {
                    title: formData.get('title'),
                    dueDate: formData.get('date'),
                    lead: { id: selectedLeadForTasks.id },
                    assignedTo: { id: selectedLeadForTasks.assignedTo?.id }
                });
                e.target.reset();
                fetchLeadTasks(selectedLeadForTasks.id);
                        }} className="space-y-3 pt-4 border-slate-800 border-t">
                            <input name="title" placeholder="New task title..." className="bg-slate-950 p-2 border border-slate-800 rounded-lg w-full text-white text-sm" required />
                            <input name="date" type="datetime-local" className="bg-slate-950 p-2 border border-slate-800 rounded-lg w-full text-white text-sm" required />
                            <button type="submit" className="bg-blue-600 hover:bg-blue-500 py-2 rounded-lg w-full font-bold text-sm transition-all">Add Task</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Leads;