import React, { useState, useEffect, useRef } from 'react';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ============================================================================
// 🛑 PASTE YOUR SUPABASE KEYS HERE 🛑
// ============================================================================
const supabaseUrl = 'https://oxjhxvqatokgbmbgqhey.supabase.co'; 
const supabaseKey = 'sb_publishable_sR0hAU9cLY--PzewO2SLsQ_mF3pzlmb'; 

// --- Supabase Initialization ---
const isConfigured = true;
let supabase;
if (isConfigured) {
  supabase = createClient(supabaseUrl, supabaseKey);
}
// ============================================================================

// Utility Functions
const formatPHP = (amount) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount || 0);
};

const calculateDaysRemaining = (targetDate) => {
  if (!targetDate) return 0;
  const today = new Date();
  const target = new Date(targetDate);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
};

// SVG Icons Dictionary
const Icons = {
  Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  FileText: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>,
  Upload: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  AlertTriangle: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Close: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  ImagePlaceholder: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Loader: () => <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
};

// --- Main Application Component ---
export default function App() {
  if (!isConfigured) {
    return <SetupScreen />;
  }

  const [properties, setProperties] = useState([]);
  const [allTimeProfit, setAllTimeProfit] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
        setAllTimeProfit(ledgerData.data.allTimeProfit || 0);
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

  // Property Handlers
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
    showNotification('Property deleted permanently.', 'info');

    await supabase.from('properties').delete().eq('id', id);
  };

  const updatePropertyStatus = async (id, field, value) => {
    const propertyToUpdate = properties.find(p => p.id === id);
    if (!propertyToUpdate) return;

    const updatedData = { ...propertyToUpdate, [field]: value };
    if (field === 'isRentPaid') {
      updatedData.rentUnpaidDate = value ? null : new Date().toISOString();
    }

    setProperties(prev => prev.map(p => p.id === id ? updatedData : p));
    if (selectedProperty && selectedProperty.id === id) {
      setSelectedProperty(updatedData);
    }

    const { id: _, ...dbData } = updatedData;
    await supabase.from('properties').update({ data: dbData }).eq('id', id);
  };

  // Ledger Logic
  const handleSimulateMonthEnd = async () => {
    const currentMonthRentCollected = properties
      .filter(p => p.isRentPaid)
      .reduce((sum, p) => sum + Number(p.rentAmount), 0);

    if (currentMonthRentCollected === 0) {
      showNotification('No paid rent to collect this month.', 'info');
      return;
    }

    const newAllTimeProfit = allTimeProfit + currentMonthRentCollected;
    
    setAllTimeProfit(newAllTimeProfit);
    await supabase.from('ledger').update({ data: { allTimeProfit: newAllTimeProfit } }).eq('id', 1);

    const updatedProperties = properties.map(p => ({
      ...p,
      isRentPaid: false,
      isElectricPaid: false,
      isWaterPaid: false,
      rentUnpaidDate: new Date().toISOString()
    }));
    setProperties(updatedProperties);

    for (const p of updatedProperties) {
      const { id, ...dbData } = p;
      await supabase.from('properties').update({ data: dbData }).eq('id', id);
    }

    showNotification(`Month ended! ₱${currentMonthRentCollected.toLocaleString()} added to Ledger.`, 'success');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Icons.Loader /> <span className="ml-2 font-medium">Connecting to Cloud...</span></div>;
  }

  // Main UI Render
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-black text-white rounded-lg">
                <Icons.Home />
              </div>
              <span className="font-bold text-xl tracking-tight">Carandang Properties</span>
            </div>
            <div className="flex items-center gap-3">
               <button 
                onClick={handleSimulateMonthEnd}
                className="hidden sm:flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-300"
              >
                Simulate Month End
              </button>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Icons.Plus />
                <span className="hidden sm:inline">Add Property</span>
              </button>
            </div>
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

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Icons.Home /></div>
            <span className="text-gray-600 text-sm font-medium mb-2 flex items-center gap-2">
              All-Time Profit (Ledger)
              <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold">CLOUD SAVED</span>
            </span>
            <span className="text-3xl font-bold text-green-700">
              {formatPHP(allTimeProfit)}
            </span>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col lg:col-span-1 md:col-span-2">
            <span className="text-gray-600 text-sm font-medium mb-2">Action Required</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-orange-500">
                {properties.filter(p => !p.isRentPaid && p.rentUnpaidDate).length}
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

      {isAddModalOpen && <AddPropertyModal onClose={() => setIsAddModalOpen(false)} onAdd={handleAddProperty} />}

      {selectedProperty && (
        <PropertyDetailModal 
          property={properties.find(p => p.id === selectedProperty.id)} 
          onClose={() => setSelectedProperty(null)}
          onUpdate={updatePropertyStatus}
          onDelete={() => handleDeleteProperty(selectedProperty.id)}
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

// --- Setup Screen ---
function SetupScreen() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full p-8 rounded-2xl shadow-xl text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icons.Upload />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cloud Database Not Connected</h1>
        <p className="text-gray-600 mb-6">
          Please follow the <strong>Supabase Setup Guide</strong> to generate your API keys. Paste them at the top of <code>App.jsx</code> to unlock File Uploads and the All-Time Ledger.
        </p>
      </div>
    </div>
  );
}

