import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import FloorView from './components/FloorView';
import RoomDetailsModal from './components/RoomDetailsModal';
import LostAndFound from './components/LostAndFound';
import MaintenanceRequests from './components/MaintenanceRequests';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import UserDashboard from './components/UserDashboard';

import EquipmentManagement from './components/EquipmentManagement';
import LandingPage from './components/LandingPage';
import LoginScreen from './components/LoginScreen';
import { FloorData, Room, UserRole, AuditLog, UserProfile, MaintenanceRequest } from './types';
import { getFloors, getSchedulesByRoom, calculateRoomStatus, updateRoomOverride, getAuditLogs, getMaintenanceRequests } from './services/spaceSyncService';
import { Bell, Search, History, Activity, Menu, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'lost-found' | 'maintenance' | 'analytics' | 'my-activity' | 'equipment'>('dashboard');
  const [floorViewMode, setFloorViewMode] = useState<'room-booking' | 'maintenance' | 'lost-found'>('room-booking');
  const [currentFloor, setCurrentFloor] = useState<number>(1);
  const [floors, setFloors] = useState<FloorData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);

  // Manage Body Background Color
  useEffect(() => {
    if (showLanding) {
      document.body.style.backgroundColor = '#0f172a'; // Dark Slate (Landing)
    } else {
      document.body.style.backgroundColor = '#F8FAFC'; // Light Gray (Dashboard)
    }
  }, [showLanding]);

  // Initial Fetch
  useEffect(() => {
    if (!showLanding) {
        fetchFloors();
        // Simulate real-time polling every minute
        const interval = setInterval(fetchFloors, 60000);
        return () => clearInterval(interval);
    }
  }, [showLanding]);

  const fetchFloors = async () => {
    // We don't set global loading to true on polls to avoid flicker
    if (floors.length === 0) setLoading(true);
    
    const floorsData = await getFloors();
    const maintenanceData = await getMaintenanceRequests();
    
    // Process each room to calculate computed status based on schedules
    // In a real app, this might happen on the backend or more efficiently
    const processedFloors = await Promise.all(floorsData.map(async (floor) => {
      const roomsWithStatus = await Promise.all(floor.rooms.map(async (room) => {
         const schedules = await getSchedulesByRoom(room.id);
         return calculateRoomStatus(room, schedules);
      }));
      return { ...floor, rooms: roomsWithStatus };
    }));

    setFloors(processedFloors);
    setMaintenanceRequests(maintenanceData);
    setLoading(false);
  };

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleStatusChange = async (roomId: string, status: any) => {
    await updateRoomOverride(roomId, status, 'Admin');
    await fetchFloors(); // Refresh data
    // Update local selected room to reflect changes immediately in modal
    if (selectedRoom) {
        setSelectedRoom(prev => prev ? ({ ...prev, manualOverride: status, computedStatus: status || 'free' }) : null);
    }
    // Refresh logs if open
    if (showLogs) fetchLogs();
  };

  const fetchLogs = async () => {
      const data = await getAuditLogs();
      setLogs(data);
  }

  const toggleLogs = () => {
      if (!showLogs) fetchLogs();
      setShowLogs(!showLogs);
  }

  const currentFloorData = floors.find(f => f.floorNumber === currentFloor);

  if (showLanding) {
      return <LandingPage onEnter={() => { setShowLanding(false); setShowLogin(true); }} />;
  }

  if (showLogin) {
      return (
        <LoginScreen 
            onLogin={(role, profile) => {
                setUserRole(role);
                if (profile) {
                    setUserProfile(profile);
                }
                setShowLogin(false);
                if (role === 'user') {
                    setCurrentView('my-activity');
                } else {
                    setCurrentView('dashboard');
                }
            }}
            onBack={() => {
                setShowLogin(false);
                setShowLanding(true);
            }}
        />
      );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#F8FAFC] text-gray-900"
    >
      <Sidebar 
        currentFloor={currentFloor} 
        onFloorChange={setCurrentFloor}
        userRole={userRole}
        onRoleChange={setUserRole}
        currentView={currentView}
        onViewChange={(view) => {
            setCurrentView(view);
            setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="md:ml-64 p-4 md:p-8">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                  AnimoSpace
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide border border-green-200">
                      Live
                  </span>
              </h1>
              <p className="text-gray-500 text-xs md:text-sm mt-1 hidden sm:block">Mabini Building • Real-time Digital Twin & Facility Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
             {/* Admin Log Toggle */}
             {userRole === 'admin' && (
                 <button 
                    onClick={toggleLogs}
                    className={`p-2 rounded-full transition-colors relative ${showLogs ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                    title="Audit Logs"
                 >
                    <History className="w-5 h-5" />
                 </button>
             )}

             <div className="relative hidden sm:block">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input 
                    type="text" 
                    placeholder="Search room..." 
                    className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 w-48 md:w-64 shadow-sm"
                />
             </div>
             <button className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors shadow-sm relative flex-shrink-0">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>
             
             <button 
                onClick={() => {
                    setShowLanding(true);
                    setShowLogin(false);
                    setUserRole('user');
                    setCurrentView('dashboard');
                }}
                className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 hover:text-green-600 transition-colors px-3 py-2.5 shadow-sm outline-none flex-shrink-0"
             >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Change User</span>
             </button>

             <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md flex-shrink-0 ${
                 userRole === 'admin' ? 'bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-indigo-200' :
                 userRole === 'maintenance' ? 'bg-gradient-to-tr from-orange-500 to-amber-500 shadow-orange-200' :
                 'bg-gradient-to-tr from-green-500 to-emerald-400 shadow-green-200'
             }`}>
                {userRole === 'admin' ? 'A' : userRole === 'maintenance' ? 'M' : 'U'}
             </div>
          </div>
        </header>

        {/* Audit Logs Drawer (Admin Only) */}
        {showLogs && userRole === 'admin' && (
            <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-top-4 duration-300">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <History className="w-5 h-5 text-indigo-600" />
                    Recent Activity Logs
                </h3>
                <div className="max-h-48 overflow-y-auto space-y-3 pr-2">
                    {logs.length === 0 ? (
                        <p className="text-gray-400 text-sm">No recent activity recorded.</p>
                    ) : (
                        logs.map(log => (
                            <div key={log.id} className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-gray-700">{log.roomName}</span>
                                    <span className="text-gray-600">{log.action}</span>
                                </div>
                                <div className="text-xs text-gray-400">
                                    {new Date(log.timestamp).toLocaleTimeString()} • {log.user}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}

        {/* Dynamic Content Based on View with Role-Based Access Control */}
        {currentView === 'dashboard' && userRole === 'maintenance' ? (
             loading ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
                   <div className="w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mb-4"></div>
                   <p>Syncing digital twin data...</p>
                </div>
             ) : (
               <FloorView 
                 currentFloor={currentFloor}
                 onFloorChange={setCurrentFloor}
                 floors={floors}
                 selectedRoom={selectedRoom}
                 onRoomClick={handleRoomClick}
                 userRole={userRole}
                 viewMode={floorViewMode}
                 onViewModeChange={setFloorViewMode}
                 maintenanceRequests={maintenanceRequests}
               />
             )
        ) : currentView === 'lost-found' && (userRole === 'sdfo' || userRole === 'user') ? (
            <LostAndFound userRole={userRole} />
        ) : currentView === 'maintenance' && (userRole === 'maintenance' || userRole === 'user') ? (
            <MaintenanceRequests userRole={userRole} />
        ) : currentView === 'my-activity' && userRole === 'user' ? (
            <UserDashboard />
        ) : currentView === 'equipment' && (userRole === 'lab-officer' || userRole === 'user') ? (
            <EquipmentManagement userRole={userRole} />
        ) : currentView === 'analytics' && userRole === 'admin' ? (
            <AnalyticsDashboard />
        ) : (
            // Default: redirect to dashboard if trying to access unauthorized view
            loading ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
                   <div className="w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mb-4"></div>
                   <p>Syncing digital twin data...</p>
                </div>
             ) : (
               <FloorView 
                 currentFloor={currentFloor}
                 onFloorChange={setCurrentFloor}
                 floors={floors}
                 selectedRoom={selectedRoom}
                 onRoomClick={handleRoomClick}
                 userRole={userRole}
                 viewMode={floorViewMode}
                 onViewModeChange={setFloorViewMode}
                 maintenanceRequests={maintenanceRequests}
               />
             )
        )}

        {/* Room Modal */}
        {selectedRoom && (
            <RoomDetailsModal 
                room={selectedRoom} 
                onClose={() => setSelectedRoom(null)}
                userRole={userRole}
                onStatusChange={handleStatusChange}
                floorViewMode={floorViewMode}
            />
        )}
      </div>
    </motion.div>
  );
};

export default App;
