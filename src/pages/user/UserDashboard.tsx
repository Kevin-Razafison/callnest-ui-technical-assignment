import DashboardLayout from '../../layouts/DashboardLayout';
import { PhoneIncoming, Star, Clock, CheckCircle2 } from 'lucide-react';


function UserDashboard(){
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const stats = [
        { name: 'My Leads', value: '12', icon: PhoneIncoming, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'To Follow Up', value: '4', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { name: 'Closed Deals', value: '8', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { name: 'My Rating', value: '4.9', icon: Star, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8 p-8">
                {/* Hedaer */}
                <div>
                    <h1 className='text-white text-3xl tracking-tight font bold'>
                        Hello, <span className="text-blue-500">{user.email?.split('@')[0]}</span> !
                    </h1>
                    <p className='mt-1 text-skate-400'>Ready to convert some leads today?</p>
                </div>

                {/*Stats Grid - simplier verion for the agent*/}
                <div className='gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
                    {stats.map((stat) => (
                        <div key={stat.name} className='bg-slate-900 p-6 border border-slate-800 hover:border-slate-700 rounded-2xl transition-colors'>
                            <div className='flex justify-between imtes-center'>
                                <p className='font-medium text-slate-400 text-sm'>{stat.name}</p>
                                <p className="mt-1 font-bold text-white text-2xl">{stat.value}</p>
                            </div>
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                                <stat.icon className='w-6 h-6' />
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Section Action : next lead to call */}
                <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2 bg-slate-900 p-6 border border-slate-800 rounded-2xl">
                    <h2 className="mb-6 font-bold text-white text-xl">Priority Leads to Call</h2>
                    <div className="space-y-4">
                    {/* static lead example */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="group flex justify-between items-center bg-slate-950 p-4 border border-slate-800 hover:border-blue-500/50 rounded-xl transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="flex justify-center items-center bg-slate-800 rounded-full w-10 h-10 font-bold text-blue-400">
                            L{i}
                            </div>
                            <div>
                            <p className="font-medium text-white group-hover:text-blue-400 transition-colors">Potential Client {i}</p>
                            <p className="text-slate-500 text-xs">Added 2 hours ago</p>
                            </div>
                        </div>
                        <button className="bg-slate-800 hover:bg-blue-600 px-4 py-2 rounded-lg font-bold text-white text-sm transition-colors">
                            Call Now
                        </button>
                        </div>
                    ))}
                    </div>
                </div>

                {/* internal dashboard sidebar : Daily Goal */}
                <div className="flex flex-col justify-center items-center bg-blue-600/5 p-6 border border-blue-500/20 rounded-2xl text-center">
                    <div className="flex justify-center items-center mb-4 border-4 border-blue-600 border-t-transparent rounded-full w-24 h-24 animate-spin-slow">
                    <span className="font-bold text-white text-2xl">75%</span>
                    </div>
                    <h3 className="font-bold text-white text-lg">Daily Goal</h3>
                    <p className="mt-2 text-slate-400 text-sm">Almost there! 2 more calls to reach your daily objective.</p>
                </div>
                </div>
                        
            </div>
        </DashboardLayout>
    )
}

export default UserDashboard;