import DashboardLayout from '../../layouts/DashboardLayout';
import {  Mail, Shield, Key } from 'lucide-react';

function Profile() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <DashboardLayout>
      <div className="mx-auto p-8 max-w-2xl">
        <header className="mb-8 md:text-left text-center">
          <h1 className="font-bold text-white text-3xl">My Profile</h1>
          <p className="text-slate-400">Manage your personal information and security.</p>
        </header>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="space-y-6 p-8">
            <div className="flex items-center gap-6">
              <div className="flex justify-center items-center bg-blue-600 rounded-full w-20 h-20 font-bold text-white text-2xl uppercase">
                {user.email?.substring(0, 2)}
              </div>
              <div>
                <h2 className="font-bold text-white text-xl">{user.email}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span className="font-bold text-slate-500 text-xs uppercase tracking-widest">{user.role}</span>
                </div>
              </div>
            </div>

            <hr className="border-slate-800" />

            <div className="space-y-4">
               <div className="flex items-center gap-4 text-slate-300">
                  <Mail className="w-5 h-5 text-slate-500" />
                  <span>{user.email}</span>
               </div>
               <div className="flex items-center gap-4 text-slate-300">
                  <Key className="w-5 h-5 text-slate-500" />
                  <span>Password: ••••••••••••</span>
                  <button className="ml-auto font-bold text-blue-500 hover:text-blue-400 text-sm">Change</button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Profile;