import React, { useState } from 'react';

function AuthPopup({ lang, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const url = isLogin ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/signup';
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطأ');
      onClose && onClose(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'فشل الاتصال');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal show" style={{ zIndex: 4000 }}>
      <div className="modal-content">
        <h3>{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}</h3>
        <form onSubmit={handleSubmit}>
          {!isLogin && <input name="name" placeholder="الاسم" value={form.name} onChange={handleChange} />}
          <input name="email" placeholder="الايميل" value={form.email} onChange={handleChange} />
          <input name="password" type="password" placeholder="كلمة المرور" value={form.password} onChange={handleChange} />
          {error && <div style={{color:'#ffb3b3',marginTop:8}}>{error}</div>}
          <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
            <button type="button" className="btn" onClick={() => onClose && onClose(null)}>إلغاء</button>
            <button type="submit" className="btn primary">{loading ? 'جاري...' : (isLogin ? 'دخول' : 'تسجيل')}</button>
          </div>
        </form>
        <div style={{marginTop:10,textAlign:'center'}}>
          <button className="btn" onClick={() => setIsLogin(s => !s)}>{isLogin ? 'إنشاء حساب جديد' : 'لديك حساب؟ تسجيل الدخول'}</button>
        </div>
      </div>
    </div>
  );
}

export default AuthPopup;
