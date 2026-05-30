import React, { useState } from 'react';
import { usePet } from '../context/PetContext';
import { VetChat } from '../components/VetChat';
import { Moon, Sun, RotateCcw, Calendar, LogOut, Plus, X } from 'lucide-react';

export const Settings: React.FC = () => {
  const { pets, appointments, theme, toggleTheme, currentUser, logout, addAppointment, selectedPetId } = usePet();

  const initials = currentUser
    ? currentUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'SD';

  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [apptReason, setApptReason] = useState('');
  const [apptDate, setApptDate] = useState('');
  const [apptTime, setApptTime] = useState('');
  const [apptVetName, setApptVetName] = useState('');

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptReason || !apptDate || !apptTime || !apptVetName || !selectedPetId) return;

    addAppointment({
      petId: selectedPetId,
      date: apptDate,
      time: apptTime,
      reason: apptReason,
      vetName: apptVetName,
      status: 'scheduled'
    });

    setApptReason('');
    setApptDate('');
    setApptTime('');
    setApptVetName('');
    setShowAddAppointment(false);
  };

  const handleResetCache = () => {
    if (window.confirm('¿Estás seguro de que deseas restablecer los datos de demostración originales? Esto eliminará las mascotas o vacunas nuevas que hayas guardado.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="screen-content settings-screen">
      {/* Page Title */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        <h1 className="title-md" style={{ margin: 0 }}>Ajustes y Cuenta</h1>
        <span className="text-caption">Gestión del tutor, citas y asistente inteligente</span>
      </div>

      {/* Owner Profile Card (Wide Banner) */}
      <div className="card-premium" style={{ width: '100%' }}>
        <div className="owner-card-layout">
          <div className="owner-card-profile">
            <div className="owner-avatar">{initials}</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
              <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)' }}>
                {currentUser?.name || 'Sofía Daniele'}
              </span>
              <span className="text-caption" style={{ fontSize: '12px' }}>
                Tutor Principal • Propietario de {pets.length} {pets.length === 1 ? 'mascota' : 'mascotas'}
              </span>
            </div>
          </div>
          
          <div className="owner-card-details">
            <div className="flex-between detail-row">
              <span className="text-caption">Correo Electrónico</span>
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {currentUser?.email || 'sofia.daniele@example.com'}
              </span>
            </div>
            <div className="flex-between detail-row">
              <span className="text-caption">Teléfono Clínico</span>
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                +34 612 345 678
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout Wrapper for Desktop, stack on Mobile */}
      <div className="settings-columns-wrapper">
        <div className="settings-left-col">
          {/* Scheduled Vet Appointments Card */}
          <div className="card-premium">
            <div className="flex-between" style={{ marginBottom: '12px' }}>
              <span className="title-sm">Citas Programadas</span>
              <div className="gap-8" style={{ alignItems: 'center' }}>
                <span className="badge applied" style={{ fontSize: '10px' }}>{appointments.length} Citas</span>
                <button 
                  className="btn-icon-round" 
                  style={{ width: '28px', height: '28px', backgroundColor: 'var(--primary-light)', borderColor: 'transparent', color: 'var(--primary)' }}
                  onClick={() => setShowAddAppointment(true)}
                  title="Agendar nueva cita"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {appointments.length > 0 ? (
                appointments.map((appt) => (
                  <div 
                    key={appt.id} 
                    className="flex-between"
                    style={{ 
                      padding: '12px', 
                      borderRadius: '12px', 
                      backgroundColor: 'var(--bg)', 
                      border: '1px solid var(--border-color)',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ padding: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                        <Calendar size={16} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {appt.reason}
                        </span>
                        <span className="text-caption" style={{ fontSize: '10.5px' }}>
                          {appt.date} • {appt.time} hs con {appt.vetName}
                        </span>
                      </div>
                    </div>
                    <span className="badge applied" style={{ fontSize: '9px', padding: '2px 6px' }}>Confirmado</span>
                  </div>
                ))
              ) : (
                <span className="text-body" style={{ fontSize: '12.5px', textAlign: 'center', padding: '8px 0' }}>
                  No tienes citas médicas programadas próximamente.
                </span>
              )}
            </div>
          </div>

          {/* System Preferences Card */}
          <div className="card-premium">
            <span className="title-sm" style={{ display: 'block', marginBottom: '14px', textAlign: 'left' }}>
              Preferencias de Aplicación
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Dark theme selector */}
              <div className="flex-between">
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>Modo Oscuro</span>
                    <span className="text-caption">Alterna la interfaz visual</span>
                  </div>
                </div>
                <button 
                  className="btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '8px' }}
                  onClick={toggleTheme}
                >
                  {theme === 'light' ? 'Activar' : 'Desactivar'}
                </button>
              </div>

              {/* Reset cache option */}
              <div className="flex-between" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ color: 'var(--danger)' }}>
                    <RotateCcw size={18} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>Restablecer Caché</span>
                    <span className="text-caption">Recarga los perfiles de demostración</span>
                  </div>
                </div>
                <button 
                  className="btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '8px', backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}
                  onClick={handleResetCache}
                >
                  Restablecer
                </button>
              </div>

              {/* Logout Option */}
              <div className="flex-between" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ color: 'var(--danger)' }}>
                    <LogOut size={18} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>Cerrar Sesión</span>
                    <span className="text-caption">Salir de la cuenta actual</span>
                  </div>
                </div>
                <button 
                  className="btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '8px', backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}
                  onClick={logout}
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-right-col">
          {/* Virtual Vet Chat Assistant */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
            <span className="title-sm" style={{ textAlign: 'left', display: 'block', fontSize: '14.5px', fontWeight: 700, paddingLeft: '4px' }}>
              Consulta al Veterinario IA
            </span>
            <VetChat />
          </div>
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddAppointment && (
        <div className="modal-overlay" onClick={() => setShowAddAppointment(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex-between">
              <span className="title-md">Agendar Cita</span>
              <button 
                className="btn-icon-round" 
                style={{ width: '32px', height: '32px' }}
                onClick={() => setShowAddAppointment(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAppointmentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  Motivo de la Cita *
                </label>
                <input 
                  type="text" 
                  className="input-premium" 
                  value={apptReason}
                  onChange={(e) => setApptReason(e.target.value)}
                  placeholder="Ej. Vacuna de Refuerzo, Control"
                  required 
                />
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                    Fecha *
                  </label>
                  <input 
                    type="date" 
                    className="input-premium" 
                    value={apptDate}
                    onChange={(e) => setApptDate(e.target.value)}
                    required 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                    Hora *
                  </label>
                  <input 
                    type="time" 
                    className="input-premium" 
                    value={apptTime}
                    onChange={(e) => setApptTime(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  Veterinario Encargado *
                </label>
                <input 
                  type="text" 
                  className="input-premium" 
                  value={apptVetName}
                  onChange={(e) => setApptVetName(e.target.value)}
                  placeholder="Ej. Dr. Carlos Mendoza"
                  required 
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                Guardar Cita
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
