import React from 'react';

function Navbar({ activeTab, switchTab }) {
  return (
    <nav className="nav">
      <div className="nav-logo">Food<span>Cycle</span></div>
      <div className="nav-tabs">
        <div className={`tab ${activeTab === 'browse' ? 'active' : ''}`} onClick={() => switchTab('browse')}>Browse listings</div>
        <div className={`tab ${activeTab === 'map' ? 'active' : ''}`} onClick={() => switchTab('map')}>Map view</div>
        <div className={`tab ${activeTab === 'post' ? 'active' : ''}`} onClick={() => switchTab('post')}>Post surplus</div>
        <div className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => switchTab('dashboard')}>My dashboard</div>
      </div>
      <div className="nav-action">
        <button className="btn btn-sm btn-primary" onClick={() => switchTab('post')}>+ List food</button>
      </div>
    </nav>
  );
}

export default Navbar;