import React from 'react';

function DashboardPanel() {
  const activeListings = [
    { name: "Evening dal + rice", detail: "8 portions · expires in 3 hrs", status: "live" },
    { name: "Assorted baked goods", detail: "12 items · expires today", status: "live" },
    { name: "Vegetable soup batch", detail: "5 L · claimed by Shelter Home", status: "claimed" },
    { name: "Fruit platter surplus", detail: "3 kg · claimed by Community Org", status: "claimed" },
    { name: "Bread loaves (6)", detail: "Expired yesterday", status: "expired" },
  ];

  const impactData = [
    { label: "Donated to shelters", value: "18 kg", width: "72%" },
    { label: "Sold at discount", value: "21 kg", width: "84%" },
    { label: "Community pantry", value: "8 kg", width: "32%" },
  ];

  return (
    <div className="panel active">
      <div className="dash-grid">
        <div className="stat-card">
          <div className="stat-label">Total listed</div>
          <div className="stat-val stat-green">34</div>
          <div className="stat-sub">food items</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Successfully claimed</div>
          <div className="stat-val stat-teal">28</div>
          <div className="stat-sub">listings</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Food saved</div>
          <div className="stat-val stat-amber">47 kg</div>
          <div className="stat-sub">from waste</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">CO₂ offset</div>
          <div className="stat-val stat-coral">94 kg</div>
          <div className="stat-sub">estimated</div>
        </div>
      </div>

      <div className="dash-two-col">
        <div>
          <div className="section-title">Active listings</div>
          <div style={{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)',borderRadius:'var(--radius)',padding:'14px'}}>
            {activeListings.map((listing, index) => (
              <div key={index} className="listing-row">
                <div className={`listing-dot ${listing.status === 'live' ? 'stat-green' : listing.status === 'claimed' ? 'stat-teal' : 'stat-gray'}`} style={{background: listing.status === 'live' ? 'var(--green-mid)' : listing.status === 'claimed' ? 'var(--teal-mid)' : 'var(--gray-mid)'}}></div>
                <div className="listing-info">
                  <div className="listing-name">{listing.name}</div>
                  <div className="listing-detail">{listing.detail}</div>
                </div>
                <div className={`listing-status status-${listing.status}`}>{listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="section-title">Impact breakdown</div>
          <div style={{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)',borderRadius:'var(--radius)',padding:'14px'}}>
            {impactData.map((bar, index) => (
              <div key={index} className="impact-bar">
                <div className="impact-label"><span>{bar.label}</span><span style={{fontWeight:'500'}}>{bar.value}</span></div>
                <div className="bar-track"><div className={`bar-fill ${index === 0 ? 'bar-teal' : index === 1 ? 'bar-amber' : 'bar-green'}`} style={{width: bar.width}}></div></div>
              </div>
            ))}
            <div style={{marginTop:'14px',paddingTop:'12px',borderTop:'0.5px solid var(--color-border-tertiary)'}}>
              <div className="stat-label" style={{marginBottom:'8px'}}>Recipients served</div>
              <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                <div style={{fontSize:'12px',padding:'5px 10px',borderRadius:'8px',background:'var(--teal-light)',color:'var(--teal)',fontWeight:'500'}}>Shelter Home A</div>
                <div style={{fontSize:'12px',padding:'5px 10px',borderRadius:'8px',background:'var(--green-light)',color:'var(--green)',fontWeight:'500'}}>Green NGO</div>
                <div style={{fontSize:'12px',padding:'5px 10px',borderRadius:'8px',background:'var(--amber-light)',color:'var(--amber)',fontWeight:'500'}}>4 individuals</div>
                <div style={{fontSize:'12px',padding:'5px 10px',borderRadius:'8px',background:'var(--coral-light)',color:'var(--coral)',fontWeight:'500'}}>Food Bank</div>
              </div>
            </div>
          </div>
          <div style={{marginTop:'14px'}}>
            <button className="btn btn-amber btn-sm" style={{width:'100%'}} onClick={() => alert('Get AI tips to improve listings!')}>Get AI tips to improve listings ↗</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPanel;