import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Beaker, Monitor, Plus, CheckCircle, XCircle, AlertCircle, User, Mail } from 'lucide-react';
import { LabBooking, UserRole } from '../types';
import { getLabBookings, createLabBooking, updateLabBookingStatus, sendEmailNotification } from '../services/spaceSyncService';

interface LabBookingProps {
  userRole: UserRole;
}

const LabBookingComponent: React.FC<LabBookingProps> = ({ userRole }) => {
  const [bookings, setBookings] = useState<LabBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Form State
  const [labType, setLabType] = useState<LabBooking['labType']>('Science Lab');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('09:00 - 10:00');
  const [purpose, setPurpose] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const data = await getLabBookings();
    setBookings(data);
    setLoading(false);
  };

  const handleBookLab = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!date || !timeSlot || !purpose || !email) {
      setNotification({ message: 'Please fill in all fields.', type: 'error' });
      return;
    }

    // Check availability (mock check)
    const isOccupied = bookings.some(b => 
        b.labType === labType && 
        b.date === date && 
        b.timeSlot === timeSlot && 
        b.status === 'confirmed'
    );

    if (isOccupied) {
        setNotification({ message: 'This slot is already booked.', type: 'error' });
        return;
    }

    await createLabBooking({
        labType,
        date,
        timeSlot,
        bookedBy: userRole === 'admin' ? 'Admin' : 'User', // In real app, get from auth
        email,
        purpose
    });

    await sendEmailNotification(
        email,
        `Lab Booking Request Received: ${labType}`,
        `Your request to book the ${labType} on ${date} at ${timeSlot} has been received and is pending approval.`
    );

    setNotification({ message: 'Booking request submitted successfully!', type: 'success' });
    setShowBookingForm(false);
    resetForm();
    fetchBookings();
    
    setTimeout(() => setNotification(null), 5000);
  };

  const handleStatusUpdate = async (id: string, status: LabBooking['status'], bookingEmail: string) => {
    await updateLabBookingStatus(id, status);
    
    const subject = status === 'confirmed' ? 'Lab Booking Approved' : 'Lab Booking Rejected';
    const body = status === 'confirmed' 
        ? 'Your lab booking request has been approved.' 
        : 'Your lab booking request has been rejected. Please contact admin for details.';
    
    await sendEmailNotification(bookingEmail, subject, body);
    
    fetchBookings();
  };

  const resetForm = () => {
    setLabType('Science Lab');
    setDate('');
    setTimeSlot('09:00 - 10:00');
    setPurpose('');
    setEmail('');
  };

  // Filter bookings based on role
  const myBookings = bookings.filter(b => b.bookedBy === 'User' || b.bookedBy === 'Me'); // Mock filter
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');

  const timeSlots = [
    '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
    '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00'
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Beaker className="w-6 h-6 text-indigo-600" />
            Lab Facilities & Booking
          </h2>
          <p className="text-gray-500 text-sm">Manage reservations for Science and Computer laboratories.</p>
        </div>
        {userRole === 'user' && (
            <button 
            onClick={() => setShowBookingForm(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-indigo-100 shadow-lg"
            >
            <Plus className="w-5 h-5" /> Book a Lab
            </button>
        )}
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-right ${
            notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <p className="text-sm font-medium">{notification.message}</p>
        </div>
      )}

      {/* Content based on Role */}
      
      {/* USER VIEW */}
      {userRole === 'user' && (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">My Bookings</h3>
            {loading ? (
                <div className="text-center py-8 text-gray-400">Loading bookings...</div>
            ) : myBookings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                    You haven't booked any labs yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myBookings.map(booking => (
                        <BookingCard key={booking.id} booking={booking} />
                    ))}
                </div>
            )}
        </div>
      )}

      {/* ADMIN VIEW */}
      {userRole === 'admin' && (
        <div className="space-y-8">
            {/* Pending Requests */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" /> Pending Requests
                </h3>
                {pendingBookings.length === 0 ? (
                    <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500 border border-gray-200">
                        No pending booking requests.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingBookings.map(booking => (
                            <div key={booking.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        {booking.labType === 'Science Lab' ? <Beaker className="w-5 h-5 text-purple-600" /> : <Monitor className="w-5 h-5 text-blue-600" />}
                                        <span className="font-bold text-gray-800">{booking.labType}</span>
                                    </div>
                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded uppercase">Pending</span>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p><span className="font-semibold">Date:</span> {booking.date} at {booking.timeSlot}</p>
                                    <p><span className="font-semibold">User:</span> {booking.bookedBy} ({booking.email})</p>
                                    <p><span className="font-semibold">Purpose:</span> {booking.purpose}</p>
                                </div>
                                <div className="flex gap-2 mt-2 pt-3 border-t border-gray-100">
                                    <button 
                                        onClick={() => handleStatusUpdate(booking.id, 'confirmed', booking.email)}
                                        className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 py-2 rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleStatusUpdate(booking.id, 'rejected', booking.email)}
                                        className="flex-1 bg-red-50 text-red-700 hover:bg-red-100 py-2 rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* All Confirmed Bookings */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" /> Confirmed Schedule
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {confirmedBookings.map(booking => (
                        <BookingCard key={booking.id} booking={booking} isAdmin />
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* MAINTENANCE VIEW */}
      {userRole === 'maintenance' && (
        <div className="space-y-6">
             <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-full text-blue-600 mt-0.5">
                    <Clock className="w-4 h-4" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-blue-900">Lab Schedule Overview</h4>
                    <p className="text-xs text-blue-700 mt-1 font-medium">
                        Use this schedule to plan maintenance and cleaning during free slots.
                    </p>
                </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800">Upcoming Lab Usage</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {confirmedBookings.map(booking => (
                    <BookingCard key={booking.id} booking={booking} />
                ))}
            </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Book a Lab</h3>
                    <button onClick={() => setShowBookingForm(false)} className="text-gray-400 hover:text-gray-600">
                        <Plus className="w-6 h-6 rotate-45" />
                    </button>
                </div>
                
                <form onSubmit={handleBookLab} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Lab Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setLabType('Science Lab')}
                                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${labType === 'Science Lab' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <Beaker className="w-6 h-6" />
                                <span className="text-sm font-medium">Science Lab</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setLabType('Computer Lab')}
                                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${labType === 'Computer Lab' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <Monitor className="w-6 h-6" />
                                <span className="text-sm font-medium">Computer Lab</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
                            <input 
                                type="date" 
                                required
                                min={new Date().toISOString().split('T')[0]}
                                value={date} 
                                onChange={e => setDate(e.target.value)} 
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Time Slot</label>
                            <select 
                                value={timeSlot} 
                                onChange={e => setTimeSlot(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                            >
                                {timeSlots.map(slot => (
                                    <option key={slot} value={slot}>{slot}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Purpose</label>
                        <input 
                            required 
                            value={purpose} 
                            onChange={e => setPurpose(e.target.value)} 
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                            placeholder="e.g. Chemistry Experiment, Coding Workshop" 
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            required 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                            placeholder="For booking confirmation" 
                        />
                    </div>

                    <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors mt-4">
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

const BookingCard = ({ booking, isAdmin }: { booking: LabBooking, isAdmin?: boolean }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
                {booking.labType === 'Science Lab' ? <Beaker className="w-5 h-5 text-purple-600" /> : <Monitor className="w-5 h-5 text-blue-600" />}
                <span className="font-bold text-gray-800 text-sm">{booking.labType}</span>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
            }`}>
                {booking.status}
            </span>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{booking.date}</span>
            </div>
            <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{booking.timeSlot}</span>
            </div>
            {isAdmin && (
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{booking.bookedBy}</span>
                </div>
            )}
            <div className="pt-2 border-t border-gray-100 mt-2">
                <p className="italic text-gray-500">"{booking.purpose}"</p>
            </div>
        </div>
    </div>
);

export default LabBookingComponent;
