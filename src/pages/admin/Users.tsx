import React, { useEffect, useState } from 'react';
import { Users as UsersIcon, UserPlus, Trash2, Loader2, X } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';

interface User {
  id: number;
  email: string;
  role: string;
}

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'STANDARD_USER' });

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users', newUser);
      setIsModalOpen(false);
      setNewUser({ email: '', password: '', role: 'STANDARD_USER' });
      fetchUsers();
    } catch (err) {
      alert("Error creating user. Check if email already exists.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      await api.delete(`/users/${id}`);
      fetchUsers();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-bold text-white text-3xl tracking-tight">Team Management</h1>
            <p className="mt-1 text-slate-400">Manage access for your company's collaborators.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 shadow-blue-900/20 shadow-lg px-4 py-2 rounded-lg font-bold text-white transition-all"
          >
            <UserPlus className="w-5 h-5" /> Add Member
          </button>
        </div>

        {/* Table */}
        <div className="bg-slate-900 shadow-xl border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 border-slate-800 border-b font-medium text-slate-400 text-sm">
              <tr>
                <th className="p-4">User Email</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr><td colSpan={3} className="p-12 text-center"><Loader2 className="mx-auto text-blue-500 animate-spin" /></td></tr>
              ) : users.map((user) => (
                <tr key={user.id} className="group hover:bg-slate-800/30 transition-colors">
                  <td className="flex items-center gap-3 p-4 text-white">
                    <div className="flex justify-center items-center bg-slate-700 rounded-full w-8 h-8 font-bold text-xs uppercase">
                      {user.email.substring(0,2)}
                    </div>
                    {user.email}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      user.role === 'COMPANY_ADMIN' ? 'bg-purple-900/20 border-purple-500/30 text-purple-400' : 'bg-blue-900/20 border-blue-500/30 text-blue-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(user.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-500 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 shadow-2xl border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden animate-in duration-200 zoom-in">
              <div className="flex justify-between items-center p-6 border-slate-800 border-b">
                <h2 className="font-bold text-white text-xl">Add New Member</h2>
                <button onClick={() => setIsModalOpen(false)}><X className="text-slate-400 hover:text-white" /></button>
              </div>
              <form onSubmit={handleCreateUser} className="space-y-4 p-6">
                <div>
                  <label className="block mb-1 text-slate-400 text-sm">Email Address</label>
                  <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="bg-slate-950 p-3 border border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 w-full text-white" placeholder="colleague@alpha.com" />
                </div>
                <div>
                  <label className="block mb-1 text-slate-400 text-sm">Temporary Password</label>
                  <input required type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="bg-slate-950 p-3 border border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 w-full text-white" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block mb-1 text-slate-400 text-sm">Role</label>
                  <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="bg-slate-950 p-3 border border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 w-full text-white">
                    <option value="STANDARD_USER">Standard User</option>
                    <option value="COMPANY_ADMIN">Company Admin</option>
                  </select>
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 mt-4 py-3 rounded-xl w-full font-bold text-white transition-all">Create Account</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Users;