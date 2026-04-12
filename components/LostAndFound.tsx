import React, { useEffect, useState } from 'react';
import { Search, MapPin, Tag, Plus, CheckCircle, Clock, Mail, AlertCircle, Upload, Image } from 'lucide-react';
import { LostItem, UserRole } from '../types';
import { getLostAndFoundItems, reportLostItem, resolveLostItem, checkSimilarItems, sendEmailNotification } from '../services/spaceSyncService';

interface LostAndFoundProps {
  userRole: UserRole;
}

const LostAndFound: React.FC<LostAndFoundProps> = ({ userRole }) => {
  const [items, setItems] = useState<LostItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info', emailPreview?: {to: string, subject: string, body: string}} | null>(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  // Form State
  const [formType, setFormType] = useState<'lost' | 'found'>('lost');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const data = await getLostAndFoundItems();
    setItems(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Check for matches
    const matches = await checkSimilarItems(itemName, formType);
    
    // 2. Submit Report
    await reportLostItem({
      type: formType,
      itemName,
      description,
      location,
      contactInfo: contact
    });

    // 3. Simulate Email Notification
    let emailSubject = '';
    let emailBody = '';
    
    if (matches.length > 0) {
        const matchNames = matches.map(m => m.itemName).join(', ');
        emailSubject = `Potential Match Found: ${itemName}`;
        emailBody = `We found items in our database that might match your report: ${matchNames}. Please check the dashboard.`;
        
        await sendEmailNotification(email, emailSubject, emailBody);
        
        setNotification({
            message: `Report submitted! We found ${matches.length} potential match(es).`,
            type: 'success',
            emailPreview: { to: email, subject: emailSubject, body: emailBody }
        });
    } else {
        emailSubject = `Report Received: ${itemName}`;
        emailBody = `Your report for "${itemName}" has been logged. We will notify you if we find a match.`;
        
        await sendEmailNotification(email, emailSubject, emailBody);
        
        setNotification({
            message: `Report submitted. A confirmation email has been sent.`,
            type: 'success',
            emailPreview: { to: email, subject: emailSubject, body: emailBody }
        });
    }

    setShowForm(false);
    resetForm();
    fetchItems();
    
    // Clear notification after 8s (longer to allow clicking view)
    setTimeout(() => setNotification(null), 8000);
  };

  const handleResolve = async (id: string) => {
      await resolveLostItem(id);
      fetchItems();
  }

  const resetForm = () => {
    setItemName('');
    setDescription('');
    setLocation('');
    setContact('');
    setEmail('');
    setPhotoUrl(null);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredItems = items.filter(item => {
      if (filter === 'all') return true;
      return item.type === filter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Notification Toast */}
      {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 animate-in slide-in-from-right duration-300 ${
              notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
              <Mail className="w-5 h-5" />
              <div>
                  <p className="text-sm font-medium">{notification.message}</p>
                  {notification.emailPreview && (
                      <button 
                        onClick={() => setShowEmailPreview(true)}
                        className="text-xs underline mt-1 hover:text-green-900 font-semibold"
                      >
                          View Simulated Email
                      </button>
                  )}
              </div>
          </div>
      )}

      {/* Email Preview Modal */}
      {showEmailPreview && notification?.emailPreview && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                  <div className="bg-gray-50 border-b border-gray-100 p-4 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-gray-500">
                          <Mail className="w-4 h-4" />
                          <span className="text-xs font-semibold uppercase tracking-wider">Email Simulation</span>
                      </div>
                      <button onClick={() => setShowEmailPreview(false)} className="text-gray-400 hover:text-gray-600">
                          <Plus className="w-5 h-5 rotate-45" />
                      </button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div className="space-y-1">
                          <p className="text-xs text-gray-500 font-medium">To:</p>
                          <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-100">{notification.emailPreview.to}</p>
                      </div>
                      <div className="space-y-1">
                          <p className="text-xs text-gray-500 font-medium">Subject:</p>
                          <p className="text-sm font-bold text-gray-900">{notification.emailPreview.subject}</p>
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{notification.emailPreview.body}</p>
                      </div>
                  </div>
                  <div className="bg-gray-50 p-4 text-center">
                      <button 
                        onClick={() => setShowEmailPreview(false)}
                        className="text-sm font-medium text-gray-500 hover:text-gray-800"
                      >
                          Close Preview
                      </button>
                  </div>
              </div>
          </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Lost & Found</h2>
          <p className="text-gray-500 text-sm">Report items found or search for lost belongings.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-indigo-100 shadow-lg"
        >
          <Plus className="w-5 h-5" /> Report Item
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
          {['all', 'lost', 'found'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                    filter === f 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                  {f} Items
              </button>
          ))}
      </div>

      {/* Grid */}
      {loading ? (
          <div className="text-center py-12 text-gray-400">Loading items...</div>
      ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
              No items found in this category.
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                  <div key={item.id} className={`bg-white rounded-xl shadow-sm border flex flex-col h-full overflow-hidden ${item.status === 'resolved' ? 'opacity-60 border-gray-200' : 'border-gray-100'}`}>
                      {item.photoUrl ? (
                          <img src={item.photoUrl} alt={item.itemName} className="w-full h-48 object-cover" />
                      ) : (
                          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                              <Image className="w-8 h-8 text-gray-300" />
                          </div>
                      )}
                      <div className="p-5 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${
                              item.type === 'lost' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                              {item.type}
                          </span>
                          {item.status === 'resolved' ? (
                               <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                                   <CheckCircle className="w-3 h-3" /> Resolved
                               </span>
                          ) : (
                              <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
                                   <Clock className="w-3 h-3" /> Open
                              </span>
                          )}
                      </div>
                      
                      <h3 className="font-bold text-gray-800 text-lg mb-2">{item.itemName}</h3>
                      <p className="text-gray-600 text-sm mb-4 flex-1">{item.description}</p>
                      
                      <div className="space-y-2 text-xs text-gray-500 mb-4">
                          <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span>{item.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4 text-gray-400" />
                              <span>{new Date(item.date).toLocaleDateString()}</span>
                          </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                          <p className="text-xs font-semibold text-gray-500 mb-1">Contact / Location:</p>
                          <p className="text-sm font-medium text-gray-800">{item.contactInfo}</p>
                      </div>

                      {userRole === 'admin' && item.status === 'open' && (
                          <button 
                            onClick={() => handleResolve(item.id)}
                            className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
                          >
                              Mark as Resolved
                          </button>
                      )}
                      </div>
                  </div>
              ))}
          </div>
      )}

      {/* Add Item Modal Overlay */}
      {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-in zoom-in-95">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-800">Report an Item</h3>
                      <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                          <Plus className="w-6 h-6 rotate-45" />
                      </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Type Toggle */}
                      <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
                          <button
                            type="button"
                            onClick={() => setFormType('lost')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${formType === 'lost' ? 'bg-white shadow text-red-600' : 'text-gray-500'}`}
                          >
                              I Lost Something
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormType('found')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${formType === 'found' ? 'bg-white shadow text-emerald-600' : 'text-gray-500'}`}
                          >
                              I Found Something
                          </button>
                      </div>

                      <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Item Name</label>
                          <input required value={itemName} onChange={e => setItemName(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" placeholder="e.g. Blue Hydroflask" />
                      </div>
                      <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                          <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" placeholder="Color, size, distinguishing marks..." rows={3} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Location {formType === 'found' ? 'Found' : 'Last Seen'}</label>
                            <input required value={location} onChange={e => setLocation(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" placeholder="e.g. Room 304" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Info</label>
                            <input required value={contact} onChange={e => setContact(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" placeholder="Email or 'Left at Guard'" />
                        </div>
                      </div>
                      
                      <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address (for notifications)</label>
                          <input 
                              type="email" 
                              required
                              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                              placeholder="We'll email you if we find a match"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                          />
                      </div>

                      <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-2">Photo (Optional)</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors cursor-pointer">
                              <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={handlePhotoUpload}
                                  className="hidden"
                                  id="photo-upload"
                              />
                              <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                  {photoUrl ? (
                                      <>
                                          <img src={photoUrl} alt="preview" className="w-24 h-24 object-cover rounded" />
                                          <span className="text-xs text-indigo-600 font-medium">Change Photo</span>
                                      </>
                                  ) : (
                                      <>
                                          <Upload className="w-5 h-5 text-gray-400" />
                                          <span className="text-xs text-gray-600">Click to upload a photo of the item</span>
                                      </>
                                  )}
                              </label>
                          </div>
                      </div>

                      <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors mt-4">
                          Submit Report
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default LostAndFound;
