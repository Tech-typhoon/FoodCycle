import React, { useState, useEffect } from 'react';

const listings = [
  { id: 1, title: "Freshly baked sourdough loaves", source: "Green Wheat Bakery", type: "donation", category: "Baked goods", qty: "2 loaves", window: "2 hrs", price: null, location: "Baker St, Sector 4", urgency: "high", tags: ["Baked goods"] },
  { id: 2, title: "Catered biryani and sides", source: "Spice Garden Caterers", type: "discounted", category: "Cooked meals", qty: "8 meal boxes", window: "4 hrs", price: "₹80/box", location: "Event Hall Rd", urgency: "high", tags: ["Cooked meals"] },
  { id: 3, title: "Organic vegetable surplus box", source: "Farm Direct Hub", type: "discounted", category: "Produce", qty: "5 boxes (~3 kg each)", window: "6 hrs", price: "₹150/box", location: "MG Road Market", urgency: "med", tags: ["Produce"] },
  { id: 4, title: "Community pantry share", source: "City Food Bank", type: "community", category: "Mixed", qty: "Open access", window: "Tomorrow 5 PM", price: null, location: "Church Lane, Old Town", urgency: "low", tags: ["Mixed"] },
  { id: 5, title: "Dairy surplus — milk & paneer", source: "Morning Fresh Dairy", type: "donation", category: "Dairy", qty: "4 L milk + 500 g paneer", window: "3 hrs", price: null, location: "Dairy Colony", urgency: "high", tags: ["Dairy"] },
  { id: 6, title: "Restaurant curry portions", source: "Namaste Dhaba", type: "discounted", category: "Cooked meals", qty: "15 portions", window: "Today 9 PM", price: "₹60/portion", location: "Station Road", urgency: "med", tags: ["Cooked meals"] },
  { id: 7, title: "Fruit platter leftovers", source: "Galaxy Events", type: "donation", category: "Produce", qty: "~2 kg mixed fruit", window: "5 hrs", price: null, location: "Event Center, Hill Top", urgency: "med", tags: ["Produce"] },
  { id: 8, title: "Bread & pastry mix", source: "Corner Bakehouse", type: "community", category: "Baked goods", qty: "20+ items", window: "Tomorrow AM", price: null, location: "Market Square", urgency: "low", tags: ["Baked goods"] },
];

function BrowsePanel({ openClaim }) {
  const [filteredListings, setFilteredListings] = useState(listings);
  const [currentFilter, setCurrentFilter] = useState('all');

  useEffect(() => {
    const filtered = currentFilter === 'all' ? listings
      : currentFilter === 'urgent' ? listings.filter(l => l.urgency === 'high')
      : listings.filter(l => l.type === currentFilter);
    setFilteredListings(filtered);
  }, [currentFilter]);

  const urgencyBadge = (u) => {
    if (u === 'high') return <span className="urgency urgency-high"><span className="urgency-dot dot-high"></span>Expiring soon</span>;
    if (u === 'med') return <span className="urgency urgency-med"><span className="urgency-dot dot-med"></span>Today</span>;
    return <span className="urgency urgency-low"><span className="urgency-dot dot-low"></span>Available</span>;
  };

  const typeTag = (t) => {
    if (t === 'donation') return <span className="tag tag-donation">Free / Donation</span>;
    if (t === 'discounted') return <span className="tag tag-discounted">Discounted</span>;
    return <span className="tag tag-community">Community</span>;
  };

  const bannerClass = (t) => {
    if (t === 'donation') return 'banner-donation';
    if (t === 'discounted') return 'banner-discounted';
    return 'banner-community';
  };

  return (
    <div className="panel active">
      <div className="browse-header">
        <div className="search-box">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5.5" stroke="var(--gray-mid)" strokeWidth="1.5"/><path d="M11 11l3 3" stroke="var(--gray-mid)" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <input placeholder="Search food, location, provider..." />
        </div>
        <div className="filter-pills">
          <div className={`pill ${currentFilter === 'all' ? 'active' : ''}`} onClick={() => setCurrentFilter('all')}>All</div>
          <div className={`pill ${currentFilter === 'donation' ? 'active' : ''}`} onClick={() => setCurrentFilter('donation')}>Free / Donation</div>
          <div className={`pill ${currentFilter === 'discounted' ? 'active' : ''}`} onClick={() => setCurrentFilter('discounted')}>Discounted</div>
          <div className={`pill ${currentFilter === 'community' ? 'active' : ''}`} onClick={() => setCurrentFilter('community')}>Community orgs</div>
          <div className={`pill ${currentFilter === 'urgent' ? 'active' : ''}`} onClick={() => setCurrentFilter('urgent')}>Expiring soon</div>
        </div>
      </div>

      <div className="listings-grid">
        {filteredListings.map(l => (
          <div key={l.id} className="card">
            <div className={`card-banner ${bannerClass(l.type)}`}></div>
            <div className="card-body">
              <div className="card-title">{l.title}</div>
              <div className="card-source">{l.source} · {l.location}</div>
              <div className="card-tags">{typeTag(l.type)}<span className="tag tag-type">{l.tags[0]}</span></div>
              <div className="card-meta">
                <div className="meta-item"><span className="meta-label">Quantity</span><span className="meta-value">{l.qty}</span></div>
                <div className="meta-item"><span className="meta-label">Pickup window</span><span className="meta-value">{l.window}</span></div>
              </div>
              <div className="card-footer">
                <div>
                  <div className={`price ${l.price ? 'price-paid' : 'price-free'}`}>{l.price || 'Free'}</div>
                  {urgencyBadge(l.urgency)}
                </div>
                <button className="btn btn-sm btn-claim" onClick={() => openClaim({ title: l.title, provider: l.source, dist: 'nearby', price: l.price || 'Free', until: l.window })}>Claim</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BrowsePanel;