// --- Components ---
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

function StatusBadge({ isPaid, text }) {
  return <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold ${isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{text || (isPaid ? 'Paid' : 'Unpaid')}</span>;
}

function AddPropertyModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({ propertyName: '', tenantName: '', leaseEnd: '', rentAmount: '', electricAmount: '', waterAmount: '' });
  const handleSubmit = (e) => { e.preventDefault(); onAdd(formData); };
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold">Add New Property</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800"><Icons.Close /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <input required type="text" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" value={formData.propertyName} onChange={e => setFormData({...formData, propertyName: e.target.value})} placeholder="Property Name / Unit" />
          <input required type="text" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" value={formData.tenantName} onChange={e => setFormData({...formData, tenantName: e.target.value})} placeholder="Tenant Name" />
          <input required type="date" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" value={formData.leaseEnd} onChange={e => setFormData({...formData, leaseEnd: e.target.value})} />
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="col-span-2"><input required type="number" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none text-lg font-bold" value={formData.rentAmount} onChange={e => setFormData({...formData, rentAmount: e.target.value})} placeholder="Rent (₱)" /></div>
            <input required type="number" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" value={formData.electricAmount} onChange={e => setFormData({...formData, electricAmount: e.target.value})} placeholder="Electric (₱)" />
            <input required type="number" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" value={formData.waterAmount} onChange={e => setFormData({...formData, waterAmount: e.target.value})} placeholder="Water (₱)" />
          </div>
          <div className="pt-4 flex justify-end gap-3"><button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-600">Cancel</button><button type="submit" className="px-5 py-2.5 bg-black text-white rounded-lg">Save</button></div>
        </form>
      </div>
    </div>
  );
}

function PropertyDetailModal({ property, onClose, onUpdate, onDelete }) {
  const [activeTab, setActiveTab] = useState('finances');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const photoInputRef = useRef(null);

  if (!property) return null;

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingPhoto(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${property.id}_${Date.now()}.${fileExt}`;
    const filePath = `property_images/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('property_files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('property_files')
        .getPublicUrl(filePath);

      await onUpdate(property.id, 'imageUrl', publicUrl);
    } catch (error) {
      alert("Error uploading image. Did you make the bucket public in Supabase?");
      console.error(error);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        <div className="h-48 w-full bg-gray-900 relative">
           {property.imageUrl && <img src={property.imageUrl} alt="" className="w-full h-full object-cover opacity-60" />}
           <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
           <div className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold text-white mb-1 drop-shadow-md">{property.propertyName}</h2>
                <div className="flex items-center gap-2 text-gray-300 font-medium"><Icons.User /><span>{property.tenantName}</span></div>
              </div>
           </div>
           <button onClick={onClose} className="absolute top-4 right-4 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full"><Icons.Close /></button>
        </div>

        <div className="flex border-b border-gray-200 px-6 bg-white z-10">
          {['finances', 'settings'].map(tab => (
            <button key={tab} className={`pb-4 pt-4 px-4 font-semibold text-sm border-b-2 capitalize ${activeTab === tab ? 'border-black text-black' : 'border-transparent text-gray-500'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
          {activeTab === 'finances' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <BillRow title="Monthly Rent" amount={property.rentAmount} isPaid={property.isRentPaid} onToggle={() => onUpdate(property.id, 'isRentPaid', !property.isRentPaid)} onUpdateAmount={(v) => onUpdate(property.id, 'rentAmount', v)} />
              <BillRow title="Electric Bill" amount={property.electricAmount} isPaid={property.isElectricPaid} onToggle={() => onUpdate(property.id, 'isElectricPaid', !property.isElectricPaid)} onUpdateAmount={(v) => onUpdate(property.id, 'electricAmount', v)} />
              <BillRow title="Water Bill" amount={property.waterAmount} isPaid={property.isWaterPaid} onToggle={() => onUpdate(property.id, 'isWaterPaid', !property.isWaterPaid)} onUpdateAmount={(v) => onUpdate(property.id, 'waterAmount', v)} />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">Property Photo</p>
                  <p className="text-sm text-gray-500 mt-1">Upload a real picture from your computer.</p>
                </div>
                <input type="file" accept="image/*" ref={photoInputRef} onChange={handlePhotoUpload} className="hidden" />
                <button onClick={() => photoInputRef.current.click()} disabled={isUploadingPhoto} className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  {isUploadingPhoto ? <><Icons.Loader /> Uploading...</> : <><Icons.Upload /> Upload Picture</>}
                </button>
              </div>

              <div className="bg-red-50 p-5 rounded-xl border border-red-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div><p className="font-bold text-red-900">Delete Property</p><p className="text-sm text-red-700 mt-1">Past revenue remains safely in the All-Time Ledger.</p></div>
                  {confirmDelete ? (
                    <div className="flex gap-2"><button onClick={() => setConfirmDelete(false)} className="bg-white border border-gray-300 px-4 py-2 rounded-lg">Cancel</button><button onClick={onDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg">Confirm Delete</button></div>
                  ) : (<button onClick={() => setConfirmDelete(true)} className="bg-red-600 text-white px-5 py-2 rounded-lg">Delete</button>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BillRow({ title, amount, isPaid, onToggle, onUpdateAmount }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(amount);
  const handleSave = () => { onUpdateAmount(Number(editValue)); setIsEditing(false); };

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm">
      <div>
        <p className="text-sm font-semibold text-gray-500 uppercase">{title}</p>
        {isEditing ? (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-gray-400 font-bold text-xl">₱</span>
            <input type="number" value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-32 p-1.5 text-xl font-bold border-b-2 border-black outline-none bg-gray-50" autoFocus />
            <button onClick={handleSave} className="p-2 bg-black text-white rounded-lg"><Icons.Check /></button>
          </div>
        ) : (
          <div className="flex items-center gap-3 mt-1">
            <p className="text-2xl font-bold text-gray-900">{formatPHP(amount)}</p>
            <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-black bg-gray-100 p-1.5 rounded-md"><Icons.Edit /></button>
          </div>
        )}
      </div>
      <div className="flex gap-4">
        <StatusBadge isPaid={isPaid} />
        <button onClick={onToggle} className={`px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm ${isPaid ? 'bg-white border border-gray-300 text-gray-700' : 'bg-black text-white'}`}>
          Mark {isPaid ? 'Unpaid' : 'Paid'}
        </button>
      </div>
    </div>
  );
}
