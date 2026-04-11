import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ClipboardList, CheckCircle, AlertTriangle, Search, Package, Clock } from 'lucide-react';
import { getMaintenanceRequests, getLostAndFoundItems } from '../services/spaceSyncService';
import { MaintenanceRequest, LostItem } from '../types';

const AnalyticsDashboard: React.FC = () => {
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceRequest[]>([]);
  const [lostFoundData, setLostFoundData] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [mRequests, lfItems] = await Promise.all([
        getMaintenanceRequests(),
        getLostAndFoundItems()
      ]);
      setMaintenanceData(mRequests);
      setLostFoundData(lfItems);
      setLoading(false);
    };
// Simulate loading delay
    fetchData();
  }, []);

  // Calculate Stats
  const pendingMaintenance = maintenanceData.filter(r => r.status === 'pending').length;
  const inProgressMaintenance = maintenanceData.filter(r => r.status === 'in-progress').length;
  const resolvedMaintenance = maintenanceData.filter(r => r.status === 'resolved').length;
  
  const maintenanceChartData = [
    { name: 'Pending', value: pendingMaintenance, color: '#F59E0B' },
    { name: 'In Progress', value: inProgressMaintenance, color: '#3B82F6' },
    { name: 'Resolved', value: resolvedMaintenance, color: '#10B981' },
  ];

  // Calculate Lost & Found Stats
  const lostItems = lostFoundData.filter(i => i.type === 'lost').length;
  const foundItems = lostFoundData.filter(i => i.type === 'found').length;
  const resolvedItems = lostFoundData.filter(i => i.status === 'resolved').length;
  const activeItems = lostFoundData.filter(i => i.status === 'open').length;

  const lostFoundChartData = [
    { name: 'Lost Reports', count: lostItems },
    { name: 'Found Items', count: foundItems },
    { name: 'Returned/Resolved', count: resolvedItems },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-indigo-600" />
            Facility Reports
          </h2>
          <p className="text-gray-500 text-sm">Overview of maintenance tickets and lost & found status.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <AlertTriangle className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-500">Pending Issues</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">{pendingMaintenance}</div>
            <div className="text-xs text-orange-600 mt-1">Requires Attention</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <Clock className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-500">In Progress</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">{inProgressMaintenance}</div>
            <div className="text-xs text-blue-600 mt-1">Active Repairs</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <Search className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-500">Active Lost/Found</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">{activeItems}</div>
            <div className="text-xs text-gray-400 mt-1">Open Cases</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                    <CheckCircle className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-500">Total Resolved</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">{resolvedMaintenance + resolvedItems}</div>
            <div className="text-xs text-green-600 mt-1">Issues & Items Closed</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Maintenance Status */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Maintenance Request Status</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={maintenanceChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {maintenanceChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Lost & Found Overview */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Lost & Found Activity</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={lostFoundChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                        <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                        <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Recent Maintenance Requests</h3>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                          <th className="px-6 py-4">Room</th>
                          <th className="px-6 py-4">Issue</th>
                          <th className="px-6 py-4">Reported By</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Status</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {loading ? (
                          <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading data...</td></tr>
                      ) : maintenanceData.length === 0 ? (
                          <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No records found.</td></tr>
                      ) : (
                          maintenanceData.slice(0, 5).map((row) => (
                              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4 font-semibold text-gray-700">{row.roomId}</td>
                                  <td className="px-6 py-4">{row.issueType}</td>
                                  <td className="px-6 py-4 text-gray-600">{row.reportedBy}</td>
                                  <td className="px-6 py-4 text-gray-500">{new Date(row.reportedAt).toLocaleDateString()}</td>
                                  <td className="px-6 py-4">
                                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                                          row.status === 'resolved' ? 'bg-green-100 text-green-700' : 
                                          row.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 
                                          'bg-yellow-100 text-yellow-700'
                                      }`}>
                                          {row.status}
                                      </span>
                                  </td>
                              </tr>
                          ))
                      )}
                  </tbody>
              </table>
          </div>
      </div>

    </div>
  );
};

export default AnalyticsDashboard;
