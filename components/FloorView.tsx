import React from 'react';
import { motion } from 'framer-motion';
import { Home, Wrench, Search } from 'lucide-react';
import FloorPlan from './FloorPlan';
import { FloorData, Room, UserRole, RoomStatus, MaintenanceRequest } from '../types';

interface FloorViewProps {
  currentFloor: number;
  onFloorChange: (floor: number) => void;
  floors: FloorData[];
  selectedRoom: Room | null;
  onRoomClick: (room: Room) => void;
  userRole: UserRole;
  viewMode: 'room-booking' | 'maintenance' | 'lost-found';
  onViewModeChange: (mode: 'room-booking' | 'maintenance' | 'lost-found') => void;
  maintenanceRequests?: MaintenanceRequest[];
}

const FloorView: React.FC<FloorViewProps> = ({
  currentFloor,
  onFloorChange,
  floors,
  selectedRoom,
  onRoomClick,
  userRole,
  viewMode,
  onViewModeChange,
  maintenanceRequests = [],
}) => {
  const currentFloorData = floors.find(f => f.floorNumber === currentFloor);

  const viewModes = [
    {
      id: 'room-booking' as const,
      label: 'Room Booking',
      icon: Home,
      description: 'View room availability and book spaces'
    },
    {
      id: 'maintenance' as const,
      label: 'Maintenance',
      icon: Wrench,
      description: 'Report and track facility issues'
    },
    {
      id: 'lost-found' as const,
      label: 'Lost & Found',
      icon: Search,
      description: 'Track lost items by location'
    }
  ];

  return (
    <div className="space-y-6">
      {/* View Mode Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wider">View Mode</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {viewModes.map(mode => {
            const Icon = mode.icon;
            return (
              <motion.button
                key={mode.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onViewModeChange(mode.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  viewMode === mode.id
                    ? 'bg-green-50 border-green-400 shadow-md'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-6 h-6 ${viewMode === mode.id ? 'text-green-600' : 'text-gray-400'}`} />
                  <div>
                    <p className={`font-semibold ${viewMode === mode.id ? 'text-green-700' : 'text-gray-700'}`}>
                      {mode.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{mode.description}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Floor Plan */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Level {currentFloor} • {
              viewMode === 'room-booking' ? 'Room Availability' :
              viewMode === 'maintenance' ? 'Maintenance Issues' :
              'Lost & Found Items'
            }
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {viewMode === 'room-booking' && 'Click a room to view availability and book'}
            {viewMode === 'maintenance' && 'Click a room to report or view maintenance issues'}
            {viewMode === 'lost-found' && 'Click a room to view or post lost items'}
          </p>
        </div>
        {currentFloorData ? (
          <FloorPlan 
            floor={currentFloorData} 
            onRoomClick={onRoomClick}
            selectedRoom={selectedRoom}
            viewMode={viewMode}
            userRole={userRole}
            maintenanceRequests={maintenanceRequests}
          />
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400">
            No floor data available
          </div>
        )}
      </div>
    </div>
  );
};

export default FloorView;
