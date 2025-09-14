import React, { useState, useEffect } from 'react';
import devicesData from '../data/devices.json';

function DeviceSelector({ lang = 'ar', onSelect, selectedDevice }) {
  const [selectedId, setSelectedId] = useState(selectedDevice?.id || '');
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    // load brands from JSON data
    setBrands(devicesData.brands || []);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setSelectedId(val);
    const [brandKey, idx] = val.split('::');
    const brand = brands.find(b => b.name === brandKey);
    const model = brand ? brand.models[parseInt(idx, 10)] : null;
    const dev = model ? { id: val, model, brand: brand.name, brandAr: brand.ar } : null;
    onSelect && onSelect(dev);
  };

  return (
    <div style={{ margin: '12px 0' }}>
      <label style={{ display: 'block', marginBottom: 6, color: '#fff', fontWeight: 800 }}>{lang === 'ar' ? 'اختر موديل الجهاز' : 'Select device model'}</label>
      <select value={selectedId} onChange={handleChange} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', color: '#fff', border: '1px solid rgba(255,255,255,0.06)', fontWeight: 700 }}>
        <option value="">{lang === 'ar' ? 'اختر الموديل' : 'Select model'}</option>
        {brands.map((b) => (
          <optgroup key={b.name} label={lang === 'ar' ? b.ar : b.name}>
            {b.models.map((m, idx) => (
              <option key={`${b.name}::${idx}`} value={`${b.name}::${idx}`}>{m}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

export default DeviceSelector;
