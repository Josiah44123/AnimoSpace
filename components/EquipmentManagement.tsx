import React, { useState, useEffect } from 'react';
import { Package, Plus, CheckCircle, AlertCircle, Inbox, Clipboard, AlertTriangle } from 'lucide-react';
import { Equipment, BorrowingSlip, EquipmentRequisition, UserRole } from '../types';
import { 
  getEquipment, 
  getBorrowingSlips, 
  createBorrowingSlip, 
  updateBorrowingSlipStatus,
  submitEquipmentRequisition,
  getEquipmentRequisitions,
  updateRequisitionStatus,
  getPendingReturns,
  getDamagedOrLostEquipment,
  sendEmailNotification
} from '../services/spaceSyncService';

interface EquipmentManagementProps {
  userRole: UserRole;
}

const EquipmentManagement: React.FC<EquipmentManagementProps> = ({ userRole }) => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [borrowingSlips, setBorrowingSlips] = useState<BorrowingSlip[]>([]);
  const [requisitions, setRequisitions] = useState<EquipmentRequisition[]>([]);
  const [pendingReturns, setPendingReturns] = useState<BorrowingSlip[]>([]);
  const [damagedItems, setDamagedItems] = useState<BorrowingSlip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'borrowing' | 'requisitions' | 'accountability'>('overview');
  const [showRequisitionForm, setShowRequisitionForm] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Form states
  const [reqProfessor, setReqProfessor] = useState('');
  const [reqEmail, setReqEmail] = useState('');
  const [reqSection, setReqSection] = useState('');
  const [reqDate, setReqDate] = useState('');
  const [reqEquipment, setReqEquipment] = useState<Array<{id: string, name: string, qty: number}>>([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    const [equipData, slipsData, reqData, penData, damData] = await Promise.all([
      getEquipment(),
      getBorrowingSlips(),
      getEquipmentRequisitions(),
      getPendingReturns(),
      getDamagedOrLostEquipment()
    ]);
    setEquipment(equipData);
    setBorrowingSlips(slipsData);
    setRequisitions(reqData);
    setPendingReturns(penData);
    setDamagedItems(damData);
    setLoading(false);
  };

  const handleSubmitRequisition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqProfessor || !reqEmail || !reqSection || !reqDate || reqEquipment.length === 0) {
      setNotification({ message: 'Please fill in all fields', type: 'error' });
      return;
    }

    await submitEquipmentRequisition({
      submittedBy: reqProfessor,
      professorEmail: reqEmail,
      sectionName: reqSection,
      labDate: reqDate,
      equipmentList: reqEquipment.map(e => ({ equipmentId: e.id, equipmentName: e.name, quantityNeeded: e.qty })),
      status: 'pending'
    });

    await sendEmailNotification(
      reqEmail,
      `Equipment Requisition Received: ${reqSection}`,
      `Your equipment requisition for ${reqDate} has been submitted and is pending approval.`
    );

    setNotification({ message: 'Requisition submitted successfully!', type: 'success' });
    setShowRequisitionForm(false);
    resetForm();
    fetchAllData();
    setTimeout(() => setNotification(null), 5000);
  };

  const resetForm = () => {
    setReqProfessor('');
    setReqEmail('');
    setReqSection('');
    setReqDate('');
    setReqEquipment([]);
  };

  const handleRequisitionApprove = async (id: string) => {
    await updateRequisitionStatus(id, 'approved');
    fetchAllData();
  };

  const handleRequisitionPrepare = async (id: string, preparedBy: string) => {
    await updateRequisitionStatus(id, 'prepared', preparedBy);
    fetchAllData();
  };

  const handleUpdateSlipStatus = async (id: string, status: BorrowingSlip['status']) => {
    await updateBorrowingSlipStatus(id, status);
    fetchAllData();
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading equipment data...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-right ${
          notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Laboratory Equipment Management
          </h2>
          <p className="text-gray-500 text-sm">Manage equipment inventory, borrowing, and requisitions.</p>
        </div>
        {userRole === 'user' && (
          <button 
            onClick={() => setShowRequisitionForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-blue-100 shadow-lg"
          >
            <Plus className="w-5 h-5" /> Submit Requisition
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-100 flex-wrap">
        {[
          { id: 'overview', label: 'Equipment Inventory', icon: Package },
          { id: 'borrowing', label: 'Borrowing Slips', icon: Inbox },
          { id: 'requisitions', label: 'Requisitions', icon: Clipboard },
          { id: 'accountability', label: 'Accountability', icon: AlertTriangle }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
              activeTab === tab.id
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      
      {/* Equipment Inventory Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    item.condition === 'good' ? 'bg-green-100 text-green-700' :
                    item.condition === 'damaged' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {item.condition}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">Category: <span className="font-medium text-gray-800">{item.category}</span></p>
                  <p className="text-gray-600">Available: <span className="font-bold text-lg text-blue-600">{item.quantity}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Borrowing Slips */}
      {activeTab === 'borrowing' && (
        <div className="space-y-4">
          {borrowingSlips.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
              No borrowing slips found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {borrowingSlips.map(slip => (
                <div key={slip.id} className={`bg-white p-5 rounded-xl shadow-sm border ${slip.status === 'returned' ? 'border-gray-200 opacity-60' : 'border-blue-200'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800">{slip.equipmentName}</h3>
                      <p className="text-xs text-gray-500">Student: {slip.studentName} ({slip.studentId})</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      slip.status === 'returned' ? 'bg-green-100 text-green-700' :
                      slip.status === 'damaged' ? 'bg-red-100 text-red-700' :
                      slip.status === 'lost' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {slip.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p>Quantity: <span className="font-medium">{slip.quantity}</span></p>
                    <p>Borrow Date: <span className="font-medium">{new Date(slip.borrowDate).toLocaleDateString()}</span></p>
                    {slip.expectedReturnDate && <p>Expected Return: <span className="font-medium">{new Date(slip.expectedReturnDate).toLocaleDateString()}</span></p>}
                  </div>
                  
                  {(userRole === 'admin' || userRole === 'maintenance') && slip.status !== 'returned' && (
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button 
                        onClick={() => handleUpdateSlipStatus(slip.id, 'returned')}
                        className="flex-1 py-1 text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 rounded"
                      >
                        Return
                      </button>
                      <button 
                        onClick={() => handleUpdateSlipStatus(slip.id, 'damaged')}
                        className="flex-1 py-1 text-xs font-semibold bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded"
                      >
                        Damaged
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Requisitions */}
      {activeTab === 'requisitions' && (
        <div className="space-y-4">
          {requisitions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
              No equipment requisitions found.
            </div>
          ) : (
            <div className="space-y-4">
              {requisitions.map(req => (
                <div key={req.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-800">{req.sectionName}</h3>
                      <p className="text-xs text-gray-500">Professor: {req.submittedBy}</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      req.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                      req.status === 'prepared' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <p>Lab Date: <span className="font-medium">{req.labDate}</span></p>
                      <p className="mt-2">Equipment needed:</p>
                      <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                        {req.equipmentList.map((eq, idx) => (
                          <li key={idx}>{eq.quantityNeeded}x {eq.equipmentName}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {(userRole === 'admin' || userRole === 'maintenance') && req.status !== 'prepared' && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                      {req.status === 'pending' && (
                        <button 
                          onClick={() => handleRequisitionApprove(req.id)}
                          className="flex-1 py-2 text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded"
                        >
                          Approve
                        </button>
                      )}
                      {req.status === 'approved' && (
                        <button 
                          onClick={() => handleRequisitionPrepare(req.id, 'CA')}
                          className="flex-1 py-2 text-sm font-semibold bg-green-50 text-green-700 hover:bg-green-100 rounded"
                        >
                          Mark Prepared
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Accountability - Damaged/Lost Items */}
      {activeTab === 'accountability' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Pending Returns
            </h3>
            {pendingReturns.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-200 text-gray-400">
                All equipment returned or in use.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingReturns.map(slip => (
                  <div key={slip.id} className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                    <p className="text-sm text-gray-700"><span className="font-bold">{slip.studentName}</span> ({slip.studentId}) has {slip.equipmentName} since {new Date(slip.borrowDate).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Damaged/Lost Items
            </h3>
            {damagedItems.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-200 text-gray-400">
                No damaged or lost items recorded.
              </div>
            ) : (
              <div className="space-y-3">
                {damagedItems.map(slip => (
                  <div key={slip.id} className="bg-red-50 border border-red-200 p-4 rounded-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{slip.equipmentName}</p>
                        <p className="text-xs text-gray-600 mt-1">Student: {slip.studentName} ({slip.studentId})</p>
                        <p className="text-xs text-gray-600 mt-1">Status: <span className="font-bold uppercase">{slip.status}</span></p>
                        {slip.damageReport && <p className="text-xs text-red-700 mt-2">Report: {slip.damageReport}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Requisition Form Modal */}
      {showRequisitionForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Submit Equipment Requisition</h3>
              <button onClick={() => setShowRequisitionForm(false)} className="text-gray-400 hover:text-gray-600">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequisition} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Professor Name</label>
                <input 
                  required 
                  value={reqProfessor} 
                  onChange={e => setReqProfessor(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Dr. Juan Dela Cruz"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                <input 
                  required 
                  type="email"
                  value={reqEmail} 
                  onChange={e => setReqEmail(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="professor@dlsl.edu.ph"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Section</label>
                <input 
                  required 
                  value={reqSection} 
                  onChange={e => setReqSection(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Chemistry 101 - Section A"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Lab Date</label>
                <input 
                  required 
                  type="date"
                  value={reqDate} 
                  onChange={e => setReqDate(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Equipment Needed</label>
                <div className="space-y-2 mb-2">
                  {reqEquipment.map((eq, idx) => (
                    <div key={idx} className="flex gap-2 items-end">
                      <select 
                        value={eq.id}
                        onChange={(e) => {
                          const selected = equipment.find(x => x.id === e.target.value);
                          const newEquip = [...reqEquipment];
                          newEquip[idx] = { ...eq, id: e.target.value, name: selected?.name || '' };
                          setReqEquipment(newEquip);
                        }}
                        className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      >
                        <option value="">Select Equipment</option>
                        {equipment.map(e => (
                          <option key={e.id} value={e.id}>{e.name}</option>
                        ))}
                      </select>
                      <input 
                        type="number" 
                        min="1"
                        value={eq.qty}
                        onChange={(e) => {
                          const newEquip = [...reqEquipment];
                          newEquip[idx].qty = parseInt(e.target.value) || 0;
                          setReqEquipment(newEquip);
                        }}
                        className="w-16 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Qty"
                      />
                      <button 
                        type="button"
                        onClick={() => setReqEquipment(reqEquipment.filter((_, i) => i !== idx))}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  type="button"
                  onClick={() => setReqEquipment([...reqEquipment, { id: '', name: '', qty: 1 }])}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Equipment
                </button>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-6">
                Submit Requisition
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentManagement;
