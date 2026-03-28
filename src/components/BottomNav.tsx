import { NavLink, useLocation } from 'react-router-dom';
import { Home, MoonStar, Activity, User, ShieldCheck } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();

  if (location.pathname === '/insight' || location.pathname === '/tonight') {
    return null;
  }

  const tabs = [
    { to: '/', icon: Home, label: 'Início' },
    { to: '/tonight', icon: MoonStar, label: 'Noite' },
    { to: '/patterns', icon: Activity, label: 'Padrões' },
    { to: '/profile', icon: User, label: 'Perfil' },
    { to: '/control', icon: ShieldCheck, label: 'Controlo' }
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.to;
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={`nav-item ${isActive ? 'active' : ''}`}
          >
            <tab.icon size={20} strokeWidth={isActive ? 1.5 : 1.2} className="nav-icon" />
            <span className="nav-label">{tab.label}</span>
            {isActive && <div className="active-dot" />}
          </NavLink>
        );
      })}
    </nav>
  );
}
