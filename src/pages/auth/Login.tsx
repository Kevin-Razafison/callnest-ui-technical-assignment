import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { authService } from '../../api/authService';
import { Link } from 'react-router-dom';

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await authService.login(data.email, data.password);
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (user.role === 'SYSTEM_ADMIN') {
        navigate('/system-dashboard');
      } else {
        navigate('/'); 
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-slate-950 p-4 min-h-screen">
      {/* Login Card */}
      <div className="bg-slate-900 shadow-2xl p-8 border border-slate-800 rounded-2xl w-full max-w-md">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex justify-center items-center bg-blue-600/10 mb-4 rounded-xl w-16 h-16">
            <LogIn className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="font-bold text-white text-2xl">Welcome back</h1>
          <p className="mt-2 text-slate-400">Enter your credentials to access CallNest</p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-center gap-3 bg-red-900/20 mb-6 p-4 border border-red-500/50 rounded-lg text-red-400 text-sm">
            <AlertCircle className="flex-shrink-0 w-5 h-5" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block mb-1.5 font-medium text-slate-300 text-sm">Email Address</label>
            <div className="relative">
              <Mail className="top-1/2 left-3 absolute w-5 h-5 text-slate-500 -translate-y-1/2" />
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                placeholder="kevin@alpha.com"
                className={`w-full bg-slate-950 border ${errors.email ? 'border-red-500' : 'border-slate-800'} text-white rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all`}
              />
            </div>
            {errors.email && <span className="mt-1 text-red-500 text-xs">{errors.email.message as string}</span>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block mb-1.5 font-medium text-slate-300 text-sm">Password</label>
            <div className="relative">
              <Lock className="top-1/2 left-3 absolute w-5 h-5 text-slate-500 -translate-y-1/2" />
              <input
                {...register("password", { required: "Password is required" })}
                type="password"
                placeholder="••••••••"
                className={`w-full bg-slate-950 border ${errors.password ? 'border-red-500' : 'border-slate-800'} text-white rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all`}
              />
            </div>
            {errors.password && <span className="mt-1 text-red-500 text-xs">{errors.password.message as string}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 shadow-blue-900/20 shadow-lg py-3 rounded-lg w-full font-semibold text-white transition-all disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-slate-500 text-sm text-center">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;