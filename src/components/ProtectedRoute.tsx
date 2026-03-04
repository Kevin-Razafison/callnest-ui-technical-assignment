import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps{
    allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) =>{
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAuthenticated = !!localStorage.getItem('token');

    if(!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if(!allowedRoles.includes(user.role)){
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default ProtectedRoute;
