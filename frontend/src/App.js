import React, { useState, useEffect } from 'react';
import DeviceSelector from './components/DeviceSelector';
import AndroidVersionSelector from './components/AndroidVersionSelector';
import AuthPopup from './components/AuthPopup';
import SubscriptionPopup from './components/SubscriptionPopup';
import FeatureModal from './components/FeatureModal';
import './index.css';

const steps = [
  { title: { ar: 'ابدأ التشخيص الذكي', en: 'Start Smart Diagnosis' }, desc: { ar: 'اختر جهازك واصدار الأندرويد والمشكلة', en: 'Select your device, Android version, and issue' } },
];

function App() {
  const [lang] = useState('ar');
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } });
  const [showAuth, setShowAuth] = useState(false);
  const [showSub, setShowSub] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [androidVersion, setAndroidVersion] = useState('');
  const [problemText, setProblemText] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [toast, setToast] = useState({ msg: '', show: false });
  const [activeFeature, setActiveFeature] = useState(null);

  // helper
  const isSubscribed = !!(user && user.plan && user.plan !== 'free');

  useEffect(() => { if (toast.show) { const t = setTimeout(() => setToast(s => ({ ...s, show: false })), 3200); return () => clearTimeout(t); } }, [toast.show]);
  const showToast = (msg) => setToast({ msg, show: true });

  useEffect(() => { if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user'); }, [user]);

  const handleAuthClose = (u) => { setShowAuth(false); if (u) { setUser(u); showToast('تم تسجيل الدخول باسم ' + (u.name || u.email)); } };
  const handleLogout = () => { localStorage.removeItem('user'); setUser(null); showToast('تم تسجيل الخروج'); setShowAuth(true); };

  const handleDeviceSelect = (d) => { setSelectedDevice(d); showToast('تم اختيار الجهاز: ' + (d.model || d.brand || '')); };

  const handleAskAI = async () => {
    setAiReply('');
    if (!problemText.trim()) { showToast('من فضلك اكتب المشكلة'); return; }
    if (!selectedDevice || !androidVersion) { showToast('الرجاء اختيار الجهاز واصدار الأندرويد'); return; }
    setLoadingAI(true);
    try {
      const res = await fetch('http://localhost:5000/api/ask-ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: problemText.trim(), device: selectedDevice.model, androidVersion }) });
      if (!res.ok) { const err = await res.text().catch(() => ''); throw new Error(err || ('Server ' + res.status)); }
      const data = await res.json();
      setAiReply(data.reply || data.answer || 'لم يصل رد من الذكاء الاصطناعي');
    } catch (err) {
      console.error('ask-ai error', err);
      setAiReply('حدث خطأ أثناء الاتصال بخدمة الذكاء الاصطناعي. تأكد من تشغيل backend وتهيئة GEN_API_KEY.');
    } finally { setLoadingAI(false); }
  };

  // Example features to display on homepage; some locked for subscribers
  const features = [
    { id: 'f1', title: 'تشخيص نصي متقدم', desc: 'تحليل المشكلة واقتراح خطوات إصلاح واضحة', locked: false },
    { id: 'f2', title: 'رفع صور المشكلة', desc: 'ارفع صوراً لتحديد العطل بدقة', locked: true },
    { id: 'f3', title: 'تحليل فني للوحة الجهاز', desc: 'تحليل اعطال عميقة بناءً على الصورة', locked: true },
    { id: 'f4', title: 'سجلات الحلول السابقة', desc: 'قاعدة حلول ومشاكل سابقة مع خطوات إصلاح', locked: false },
    { id: 'f5', title: 'دعم فني مباشر', desc: 'تواصل مع فنيين مختصين عبر الدردشة أو المكالمة', locked: true },
    { id: 'f6', title: 'منتدى المجتمع', desc: 'شارك مشكلتك أو خبرتك مع مستخدمين آخرين واحصل على حلول جماعية', locked: false },
    { id: 'f7', title: 'دروس فيديو تعليمية', desc: 'شاهد فيديوهات إصلاح الأعطال خطوة بخطوة', locked: false },
    { id: 'f8', title: 'معالج الأعطال التفاعلي', desc: 'أجب عن أسئلة وسيتم توجيهك لحل مناسب تلقائياً', locked: true },
    { id: 'f9', title: 'فحص توافق الجهاز', desc: 'تحقق من توافق جهازك مع أحدث التطبيقات والأنظمة', locked: false },
    { id: 'f10', title: 'دعم بريميوم فوري', desc: 'ردود أسرع وحلول مخصصة للمشتركين', locked: true },
    { id: 'f11', title: 'مكتبة حلول الذكاء الاصطناعي', desc: 'استعرض حلول الذكاء الاصطناعي لمشاكل شائعة', locked: false },
    { id: 'f12', title: 'توصيات تحديثات النظام', desc: 'احصل على نصائح حول تحديثات الأندرويد الأنسب لجهازك', locked: false },
    { id: 'f13', title: 'تواصل مع خبراء الصيانة', desc: 'احجز جلسة استشارة مع فنيين متخصصين', locked: true },
  ];

  return (
    <div className="gradient-bg container">
      <header className="header" style={{paddingBottom:8}}>
        <div style={{textAlign:'center'}}>
          <div className="site-title neon" style={{fontSize:52,lineHeight:1}}>MaroPhone-AI</div>
          <div style={{marginTop:8,display:'flex',justifyContent:'center',gap:12,alignItems:'center'}}>
            {user ? (
              <div className="account-wrap" style={{display:'flex',gap:12,alignItems:'center'}}>
                <button className="account-btn" onClick={() => setShowAccountMenu(s => !s)}>{user.name || user.email}</button>
                <button className="btn" onClick={() => setShowSub(true)}>{isSubscribed ? 'مشترك' : 'غير مشترك'}</button>
                {showAccountMenu && (
                  <div className="account-toast">
                    <button className="close-x" onClick={() => setShowAccountMenu(false)}>✕</button>
                    <div style={{padding:8}}><strong style={{display:'block',marginBottom:6}}>الخطة الحالية:</strong><div style={{color:'#fff',fontWeight:700}}>{user.plan || 'غير مشترك'}</div></div>
                    <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:8,padding:'0 8px 12px 8px'}}>
                      <button className="btn" onClick={() => { showToast('ميزة تغيير كلمة المرور مؤقتة'); setShowAccountMenu(false); }}>تغيير كلمة المرور</button>
                      <button className="btn" onClick={() => { showToast('أضف صورة (مؤقت)'); setShowAccountMenu(false); }}>إضافة صورة</button>
                      <button className="btn" onClick={() => { showToast('أضف رقم الهاتف (مؤقت)'); setShowAccountMenu(false); }}>إضافة رقم الهاتف</button>
                      <button className="btn" onClick={() => { handleLogout(); setShowAccountMenu(false); }}>تسجيل الخروج</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <button className="btn" onClick={() => setShowAuth(true)}>تسجيل / إنشاء حساب</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="app-shell">
        <section className="panel">
          <h2 style={{ marginTop: 0, color: '#fff', textShadow: '0 0 12px rgba(255,255,255,0.06), 0 0 30px rgba(0,229,255,0.06)' }}>{steps[0].title[lang]}</h2>
          <p style={{ opacity: 0.95, color: '#eaffff', fontWeight:700 }}>{steps[0].desc[lang]}</p>

          <DeviceSelector lang={lang} onSelect={handleDeviceSelect} selectedDevice={selectedDevice} />
          <AndroidVersionSelector lang={lang} value={androidVersion} onChange={setAndroidVersion} />

          <textarea className="problem-textarea" placeholder={lang === 'ar' ? 'اكتب وصف المشكلة هنا...' : 'Describe your problem...'} value={problemText} onChange={e => setProblemText(e.target.value)} />

          <div className="actions-row">
            <button className="btn primary" onClick={handleAskAI} disabled={loadingAI}>{loadingAI ? 'جاري الاتصال...' : 'اسأل الذكاء الاصطناعي'}</button>
            <button className="btn" onClick={() => { setProblemText(''); showToast('تم مسح النص'); }}>مسح</button>
            <button className="btn" onClick={() => { setShowSub(true); showToast('افتح الاشتراك للاميزات المميزة'); }}>عرض الخطط</button>
          </div>

          {aiReply && (
            <div className="ai-reply modern-reply" style={{ marginTop: 18 }}>
              <h3 style={{ marginTop: 0 }}>رد الذكاء الاصطناعي</h3>
              <div style={{ whiteSpace: 'pre-wrap' }}>{aiReply}</div>
            </div>
          )}

          <div style={{ marginTop: 26 }}>
            <h3 style={{ color: '#fff' }}>مميزات الموقع</h3>
            <div className="features-grid">
              {features.map(f => (
                <div key={f.id} className={`feature-card ${f.locked ? 'locked' : ''}`}>
                  <h4>{f.title} {f.locked && <span className="lock-badge">مميز</span>}</h4>
                  <p>{f.desc}</p>
                  <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
                    {f.locked ? <button className="neon-cta" onClick={() => setShowSub(true)}>اشترك لعرض</button> : <button className="btn" onClick={() => { setActiveFeature(f); }}>{'جرب الآن'}</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      </main>

      {showAuth && <AuthPopup lang={lang} onClose={handleAuthClose} />}
      {showSub && <SubscriptionPopup lang={lang} onClose={() => setShowSub(false)} />}
      {activeFeature && <FeatureModal title={activeFeature.title} desc={activeFeature.desc} onClose={() => setActiveFeature(null)} />}

      <div id="toast" className={toast.show ? 'toast show' : 'toast'}>{toast.msg}</div>
    </div>
  );
}

export default App;
