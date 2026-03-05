import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Building, Globe, ArrowRight, Check, X } from 'lucide-react';
import api from '../../api/axios';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        companyName: '',
        schemaName: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordValidations, setPasswordValidations] = useState({
        length: false,
        hasNumber: false,
    });

    useEffect(() => {
        setPasswordValidations({
            length: formData.password.length >= 8,
            hasNumber: /\d/.test(formData.password)
        });
    }, [formData.password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/register', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed. Please check your details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center bg-slate-950 p-6 min-h-screen">
            <div className="bg-slate-900 shadow-2xl p-8 border border-slate-800 rounded-3xl w-full max-w-2xl">
                <div className="mb-10 text-center">
                    <h1 className="font-bold text-white text-3xl tracking-tight">Create your Account</h1>
                    <p className="mt-2 text-slate-400">Join CallNest and start managing your leads efficiently.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 mb-6 p-4 border border-red-500/20 rounded-xl font-medium text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                        {/* First Name */}
                        <div className="space-y-2">
                            <label className="ml-1 font-medium text-slate-300 text-sm">First Name</label>
                            <div className="relative">
                                <User className="top-3 left-3 absolute w-5 h-5 text-slate-500" />
                                <input
                                    required
                                    type="text"
                                    className="bg-slate-950 py-2.5 pr-4 pl-11 border border-slate-800 focus:border-transparent rounded-xl outline-none focus:ring-2 focus:ring-blue-500 w-full text-white transition-all"
                                    placeholder="alpha"
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                            <label className="ml-1 font-medium text-slate-300 text-sm">Last Name</label>
                            <div className="relative">
                                <User className="top-3 left-3 absolute w-5 h-5 text-slate-500" />
                                <input
                                    required
                                    type="text"
                                    className="bg-slate-950 py-2.5 pr-4 pl-11 border border-slate-800 focus:border-transparent rounded-xl outline-none focus:ring-2 focus:ring-blue-500 w-full text-white transition-all"
                                    placeholder="Razafison"
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="ml-1 font-medium text-slate-300 text-sm">Email Address</label>
                            <div className="relative">
                                <Mail className="top-3 left-3 absolute w-5 h-5 text-slate-500" />
                                <input
                                    required
                                    type="email"
                                    className="bg-slate-950 py-2.5 pr-4 pl-11 border border-slate-800 focus:border-transparent rounded-xl outline-none focus:ring-2 focus:ring-blue-500 w-full text-white transition-all"
                                    placeholder="alpha@company.com"
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="ml-1 font-medium text-slate-300 text-sm">Password</label>
                            <div className="relative">
                                <Lock className="top-3 left-3 absolute w-5 h-5 text-slate-500" />
                                <input
                                    required
                                    type="password"
                                    className={`w-full bg-slate-950 border rounded-xl py-2.5 pl-11 pr-4 text-white outline-none transition-all ${
                                        formData.password && (passwordValidations.length && passwordValidations.hasNumber ? 'border-emerald-500/50' : 'border-red-500/30')
                                        || 'border-slate-800'
                                    }`}
                                    placeholder="••••••••"
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                            
                            {/* Validation Live Visual Feedback */}
                            {formData.password && (
                                <div className="space-y-1 mt-2 ml-1">
                                    <div className={`flex items-center gap-2 text-xs ${passwordValidations.length ? 'text-emerald-400' : 'text-slate-500'}`}>
                                        {passwordValidations.length ? <Check size={12}/> : <X size={12}/>} 
                                        At least 8 characters
                                    </div>
                                    <div className={`flex items-center gap-2 text-xs ${passwordValidations.hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                                        {passwordValidations.hasNumber ? <Check size={12}/> : <X size={12}/>} 
                                        At least one number
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Company Name */}
                        <div className="space-y-2">
                            <label className="ml-1 font-medium text-slate-300 text-sm">Company Name</label>
                            <div className="relative">
                                <Building className="top-3 left-3 absolute w-5 h-5 text-slate-500" />
                                <input
                                    required
                                    type="text"
                                    className="bg-slate-950 py-2.5 pr-4 pl-11 border border-slate-800 focus:border-transparent rounded-xl outline-none focus:ring-2 focus:ring-blue-500 w-full text-white transition-all"
                                    placeholder="CallNest Inc."
                                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Schema Name (Multi-tenancy) */}
                        <div className="space-y-2">
                            <label className="ml-1 font-medium text-slate-300 text-sm">Schema Identifier</label>
                            <div className="relative">
                                <Globe className="top-3 left-3 absolute w-5 h-5 text-slate-500" />
                                <input
                                    required
                                    type="text"
                                    className="bg-slate-950 py-2.5 pr-4 pl-11 border border-slate-800 focus:border-transparent rounded-xl outline-none focus:ring-2 focus:ring-blue-500 w-full text-white transition-all"
                                    placeholder="company_db"
                                    onChange={(e) => setFormData({...formData, schemaName: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 py-3 rounded-xl w-full font-bold text-white transition-all"
                    >
                        {loading ? "Creating account..." : "Register Now"}
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                </form>

                <p className="mt-8 text-slate-400 text-sm text-center">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-blue-500 hover:text-blue-400 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;