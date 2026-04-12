import React from 'react';
import { Layers, User, Shield, Building, Search, LayoutGrid, Wrench, Activity, HardHat, ClipboardList, Beaker, Package, X } from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentFloor: number;
  onFloorChange: (floor: number) => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentView: 'dashboard' | 'lost-found' | 'maintenance' | 'analytics' | 'my-activity' | 'lab-facilities' | 'equipment';
  onViewChange: (view: 'dashboard' | 'lost-found' | 'maintenance' | 'analytics' | 'my-activity' | 'lab-facilities' | 'equipment') => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentFloor, 
  onFloorChange, 
  userRole, 
  onRoleChange,
  currentView,
  onViewChange,
  isOpen,
  onClose
}) => {
  const floors = [1, 2, 3, 4, 5, 6];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <div className={`w-64 bg-white h-screen border-r border-gray-200 flex flex-col shadow-sm fixed left-0 top-0 z-30 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2 text-green-800 flex-1">
              <Building className="w-8 h-8" />
              <div className="flex-1">
                  <h1 className="text-xl font-bold leading-tight tracking-tight">Animo<span className="text-green-600">Space</span></h1>
                  <p className="text-xs text-gray-500 font-medium">Mabini Building</p>
              </div>
          </div>
          <button className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Badge */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Current Role</p>
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-600"></div>
            <span className="text-sm font-semibold text-green-700 capitalize">
              {userRole === 'lab-officer' ? 'Lab Officer' : 
               userRole === 'sdfo' ? 'SDFO' : 
               userRole === 'user' ? 'Student/Faculty' : 
               userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </span>
          </div>
        </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4">
        
        {/* Main Views */}
        <div className="mb-8 space-y-2">
             <button
              onClick={() => onViewChange('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                currentView === 'dashboard'
                  ? 'bg-green-50 text-green-700 shadow-sm font-medium border border-green-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            
            {userRole !== 'user' && (
                <button
                onClick={() => onViewChange('analytics')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    currentView === 'analytics'
                    ? 'bg-green-50 text-green-700 shadow-sm font-medium border border-green-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                >
                <ClipboardList className="w-5 h-5" />
                <span>Reports</span>
                </button>
            )}

            {userRole === 'user' && (
                <button
                onClick={() => onViewChange('my-activity')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    currentView === 'my-activity'
                    ? 'bg-green-50 text-green-700 shadow-sm font-medium border border-green-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                >
                <User className="w-5 h-5" />
                <span>My Activity</span>
                </button>
            )}

            <button
              onClick={() => onViewChange('lab-facilities')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                currentView === 'lab-facilities'
                  ? 'bg-green-50 text-green-700 shadow-sm font-medium border border-green-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Beaker className="w-5 h-5" />
              <span>Lab Facilities</span>
            </button>

            <button
              onClick={() => onViewChange('equipment')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                currentView === 'equipment'
                  ? 'bg-green-50 text-green-700 shadow-sm font-medium border border-green-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Equipment Mgmt</span>
            </button>

            <button
              onClick={() => onViewChange('maintenance')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                currentView === 'maintenance'
                  ? 'bg-green-50 text-green-700 shadow-sm font-medium border border-green-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Wrench className="w-5 h-5" />
              <span>Maintenance</span>
            </button>

            {userRole !== 'maintenance' && (
             <button
              onClick={() => onViewChange('lost-found')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                currentView === 'lost-found'
                  ? 'bg-green-50 text-green-700 shadow-sm font-medium border border-green-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Search className="w-5 h-5" />
              <span>Lost & Found</span>
            </button>
            )}
        </div>

        {/* Floor Selector (Only visible in Dashboard) */}
        {currentView === 'dashboard' && (
            <>
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 ml-2 mt-4">Floors</h2>
                <div className="space-y-1">
                {floors.map((floor) => (
                    <button
                    key={floor}
                    onClick={() => {
                        onFloorChange(floor);
                        onClose(); // Close sidebar on mobile after selection
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                        currentFloor === floor
                        ? 'bg-gray-100 text-gray-900 font-medium'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    >
                    <Layers className="w-4 h-4" />
                    <span>Floor {floor}</span>
                    </button>
                ))}
                </div>
            </>
        )}
      </div>
    </div>
    </>
  );
};

export default Sidebar;
