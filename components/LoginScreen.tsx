import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Wrench, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
  onBack: () => void;
}
// LoginScreen component with role selection and password input for admin/maintenance
const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onBack }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    setPassword('');
    
    // If user role, login immediately
    if (role === 'user') {
      onLogin('user');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    if (selectedRole === 'admin') {
      if (password === 'admin123') {
        onLogin('admin');
      } else {
        setError('Invalid admin password');
      }
    } else if (selectedRole === 'maintenance') {
      if (password === 'maint123') {
        onLogin('maintenance');
      } else {
        setError('Invalid maintenance password');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-md w-full relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome to AnimoSpace</h2>
          <p className="text-slate-400">Select your role to continue</p>
        </div>

        {!selectedRole || (selectedRole !== 'user' && !password && selectedRole !== 'user') ? (
           <div className="grid gap-4">
             {/* User Role */}
             <button
               onClick={() => handleRoleSelect('user')}
               className="flex items-center gap-4 p-4 rounded-xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-green-500/50 transition-all group text-left"
             >
               <div className="p-3 rounded-lg bg-green-500/10 text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors">
                 <User className="w-6 h-6" />
               </div>
               <div>
                 <h3 className="font-semibold text-white">Student / Faculty</h3>
                 <p className="text-xs text-slate-400">Access public spaces and services</p>
               </div>
               <ArrowRight className="w-5 h-5 text-slate-500 ml-auto group-hover:translate-x-1 transition-transform" />
             </button>

             {/* Maintenance Role */}
             <button
               onClick={() => setSelectedRole('maintenance')}
               className={`flex items-center gap-4 p-4 rounded-xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-orange-500/50 transition-all group text-left ${selectedRole === 'maintenance' ? 'ring-2 ring-orange-500 border-transparent' : ''}`}
             >
               <div className="p-3 rounded-lg bg-orange-500/10 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                 <Wrench className="w-6 h-6" />
               </div>
               <div>
                 <h3 className="font-semibold text-white">Maintenance Staff</h3>
                 <p className="text-xs text-slate-400">Manage tickets and facility reports</p>
               </div>
             </button>

             {/* Admin Role */}
             <button
               onClick={() => setSelectedRole('admin')}
               className={`flex items-center gap-4 p-4 rounded-xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-blue-500/50 transition-all group text-left ${selectedRole === 'admin' ? 'ring-2 ring-blue-500 border-transparent' : ''}`}
             >
               <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                 <ShieldCheck className="w-6 h-6" />
               </div>
               <div>
                 <h3 className="font-semibold text-white">Administrator</h3>
                 <p className="text-xs text-slate-400">Full system control and analytics</p>
               </div>
             </button>
           </div>
        ) : null}

        {/* Password Input for Admin/Maintenance */}
        {(selectedRole === 'admin' || selectedRole === 'maintenance') && (
          <motion.form 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleLogin}
            className="mt-6 space-y-4"
          >
            <div className="text-center mb-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${selectedRole === 'admin' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
                    {selectedRole === 'admin' ? <ShieldCheck className="w-6 h-6" /> : <Wrench className="w-6 h-6" />}
                </div>
                <h3 className="text-white font-medium">
                    {selectedRole === 'admin' ? 'Admin Access' : 'Maintenance Access'}
                </h3>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="flex-1 py-3 px-4 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium transition-colors shadow-lg shadow-green-900/20"
                >
                  Login
                </button>
            </div>
          </motion.form>
        )}

        <div className="mt-8 text-center">
            <button onClick={onBack} className="text-slate-500 hover:text-slate-400 text-sm underline">
                Return to Landing Page
            </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
