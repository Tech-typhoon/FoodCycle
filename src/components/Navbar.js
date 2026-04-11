import React from 'react';
import { useAuth } from '../context/AuthContext';

function Navbar({ activeTab, switchTab }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    switchTab('browse');
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: '#888780' }}>👤 {user?.displayName || user?.email?.split('@')[0] || 'User'}</span>
          <button className="btn btn-sm btn-primary" onClick={() => switchTab('post')} style={{ marginRight: '8px' }}>+ List food</button>
          <button
            className="btn btn-sm"
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: '1px solid #888780',
              color: '#888780',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;