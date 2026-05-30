import { useState } from 'react';
import { usePet } from '../context/PetContext';
import type { CheckupPhoto } from '../context/PetContext';
import { Lightbox } from '../components/Lightbox';
import { Image, Plus } from 'lucide-react';

export const Gallery: React.FC = () => {
  const { selectedPet, photos, addCheckupPhoto, deleteCheckupPhoto } = usePet();
  const [selectedPhoto, setSelectedPhoto] = useState<CheckupPhoto | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  if (!selectedPet) return null;

  // Filter photos by pet
  const petPhotos = photos.filter((p) => p.petId === selectedPet.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !description) return;

    // Default premium checkup photo if none given
    const defaultUrl = 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&q=80&w=800';

    addCheckupPhoto({
      petId: selectedPet.id,
      date,
      url: photoUrl || defaultUrl,
      title,
      description
    });

    setTitle('');
    setDate('');
    setDescription('');
    setPhotoUrl('');
    setShowAddModal(false);
  };

  return (
    <div className="screen-content">
      {/* Header Section */}
      <div className="flex-between">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h1 className="title-md" style={{ margin: 0 }}>Fotos de Chequeos</h1>
          <span className="text-caption">Registro visual clínico de {selectedPet.name}</span>
        </div>
        <button 
          className="btn-primary" 
          style={{ padding: '8px 14px', fontSize: '13px', borderRadius: '12px' }}
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} />
          Subir Foto
        </button>
      </div>

      {/* Gallery Grid */}
      {petPhotos.length > 0 ? (
        <div className="gallery-grid">
          {petPhotos.map((photo) => (
            <div 
              key={photo.id} 
              className="gallery-card"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img src={photo.url} alt={photo.title} className="gallery-img" />
              <div className="gallery-overlay-text">
                <span style={{ fontWeight: 700, fontSize: '12.5px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {photo.title}
                </span>
                <span style={{ fontSize: '9px', opacity: 0.8, fontWeight: 500 }}>
                  {photo.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-premium flex-center" style={{ flexDirection: 'column', padding: '48px 0', gap: '12px' }}>
          <Image size={36} color="var(--text-tertiary)" style={{ opacity: 0.5 }} />
          <span className="text-body" style={{ fontSize: '13px' }}>
            Aún no has registrado fotos de chequeos clínicos para esta mascota.
          </span>
        </div>
      )}

      {/* Lightbox for large view */}
      <Lightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} onDelete={deleteCheckupPhoto} />

      {/* Add Photo Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex-between">
              <span className="title-md">Registrar Foto de Chequeo</span>
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
                  Título del Chequeo *
                </label>
                <input 
                  type="text" 
                  className="input-premium" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Ej. Chequeo Dental, Orejas Otoclean" 
                  required 
                />
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                    Fecha del Registro *
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
                    Foto de Chequeo *
                  </label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input 
                      type="file" 
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="gallery-add-photo-upload"
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
                      htmlFor="gallery-add-photo-upload"
                      className="btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '13px', borderRadius: '10px', cursor: 'pointer', margin: 0 }}
                    >
                      Subir Imagen
                    </label>
                    
                    {photoUrl && (
                      <div className="pet-avatar-wrapper" style={{ width: '48px', height: '48px', padding: '1.5px' }}>
                        <img src={photoUrl} alt="Vista previa" className="pet-avatar" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  Descripción de lo Observado *
                </label>
                <textarea 
                  className="input-premium" 
                  style={{ resize: 'none', height: '100px' }}
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Describe qué se ve en la fotografía y qué reportó el veterinario..." 
                  required 
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                Guardar Fotografía
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
