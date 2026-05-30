import React, { useState } from 'react';
import { usePet } from '../context/PetContext';
import { CalendarDays, Plus, Syringe, Info, Check, AlertTriangle, Clock, Trash2 } from 'lucide-react';

export const Vaccines: React.FC = () => {
  const { selectedPet, vaccines, addVaccine, deleteVaccine } = usePet();

  const handleDeleteVaccine = (id: string, vaccineName: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el registro de la vacuna "${vaccineName}"?`)) {
      deleteVaccine(id);
    }
  };
  const [activeTab, setActiveTab] = useState<'all' | 'applied' | 'pending' | 'overdue'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState<'applied' | 'pending' | 'overdue'>('pending');
  const [notes, setNotes] = useState('');

  if (!selectedPet) return null;

  // Filter vaccines by pet and tab
  const petVaccines = vaccines.filter((v) => v.petId === selectedPet.id);
  
  const filteredVaccines = petVaccines.filter((v) => {
    if (activeTab === 'all') return true;
    return v.status === activeTab;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // descending by date

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date) return;

    addVaccine({
      petId: selectedPet.id,
      name,
      date,
      status,
      notes: notes || undefined
    });

    setName('');
    setDate('');
    setStatus('pending');
    setNotes('');
    setShowAddModal(false);
  };

  const getStatusBadge = (status: 'applied' | 'pending' | 'overdue') => {
    switch (status) {
      case 'applied':
        return <span className="badge applied"><Check size={12} /> Aplicada</span>;
      case 'pending':
        return <span className="badge pending"><Clock size={12} /> Pendiente</span>;
      case 'overdue':
        return <span className="badge overdue"><AlertTriangle size={12} /> Vencida</span>;
    }
  };

  return (
    <div className="screen-content">
      {/* Title & Add Button */}
      <div className="flex-between">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h1 className="title-md" style={{ margin: 0 }}>Calendario de Vacunación</h1>
          <span className="text-caption">Control preventivo e inmunizaciones</span>
        </div>
        <button 
          className="btn-primary" 
          style={{ padding: '8px 14px', fontSize: '13px', borderRadius: '12px' }}
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} />
          Agendar
        </button>
      </div>

      {/* Filter Tabs */}
      <div 
        style={{ 
          display: 'flex', 
          backgroundColor: 'var(--card)', 
          borderRadius: 'var(--radius-md)', 
          padding: '4px',
          border: '1px solid var(--border-color)',
          justifyContent: 'space-between'
        }}
      >
        {(['all', 'applied', 'pending', 'overdue'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '8px 4px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeTab === tab ? 'var(--primary)' : 'transparent',
              color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textTransform: 'capitalize'
            }}
          >
            {tab === 'all' ? 'Todas' : tab === 'applied' ? 'Puestas' : tab === 'pending' ? 'Pendientes' : 'Vencidas'}
          </button>
        ))}
      </div>

      {/* Vaccine Timeline List */}
      <div className="card-premium" style={{ padding: '24px 16px' }}>
        {filteredVaccines.length > 0 ? (
          <div className="timeline">
            {filteredVaccines.map((v) => (
              <div key={v.id} className="timeline-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingBottom: '20px' }}>
                {/* Visual Timeline Bullet */}
                <div className={`timeline-dot ${v.status}`} />
                
                {/* Vaccine Details */}
                <div style={{ width: '100%', paddingLeft: '12px' }}>
                  <div className="flex-between" style={{ alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                      <span style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'left' }}>
                        {v.name}
                      </span>
                      <span className="text-caption" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CalendarDays size={12} color="var(--primary)" /> {v.date}
                      </span>
                    </div>
                    <div className="flex-center" style={{ gap: '8px' }}>
                      {getStatusBadge(v.status)}
                      <button 
                        className="btn-icon-round"
                        style={{ width: '28px', height: '28px', border: '1px solid var(--border-color)', color: 'var(--danger)', backgroundColor: 'var(--danger-light)' }}
                        onClick={() => handleDeleteVaccine(v.id, v.name)}
                        title="Eliminar vacuna"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  
                  {v.notes && (
                    <div 
                      style={{ 
                        marginTop: '8px', 
                        padding: '10px', 
                        borderRadius: '10px', 
                        backgroundColor: 'var(--bg)', 
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        gap: '6px',
                        alignItems: 'flex-start'
                      }}
                    >
                      <Info size={14} color="var(--text-tertiary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span className="text-body" style={{ fontSize: '12px', textAlign: 'left' }}>
                        {v.notes}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-center" style={{ flexDirection: 'column', padding: '32px 0', gap: '12px' }}>
            <Syringe size={36} color="var(--text-tertiary)" style={{ opacity: 0.5 }} />
            <span className="text-body" style={{ fontSize: '13px' }}>
              No se encontraron vacunas en esta categoría.
            </span>
          </div>
        )}
      </div>

      {/* Add Vaccine Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex-between">
              <span className="title-md">Registrar Inmunización</span>
              <button 
                className="btn-icon-round" 
                style={{ width: '32px', height: '32px' }}
                onClick={() => setShowAddModal(false)}
              >
                <Plus size={16} style={{ transform: 'rotate(45deg)' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  Nombre de la Vacuna *
                </label>
                <input 
                  type="text" 
                  className="input-premium" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Ej. Antirrábica Anual, Triple Viral" 
                  required 
                />
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                    Fecha Programada *
                  </label>
                  <input 
                    type="date" 
                    className="input-premium" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                    Estado *
                  </label>
                  <select 
                    className="select-premium" 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value as 'applied' | 'pending' | 'overdue')}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="applied">Aplicada</option>
                    <option value="overdue">Vencida</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  Notas de Inmunización
                </label>
                <textarea 
                  className="input-premium" 
                  style={{ resize: 'none', height: '80px' }}
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  placeholder="Ej. Laboratorio, lote o comportamiento de la mascota" 
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                Agendar Vacuna
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
