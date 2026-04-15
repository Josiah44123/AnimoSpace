import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Wrench, ShieldCheck, ArrowRight, Lock, Users, Key } from 'lucide-react';
import { UserRole, UserProfile } from '../types';

interface LoginScreenProps {
  onLogin: (role: UserRole, profile?: UserProfile) => void;
  onBack: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onBack }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [password, setPassword] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    setPassword('');
    setStudentNumber('');
    setEmail('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    // Student login - requires student number (10 digits)
    if (selectedRole === 'user') {
      if (!studentNumber.trim()) {
        setError('Please enter your student number');
        return;
      }
      // Regex: exactly 10 digits
      const studentNumberRegex = /^\d{10}$/;
      if (!studentNumberRegex.test(studentNumber.trim())) {
        setError('Student number must be exactly 10 digits');
        return;
      }
      const profile: UserProfile = {
        studentNumber: studentNumber.trim(),
        email: email.trim() || undefined,
        userRole: 'user',
        createdAt: new Date()
      };
      onLogin('user', profile);
      return;
    }

    // Admin/Staff login - requires password
    const passwords: Record<Exclude<UserRole, 'user'>, string> = {
      admin: 'admin123',
      maintenance: 'maint123',
      'lab-officer': 'lab123',
      sdfo: 'sdfo123'
    };

    if (password === passwords[selectedRole]) {
      onLogin(selectedRole);
    } else {
      setError(`Invalid ${selectedRole} password`);
    }
  };

  const roleConfig = [
    {
      role: 'user' as UserRole,
      label: 'Student / Faculty',
      desc: 'Access rooms, book labs, request equipment',
      icon: User,
      color: 'green'
    },
    {
      role: 'maintenance' as UserRole,
      label: 'Maintenance Staff',
      desc: 'Manage tickets and facility repairs',
      icon: Wrench,
      color: 'orange'
    },
    {
      role: 'lab-officer' as UserRole,
      label: 'Lab Officer',
      desc: 'Manage equipment and lab resources',
      icon: Key,
      color: 'purple'
    },
    {
      role: 'sdfo' as UserRole,
      label: 'SDFO',
      desc: 'Special Duty Facilities Officer oversight',
      icon: Users,
      color: 'amber'
    },
    {
      role: 'admin' as UserRole,
      label: 'Administrator',
      desc: 'Full system control and analytics',
      icon: ShieldCheck,
      color: 'blue'
    }
  ];

  const colorMap: Record<string, { bg: string; border: string; ring: string; hover: string }> = {
    green: { bg: 'bg-green-50', border: 'border-green-200', ring: 'ring-green-400', hover: 'hover:border-green-400 hover:bg-green-50' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', ring: 'ring-orange-400', hover: 'hover:border-orange-400 hover:bg-orange-50' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', ring: 'ring-blue-400', hover: 'hover:border-blue-400 hover:bg-blue-50' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', ring: 'ring-purple-400', hover: 'hover:border-purple-400 hover:bg-purple-50' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', ring: 'ring-amber-400', hover: 'hover:border-amber-400 hover:bg-amber-50' }
  };

  const textColorMap: Record<string, string> = {
    green: 'text-green-700',
    orange: 'text-orange-700',
    blue: 'text-blue-700',
    purple: 'text-purple-700',
    amber: 'text-amber-700'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000012_1px,transparent_1px),linear-gradient(to_bottom,#00000012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-gray-200 p-10 rounded-2xl shadow-lg max-w-2xl w-full relative z-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Welcome to AnimoSpace</h2>
          <p className="text-lg text-gray-600">Select your user type to access the platform</p>
        </div>

        {!selectedRole ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {roleConfig.map((config) => {
              const Icon = config.icon;
              const colors = colorMap[config.color];
              const textColor = textColorMap[config.color];

              return (
                <motion.button
                  key={config.role}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect(config.role)}
                  className={`flex flex-col items-start gap-3 p-5 rounded-xl border-2 transition-all text-left group ${colors.border} ${colors.hover} ${colors.bg}`}
                >
                  <div className={`p-3 rounded-lg ${colors.bg} group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${textColor}`} />
                  </div>
                  <div>
                    <h3 className={`font-bold ${textColor}`}>{config.label}</h3>
                    <p className="text-sm text-gray-600 mt-1">{config.desc}</p>
                  </div>
                  <ArrowRight className={`w-5 h-5 ${textColor} ml-auto mt-2 group-hover:translate-x-1 transition-transform`} />
                </motion.button>
              );
            })}
          </div>
        ) : null}

        {/* Student Form */}
        {selectedRole === 'user' && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleLogin}
            className="mt-8 space-y-6"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 bg-green-50">
                <User className="w-8 h-8 text-green-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Student / Faculty Login</h3>
              <p className="text-gray-600 mt-1">Enter your student number to continue</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student Number *</label>
                <input
                  type="text"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g., 2024001234 (10 digits)"
                  maxLength={10}
                  className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@dlsl.edu.ph"
                  className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="flex-1 py-3 px-4 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors shadow-md hover:shadow-lg"
              >
                Login
              </button>
            </div>
          </motion.form>
        )}

        {/* Password Input for Protected Roles */}
        {selectedRole && selectedRole !== 'user' && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleLogin}
            className="mt-8 space-y-6"
          >
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${colorMap[roleConfig.find(r => r.role === selectedRole)?.color || 'green'].bg}`}>
                {(() => {
                  const Icon = roleConfig.find(r => r.role === selectedRole)?.icon || ShieldCheck;
                  return <Icon className={`w-8 h-8 ${textColorMap[roleConfig.find(r => r.role === selectedRole)?.color || 'green']}`} />;
                })()}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {roleConfig.find(r => r.role === selectedRole)?.label}
              </h3>
              <p className="text-gray-600 mt-1">Enter your password to continue</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="flex-1 py-3 px-4 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors shadow-md hover:shadow-lg"
              >
                Login
              </button>
            </div>
          </motion.form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium hover:underline transition-colors"
          >
            Return to Landing Page
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
