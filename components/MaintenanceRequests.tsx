import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Plus, Wrench, Mail } from 'lucide-react';
import { MaintenanceRequest, UserRole } from '../types';
import { getMaintenanceRequests, reportMaintenanceIssue, updateMaintenanceStatus, sendEmailNotification } from '../services/spaceSyncService';

interface MaintenanceRequestsProps {
  userRole: UserRole;
}

const MaintenanceRequests: React.FC<MaintenanceRequestsProps> = ({ userRole }) => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  // Form State
  const [roomId, setRoomId] = useState('');
  const [issueType, setIssueType] = useState<MaintenanceRequest['issueType']>('Other');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const data = await getMaintenanceRequests();
    setRequests(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for duplicate/pending requests for this room
    const existingRequest = requests.find(r => r.roomId === roomId && r.status !== 'resolved');
    
    await reportMaintenanceIssue({
      roomId,
      issueType,
      description,
      reportedBy: userRole === 'maintenance' ? 'Maintenance Staff' : 'User',
    });

    if (existingRequest) {
        await sendEmailNotification(
            email,
            `Maintenance Ticket Update: ${roomId}`,
            `We noticed there is already a pending ticket for ${roomId}. We have added your report to the queue.`
        );
        setNotification({
            message: `Ticket submitted. Note: A pending request already exists for ${roomId}. Email sent to ${email}.`,
            type: 'info'
        });
    } else {
        await sendEmailNotification(
            email,
            `Maintenance Ticket Created: ${roomId}`,
            `Your maintenance request for ${roomId} (${issueType}) has been received. Ticket ID: #${Math.floor(Math.random() * 1000)}`
        );
        setNotification({
            message: `Maintenance ticket created successfully! Confirmation sent to ${email}.`,
            type: 'success'
        });
    }

    setShowForm(false);
    resetForm();
    fetchRequests();
    
    setTimeout(() => setNotification(null), 5000);
  };

  const handleStatusUpdate = async (id: string, status: MaintenanceRequest['status']) => {
    await updateMaintenanceStatus(id, status);
    fetchRequests();
  };

  const resetForm = () => {
    setRoomId('');
    setIssueType('Other');
    setDescription('');
    setEmail('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-orange-500" />
            Maintenance Requests
          </h2>
          <p className="text-gray-500 text-sm">Track and manage facility issues across the building.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors shadow-orange-100 shadow-lg"
        >
          <Plus className="w-5 h-5" /> Report Issue
        </button>
      </div>

      {/* Grid */}
      {loading ? (
          <div className="text-center py-12 text-gray-400">Loading requests...</div>
      ) : requests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
              No maintenance requests found. Everything is running smoothly!
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map(req => (
                  <div key={req.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col h-full hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide border ${getStatusColor(req.status)}`}>
                              {req.status}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                              {new Date(req.reportedAt).toLocaleDateString()}
                          </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-semibold">
                              {req.roomId}
                          </span>
                          <span className="text-sm font-medium text-gray-700">
                              {req.issueType}
                          </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 flex-1 border-l-2 border-gray-200 pl-3 italic">
                          "{req.description}"
                      </p>
                      
                      <div className="text-xs text-gray-400 mb-4">
                          Reported by: <span className="font-medium text-gray-600">{req.reportedBy}</span>
                      </div>

                      {/* Admin Actions */}
                      {(userRole === 'admin' || userRole === 'maintenance') && (
                          <div className="pt-4 border-t border-gray-100 flex gap-2">
                              {req.status === 'pending' && (
                                  <button 
                                    onClick={() => handleStatusUpdate(req.id, 'in-progress')}
                                    className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                                  >
                                      <Clock className="w-3 h-3" /> Start Work
                                  </button>
                              )}
                              {req.status !== 'resolved' && (
                                  <button 
                                    onClick={() => handleStatusUpdate(req.id, 'resolved')}
                                    className="flex-1 py-2 bg-green-50 hover:bg-green-100 text-green-600 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                                  >
                                      <CheckCircle className="w-3 h-3" /> Resolve
                                  </button>
                              )}
                          </div>
                      )}
                  </div>
              ))}
          </div>
      )}

      {/* Add Request Modal */}
      {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-in zoom-in-95">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-800">Report Maintenance Issue</h3>
                      <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                          <Plus className="w-6 h-6 rotate-45" />
                      </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Room ID</label>
                          <input required value={roomId} onChange={e => setRoomId(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" placeholder="e.g. MB-204" />
                      </div>
                      
                      <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Issue Type</label>
                          <select 
                            value={issueType} 
                            onChange={e => setIssueType(e.target.value as any)}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
                          >
                              <option value="AC">Air Conditioning</option>
                              <option value="Electrical">Electrical / Lighting</option>
                              <option value="Plumbing">Plumbing</option>
                              <option value="Furniture">Furniture</option>
                              <option value="Cleanliness">Cleanliness</option>
                              <option value="Other">Other</option>
                          </select>
                      </div>

                      <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                          <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" placeholder="Describe the issue in detail..." rows={3} />
                      </div>

                      <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address (for updates)</label>
                          <input 
                              type="email" 
                              required
                              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                              placeholder="We'll notify you when it's resolved"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                          />
                      </div>

                      <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors mt-4">
                          Submit Request
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default MaintenanceRequests;
