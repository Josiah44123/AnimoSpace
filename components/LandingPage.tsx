import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Zap, Wrench, Package, BookOpen, AlertCircle } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col relative overflow-hidden">
      
      {/* Navigation Bar */}
      <nav className="relative z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">
            Animo<span className="text-green-600">Space</span>
          </div>
          <p className="text-sm text-gray-600">Digital Twin Platform • Mabini Building</p>
        </div>
      </nav>

      {/* Hero Section with Image */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-6 py-12 max-w-7xl mx-auto w-full">
        
        {/* Left: Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center space-y-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
              Smart Facility Management
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-4">
              Transform Your Campus with Digital Twin Intelligence
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              AnimoSpace brings the Mabini Building into the digital age—real-time occupancy tracking, intelligent lab booking, streamlined equipment management, and unified facility oversight all in one platform.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={onEnter}
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
            >
              Enter AnimoSpace
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold transition-all"
            >
              Learn More
            </button>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
            <div>
              <div className="text-2xl font-bold text-green-600">6</div>
              <p className="text-sm text-gray-600">Building Floors</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">72</div>
              <p className="text-sm text-gray-600">Classrooms & Labs</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">2.5K+</div>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
          </div>
        </motion.div>

        {/* Right: Building Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative hidden lg:block"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="/mabini-building.jpg" 
              alt="Mabini Building" 
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <p className="text-sm font-semibold text-gray-900">Mabini Building</p>
            <p className="text-xs text-gray-600">Smart Campus Hub</p>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 bg-gray-50 border-t border-gray-200 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Features</h2>
            <p className="text-xl text-gray-600">Everything you need to manage the Mabini Building efficiently</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-8 border border-gray-100"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Digital Twin</h3>
              <p className="text-gray-600">Real-time color-coded floor maps showing room occupancy, availability, and maintenance status across all floors.</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-8 border border-gray-100"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lab Facilities & Booking</h3>
              <p className="text-gray-600">Streamlined reservation system for Science and Computer labs with admin approval workflow and email notifications.</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-8 border border-gray-100"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Equipment Management</h3>
              <p className="text-gray-600">Digital borrowing slips, advance requisitions, accountability tracker, and multi-day equipment pendings ledger.</p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-8 border border-gray-100"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Wrench className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Maintenance Ticketing</h3>
              <p className="text-gray-600">Integrated ticketing system for facility issues with real-time status updates and maintenance team coordination.</p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-8 border border-gray-100"
            >
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lost & Found Hub</h3>
              <p className="text-gray-600">Digital bulletin board replacing physical lost-and-found with smart matching and location-based tracking.</p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-8 border border-gray-100"
            >
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics & Dashboards</h3>
              <p className="text-gray-600">Role-specific dashboards for users, admins, and maintenance staff with actionable insights and audit logs.</p>
            </motion.div>

          </div>
        </div>
      </div>

      {/* User Roles Section */}
      <div className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Everyone</h2>
            <p className="text-xl text-gray-600">Tailored experiences for all campus stakeholders</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { role: 'Students & Faculty', desc: 'Find rooms, book labs, request equipment' },
              { role: 'Administrators', desc: 'Oversee building, approve requests, view analytics' },
              { role: 'Lab Assistants', desc: 'Manage equipment prep and borrowing slips' },
              { role: 'Maintenance Staff', desc: 'Prioritize repairs and schedule cleaning' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-6 border border-green-200"
              >
                <p className="font-semibold text-gray-900 mb-2">{item.role}</p>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="relative z-10 bg-green-600 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Mabini Building?</h2>
          <p className="text-xl text-green-100 mb-8">Join the digital revolution in facility management</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEnter}
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-green-600 rounded-lg font-bold text-lg hover:bg-green-50 transition-all"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
