import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BrowsePanel from './components/BrowsePanel';
import MapPanel from './components/MapPanel';
import PostPanel from './components/PostPanel';
import DashboardPanel from './components/DashboardPanel';
import ClaimModal from './components/ClaimModal';

function App() {
  const [activeTab, setActiveTab] = useState('browse');
  const [modalData, setModalData] = useState(null);

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const openClaim = (data) => {
    setModalData(data);
  };

  const closeModal = () => {
    setModalData(null);
  };

  const renderPanel = () => {
    switch (activeTab) {
      case 'browse':
        return <BrowsePanel openClaim={openClaim} />;
      case 'map':
        return <MapPanel openClaim={openClaim} />;
      case 'post':
        return <PostPanel switchTab={switchTab} />;
      case 'dashboard':
        return <DashboardPanel />;
      default:
        return <BrowsePanel openClaim={openClaim} />;
    }
  };

  return (
    <div className="app">
      <Navbar activeTab={activeTab} switchTab={switchTab} />
      {renderPanel()}
      {modalData && <ClaimModal data={modalData} closeModal={closeModal} />}
    </div>
  );
}

export default App;