import React, { useState } from 'react';
import { usePet } from '../context/PetContext';
import { Sun, Moon, Bell, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onOpenPetSelector: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPetSelector }) => {
  const { selectedPet, theme, toggleTheme, appointments } = usePet();
  const [showNotifications, setShowNotifications] = useState(false);

  // Active appointments act as dynamic pending notifications
  const notificationCount = appointments.length;

  return (
    <header className="app-header">
      <div 
        className="flex-center" 
        style={{ gap: '10px', cursor: 'pointer' }}
        onClick={onOpenPetSelector}
      >
        {selectedPet ? (
          <div className="pet-avatar-wrapper" style={{ width: '40px', height: '40px', padding: '1.5px' }}>
            <img 
              src={selectedPet.photo} 
              alt={selectedPet.name} 
              className="pet-avatar" 
            />
          </div>
        ) : (
          <div className="pet-avatar-wrapper" style={{ width: '40px', height: '40px', padding: '1.5px', background: '#ccc' }} />
        )}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div className="flex-center" style={{ gap: '4px' }}>
            <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>
              {selectedPet ? selectedPet.name : 'Seleccionar'}
            </span>
            <ChevronDown size={14} color="var(--text-secondary)" />
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {selectedPet ? selectedPet.breed : 'Mascota'}
          </span>
        </div>
      </div>

      <div className="gap-8">
        <button 
          className="btn-icon-round" 
          style={{ width: '38px', height: '38px' }}
          onClick={toggleTheme}
          aria-label="Cambiar tema visual"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div style={{ position: 'relative' }}>
          <button 
            className="btn-icon-round" 
            style={{ width: '38px', height: '38px' }}
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Ver notificaciones"
          >
            <Bell size={18} />
            {notificationCount > 0 && (
              <span 
                style={{ 
                  position: 'absolute', 
                  top: '-2px', 
                  right: '-2px', 
                  backgroundColor: 'var(--danger)', 
                  color: '#fff', 
                  borderRadius: '50%', 
                  width: '18px', 
                  height: '18px', 
                  fontSize: '10px', 
                  fontWeight: 'bold', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '2px solid var(--card)'
                }}
              >
                {notificationCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div 
              className="card-premium" 
              style={{ 
                position: 'absolute', 
                top: '48px', 
                right: '0', 
                width: '260px', 
                zIndex: 1000, 
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                animation: 'scaleIn 0.2s ease-out'
              }}
            >
              <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span className="title-sm" style={{ fontSize: '14px' }}>Notificaciones</span>
                <span 
                  className="text-caption" 
                  style={{ cursor: 'pointer', color: 'var(--primary)' }}
                  onClick={() => setShowNotifications(false)}
                >
                  Cerrar
                </span>
              </div>
              
              {appointments.length > 0 ? (
                appointments.map(appt => (
                  <div key={appt.id} style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Cita Próxima: {appt.reason}
                    </span>
                    <span className="text-caption" style={{ fontSize: '11px' }}>
                      {appt.date} a las {appt.time} con {appt.vetName}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-body" style={{ fontSize: '12px', textAlign: 'center', padding: '8px 0' }}>
                  No tienes notificaciones pendientes.
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
