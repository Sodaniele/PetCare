import React, { useState } from 'react';
import { usePet } from '../context/PetContext';
import { Plus, X, Sparkles, Check } from 'lucide-react';

interface PetSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PetSelector: React.FC<PetSelectorProps> = ({ isOpen, onClose }) => {
  const { pets, selectedPetId, setSelectedPetId, addPet } = usePet();
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<'dog' | 'cat'>('dog');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [birthdate, setBirthdate] = useState('');
  const [bio, setBio] = useState('');
  const [microchip, setMicrochip] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !breed || !birthdate) return;

    // Use high quality default photo based on species if none provided
    const defaultPhoto = species === 'dog' 
      ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600'
      : 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=600';

    addPet({
      name,
      species,
      breed,
      gender,
      birthdate,
      ownerName: 'Sofía Daniele',
      microchip: microchip || 'N/A',
      photo: photoUrl || defaultPhoto,
      bio: bio || `Un adorable ${species === 'dog' ? 'perrito' : 'gatito'} que llena la casa de alegría.`,
      weightHistory: [
        { date: 'Hoy', weight: species === 'dog' ? 12.5 : 3.5 }
      ]
    });

    // Reset and close
    setName('');
    setBreed('');
    setBirthdate('');
    setBio('');
    setMicrochip('');
    setPhotoUrl('');
    setShowAddForm(false);
    onClose();
  };

  return (
    <div className="pet-selector-backdrop" onClick={onClose}>
      <div className="pet-selector-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <span className="title-md">
            {showAddForm ? 'Nueva Mascota' : 'Mis Mascotas'}
          </span>
          <button 
            className="btn-icon-round" 
            style={{ width: '32px', height: '32px' }}
            onClick={showAddForm ? () => setShowAddForm(false) : onClose}
          >
            <X size={16} />
          </button>
        </div>

        {!showAddForm ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
            {pets.map((pet) => {
              const isSelected = pet.id === selectedPetId;
              return (
                <div
                  key={pet.id}
                  className={`pet-option-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedPetId(pet.id);
                    onClose();
                  }}
                >
                  <div className="flex-center" style={{ gap: '12px' }}>
                    <div className="pet-avatar-wrapper" style={{ width: '48px', height: '48px', padding: '1.5px' }}>
                      <img src={pet.photo} alt={pet.name} className="pet-avatar" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>
                        {pet.name}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {pet.breed} • {pet.gender === 'male' ? 'Macho' : 'Hembra'}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <div style={{ backgroundColor: 'var(--primary)', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}

            <button 
              className="btn-secondary" 
              style={{ marginTop: '8px' }}
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={18} />
              Agregar Mascota
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '450px', overflowY: 'auto', paddingRight: '4px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                Nombre *
              </label>
              <input 
                type="text" 
                className="input-premium" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Ej. Toby" 
                required 
              />
            </div>

            <div className="grid-2">
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  Especie *
                </label>
                <select 
                  className="select-premium" 
                  value={species} 
                  onChange={(e) => setSpecies(e.target.value as 'dog' | 'cat')}
                >
                  <option value="dog">Perro</option>
                  <option value="cat">Gato</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  Género *
                </label>
                <select 
                  className="select-premium" 
                  value={gender} 
                  onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                >
                  <option value="male">Macho</option>
                  <option value="female">Hembra</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                Raza *
              </label>
              <input 
                type="text" 
                className="input-premium" 
                value={breed} 
                onChange={(e) => setBreed(e.target.value)} 
                placeholder="Ej. Golden Retriever, Siamés" 
                required 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                Fecha de Nacimiento *
              </label>
              <input 
                type="date" 
                className="input-premium" 
                value={birthdate} 
                onChange={(e) => setBirthdate(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                Nº Microchip (opcional)
              </label>
              <input 
                type="text" 
                className="input-premium" 
                value={microchip} 
                onChange={(e) => setMicrochip(e.target.value)} 
                placeholder="9810XXXXXXXXXXX" 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                Foto de Mascota (opcional)
              </label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input 
                  type="file" 
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="pet-add-photo-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        if (typeof reader.result === 'string') {
                          setPhotoUrl(reader.result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }} 
                />
                <label 
                  htmlFor="pet-add-photo-upload"
                  className="btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '13px', borderRadius: '10px', cursor: 'pointer', margin: 0 }}
                >
                  Subir Imagen Local
                </label>
                
                {photoUrl && (
                  <div className="pet-avatar-wrapper" style={{ width: '48px', height: '48px', padding: '1.5px' }}>
                    <img src={photoUrl} alt="Vista previa" className="pet-avatar" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                Breve Biografía / Notas
              </label>
              <textarea 
                className="input-premium" 
                style={{ resize: 'none', height: '60px' }}
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                placeholder="Le gusta..." 
              />
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
              <Sparkles size={18} />
              Guardar Mascota
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
