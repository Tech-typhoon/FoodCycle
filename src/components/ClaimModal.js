import React, { useState } from 'react';

function ClaimModal({ data, closeModal }) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');

  const confirmClaim = () => {
    if (!name.trim() || !mobile.trim() || !address.trim()) {
      alert('Please fill in all required fields.');
      return;
    }
    alert(`Claim confirmed! Check your contact for pickup details.\n\nName: ${name}\nMobile: ${mobile}\nAddress: ${address}`);
    closeModal();
  };

  return (
    <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{data.title}</div>
          <button className="modal-close" onClick={closeModal}>×</button>
        </div>
        <div className="modal-section">
          <div className="modal-field"><span className="modal-label">Provider</span><span className="modal-value">{data.provider}</span></div>
          <div className="modal-field"><span className="modal-label">Distance</span><span className="modal-value">{data.dist}</span></div>
          <div className="modal-field"><span className="modal-label">Price</span><span className="modal-value">{data.price}</span></div>
          <div className="modal-field"><span className="modal-label">Available until</span><span className="modal-value">{data.until}</span></div>
        </div>
        <div className="modal-note">Food safety reminder: inspect items at pickup. Consume cooked food within the freshness window.</div>
        <div className="field" style={{marginBottom:'12px'}}>
          <label style={{fontSize:'12px',fontWeight:'500',color:'var(--color-text-secondary)',textTransform:'uppercase',letterSpacing:'0.04em',display:'block',marginBottom:'5px'}}>Your name</label>
          <input style={{fontFamily:'var(--font-body)',fontSize:'13px',padding:'9px 12px',border:'0.5px solid var(--color-border-tertiary)',borderRadius:'var(--radius-sm)',background:'var(--color-background-primary)',color:'var(--color-text-primary)',width:'100%',outline:'none'}} placeholder="Enter your name or org" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field" style={{marginBottom:'12px'}}>
          <label style={{fontSize:'12px',fontWeight:'500',color:'var(--color-text-secondary)',textTransform:'uppercase',letterSpacing:'0.04em',display:'block',marginBottom:'5px'}}>Mobile number</label>
          <input style={{fontFamily:'var(--font-body)',fontSize:'13px',padding:'9px 12px',border:'0.5px solid var(--color-border-tertiary)',borderRadius:'var(--radius-sm)',background:'var(--color-background-primary)',color:'var(--color-text-primary)',width:'100%',outline:'none'}} placeholder="Enter your mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        </div>
        <div className="field" style={{marginBottom:'12px'}}>
          <label style={{fontSize:'12px',fontWeight:'500',color:'var(--color-text-secondary)',textTransform:'uppercase',letterSpacing:'0.04em',display:'block',marginBottom:'5px'}}>Address</label>
          <textarea style={{fontFamily:'var(--font-body)',fontSize:'13px',padding:'9px 12px',border:'0.5px solid var(--color-border-tertiary)',borderRadius:'var(--radius-sm)',background:'var(--color-background-primary)',color:'var(--color-text-primary)',width:'100%',outline:'none',resize:'vertical',minHeight:'60px'}} placeholder="Enter your pickup address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="modal-actions">
          <button className="btn" style={{flex:1}} onClick={closeModal}>Cancel</button>
          <button className="btn btn-claim" style={{flex:2}} onClick={confirmClaim}>Confirm claim</button>
        </div>
      </div>
    </div>
  );
}

export default ClaimModal;