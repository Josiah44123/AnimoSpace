import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Shield, Search, Database } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col relative overflow-hidden">
      
      {/* Background Grid Animation */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live Digital Twin System
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 text-white">
            Animo<span className="text-green-500">Space</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            The official digital twin for the Mabini Building. Monitor occupancy, manage facilities, and keep the Animo spirit alive with smart campus technology.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <button
            onClick={onEnter}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-full font-semibold text-lg transition-all shadow-lg shadow-green-900/20 hover:shadow-green-500/30"
          >
            Enter AnimoSpace
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Feature Grid */}
      <div className="relative z-10 bg-slate-900/50 backdrop-blur-sm border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <Activity className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Real-time Monitoring</h3>
            <p className="text-sm text-slate-400">Live occupancy tracking and environmental sensors for every room.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <Shield className="w-8 h-8 text-green-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Facility Management</h3>
            <p className="text-sm text-slate-400">Streamlined maintenance requests and asset tracking for admins.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <Search className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Lost & Found</h3>
            <p className="text-sm text-slate-400">Digital repository for lost items with location context.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <Database className="w-8 h-8 text-orange-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Predictive Analytics</h3>
            <p className="text-sm text-slate-400">Historical data analysis for space optimization and energy usage.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LandingPage;
