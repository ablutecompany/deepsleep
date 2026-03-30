import { NavLink, useLocation } from 'react-router-dom';
import { Home, MoonStar, Activity, User, Info, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function BottomNav() {
  const location = useLocation();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const nightCount = parseInt(localStorage.getItem('nightCount') || '0', 10);
    const seen = localStorage.getItem('profileTooltipSeen');
    if (nightCount >= 5 && seen !== 'true') {
      setShowTooltip(true);
    }
  }, [location.pathname]);

  // Allow visibility in the stable tabs plus the active plan home and context areas
  if (!['/process_home', '/manual_log_hub', '/phase2/context', '/phase2/entry', '/phase2/proposals', '/profile', '/phase3_home'].includes(location.pathname)) {
    return null;
  }

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTooltip(false);
    localStorage.setItem('profileTooltipSeen', 'true');
  };

  const tabs = [
    { to: '/process_home', icon: Home, label: 'Início' },
    { to: '/manual_log_hub', icon: MoonStar, label: 'Noite' },
    { to: '/phase2/context', icon: Activity, label: 'Padrões' },
    { to: '/profile', icon: User, label: 'Perfil' }
  ];

  return (
    <nav className="bottom-nav" style={{ position: 'relative' }}>
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.to;
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => {
              if (tab.to === '/profile') {
                setShowTooltip(false);
                localStorage.setItem('profileTooltipSeen', 'true');
              }
            }}
          >
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <tab.icon size={20} strokeWidth={isActive ? 1.5 : 1.2} className="nav-icon" />
              {tab.to === '/profile' && showTooltip && (
                <div style={{ 
                  position: 'absolute', bottom: '38px', right: '-12px', width: '220px', 
                  background: '#0F172A', border: '1px solid #38BDF8', borderRadius: '12px', 
                  padding: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', zIndex: 100 
                }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <Info size={16} color="#38BDF8" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <p style={{ fontSize: '13px', color: '#F8FAFC', lineHeight: '18px', textAlign: 'left', margin: 0 }}>
                      <strong style={{ color: '#38BDF8', display: 'block', marginBottom: '4px' }}>Fase 1 Concluída</strong>
                      O teu perfil inicial ganhou forma! Espreita-o aqui.
                    </p>
                  </div>
                  <div 
                    onClick={handleDismiss}
                    style={{ position: 'absolute', top: '8px', right: '8px', cursor: 'pointer', outline: 'none' }}
                  >
                    <X size={14} color="#64748B" />
                  </div>
                  {/* pointer down */}
                  <div style={{ position: 'absolute', bottom: '-7px', right: '18px', width: '12px', height: '12px', background: '#0F172A', borderBottom: '1px solid #38BDF8', borderRight: '1px solid #38BDF8', transform: 'rotate(45deg)' }} />
                </div>
              )}
            </div>
            <span className="nav-label">{tab.label}</span>
            {isActive && <div className="active-dot" />}
          </NavLink>
        );
      })}
    </nav>
  );
}
