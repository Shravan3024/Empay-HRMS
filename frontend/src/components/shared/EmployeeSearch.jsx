import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

export default function EmployeeSearch({ employees, value, onChange, placeholder = 'Search employee by name or email...' }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selected = employees.find(e => e.id === value);
  const filtered = query.trim()
    ? employees.filter(e => e.full_name?.toLowerCase().includes(query.toLowerCase()) || e.email?.toLowerCase().includes(query.toLowerCase()))
    : employees;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (emp) => {
    onChange(emp.id);
    setQuery('');
    setOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setQuery('');
  };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--t-on-surface-variant)' }} />
        {selected && !open ? (
          <div className="input-glass w-full pl-9 pr-8 py-2.5 text-sm rounded-xl flex items-center justify-between cursor-pointer"
            onClick={() => setOpen(true)}>
            <span className="font-medium" style={{ color: 'var(--t-on-surface)' }}>
              {selected.full_name} <span className="font-normal text-xs" style={{ color: 'var(--t-on-surface-variant)' }}>({selected.email})</span>
            </span>
            <button type="button" onClick={(e) => { e.stopPropagation(); handleClear(); }} className="transition-colors hover:opacity-80" style={{ color: 'var(--t-on-surface-variant)' }}>
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="input-glass w-full pl-9 pr-8 py-2.5 text-sm rounded-xl"
          />
        )}
        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: 'var(--t-on-surface-variant)' }} />
      </div>

      {open && (
        <div className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto rounded-xl shadow-2xl"
          style={{ background: 'var(--t-panel-bg)', border: '1px solid var(--t-glass-border)', backdropFilter: 'blur(24px)' }}>
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-sm text-center" style={{ color: 'var(--t-on-surface-variant)' }}>No employees found</div>
          ) : (
            filtered.slice(0, 20).map(emp => (
              <button key={emp.id} type="button"
                onClick={() => handleSelect(emp)}
                className="w-full text-left px-4 py-3 text-sm transition-all flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5"
                style={{ backgroundColor: value === emp.id ? 'var(--t-primary-muted)' : 'transparent' }}>
                
                <div className="relative">
                  {emp.profile_pic ? (
                    <img src={`${SERVER_URL}${emp.profile_pic}`} alt="" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[0.65rem] font-bold flex-shrink-0 text-white"
                      style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
                      {getInitials(emp.full_name)}
                    </div>
                  )}
                </div>
                
                <div className="min-w-0">
                  <div className="font-medium truncate" style={{ color: 'var(--t-on-surface)' }}>{emp.full_name}</div>
                  <div className="text-[0.65rem] truncate" style={{ color: 'var(--t-on-surface-variant)' }}>{emp.email} · {emp.department || 'N/A'}</div>
                </div>
              </button>
            ))
          )}
          {filtered.length > 20 && (
            <div className="px-4 py-2 text-[10px] text-center border-t uppercase tracking-wider font-semibold" style={{ color: 'var(--t-on-surface-variant)', borderColor: 'var(--t-glass-border)' }}>
              Showing 20 of {filtered.length} — type to search more
            </div>
          )}
        </div>
      )}
    </div>
  );
}
