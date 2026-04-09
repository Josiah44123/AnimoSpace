import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, AlertCircle, FileText, Search, ArrowRight, Beaker } from 'lucide-react';
import { MaintenanceRequest, LostItem, LabBooking } from '../types';
import { getMaintenanceRequests, getLostAndFoundItems, getLabBookings } from '../services/spaceSyncService';

const UserDashboard: React.FC = () => {
  const [myMaintenance, setMyMaintenance] = useState<MaintenanceRequest[]>([]);
  const [myLostFound, setMyLostFound] = useState<LostItem[]>([]);
  const [myBookings, setMyBookings] = useState<LabBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [mRequests, lfItems, lBookings] = await Promise.all([
        getMaintenanceRequests(),
        getLostAndFoundItems(),
        getLabBookings()
      ]);
      
      
      // In a real app, this would filter by the logged-in user's ID
      setMyMaintenance(mRequests); 
      setMyLostFound(lfItems);
      setMyBookings(lBookings.filter(b => b.bookedBy === 'User' || b.bookedBy === 'Me' || b.bookedBy === 'John Doe')); // Mock filter
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
      
      {/* Welcome Section */}
      <div 
        className="rounded-2xl p-6 md:p-8 text-white shadow-lg" 
        style={{ background: 'linear-gradient(to right, #16a34a, #059669)' }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">My Activity Dashboard</h2>
        <p className="text-green-50 opacity-90 font-medium text-sm md:text-base">Track your reported issues, lost items, and space requests in one place.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* My Maintenance Requests */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                        <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-gray-900">Maintenance Tickets</h3>
                </div>
                <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{myMaintenance.length} Active</span>
            </div>
            
            <div className="p-6 flex-1 bg-white">
                {loading ? (
                    <div className="text-center text-gray-500 py-8 font-medium">Loading...</div>
                ) : myMaintenance.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                        <p className="text-gray-500 text-sm font-medium">No maintenance tickets submitted.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {myMaintenance.map(req => (
                            <div key={req.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all bg-white group">
                                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                                    req.status === 'resolved' ? 'bg-green-500' : 
                                    req.status === 'in-progress' ? 'bg-blue-500' : 'bg-yellow-500'
                                }`} />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-gray-900 text-sm">{req.issueType} Issue</h4>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                            req.status === 'resolved' ? 'bg-green-100 text-green-700' : 
                                            req.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {req.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2 font-medium">{req.description}</p>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 font-medium">
                                        <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{req.roomId}</span>
                                        <span>•</span>
                                        <span>{new Date(req.reportedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* My Lost & Found */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                        <Search className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-gray-900">Lost & Found Reports</h3>
                </div>
                <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{myLostFound.length} Active</span>
            </div>
            
            <div className="p-6 flex-1 bg-white">
                {loading ? (
                    <div className="text-center text-gray-500 py-8 font-medium">Loading...</div>
                ) : myLostFound.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                        <p className="text-gray-500 text-sm font-medium">No items reported.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {myLostFound.map(item => (
                            <div key={item.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all bg-white">
                                <div className={`p-2 rounded-lg ${item.type === 'lost' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                    {item.type === 'lost' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-gray-900 text-sm">{item.itemName}</h4>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                            item.status === 'resolved' ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2 font-medium">{item.description}</p>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 font-medium">
                                        <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{item.location}</span>
                                        <span>•</span>
                                        <span>{new Date(item.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* My Lab Reservations */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <Beaker className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-gray-900">Lab Reservations</h3>
                </div>
                <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{myBookings.length} Active</span>
            </div>
            
            <div className="p-6 flex-1 bg-white">
                {loading ? (
                    <div className="text-center text-gray-500 py-8 font-medium">Loading...</div>
                ) : myBookings.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                        <p className="text-gray-500 text-sm font-medium">No lab reservations.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {myBookings.map(booking => (
                            <div key={booking.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all bg-white">
                                <div className={`p-2 rounded-lg ${booking.labType === 'Science Lab' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                    <Beaker className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-gray-900 text-sm">{booking.labType}</h4>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2 font-medium">{booking.purpose}</p>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 font-medium">
                                        <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{booking.date}</span>
                                        <span>•</span>
                                        <span>{booking.timeSlot}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

      </div>

      {/* Notifications / Email Simulation Preview */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-full text-blue-600 mt-0.5">
              <Clock className="w-4 h-4" />
          </div>
          <div>
              <h4 className="text-sm font-bold text-blue-900">Recent Notifications</h4>
              <p className="text-xs text-blue-700 mt-1 font-medium">
                  Check your email for updates on your tickets. The system automatically cross-references new lost item reports with the database and notifies you of potential matches.
              </p>
          </div>
      </div>

    </div>
  );
};

export default UserDashboard;
