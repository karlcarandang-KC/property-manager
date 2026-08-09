import React, { useState, useEffect, useRef } from 'react';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ============================================================================
// 🛑 PASTE YOUR SUPABASE KEYS HERE 🛑
// ============================================================================
const supabaseUrl = 'https://oxjhxvqatokgbmbgqhey.supabase.co'; 
const supabaseKey = 'sb_publishable_sR0hAU9cLY--PzewO2SLsQ_mF3pzlmb';

// --- Supabase Initialization ---
const isConfigured = supabaseUrl !== "https://oxjhxvqatokgbmbgqhey.supabase.co/rest/v1/";
let supabase;
if (isConfigured) {
  supabase = createClient(supabaseUrl, supabaseKey);
}
// ============================================================================

const formatPHP = (amount) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Intl.DateTimeFormat('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateString));
};

const calculateDaysRemaining = (targetDate) => {
  if (!targetDate) return 0;
  const today = new Date();
  const target = new Date(targetDate);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
};

const Icons = {
  Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Upload: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  AlertTriangle: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Close: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  ImagePlaceholder: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Loader: () => <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>,
  Phone: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Book: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  File: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Save: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
};

export default function App() {
  if (!isConfigured) {
    return <SetupScreen />;
  }

  const [properties, setProperties] = useState([]);
  const [ledgerHistory, setLedgerHistory] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cloud Data Fetching
  const fetchCloudData = async () => {
    try {
      const { data: propsData } = await supabase.from('properties').select('*');
      if (propsData) {
        setProperties(propsData.map(row => ({ id: row.id, ...row.data })));
      }

      const { data: ledgerData } = await supabase.from('ledger').select('*').eq('id', 1).single();
      if (ledgerData && ledgerData.data) {
        let history = ledgerData.data.history || [];
        // Migration for old data if they had a balance but no history
        if (history.length === 0 && ledgerData.data.allTimeProfit > 0) {
            history = [{
                id: 'legacy_balance',
                date: new Date().toISOString(),
                amount: ledgerData.data.allTimeProfit,
                desc: 'Previous Balance'
            }];
        }
        setLedgerHistory(history);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCloudData();
  }, []);

  const showNotification = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddProperty = async (newProperty) => {
    const id = Date.now().toString();
    const dataObj = {
      ...newProperty,
      isRentPaid: true,
      isElectricPaid: true,
      isWaterPaid: true,
      rentUnpaidDate: null,
      documents: [],
      imageUrl: null
    };

    setProperties(prev => [...prev, { id, ...dataObj }]);
    setIsAddModalOpen(false);
    showNotification('Property saved to Cloud!', 'success');

    await supabase.from('properties').insert({ id, data: dataObj });
  };

  const handleDeleteProperty = async (id) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    setSelectedProperty(null);
    showNotification('Property deleted.', 'info');
    await supabase.from('properties').delete().eq('id', id);
  };

  // Bulk update used for the new "Save Changes" flow
  const handleBulkUpdateProperty = async (id, updates) => {
    const propertyToUpdate = properties.find(p => p.id === id);
    if (!propertyToUpdate) return;

    const updatedData = { ...propertyToUpdate, ...updates };
    
    // Auto-set overdue date if rent becomes unpaid
    if (updates.isRentPaid === false) {
      updatedData.rentUnpaidDate = new Date().toISOString();
    } else if (updates.isRentPaid === true) {
      updatedData.rentUnpaidDate = null;
    }

    setProperties(prev => prev.map(p => p.id === id ? updatedData : p));
    if (selectedProperty && selectedProperty.id === id) {
      setSelectedProperty(updatedData);
    }

    const { id: _, ...dbData } = updatedData;
    await supabase.from('properties').update({ data: dbData }).eq('id', id);
  };

  // Ledger Add/Delete logic
  const handleAddToLedger = async (amount, desc) => {
    const newTx = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        amount: Number(amount),
        desc: desc
    };
    const newHistory = [...ledgerHistory, newTx];
    setLedgerHistory(newHistory);
    await supabase.from('ledger').update({ data: { history: newHistory, allTimeProfit: newHistory.reduce((sum, tx) => sum + tx.amount, 0) } }).eq('id', 1);
  };

  const handleDeleteLedgerEntry = async (txId) => {
    const newHistory = ledgerHistory.filter(t => t.id !== txId);
    setLedgerHistory(newHistory);
    await supabase.from('ledger').update({ data: { history: newHistory, allTimeProfit: newHistory.reduce((sum, tx) => sum + tx.amount, 0) } }).eq('id', 1);
    showNotification('Ledger entry deleted.', 'info');
  };

  const totalAllTimeProfit = ledgerHistory.reduce((sum, tx) => sum + tx.amount, 0);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Icons.Loader /> <span className="ml-2 font-medium">Connecting to Cloud...</span></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-black text-white rounded-lg">
                  <Icons.Home />
                </div>
                <span className="font-bold text-xl tracking-tight hidden sm:block">Carandang Properties</span>
              </div>
              <button 
                onClick={() => setIsContactsOpen(true)}
                className="flex items-center gap-2 text-gray-600 hover:text-black hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors text-sm font-semibold"
              >
                <Icons.Phone /> Contacts
              </button>
            </div>
            
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Icons.Plus />
              <span className="hidden sm:inline">Add Property</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <span className="text-gray-600 text-sm font-medium mb-2">Total Paid Rent (Current Month)</span>
            <span className="text-3xl font-bold text-green-600">
              {formatPHP(properties.filter(p => p.isRentPaid).reduce((sum, p) => sum + Number(p.rentAmount), 0))}
            </span>
          </div>

          {/* Clickable Ledger Card */}
          <div 
            onClick={() => setIsLedgerOpen(true)}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col relative overflow-hidden cursor-pointer hover:border-green-500 hover:shadow-md transition-all group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Icons.Book /></div>
            <span className="text-gray-600 text-sm font-medium mb-2 flex items-center gap-2">
              All-Time Profit (Ledger)
              <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold">CLICK TO VIEW</span>
            </span>
            <span className="text-3xl font-bold text-green-700">
              {formatPHP(totalAllTimeProfit)}
            </span>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col lg:col-span-1 md:col-span-2">
            <span className="text-gray-600 text-sm font-medium mb-2">Action Required</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-orange-500">
                {properties.filter(p => !p.isRentPaid).length}
              </span>
              <span className="text-sm text-gray-500">unpaid properties</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4 mt-8">
          <h2 className="text-xl font-bold">Property Portfolio</h2>
        </div>
        
        {properties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 mb-4">No properties added yet.</p>
            <button onClick={() => setIsAddModalOpen(true)} className="text-blue-600 font-medium hover:underline">
              Add your first property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} onClick={() => setSelectedProperty(property)} />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {isAddModalOpen && <AddPropertyModal onClose={() => setIsAddModalOpen(false)} onAdd={handleAddProperty} />}
      
      {isContactsOpen && <ContactsModal onClose={() => setIsContactsOpen(false)} />}
      
      {isLedgerOpen && <LedgerModal history={ledgerHistory} onClose={() => setIsLedgerOpen(false)} onDelete={handleDeleteLedgerEntry} />}

      {selectedProperty && (
        <PropertyDetailModal 
          property={properties.find(p => p.id === selectedProperty.id)} 
          onClose={() => setSelectedProperty(null)}
          onBulkUpdate={handleBulkUpdateProperty}
          onDelete={() => handleDeleteProperty(selectedProperty.id)}
          onAddLedger={handleAddToLedger}
          supabase={supabase}
        />
      )}

      {notification && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce z-50">
          <span>{notification.msg}</span>
        </div>
      )}
    </div>
  );
}

function ContactsModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold flex items-center gap-2"><Icons.Phone /> Important Contacts</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800"><Icons.Close /></button>
        </div>
        <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto">
          <div>
            <h3 className="font-bold text-gray-900 mb-2 border-b pb-1">Meralco</h3>
            <p className="text-sm text-gray-600"><strong>Hotline:</strong> 16211 or (02) 16211 (24/7)</p>
            <p className="text-sm text-gray-600"><strong>Globe SMS:</strong> 0917-551-6211</p>
            <p className="text-sm text-gray-600"><strong>Smart SMS:</strong> 0920-971-6211</p>
            <p className="text-sm text-gray-600"><strong>Email:</strong> customercare@meralco.com.ph</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2 border-b pb-1">Maynilad</h3>
            <p className="text-sm text-gray-600"><strong>Main Hotline:</strong> 1626</p>
            <p className="text-sm text-gray-600"><strong>Text Hotline:</strong> 0998-8641446</p>
            <p className="text-sm text-gray-600"><strong>Email:</strong> customer.helpdesk@mayniladwater.com.ph</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2 border-b pb-1">Management Team</h3>
            <div className="mb-3">
              <p className="text-sm font-semibold">Frolan B. Carandang</p>
              <p className="text-sm text-gray-600">0917 515 2383</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Karl Carandang</p>
              <p className="text-sm text-gray-600">0927 474 7380</p>
              <p className="text-sm text-gray-600">karladriancarandang@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LedgerModal({ history, onClose, onDelete }) {
  const total = history.reduce((sum, tx) => sum + tx.amount, 0);
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white rounded-t-xl">
          <h2 className="text-xl font-bold flex items-center gap-2"><Icons.Book /> All-Time Ledger</h2>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-xs text-gray-500 font-bold uppercase">Total Profit</p>
                <p className="text-xl font-bold text-green-600">{formatPHP(total)}</p>
             </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-800 bg-gray-100 p-2 rounded-full"><Icons.Close /></button>
          </div>
        </div>
        
        <div className="p-1 overflow-y-auto bg-gray-50 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No payments recorded yet.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider sticky top-0">
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Description</th>
                  <th className="p-4 font-semibold text-right">Amount</th>
                  <th className="p-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {/* Sort history by newest first */}
                {[...history].sort((a,b) => new Date(b.date) - new Date(a.date)).map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-600">{formatDate(tx.date)}</td>
                    <td className="p-4 text-sm font-medium text-gray-900">{tx.desc}</td>
                    <td className="p-4 text-sm font-bold text-green-600 text-right">+{formatPHP(tx.amount)}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => {if(window.confirm('Delete this record from ledger?')) onDelete(tx.id)}} className="text-red-400 hover:text-red-600 p-1">
                        <Icons.Trash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function AddPropertyModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({ 
    propertyName: '', tenantName: '', tenantPhone: '', tenantPhone2: '', 
    propertyAddress: '', leaseEnd: '', rentAmount: '', electricAmount: '', waterAmount: '' 
  });
  
  const handleSubmit = (e) => { e.preventDefault(); onAdd(formData); };
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold">Add New Property</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800"><Icons.Close /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
             <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Property Details</label>
             <input required type="text" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none mb-2" value={formData.propertyName} onChange={e => setFormData({...formData, propertyName: e.target.value})} placeholder="Property Name / Unit" />
             <input required type="text" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" value={formData.propertyAddress} onChange={e => setFormData({...formData, propertyAddress: e.target.value})} placeholder="Full Address" />
          </div>

          <div>
             <label className="text-xs font-bold text-gray-500 uppercase mb-1 mt-2 block">Tenant Info</label>
             <input required type="text" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none mb-2" value={formData.tenantName} onChange={e => setFormData({...formData, tenantName: e.target.value})} placeholder="Tenant Name" />
             <div className="grid grid-cols-2 gap-2">
                <input required type="text" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" value={formData.tenantPhone} onChange={e => setFormData({...formData, tenantPhone: e.target.value})} placeholder="Phone 1 (Required)" />
                <input type="text" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" value={formData.tenantPhone2} onChange={e => setFormData({...formData, tenantPhone2: e.target.value})} placeholder="Phone 2 (Optional)" />
             </div>
          </div>

          <div>
             <label className="text-xs font-bold text-gray-500 uppercase mb-1 mt-2 block">Lease Expiration Date</label>
             <input required type="date" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" value={formData.leaseEnd} onChange={e => setFormData({...formData, leaseEnd: e.target.value})} />
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 mt-2 block">Monthly Bills</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><input required type="number" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none text-lg font-bold" value={formData.rentAmount} onChange={e => setFormData({...formData, rentAmount: e.target.value})} placeholder="Rent (₱)" /></div>
              <input required type="number" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" value={formData.electricAmount} onChange={e => setFormData({...formData, electricAmount: e.target.value})} placeholder="Electric (₱)" />
              <input required type="number" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" value={formData.waterAmount} onChange={e => setFormData({...formData, waterAmount: e.target.value})} placeholder="Water (₱)" />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white"><button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-600">Cancel</button><button type="submit" className="px-5 py-2.5 bg-black text-white rounded-lg">Save</button></div>
        </form>
      </div>
    </div>
  );
}

