import React from 'react';
import { HeartPulse, CalendarDays, ClipboardList, Image, Settings } from 'lucide-react';

interface BottomNavProps {
  currentScreen: string;
  setScreen: (screen: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, setScreen }) => {
  const navItems = [
    { id: 'dashboard', label: 'Ficha', icon: HeartPulse },
    { id: 'vaccines', label: 'Vacunas', icon: CalendarDays },
    { id: 'history', label: 'Historial', icon: ClipboardList },
    { id: 'gallery', label: 'Fotos', icon: Image },
    { id: 'settings', label: 'Ajustes', icon: Settings }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id;
        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setScreen(item.id)}
            aria-label={`Ir a ${item.label}`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
