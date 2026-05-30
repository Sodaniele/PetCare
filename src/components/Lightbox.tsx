import { X, Trash2 } from 'lucide-react';
import type { CheckupPhoto } from '../context/PetContext';

interface LightboxProps {
  photo: CheckupPhoto | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ photo, onClose, onDelete }) => {
  if (!photo) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button 
        className="lightbox-close" 
        onClick={onClose} 
        aria-label="Cerrar vista de imagen"
      >
        <X size={28} />
      </button>
      
      <img 
        src={photo.url} 
        alt={photo.title} 
        className="lightbox-img" 
        onClick={(e) => e.stopPropagation()} 
      />
      
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          marginTop: '16px', 
          textAlign: 'center', 
          maxWidth: '85%', 
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}
      >
        <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.3px' }}>
          {photo.title}
        </span>
        <span style={{ fontSize: '12px', opacity: 0.6, fontWeight: 500 }}>
          Chequeo del {photo.date}
        </span>
        <p style={{ fontSize: '14px', opacity: 0.85, fontWeight: 400, marginTop: '4px', lineHeight: 1.4 }}>
          {photo.description}
        </p>
        
        {onDelete && (
          <button
            className="btn-secondary"
            style={{ 
              alignSelf: 'center', 
              padding: '6px 14px', 
              fontSize: '12px', 
              borderRadius: '8px', 
              color: 'var(--danger)', 
              backgroundColor: 'rgba(239, 68, 68, 0.2)', 
              border: 'none', 
              marginTop: '10px',
              display: 'inline-flex',
              gap: '6px',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => {
              if (window.confirm(`¿Estás absolutamente seguro de que deseas eliminar permanentemente esta foto clínica del registro?`)) {
                onDelete(photo.id);
                onClose();
              }
            }}
          >
            <Trash2 size={13} />
            Eliminar Foto
          </button>
        )}
      </div>
    </div>
  );
};
