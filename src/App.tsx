import { useState } from 'react';
import { authService } from './api/authService';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await authService.login(email, password);
      setMessage(`Connecté ! Bienvenue ${data.email}`);
    } catch (err: any) {
      setMessage("Erreur : " + (err.response?.data?.message || "Identifiants invalides"));
    }
  };

  return (
    <div className="flex justify-center items-center bg-slate-900 p-4 min-h-screen text-white">
      <form onSubmit={handleLogin} className="bg-slate-800 shadow-2xl p-8 border border-slate-700 rounded-xl w-full max-w-md">
        <h2 className="mb-6 font-bold text-blue-400 text-2xl text-center">Connexion CallNest</h2>
        <input 
          type="email" placeholder="Email" 
          className="bg-slate-900 mb-4 p-3 border border-slate-700 focus:border-blue-500 rounded outline-none w-full"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Mot de passe" 
          className="bg-slate-900 mb-6 p-3 border border-slate-700 focus:border-blue-500 rounded outline-none w-full"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 py-3 rounded w-full font-bold transition">
          Se connecter
        </button>
        {message && <p className="mt-4 text-yellow-400 text-sm text-center">{message}</p>}
      </form>
    </div>
  );
}

export default App;