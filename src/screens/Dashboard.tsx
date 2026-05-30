import React, { useState } from 'react';
import { usePet } from '../context/PetContext';
import { WeightChart } from '../components/WeightChart';
import { Scale, Sparkles, User, BadgeAlert, Plus, Calendar, CheckCircle, Edit, Trash2, X, Printer } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { selectedPet, vaccines, medicalRecords, addWeight, updatePet, deletePet } = usePet();
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newWeightDate, setNewWeightDate] = useState('');

  // Edit profile states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBreed, setEditBreed] = useState('');
  const [editGender, setEditGender] = useState<'male' | 'female'>('male');
  const [editBirthdate, setEditBirthdate] = useState('');
  const [editMicrochip, setEditMicrochip] = useState('');
  const [editPhoto, setEditPhoto] = useState('');
  const [editBio, setEditBio] = useState('');

  if (!selectedPet) {
    return (
      <div className="screen-content flex-center">
        <span className="text-body">Selecciona o agrega una mascota para comenzar.</span>
      </div>
    );
  }

  // Calculate detailed age
  const getAge = (birthdate: string) => {
    const birth = new Date(birthdate);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    
    if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
      years--;
      months += 12;
    }

    if (years === 0) {
      return `${months} ${months === 1 ? 'mes' : 'meses'}`;
    }
    
    return `${years} ${years === 1 ? 'año' : 'años'}${months > 0 ? ` y ${months} ${months === 1 ? 'mes' : 'meses'}` : ''}`;
  };

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight || !newWeightDate) return;

    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const dateObj = new Date(newWeightDate + 'T00:00:00');
    const formattedDate = `${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

    addWeight(selectedPet.id, {
      date: formattedDate,
      weight: parseFloat(newWeight)
    });

    setNewWeight('');
    setNewWeightDate('');
    setShowWeightModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName || !editBreed || !editBirthdate) return;

    updatePet(selectedPet.id, {
      name: editName,
      breed: editBreed,
      gender: editGender,
      birthdate: editBirthdate,
      microchip: editMicrochip || 'N/A',
      photo: editPhoto,
      bio: editBio
    });

    setShowEditModal(false);
  };

  const handleDeletePet = () => {
    if (window.confirm(`¿Estás absolutamente seguro de que deseas eliminar permanentemente a ${selectedPet.name}? Se borrarán de forma irreversible todos sus registros clínicos, calendario de vacunas y fotos de la base de datos.`)) {
      deletePet(selectedPet.id);
    }
  };

  const openEditModal = () => {
    setEditName(selectedPet.name);
    setEditBreed(selectedPet.breed);
    setEditGender(selectedPet.gender);
    setEditBirthdate(selectedPet.birthdate);
    setEditMicrochip(selectedPet.microchip === 'N/A' ? '' : selectedPet.microchip);
    setEditPhoto(selectedPet.photo);
    setEditBio(selectedPet.bio);
    setShowEditModal(true);
  };

  const currentWeight = selectedPet.weightHistory[selectedPet.weightHistory.length - 1]?.weight || 0;
  
  const pendingVaccines = vaccines.filter(
    (v) => v.petId === selectedPet.id && v.status === 'pending'
  );
  
  const recentRecord = medicalRecords
    .filter((r) => r.petId === selectedPet.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return (
    <div className="screen-content dashboard-screen">
      {/* Dynamic Profile Card */}
      <div className="card-premium primary flex-between" style={{ padding: '24px 20px' }}>
        <div className="pet-profile-summary">
          <div className="pet-avatar-wrapper" style={{ width: '84px', height: '84px' }}>
            <img src={selectedPet.photo} alt={selectedPet.name} className="pet-avatar" />
            <div className="pet-status-dot" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
            <h1 className="title-lg" style={{ margin: 0, lineHeight: 1.1 }}>{selectedPet.name}</h1>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span className="badge applied" style={{ fontSize: '11px', padding: '2px 8px' }}>
                {selectedPet.species === 'dog' ? '🐶 Perro' : '🐱 Gato'}
              </span>
              <span className="text-caption" style={{ fontWeight: 600 }}>
                {selectedPet.breed}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls for Real-world editing/deleting */}
        <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start' }}>
          <button 
            className="btn-icon-round"
            style={{ width: '36px', height: '36px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
            onClick={() => window.print()}
            title="Imprimir Ficha Médica (PDF)"
          >
            <Printer size={16} />
          </button>
          <button 
            className="btn-icon-round"
            style={{ width: '36px', height: '36px', border: '1px solid var(--border-color)', color: 'var(--primary)' }}
            onClick={openEditModal}
            title="Editar perfil de mascota"
          >
            <Edit size={16} />
          </button>
          <button 
            className="btn-icon-round"
            style={{ width: '36px', height: '36px', border: '1px solid var(--border-color)', color: 'var(--danger)', backgroundColor: 'var(--danger-light)' }}
            onClick={handleDeletePet}
            title="Eliminar mascota"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Quick Specs Grid */}
      <div className="grid-2">
        <div className="pet-quick-badge">
          <span className="text-caption">Edad</span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {getAge(selectedPet.birthdate)}
          </span>
        </div>
        <div className="pet-quick-badge">
          <span className="text-caption">Peso Actual</span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <Scale size={14} color="var(--primary)" /> {currentWeight} kg
          </span>
        </div>
        <div className="pet-quick-badge">
          <span className="text-caption">Nº Microchip</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', wordBreak: 'break-all' }}>
            {selectedPet.microchip}
          </span>
        </div>
        <div className="pet-quick-badge">
          <span className="text-caption">Propietario</span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <User size={14} color="var(--accent)" /> {selectedPet.ownerName}
          </span>
        </div>
      </div>

      {/* Bio / Description Card */}
      <div className="card-premium">
        <div className="flex-center" style={{ gap: '6px', justifyContent: 'flex-start', marginBottom: '8px' }}>
          <Sparkles size={16} color="var(--accent)" />
          <span className="title-sm" style={{ fontSize: '15px' }}>Perfil Clínico y Notas</span>
        </div>
        <p className="text-body" style={{ fontStyle: 'italic', fontSize: '13.5px' }}>
          "{selectedPet.bio}"
        </p>
      </div>

      {/* Weight History Graphic Card */}
      <div className="card-premium">
        <div className="flex-between" style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span className="title-sm">Evolución de Peso</span>
            <span className="text-caption">Últimos 6 registros clínicos</span>
          </div>
          <button 
            className="btn-icon-round" 
            style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary-light)', borderColor: 'transparent', color: 'var(--primary)' }}
            onClick={() => setShowWeightModal(true)}
            aria-label="Registrar peso"
          >
            <Plus size={16} />
          </button>
        </div>
        
        <WeightChart data={selectedPet.weightHistory} />
      </div>

      {/* Highlights & Quick Actions */}
      <div className="card-premium">
        <span className="title-sm" style={{ display: 'block', marginBottom: '12px', textAlign: 'left' }}>
          Resumen Sanitario
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Vaccine highlight */}
          <div className="flex-between" style={{ paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
            <div className="flex-center" style={{ gap: '10px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: pendingVaccines.length > 0 ? 'var(--warning-light)' : 'var(--primary-light)' }}>
                {pendingVaccines.length > 0 ? <BadgeAlert size={16} color="var(--warning)" /> : <CheckCircle size={16} color="var(--primary)" />}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Vacunas Anuales</span>
                <span className="text-caption">
                  {pendingVaccines.length > 0 
                    ? `Tienes ${pendingVaccines.length} vacuna(s) programada(s)`
                    : 'Calendario al día'}
                </span>
              </div>
            </div>
            {pendingVaccines.length > 0 && (
              <span className="badge pending" style={{ fontSize: '10px' }}>Pendiente</span>
            )}
          </div>

          {/* Consultation highlight */}
          <div className="flex-between">
            <div className="flex-center" style={{ gap: '10px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'var(--accent-light)' }}>
                <Calendar size={16} color="var(--accent)" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Último Chequeo Clínico</span>
                <span className="text-caption" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '170px' }}>
                  {recentRecord ? recentRecord.title : 'No registrado'}
                </span>
              </div>
            </div>
            {recentRecord && (
              <span className="text-caption" style={{ fontWeight: 600 }}>{recentRecord.date}</span>
            )}
          </div>
        </div>
      </div>

      {/* Weight Modal */}
      {showWeightModal && (
        <div className="modal-overlay" onClick={() => setShowWeightModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex-between">
              <span className="title-md">Registrar Peso</span>
              <button 
                className="btn-icon-round" 
                style={{ width: '32px', height: '32px' }}
                onClick={() => setShowWeightModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleWeightSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  Peso (kg) *
                </label>
                <input 
                  type="number" 
                  step="0.05"
                  className="input-premium" 
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="Ej. 33.8"
                  required 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  Fecha de Registro *
                </label>
                <input 
                  type="date" 
                  className="input-premium" 
                  value={newWeightDate}
                  onChange={(e) => setNewWeightDate(e.target.value)}
                  required 
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                Registrar Peso
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex-between">
              <span className="title-md">Editar Mascota</span>
              <button 
                className="btn-icon-round" 
                style={{ width: '32px', height: '32px' }}
                onClick={() => setShowEditModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '450px', overflowY: 'auto', paddingRight: '4px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  Nombre de Mascota *
                </label>
                <input 
                  type="text" 
                  className="input-premium" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required 
                />
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                    Raza *
                  </label>
                  <input 
                    type="text" 
                    className="input-premium" 
                    value={editBreed}
                    onChange={(e) => setEditBreed(e.target.value)}
                    required 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                    Género *
                  </label>
                  <select 
                    className="select-premium" 
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value as 'male' | 'female')}
                  >
                    <option value="male">Macho</option>
                    <option value="female">Hembra</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  Fecha de Nacimiento *
                </label>
                <input 
                  type="date" 
                  className="input-premium" 
                  value={editBirthdate}
                  onChange={(e) => setEditBirthdate(e.target.value)}
                  required 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  Nº Microchip
                </label>
                <input 
                  type="text" 
                  className="input-premium" 
                  value={editMicrochip}
                  onChange={(e) => setEditMicrochip(e.target.value)}
                  placeholder="9810XXXXXXXXXXX" 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  Foto de Mascota
                </label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input 
                    type="file" 
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="pet-edit-photo-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (typeof reader.result === 'string') {
                            setEditPhoto(reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }} 
                  />
                  <label 
                    htmlFor="pet-edit-photo-upload"
                    className="btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '13px', borderRadius: '10px', cursor: 'pointer', margin: 0 }}
                  >
                    Subir Foto Local
                  </label>
                  
                  {editPhoto && (
                    <div className="pet-avatar-wrapper" style={{ width: '48px', height: '48px', padding: '1.5px' }}>
                      <img src={editPhoto} alt="Vista previa" className="pet-avatar" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  Biografía / Notas
                </label>
                <textarea 
                  className="input-premium" 
                  style={{ resize: 'none', height: '80px' }}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