function PropertyCard({ property, onClick }) {
  let evictionWarning = null;
  if (!property.isRentPaid && property.rentUnpaidDate) {
    const daysLeft = calculateDaysRemaining(new Date(property.rentUnpaidDate).setDate(new Date(property.rentUnpaidDate).getDate() + 90));
    evictionWarning = daysLeft <= 0 ? "EVICTION OVERDUE" : `${daysLeft} days to eviction`;
  }

  return (
    <div onClick={onClick} className="bg-white rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all flex flex-col relative overflow-hidden group">
      <div className={`absolute top-0 left-0 w-full h-1.5 z-10 ${!property.isRentPaid ? 'bg-red-500' : 'bg-green-500'}`}></div>
      <div className="h-32 w-full bg-gray-200 relative overflow-hidden">
        {property.imageUrl ? (
          <img src={property.imageUrl} alt={property.propertyName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100"><Icons.ImagePlaceholder /></div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 mb-1 truncate">{property.propertyName}</h3>
        <div className="flex items-center gap-1.5 text-gray-500 mb-4 text-xs font-medium">
          <Icons.User /> <span className="truncate">{property.tenantName}</span>
        </div>
        <div className="space-y-2 mt-auto bg-gray-50 p-3 rounded-lg border border-gray-100">
          <div className="flex justify-between items-center text-sm"><span className="text-gray-600">Rent</span><StatusBadge isPaid={property.isRentPaid} /></div>
          <div className="flex justify-between items-center text-sm"><span className="text-gray-600">Utilities</span><StatusBadge isPaid={property.isElectricPaid && property.isWaterPaid} text={property.isElectricPaid && property.isWaterPaid ? "Paid" : "Pending"} /></div>
        </div>
        {evictionWarning && (
          <div className="bg-red-50 text-red-700 px-2 py-1.5 rounded flex items-center justify-center gap-1 text-[11px] uppercase font-bold w-full mt-3 border border-red-100">
            <Icons.AlertTriangle />{evictionWarning}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ isPaid, text, isDraft }) {
  if (isDraft) {
    return <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold bg-orange-100 text-orange-700 border border-orange-200 animate-pulse`}>PENDING SAVE</span>;
  }
  return <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold ${isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{text || (isPaid ? 'Paid' : 'Unpaid')}</span>;
}

function PropertyDetailModal({ property, onClose, onBulkUpdate, onDelete, onAddLedger, supabase }) {
  const [activeTab, setActiveTab] = useState('finances');
  
  // Safe changes logic for Finances
  const [draftStatus, setDraftStatus] = useState({
    isRentPaid: property.isRentPaid,
    isElectricPaid: property.isElectricPaid,
    isWaterPaid: property.isWaterPaid,
    rentAmount: property.rentAmount,
    electricAmount: property.electricAmount,
    waterAmount: property.waterAmount
  });

  const hasUnsavedChanges = 
    draftStatus.isRentPaid !== property.isRentPaid ||
    draftStatus.isElectricPaid !== property.isElectricPaid ||
    draftStatus.isWaterPaid !== property.isWaterPaid ||
    draftStatus.rentAmount !== property.rentAmount ||
    draftStatus.electricAmount !== property.electricAmount ||
    draftStatus.waterAmount !== property.waterAmount;

  const handleSaveFinances = async () => {
    // Check what was just marked as paid so we can add it to the ledger
    if (draftStatus.isRentPaid && !property.isRentPaid) {
      await onAddLedger(draftStatus.rentAmount, `Rent - ${property.propertyName}`);
    }
    if (draftStatus.isElectricPaid && !property.isElectricPaid) {
      await onAddLedger(draftStatus.electricAmount, `Electric - ${property.propertyName}`);
    }
    if (draftStatus.isWaterPaid && !property.isWaterPaid) {
      await onAddLedger(draftStatus.waterAmount, `Water - ${property.propertyName}`);
    }

    // Save all changes to the property
    await onBulkUpdate(property.id, draftStatus);
  };

  const updateDraft = (field, value) => setDraftStatus(prev => ({...prev, [field]: value}));

  if (!property) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden relative">
        
        {/* Unsaved Changes Floating Bar */}
        {hasUnsavedChanges && activeTab === 'finances' && (
          <div className="absolute top-1/2 right-6 -translate-y-1/2 z-50 bg-white p-4 rounded-xl shadow-2xl border-2 border-orange-400 flex flex-col gap-3 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-2 text-orange-600 font-bold">
              <Icons.AlertTriangle /> Unsaved Changes
            </div>
            <p className="text-sm text-gray-600 w-48">You marked bills differently. Save to finalize and log to Ledger.</p>
            <button onClick={handleSaveFinances} className="bg-black hover:bg-gray-800 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <Icons.Save /> Save Changes
            </button>
            <button onClick={() => setDraftStatus({...property})} className="text-gray-500 text-sm hover:underline">Cancel</button>
          </div>
        )}

        {/* Header Image */}
        <div className="h-40 w-full bg-gray-900 relative shrink-0">
           {property.imageUrl && <img src={property.imageUrl} alt="" className="w-full h-full object-cover opacity-60" />}
           <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
           <div className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold text-white mb-1 drop-shadow-md">{property.propertyName}</h2>
                <div className="flex items-center gap-2 text-gray-300 font-medium text-sm">
                  <Icons.User /><span>{property.tenantName}</span>
                </div>
              </div>
           </div>
           <button onClick={onClose} className="absolute top-4 right-4 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full"><Icons.Close /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 bg-white shrink-0 overflow-x-auto">
          {['finances', 'details', 'documents', 'settings'].map(tab => (
            <button key={tab} className={`pb-4 pt-4 px-4 font-semibold text-sm border-b-2 capitalize whitespace-nowrap ${activeTab === tab ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50 relative">
          {activeTab === 'finances' && (
            <div className="space-y-4 max-w-2xl mx-auto pb-20">
              <BillRow 
                title="Monthly Rent" 
                amount={draftStatus.rentAmount} 
                isPaid={draftStatus.isRentPaid} 
                isDraftChanged={draftStatus.isRentPaid !== property.isRentPaid}
                onToggle={() => updateDraft('isRentPaid', !draftStatus.isRentPaid)} 
                onUpdateAmount={(v) => updateDraft('rentAmount', v)} 
              />
              <BillRow 
                title="Electric Bill" 
                amount={draftStatus.electricAmount} 
                isPaid={draftStatus.isElectricPaid} 
                isDraftChanged={draftStatus.isElectricPaid !== property.isElectricPaid}
                onToggle={() => updateDraft('isElectricPaid', !draftStatus.isElectricPaid)} 
                onUpdateAmount={(v) => updateDraft('electricAmount', v)} 
              />
              <BillRow 
                title="Water Bill" 
                amount={draftStatus.waterAmount} 
                isPaid={draftStatus.isWaterPaid} 
                isDraftChanged={draftStatus.isWaterPaid !== property.isWaterPaid}
                onToggle={() => updateDraft('isWaterPaid', !draftStatus.isWaterPaid)} 
                onUpdateAmount={(v) => updateDraft('waterAmount', v)} 
              />
            </div>
          )}

          {activeTab === 'details' && (
             <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
                <div>
                   <label className="text-xs text-gray-500 font-bold uppercase">Address</label>
                   <p className="text-gray-900 font-medium flex items-center gap-2 mt-1"><Icons.MapPin /> {property.propertyAddress || 'No address provided'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                   <div>
                      <label className="text-xs text-gray-500 font-bold uppercase">Phone 1</label>
                      <p className="text-gray-900 font-medium flex items-center gap-2 mt-1"><Icons.Phone /> {property.tenantPhone || 'N/A'}</p>
                   </div>
                   <div>
                      <label className="text-xs text-gray-500 font-bold uppercase">Phone 2</label>
                      <p className="text-gray-900 font-medium flex items-center gap-2 mt-1"><Icons.Phone /> {property.tenantPhone2 || 'N/A'}</p>
                   </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                   <label className="text-xs text-gray-500 font-bold uppercase">Lease Expiration</label>
                   <p className="text-gray-900 font-medium mt-1">{formatDate(property.leaseEnd)}</p>
                </div>
             </div>
          )}

          {activeTab === 'documents' && (
            <DocumentsTab property={property} onBulkUpdate={onBulkUpdate} supabase={supabase} />
          )}

          {activeTab === 'settings' && (
            <SettingsTab property={property} onBulkUpdate={onBulkUpdate} onDelete={onDelete} supabase={supabase} />
          )}
        </div>
      </div>
    </div>
  );
}

function BillRow({ title, amount, isPaid, isDraftChanged, onToggle, onUpdateAmount }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(amount);
  const handleSave = () => { onUpdateAmount(Number(editValue)); setIsEditing(false); };

  return (
    <div className={`p-5 rounded-xl border flex items-center justify-between shadow-sm transition-colors ${isDraftChanged ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'}`}>
      <div>
        <p className="text-sm font-semibold text-gray-500 uppercase">{title}</p>
        {isEditing ? (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-gray-400 font-bold text-xl">₱</span>
            <input type="number" value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-32 p-1.5 text-xl font-bold border-b-2 border-black outline-none bg-transparent" autoFocus />
            <button onClick={handleSave} className="p-2 bg-black text-white rounded-lg"><Icons.Check /></button>
          </div>
        ) : (
          <div className="flex items-center gap-3 mt-1">
            <p className="text-2xl font-bold text-gray-900">{formatPHP(amount)}</p>
            <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-black bg-gray-100/50 p-1.5 rounded-md"><Icons.Edit /></button>
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 sm:gap-4">
        <StatusBadge isPaid={isPaid} isDraft={isDraftChanged} />
        <button onClick={onToggle} className={`px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors ${isPaid ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-black text-white hover:bg-gray-800'}`}>
          Mark {isPaid ? 'Unpaid' : 'Paid'}
        </button>
      </div>
    </div>
  );
}

function DocumentsTab({ property, onBulkUpdate, supabase }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const docs = property.documents || [];

  const handleDocUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${property.id}_doc_${Date.now()}.${fileExt}`;
    const filePath = `property_files/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage.from('property_files').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('property_files').getPublicUrl(filePath);
      
      const newDoc = { name: file.name, url: publicUrl, date: new Date().toISOString() };
      await onBulkUpdate(property.id, { documents: [...docs, newDoc] });
    } catch (error) {
      alert("Error uploading document.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDoc = async (docUrl) => {
    if(!window.confirm('Delete this document?')) return;
    const newDocs = docs.filter(d => d.url !== docUrl);
    await onBulkUpdate(property.id, { documents: newDocs });
    // Note: To be fully clean, we should also delete from storage bucket here, 
    // but updating the array removes it from the UI.
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
       <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="font-bold text-gray-800 flex items-center gap-2"><Icons.File /> Upload Document</p>
            <p className="text-sm text-gray-500 mt-1">Contracts, IDs, PDFs, or photos.</p>
          </div>
          <input type="file" accept=".pdf,image/*" ref={fileInputRef} onChange={handleDocUpload} className="hidden" />
          <button onClick={() => fileInputRef.current.click()} disabled={isUploading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            {isUploading ? <><Icons.Loader /> Uploading...</> : <><Icons.Upload /> Choose File</>}
          </button>
       </div>

       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50"><h3 className="font-bold text-gray-700">Saved Documents</h3></div>
          {docs.length === 0 ? (
            <p className="p-5 text-gray-500 text-sm text-center">No documents uploaded yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {docs.map((doc, i) => (
                <li key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0"><Icons.File /></div>
                    <div className="min-w-0">
                      <a href={doc.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline truncate block">{doc.name}</a>
                      <p className="text-xs text-gray-500">{formatDate(doc.date)}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteDoc(doc.url)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Icons.Trash /></button>
                </li>
              ))}
            </ul>
          )}
       </div>
    </div>
  );
}

function SettingsTab({ property, onBulkUpdate, onDelete, supabase }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const photoInputRef = useRef(null);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingPhoto(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${property.id}_img_${Date.now()}.${fileExt}`;
    const filePath = `property_images/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage.from('property_files').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('property_files').getPublicUrl(filePath);
      await onBulkUpdate(property.id, { imageUrl: publicUrl });
    } catch (error) {
      alert("Error uploading image.");
      console.error(error);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="font-bold text-gray-800">Property Photo</p>
          <p className="text-sm text-gray-500 mt-1">Upload a real picture for the dashboard header.</p>
        </div>
        <input type="file" accept="image/*" ref={photoInputRef} onChange={handlePhotoUpload} className="hidden" />
        <button onClick={() => photoInputRef.current.click()} disabled={isUploadingPhoto} className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium">
          {isUploadingPhoto ? <><Icons.Loader /> Uploading...</> : <><Icons.Upload /> Upload Picture</>}
        </button>
      </div>

      <div className="bg-red-50 p-5 rounded-xl border border-red-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div><p className="font-bold text-red-900">Delete Property</p><p className="text-sm text-red-700 mt-1">Past revenue remains safely in the All-Time Ledger.</p></div>
          {confirmDelete ? (
            <div className="flex gap-2"><button onClick={() => setConfirmDelete(false)} className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-bold">Cancel</button><button onClick={onDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md">Confirm Delete</button></div>
          ) : (<button onClick={() => setConfirmDelete(true)} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-sm transition-colors">Delete Property</button>)}
      </div>
    </div>
  );
}

// Setup fallback for missing keys
function SetupScreen() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full p-8 rounded-2xl shadow-xl text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icons.Upload />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Supabase Keys Required</h1>
        <p className="text-gray-600 mb-6">
          Paste your Project URL and Publishable Key at the top of <code>App.jsx</code> to unlock the dashboard.
        </p>
      </div>
    </div>
  );
}
