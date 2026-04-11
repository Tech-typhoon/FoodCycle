import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import BrowsePanel from './components/BrowsePanel';
import MapPanel from './components/MapPanel';
import PostPanel from './components/PostPanel';
import DashboardPanel from './components/DashboardPanel';
import ClaimModal from './components/ClaimModal';
import AuthPage from './pages/AuthPage';
import ClaimStatusPage from './pages/ClaimStatusPage';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [modalData, setModalData] = useState(null);
  const [claimStatusData, setClaimStatusData] = useState(null);

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const openClaim = (data) => {
    if (!user) {
      alert('Please sign in to claim food items.');
      setActiveTab('auth');
      return;
    }
    setModalData(data);
  };

  const closeModal = () => {
    setModalData(null);
  };

  const handleClaimSuccess = (claimData) => {
    setClaimStatusData(claimData);
    setActiveTab('claim-status');
  };

  const renderPanel = () => {
    if (!user) {
      return <AuthPage onSuccess={() => setActiveTab('browse')} />;
    }

    switch (activeTab) {
      case 'browse':
        return <BrowsePanel openClaim={openClaim} />;
      case 'map':
        return <MapPanel openClaim={openClaim} />;
      case 'post':
        return <PostPanel switchTab={switchTab} />;
      case 'dashboard':
        return <DashboardPanel />;
      case 'claim-status':
        return (
          <ClaimStatusPage
            claimData={claimStatusData}
            onClose={() => setActiveTab('browse')}
          />
        );
      default:
        return <BrowsePanel openClaim={openClaim} />;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f7f6f2' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌾</div>
          <p style={{ color: '#888780' }}>Loading FoodCycle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {user && <Navbar activeTab={activeTab} switchTab={switchTab} />}
      {renderPanel()}
      {modalData && (
        <ClaimModal
          data={modalData}
          closeModal={closeModal}
          onClaimSuccess={handleClaimSuccess}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}