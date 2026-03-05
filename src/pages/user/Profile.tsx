import { useState } from 'react';
import { Mail, Shield, Key, X, Save, Eye, EyeOff, Building2 } from 'lucide-react';
import api from '../../api/axios';

function Profile() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [status, setStatus] = useState<{type: 'success' | 'error' | '', message: string}>({
    type: '',
    message: ''
  });

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (passwords.newPassword !== passwords.confirmPassword) {
      setStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    try {
      await api.put('/users/change-password', {
        oldPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      
      setStatus({ type: 'success', message: 'Password updated successfully!' });
      setIsEditing(false);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to update password.';
      setStatus({ type: 'error', message: errorMsg });
    }
  };

  return (
    <div className="mx-auto p-8 max-w-2xl">
      <header className="mb-8 md:text-left text-center">
        <h1 className="font-bold text-white text-3xl">My Profile</h1>
        <p className="text-slate-400">Manage your personal information and security.</p>
      </header>

      <div className="bg-slate-900 shadow-xl border border-slate-800 rounded-2xl overflow-hidden">
        <div className="space-y-6 p-8">
          
          {/* User Identity Section */}
          <div className="flex items-center gap-6">
            <div className={`flex justify-center items-center rounded-full w-20 h-20 font-bold text-white text-2xl uppercase ${
              user.role === 'SYSTEM_ADMIN' ? 'bg-amber-500 shadow-lg shadow-amber-900/20' : 'bg-blue-600'
            }`}>
              {user.email?.substring(0, 2)}
            </div>
            <div>
              <h2 className="font-bold text-white text-xl">{user.email}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Shield className={`w-4 h-4 ${user.role === 'SYSTEM_ADMIN' ? 'text-amber-500' : 'text-blue-500'}`} />
                <span className="font-bold text-slate-500 text-xs uppercase tracking-widest">
                    {user.role?.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          <hr className="border-slate-800" />

          {status.message && (
            <div className={`p-4 rounded-xl text-sm font-bold ${
              status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
            }`}>
              {status.message}
            </div>
          )}

          <div className="space-y-6">
            {/* Email */}
            <div className="flex items-center gap-4 text-slate-300">
              <Mail className="w-5 h-5 text-slate-500" />
              <div className="flex flex-col">
                <span className="font-bold text-[10px] text-slate-500 uppercase tracking-widest">Email</span>
                <span>{user.email}</span>
              </div>
            </div>

            {/* Organization / Company Section */}
            <div className="flex items-center gap-4 text-slate-300">
              <Building2 className="w-5 h-5 text-slate-500" />
              <div className="flex flex-col">
                <span className="font-bold text-[10px] text-slate-500 uppercase tracking-widest">Organization</span>
                <span className={user.role === 'SYSTEM_ADMIN' ? 'text-amber-400 font-medium' : ''}>
                    {user.companyName || 'CallNest Platform Root'}
                </span>
              </div>
            </div>

            {/* Password Toggle Section */}
            {!isEditing ? (
              <div className="flex items-center gap-4 text-slate-300">
                <Key className="w-5 h-5 text-slate-500" />
                <div className="flex flex-col">
                  <span className="font-bold text-[10px] text-slate-500 uppercase tracking-widest">Security</span>
                  <span>Password: ••••••••••••</span>
                </div>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="ml-auto font-bold text-blue-500 hover:text-blue-400 text-sm transition-colors"
                >
                  Change
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdatePassword} className="space-y-4 bg-slate-950/50 p-6 border border-slate-800 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-white text-sm uppercase">Update Password</h3>
                  <button type="button" onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <input 
                    type="password"
                    placeholder="Current Password"
                    required
                    className="bg-slate-900 px-4 py-2 border border-slate-800 focus:border-blue-500 rounded-lg outline-none w-full text-white text-sm transition-all"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                  />
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                      required
                      className="bg-slate-900 px-4 py-2 border border-slate-800 focus:border-blue-500 rounded-lg outline-none w-full text-white text-sm transition-all"
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                    />
                    <button 
                      type="button" 
                      className="top-2.5 right-3 absolute text-slate-500 hover:text-slate-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <input 
                    type="password"
                    placeholder="Confirm New Password"
                    required
                    className="bg-slate-900 px-4 py-2 border border-slate-800 focus:border-blue-500 rounded-lg outline-none w-full text-white text-sm transition-all"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex flex-1 justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 py-2 rounded-lg font-bold text-white text-sm">
                    <Save className="w-4 h-4" /> Save
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-2 rounded-lg font-bold text-white text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;