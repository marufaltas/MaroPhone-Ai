import React from 'react';

const versions = [
  '4.4', '5.0', '5.1', '6.0', '7.0', '7.1', '8.0', '8.1', '9.0', '10', '11', '12', '13', '14'
];

function AndroidVersionSelector({ lang, value, onChange }) {
  return (
    <div style={{ margin: '18px 0' }}>
      <label style={{ fontWeight: 'bold', marginBottom: 6, display: 'block' }}>
        {lang === 'ar' ? 'إصدار الأندرويد' : 'Android Version'}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '0.7rem', borderRadius: 8, fontSize: '1rem', fontFamily: lang === 'ar' ? 'Cairo' : 'Roboto' }}
      >
        <option value="">{lang === 'ar' ? 'اختر الإصدار' : 'Select version'}</option>
        {versions.map(v => <option key={v} value={v}>{v}</option>)}
      </select>
    </div>
  );
}

export default AndroidVersionSelector;