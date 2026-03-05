export interface User {
    id: number;
    email: string;
    role: string;
}

export interface Lead {
    id: number;
    name: string; 
    email: string;
    phone: string;
    status: string;
    createdAt: string;
    assignedTo?: any; 
}

export interface UserStats {
    total: number;
    new: number;
    closed: number;
    goal:number;
}