import React from 'react';

function FeatureModal({ title, desc, onClose }) {
  return (
    <div className="modal show" style={{ zIndex: 5000 }}>
      <div className="modal-content subscription-modal" style={{ maxWidth: 760 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="neon-heading">{title}</div>
            <p className="lead" style={{ marginTop: 6 }}>{desc}</p>
          </div>
          <div>
            <button className="btn" onClick={() => onClose && onClose()}>إغلاق</button>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <p style={{ color: 'rgba(255,255,255,0.9)' }}>هذه ميزة تتيح لك: {desc}. يمكنك تجربتها أو الاشتراك للوصول الكامل.</p>
        </div>
      </div>
    </div>
  );
}

export default FeatureModal;
