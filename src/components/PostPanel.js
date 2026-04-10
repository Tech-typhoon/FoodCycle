import React, { useState } from 'react';

function PostPanel({ switchTab }) {
  const [selectedType, setSelectedType] = useState('donation');
  const [showSuccess, setShowSuccess] = useState(false);
  const [freshnessWindow, setFreshnessWindow] = useState('Within 2 hours');
  const [customFreshness, setCustomFreshness] = useState('');

  const selectType = (type) => {
    setSelectedType(type);
  };

  const handleFreshnessChange = (e) => {
    setFreshnessWindow(e.target.value);
    if (e.target.value !== 'Custom') {
      setCustomFreshness('');
    }
  };

  const submitListing = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      switchTab('browse');
    }, 2500);
  };

  return (
    <div className="panel active">
      <div className="post-form">
        <div className="form-title">List surplus food</div>
        <div className="form-subtitle">Help reduce waste. Share details about what you have and when it's available for pickup.</div>

        <div className={`success-msg ${showSuccess ? 'show' : ''}`}>
          <h3>Listing posted!</h3>
          <p>Your surplus food has been listed. Nearby users and orgs will be notified.</p>
        </div>

        <div id="post-form-fields" style={{display: showSuccess ? 'none' : 'block'}}>
          <div className="form-section">
            <div className="field">
              <label>Listing type</label>
              <div className="type-selector">
                <div className={`type-opt ${selectedType === 'donation' ? 'selected' : ''}`} onClick={() => selectType('donation')}>
                  <span className="opt-icon">🤲</span>Free / Donation
                </div>
                <div className={`type-opt ${selectedType === 'discounted' ? 'selected' : ''}`} onClick={() => selectType('discounted')}>
                  <span className="opt-icon">🏷️</span>Discounted sale
                </div>
                <div className={`type-opt ${selectedType === 'community' ? 'selected' : ''}`} onClick={() => selectType('community')}>
                  <span className="opt-icon">🏛️</span>Community org
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="field-group">
              <div className="field">
                <label>Food item name</label>
                <input placeholder="e.g. Vegetable biryani" />
              </div>
              <div className="field">
                <label>Food category</label>
                <select>
                  <option>Cooked meals</option>
                  <option>Baked goods</option>
                  <option>Produce / vegetables</option>
                  <option>Dairy products</option>
                  <option>Packaged / pantry</option>
                  <option>Beverages</option>
                  <option>Mixed / assorted</option>
                </select>
              </div>
            </div>
            <div className="field-group">
              <div className="field">
                <label>Quantity</label>
                <input placeholder="e.g. 10 portions, 3 kg" />
              </div>
              <div className="field">
                <label>Freshness window</label>
                <select value={freshnessWindow} onChange={handleFreshnessChange}>
                  <option>Within 2 hours</option>
                  <option>Within 4 hours</option>
                  <option>Today only</option>
                  <option>Until tomorrow</option>
                  <option>2–3 days</option>
                  <option>Custom</option>
                </select>
                {freshnessWindow === 'Custom' && (
                  <input
                    type="text"
                    placeholder="e.g. Within 6 hours, Until Friday"
                    value={customFreshness}
                    onChange={(e) => setCustomFreshness(e.target.value)}
                    style={{marginTop: '8px'}}
                  />
                )}
              </div>
            </div>
            <div className="field">
              <label>Description / notes</label>
              <textarea rows="2" placeholder="Ingredients, allergens, packaging, storage info..."></textarea>
            </div>
          </div>

          <div className="form-section">
            <div className="field-group">
              <div className="field">
                <label>Pickup location</label>
                <input placeholder="Address or landmark" />
              </div>
              <div className="field">
                <label>Pickup window</label>
                <input placeholder="e.g. 3 PM – 6 PM today" />
              </div>
            </div>
            <div className="field-group">
              <div className="field">
                <label>Your name / org</label>
                <input placeholder="Restaurant, store, or your name" />
              </div>
              <div className="field">
                <label>Contact</label>
                <input placeholder="Phone or email" />
              </div>
            </div>
            {selectedType === 'discounted' && (
              <div className="field" id="price-field">
                <label>Discounted price</label>
                <input placeholder="e.g. ₹50 per box" />
              </div>
            )}
          </div>

          <button className="btn btn-primary" style={{width:'100%',padding:'11px'}} onClick={submitListing}>Post listing</button>
        </div>
      </div>
    </div>
  );
}

export default PostPanel;