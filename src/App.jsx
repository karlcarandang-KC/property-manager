import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// Utility for formatting PHP currency
const formatPHP = (amount) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount || 0);
};

// Utility to calculate days difference
const calculateDaysRemaining = (targetDate) => {
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = target - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

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
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
};

const initialData = [
  {
    id: '1',
    propertyName: 'Block 4 Lot 12 - Villa Maria',
    tenantName: 'Juan Dela Cruz',
    leaseEnd: '2027-01-15',
    rentAmount: 15000,
    isRentPaid: true,
    rentUnpaidDate: null,
    electricAmount: 2450,
    isElectricPaid: false,
    waterAmount: 600,
    isWaterPaid: true,
    documents: []
  },
  {
    id: '2',
    propertyName: 'Apt 2B - Sunrise Bldg',
    tenantName: 'Maria Santos',
    leaseEnd: '2026-10-01',
    rentAmount: 12000,
    isRentPaid: false,
    rentUnpaidDate: new Date(new Date().setDate(new Date().getDate() - 45)).toISOString(), // Unpaid 45 days ago
    electricAmount: 1800,
    isElectricPaid: false,
    waterAmount: 400,
    isWaterPaid: false,
    documents: []
  }
];

export default function App() {
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('property_manager_data');
    return saved ? JSON.parse(saved) : initialData;
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  
  // Custom Toast/Notification state
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem('property_manager_data', JSON.stringify(properties));
  }, [properties]);

  const showNotification = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddProperty = (newProperty) => {
    setProperties([...properties, { ...newProperty, id: Date.now().toString(), documents: [] }]);
    setIsAddModalOpen(false);
    showNotification('Property added successfully!', 'success');
  };

  const handleDeleteProperty = (id) => {
    setProperties(properties.filter(p => p.id !== id));
    setSelectedProperty(null);
    showNotification('Property deleted.', 'info');
  };

  const updatePropertyStatus = (id, field, value) => {
    setProperties(props => props.map(p => {
      if (p.id === id) {
        let updates = { [field]: value };
        
        // Special logic for Rent: Trigger eviction timer if unpaid
        if (field === 'isRentPaid') {
          updates.rentUnpaidDate = value ? null : new Date().toISOString();
        }
        
        return { ...p, ...updates };
      }
      return p;
    }));
  };

  const addDocument = (propertyId, document) => {
    setProperties(props => props.map(p => {
      if (p.id === propertyId) {
        return { ...p, documents: [...(p.documents || []), document] };
      }
      return p;
    }));
    showNotification('Document saved locally.', 'success');
  };

  const deleteDocument = (propertyId, docId) => {
    setProperties(props => props.map(p => {
      if (p.id === propertyId) {
        return { ...p, documents: p.documents.filter(d => d.id !== docId) };
      }
      return p;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-black text-white rounded-lg">
                <Icons.Home />
              </div>
              <span className="font-bold text-xl tracking-tight">Carandang Properties</span>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Summary Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <span className="text-gray-500 text-sm font-medium mb-1">Total Properties</span>
            <span className="text-3xl font-bold">{properties.length}</span>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <span className="text-gray-500 text-sm font-medium mb-1">Total Paid Rent (Profit)</span>
            <span className="text-3xl font-bold text-green-600">
              {formatPHP(properties.filter(p => p.isRentPaid).reduce((sum, p) => sum + Number(p.rentAmount), 0))}
            </span>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <span className="text-gray-500 text-sm font-medium mb-1">Action Required</span>
            <span className="text-3xl font-bold text-orange-500">
              {properties.filter(p => !p.isRentPaid && p.rentUnpaidDate).length}
            </span>
            <span className="text-xs text-gray-400 mt-1">Properties with running eviction timers</span>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Properties</h2>
        </div>
        
        {properties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 mb-4">No properties added yet.</p>
            <button onClick={() => setIsAddModalOpen(true)} className="text-blue-600 font-medium hover:underline">
              Add your first property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                onClick={() => setSelectedProperty(property)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {isAddModalOpen && (
        <AddPropertyModal 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={handleAddProperty} 
        />
      )}

      {selectedProperty && (
        <PropertyDetailModal 
          property={properties.find(p => p.id === selectedProperty.id)} 
          onClose={() => setSelectedProperty(null)}
          onUpdate={updatePropertyStatus}
          onDelete={() => handleDeleteProperty(selectedProperty.id)}
          onAddDocument={addDocument}
          onDeleteDocument={deleteDocument}
        />
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <span>{notification.msg}</span>
        </div>
      )}
    </div>
  );
}

function PropertyCard({ property, onClick }) {
  // Eviction Logic Calculation for summary
  let evictionWarning = null;
  if (!property.isRentPaid && property.rentUnpaidDate) {
    const unpaidDate = new Date(property.rentUnpaidDate);
    const evictionDate = new Date(unpaidDate);
    evictionDate.setDate(evictionDate.getDate() + 90); // 3 months = 90 days
    
    const daysLeft = calculateDaysRemaining(evictionDate);
    
    if (daysLeft <= 0) {
      evictionWarning = "EVICTION OVERDUE";
    } else {
      evictionWarning = `${daysLeft} days to eviction`;
    }
  }

  const isLeaseEndingSoon = calculateDaysRemaining(property.leaseEnd) <= 30;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-shadow flex flex-col relative overflow-hidden"
    >
      {/* Top color bar indicator based on status */}
      <div className={`absolute top-0 left-0 w-full h-1 ${!property.isRentPaid ? 'bg-red-500' : 'bg-green-500'}`}></div>
      
      <h3 className="font-bold text-lg mb-1 truncate">{property.propertyName}</h3>
      <div className="flex items-center gap-2 text-gray-600 mb-4 text-sm">
        <Icons.User />
        <span className="truncate">{property.tenantName}</span>
      </div>

      <div className="space-y-3 mt-auto">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Rent ({formatPHP(property.rentAmount)})</span>
          <StatusBadge isPaid={property.isRentPaid} />
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Electric ({formatPHP(property.electricAmount)})</span>
          <StatusBadge isPaid={property.isElectricPaid} />
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Water ({formatPHP(property.waterAmount)})</span>
          <StatusBadge isPaid={property.isWaterPaid} />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500">Lease Ends:</span>
          <span className={`font-medium ${isLeaseEndingSoon ? 'text-orange-600' : 'text-gray-700'}`}>
            {new Date(property.leaseEnd).toLocaleDateString()}
          </span>
        </div>
        
        {evictionWarning && (
          <div className="bg-red-50 text-red-700 px-2 py-1.5 rounded flex items-center justify-center gap-1 text-xs font-bold w-full mt-2">
            <Icons.AlertTriangle />
            {evictionWarning}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ isPaid }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
      {isPaid ? 'Paid' : 'Unpaid'}
    </span>
  );
}

function AddPropertyModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    propertyName: '',
    tenantName: '',
    leaseEnd: '',
    rentAmount: '',
    electricAmount: '',
    waterAmount: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      isRentPaid: true, // Default new entries to paid to avoid immediate eviction timers
      isElectricPaid: true,
      isWaterPaid: true,
      rentUnpaidDate: null
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold">Add New Property</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><Icons.Close /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Name / Unit</label>
            <input required type="text" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" 
              value={formData.propertyName} onChange={e => setFormData({...formData, propertyName: e.target.value})} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Name</label>
            <input required type="text" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" 
              value={formData.tenantName} onChange={e => setFormData({...formData, tenantName: e.target.value})} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lease Expiration Date</label>
            <input required type="date" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" 
              value={formData.leaseEnd} onChange={e => setFormData({...formData, leaseEnd: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rent (₱)</label>
              <input required type="number" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" 
                value={formData.rentAmount} onChange={e => setFormData({...formData, rentAmount: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Electric (₱)</label>
              <input required type="number" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" 
                value={formData.electricAmount} onChange={e => setFormData({...formData, electricAmount: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Water (₱)</label>
              <input required type="number" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" 
                value={formData.waterAmount} onChange={e => setFormData({...formData, waterAmount: e.target.value})} />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800">Save Property</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PropertyDetailModal({ property, onClose, onUpdate, onDelete, onAddDocument, onDeleteDocument }) {
  const [activeTab, setActiveTab] = useState('finances');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  if (!property) return null;

  // Eviction Calculation for detail view
  let evictionData = null;
  if (!property.isRentPaid && property.rentUnpaidDate) {
    const unpaidDate = new Date(property.rentUnpaidDate);
    const evictionDate = new Date(unpaidDate);
    evictionDate.setDate(evictionDate.getDate() + 90); 
    const daysLeft = calculateDaysRemaining(evictionDate);
    evictionData = { date: evictionDate, daysLeft };
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit (e.g., 2MB) for localStorage constraints
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("File is too large for local browser storage. Please upload files under 2MB.");
      setTimeout(() => setUploadError(''), 4000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      onAddDocument(property.id, {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        dataUrl: event.target.result,
        dateAdded: new Date().toISOString()
      });
    };
    reader.readAsDataURL(file);
  };

  const isLeaseEndingSoon = calculateDaysRemaining(property.leaseEnd) <= 30;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gray-900 text-white p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-1">{property.propertyName}</h2>
            <div className="flex items-center gap-2 text-gray-300">
              <Icons.User />
              <span>{property.tenantName}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1"><Icons.Close /></button>
        </div>

        {/* Warning Banner */}
        {evictionData && (
          <div className="bg-red-500 text-white p-3 px-6 flex items-center gap-3">
            <Icons.AlertTriangle />
            <div>
              <p className="font-bold">EVICTION WARNING ACTIVE</p>
              <p className="text-sm">
                Rent marked unpaid. Eviction notice due on {evictionData.date.toLocaleDateString()} 
                ({evictionData.daysLeft <= 0 ? 'OVERDUE' : `${evictionData.daysLeft} days remaining`}).
              </p>
            </div>
          </div>
        )}
        
        {isLeaseEndingSoon && !evictionData && (
          <div className="bg-orange-500 text-white p-3 px-6 flex items-center gap-3">
            <Icons.AlertTriangle />
            <div>
              <p className="font-bold">LEASE EXPIRING SOON</p>
              <p className="text-sm">Lease ends on {new Date(property.leaseEnd).toLocaleDateString()}.</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 mt-2">
          <button 
            className={`pb-3 pt-3 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'finances' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            onClick={() => setActiveTab('finances')}
          >
            Bills & Finances
          </button>
          <button 
            className={`pb-3 pt-3 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'documents' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </button>
          <button 
            className={`pb-3 pt-3 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'settings' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
          
          {activeTab === 'finances' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg mb-4">Current Billing Cycle</h3>
              
              <BillRow 
                title="Monthly Rent" 
                amount={property.rentAmount} 
                isPaid={property.isRentPaid} 
                onToggle={() => onUpdate(property.id, 'isRentPaid', !property.isRentPaid)} 
                onUpdateAmount={(newAmount) => onUpdate(property.id, 'rentAmount', newAmount)}
              />
              <BillRow 
                title="Electric Bill" 
                amount={property.electricAmount} 
                isPaid={property.isElectricPaid} 
                onToggle={() => onUpdate(property.id, 'isElectricPaid', !property.isElectricPaid)} 
                onUpdateAmount={(newAmount) => onUpdate(property.id, 'electricAmount', newAmount)}
              />
              <BillRow 
                title="Water Bill" 
                amount={property.waterAmount} 
                isPaid={property.isWaterPaid} 
                onToggle={() => onUpdate(property.id, 'isWaterPaid', !property.isWaterPaid)} 
                onUpdateAmount={(newAmount) => onUpdate(property.id, 'waterAmount', newAmount)}
              />
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Property Documents</h3>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept=".pdf,image/*"
                />
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  <Icons.Upload /> Upload File
                </button>
              </div>
              
              <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg mb-4 border border-blue-100">
                <strong>Note:</strong> Files are currently saved in your browser's local memory for demonstration. Avoid uploading massive PDFs to prevent browser lag.
              </div>

              {uploadError && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 border border-red-200">
                  {uploadError}
                </div>
              )}

              {(!property.documents || property.documents.length === 0) ? (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                  <Icons.FileText />
                  <p className="text-gray-500 mt-2 text-sm">No documents uploaded yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.documents.map(doc => (
                    <div key={doc.id} className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-gray-100 rounded text-gray-500">
                          <Icons.FileText />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-medium truncate">{doc.name}</p>
                          <p className="text-xs text-gray-500">{new Date(doc.dateAdded).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a 
                          href={doc.dataUrl} 
                          download={doc.name}
                          className="text-blue-600 hover:bg-blue-50 p-1.5 rounded"
                          title="Download"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        </a>
                        <button 
                          onClick={() => onDeleteDocument(property.id, doc.id)}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded"
                        >
                          <Icons.Trash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-2">Lease Contract</h3>
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Contract End Date</p>
                  <input 
                    type="date" 
                    value={property.leaseEnd}
                    onChange={(e) => onUpdate(property.id, 'leaseEnd', e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2 text-red-600">Danger Zone</h3>
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-red-800 text-sm">Delete Property</p>
                    <p className="text-xs text-red-600">This action cannot be undone.</p>
                  </div>
                  {confirmDelete ? (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setConfirmDelete(false)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded-lg text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => onDelete()}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
                      >
                        Yes, Delete
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setConfirmDelete(true)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>
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

  const handleSave = () => {
    onUpdateAmount(Number(editValue));
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between">
      <div>
        <p className="font-medium text-gray-800">{title}</p>
        {isEditing ? (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-500 font-bold">₱</span>
            <input 
              type="number" 
              value={editValue} 
              onChange={(e) => setEditValue(e.target.value)}
              className="w-24 p-1 text-lg font-bold border border-gray-300 rounded outline-none focus:border-black"
              autoFocus
            />
            <button onClick={handleSave} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
              <Icons.Check />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-1">
            <p className="text-lg font-bold">{formatPHP(amount)}</p>
            <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-gray-700 transition-colors" title="Edit Amount">
              <Icons.Edit />
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge isPaid={isPaid} />
        <button 
          onClick={onToggle}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isPaid 
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          Mark as {isPaid ? 'Unpaid' : 'Paid'}
        </button>
      </div>
    </div>
  );
}