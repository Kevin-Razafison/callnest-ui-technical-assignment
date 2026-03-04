import DashboardLayout from '../../layouts/DashboardLayout';

function UserDashboard(){
    return(
        <DashboardLayout>
            <div className="p-8">
                <h1 className="font-bold text-white text-2xl">Welcome back!</h1>
                <p className="text-slate-400">Here are your assigned leads</p>
            </div>
        </DashboardLayout>
    )
}

export default UserDashboard;