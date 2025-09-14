import React from 'react';
import { FaStar, FaRocket, FaCrown } from 'react-icons/fa';

const plans = [
  { price: 50, title: 'Basic', icon: <FaStar style={{ color: '#ffb300', fontSize: 26 }} />, features: ['رفع 20 صورة للمشكلة شهرياً', 'دعم فني ذكي للنص والصورة', 'أولوية في الردود'], payUrl: 'https://paymob.xyz/yatWnT9T/' },
  { price: 100, title: 'Pro', icon: <FaRocket style={{ color: '#8cff6b', fontSize: 26 }} />, features: ['رفع حتى 30 صورة شهرياً', 'تحليل متقدم للصور', 'دعم فني مباشر', 'أولوية عالية في الردود'], payUrl: 'https://pay.example.com/pro' },
  { price: 150, title: 'VIP', icon: <FaCrown style={{ color: '#ffb300', fontSize: 28 }} />, features: ['رفع صور غير محدود شهرياً', 'تحليل فوري للصور', 'دعم فني خاص', 'استشارات هاتفية', 'تواصل مع فنيين متخصصين', 'أولوية قصوى في الردود'], payUrl: 'https://pay.example.com/vip' },
];

function SubscriptionPopup({ lang, onClose }) {
  return (
    <div className="modal show" style={{ zIndex: 4500 }}>
      <div className="modal-content subscription-modal" style={{ maxWidth: 960 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="neon-heading">اشترك واحصل على ميزات مميزة</div>
            <p className="lead">استمتع بتحليل متقدم، رفع صور غير محدود، ودعم فني أولوية للمشتركين.</p>
          </div>
          <div>
            <button className="btn" onClick={() => onClose && onClose(null)}>إغلاق</button>
          </div>
        </div>

        <div className="subscription-grid" style={{ marginTop: 18 }}>
          {plans.map((p, i) => (
            <div key={i} className="sub-card" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="title" style={{ color: '#fff' }}>{p.title}</div>
                  <div className="price">{p.price} EGP</div>
                </div>
                <div>{p.icon}</div>
              </div>
              <div className="features" style={{ marginTop: 10 }}>
                {p.features.map((f, idx) => <div key={idx}>• {f}</div>)}
              </div>
              <div className="sub-actions" style={{ marginTop: 12 }}>
                <a className="neon-cta" href={p.payUrl} target="_blank" rel="noreferrer">اشترك</a>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center' }}>
          <small style={{ color: 'rgba(255,255,255,0.7)' }}>ضمان استرداد خلال ٧ أيام | تواصل معنا للدعم</small>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPopup;
