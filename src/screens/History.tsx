import React, { useState } from 'react';
import { usePet } from '../context/PetContext';
import { Search, Plus, ClipboardList, Stethoscope, ChevronRight, X, Calendar, User } from 'lucide-react';

export const History: React.FC = () => {
  const { selectedPet, medicalRecords, addMedicalRecord, deleteMedicalRecord } = usePet();

  const handleDeleteRecord = (id: string, recordTitle: string) => {
    if (window.confirm(`¿Estás absolutamente seguro de que deseas eliminar permanentemente el registro "${recordTitle}"? Esta acción no se puede deshacer.`)) {
      deleteMedicalRecord(id);
      setSelectedRecordId(null);
    }
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'Checkup' | 'Consultation' | 'Surgery' | 'Emergency'>('all');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<'Checkup' | 'Consultation' | 'Surgery' | 'Emergency'>('Consultation');
  const [vetName, setVetName] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [notes, setNotes] = useState('');

  if (!selectedPet) return null;

  // Filter records
  const petRecords = medicalRecords.filter((r) => r.petId === selectedPet.id);

  const filteredRecords = petRecords.filter((r) => {
    // Type filter
    if (activeFilter !== 'all' && r.type !== activeFilter) return false;
    
    // Search query filter
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(query) ||
      r.vetName.toLowerCase().includes(query) ||
      r.diagnosis.toLowerCase().includes(query) ||
      r.treatment.toLowerCase().includes(query)
    );
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !vetName || !diagnosis || !treatment) return;

    addMedicalRecord({
      petId: selectedPet.id,
      date,
      type,
      title,
      vetName,
      symptoms: symptoms || 'Ninguno reportado.',
      diagnosis,
      treatment,
      notes: notes || undefined
    });

    // Reset Form
    setTitle('');
    setDate('');
    setType('Consultation');
    setVetName('');
    setSymptoms('');
    setDiagnosis('');
    setTreatment('');
    setNotes('');
    setShowAddModal(false);
  };

  const getTypeBadge = (type: 'Checkup' | 'Surgery' | 'Emergency' | 'Consultation') => {
    switch (type) {
      case 'Checkup':
        return <span className="badge checkup">Chequeo</span>;
      case 'Consultation':
        return <span className="badge consultation">Consulta</span>;
      case 'Surgery':
        return <span className="badge surgery">Cirugía</span>;
      case 'Emergency':
        return <span className="badge emergency">Urgencia</span>;
    }
  };

  const selectedRecord = medicalRecords.find((r) => r.id === selectedRecordId);

  return (
    <div className="screen-content">
      {/* Title Header */}
      <div className="flex-between">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h1 className="title-md" style={{ margin: 0 }}>Historial Clínico</h1>
          <span className="text-caption">Consultas, cirugías e informes veterinarios</span>
        </div>
        <button 
          className="btn-primary" 
          style={{ padding: '8px 14px', fontSize: '13px', borderRadius: '12px' }}
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} />
          Nuevo
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="input-premium search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar diagnósticos, tratamientos o veterinarios..."
        />
      </div>

      {/* Type Selector Horizontal Scroller */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '8px', 
          overflowX: 'auto', 
          paddingBottom: '4px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {[
          { id: 'all', label: 'Todos' },
          { id: 'Checkup', label: 'Chequeos' },
          { id: 'Consultation', label: 'Consultas' },
          { id: 'Surgery', label: 'Cirugías' },
          { id: 'Emergency', label: 'Urgencias' }
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id as any)}
            style={{
              padding: '6px 14px',
              borderRadius: '99px',
              border: '1px solid var(--border-color)',
              backgroundColor: activeFilter === filter.id ? 'var(--accent)' : 'var(--card)',
              color: activeFilter === filter.id ? '#fff' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Records Scrollable List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredRecords.length > 0 ? (
          filteredRecords.map((r) => (
            <div 
              key={r.id} 
              className="card-premium flex-between"
              style={{ cursor: 'pointer', padding: '16px 20px', textAlign: 'left' }}
              onClick={() => setSelectedRecordId(r.id)}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px', maxWidth: '85%' }}>
                <div className="flex-center" style={{ gap: '8px' }}>
                  <span className="text-caption" style={{ fontWeight: 600 }}>{r.date}</span>
                  {getTypeBadge(r.type)}
                </div>
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                  {r.title}
                </span>
                <span className="text-caption" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Stethoscope size={11} color="var(--primary)" /> Dr(a). {r.vetName}
                </span>
              </div>
              <ChevronRight size={18} color="var(--text-tertiary)" />
            </div>
          ))
        ) : (
          <div className="card-premium flex-center" style={{ flexDirection: 'column', padding: '40px 0', gap: '12px' }}>
            <ClipboardList size={36} color="var(--text-tertiary)" style={{ opacity: 0.5 }} />
            <span className="text-body" style={{ fontSize: '13px' }}>
              No hay eventos clínicos registrados con estos filtros.
            </span>
          </div>
        )}
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="modal-overlay" onClick={() => setSelectedRecordId(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ gap: '20px' }}>
            <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                {getTypeBadge(selectedRecord.type)}
                <span className="title-sm" style={{ fontSize: '16px' }}>Detalles de Consulta</span>
              </div>
              <button 
                className="btn-icon-round" 
                style={{ width: '32px', height: '32px' }}
                onClick={() => setSelectedRecordId(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
              <div>
                <h1 className="title-md" style={{ fontSize: '18px', marginBottom: '8px' }}>{selectedRecord.title}</h1>
                <div className="grid-2">
                  <span className="text-caption" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px' }}>
                    <Calendar size={13} /> {selectedRecord.date}
                  </span>
                  <span className="text-caption" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px' }}>
                    <User size={13} /> Dr(a). {selectedRecord.vetName}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'var(--bg)', border: '1px solid var(--border-color)' }}>
                  <span className="text-caption" style={{ fontSize: '10px', display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                    Sintomatología
                  </span>
                  <span className="text-body" style={{ fontSize: '13px' }}>{selectedRecord.symptoms}</span>
                </div>

                <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'var(--bg)', border: '1px solid var(--border-color)' }}>
                  <span className="text-caption" style={{ fontSize: '10px', display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                    Diagnóstico Clínico
                  </span>
                  <span className="text-body" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{selectedRecord.diagnosis}</span>
                </div>

                <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'var(--bg)', border: '1px solid var(--border-color)' }}>
                  <span className="text-caption" style={{ fontSize: '10px', display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                    Tratamiento y Receta
                  </span>
                  <span className="text-body" style={{ fontSize: '13px', color: 'var(--primary-dark)', fontWeight: 600 }}>{selectedRecord.treatment}</span>
                </div>

                {selectedRecord.notes && (
                  <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'var(--bg)', border: '1px solid var(--border-color)' }}>
                    <span className="text-caption" style={{ fontSize: '10px', display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                      Observaciones
                    </span>
                    <span className="text-body" style={{ fontSize: '13px', fontStyle: 'italic' }}>{selectedRecord.notes}</span>
                  </div>
                )}
              </div>
              <button 
                className="btn-secondary" 
                style={{ padding: '10px 16px', fontSize: '13px', borderRadius: '12px', color: 'var(--danger)', backgroundColor: 'var(--danger-light)', width: '100%', marginTop: '8px', border: 'none' }}
                onClick={() => handleDeleteRecord(selectedRecord.id, selectedRecord.title)}
              >
                Eliminar Registro Clínico
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex-between">
              <span className="title-md">Registrar Historial</span>
              <button 
                className="btn-icon-round" 
                style={{ width: '32px', height: '32px' }}
                onClick={() => setShowAddModal(false)}
              >
                <Plus size={16} style={{ transform: 'rotate(45deg)' }} />
              </button>
            </div>

            <form onSubmit={handleRecordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '450px', overflowY: 'auto', paddingRight: '4px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  Título del Evento *
                </label>
                <input 
                  type="text" 
                  className="input-premium" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Ej. Chequeo Dental, Vacunación Leucemia" 
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
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                    Categoría *
                  </label>
                  <select 
                    className="select-premium" 
                    value={type} 
                    onChange={(e) => setType(e.target.value as any)}
                  >
                    <option value="Consultation">Consulta</option>
                    <option value="Checkup">Chequeo de rutina</option>
                    <option value="Surgery">Cirugía</option>
                    <option value="Emergency">Urgencia</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  Veterinario Encargado *
                </label>
                <input 
                  type="text" 
                  className="input-premium" 
                  value={vetName} 
                  onChange={(e) => setVetName(e.target.value)} 
                  placeholder="Ej. Dr. Carlos Mendoza" 
                  required 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  Sintomatología (Opcional)
                </label>
                <input 
                  type="text" 
                  className="input-premium" 
                  value={symptoms} 
                  onChange={(e) => setSymptoms(e.target.value)} 
                  placeholder="Ej. Estornudos, rascado crónico..." 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  Diagnóstico Clínico *
                </label>
                <textarea 
                  className="input-premium" 
                  style={{ resize: 'none', height: '60px' }}
                  value={diagnosis} 
                  onChange={(e) => setDiagnosis(e.target.value)} 
                  placeholder="Diagnóstico oficial..." 
                  required 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  Tratamiento Recetado *
                </label>
                <textarea 
                  className="input-premium" 
                  style={{ resize: 'none', height: '60px' }}
                  value={treatment} 
                  onChange={(e) => setTreatment(e.target.value)} 
                  placeholder="Prescripción, dosis y reposo..." 
                  required 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  Notas Adicionales
                </label>
                <textarea 
                  className="input-premium" 
                  style={{ resize: 'none', height: '60px' }}
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  placeholder="Ej. Comportamiento en clínica..." 
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                Registrar Evento
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
