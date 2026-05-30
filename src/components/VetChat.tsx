import React, { useState, useRef, useEffect } from 'react';
import { usePet } from '../context/PetContext';
import { Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

export const VetChat: React.FC = () => {
  const { selectedPet, vaccines, medicalRecords } = usePet();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize with a pet-specific welcome message
  useEffect(() => {
    if (!selectedPet) return;
    setMessages([
      {
        id: 'msg-welcome',
        sender: 'ai',
        text: `¡Hola, Sofía! Soy tu Asistente Virtual Vet de PetCare. 🐾 Estoy listo para ayudarte a cuidar de **${selectedPet.name}**. ¿Tienes dudas sobre sus vacunas pendientes, su peso reciente, sus últimos chequeos de otitis u odontología, o necesitas algún consejo nutricional? Pregúntame lo que quieras.`,
        timestamp: new Date()
      }
    ]);
  }, [selectedPet]);

  // Autoscroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedPet) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      let replyText = '';
      const query = userMessage.text.toLowerCase();

      // Simple contextual responses
      if (query.includes('hola') || query.includes('buenos') || query.includes('saludo')) {
        replyText = `¡Hola! Qué gusto saludarte. ¿Cómo se encuentra **${selectedPet.name}** hoy? Recuerda que puedo responder preguntas sobre sus vacunas, su peso actual, o repasar su historial médico.`;
      } 
      else if (query.includes('vacuna') || query.includes('calendario') || query.includes('inyec')) {
        const pending = vaccines.filter(v => v.petId === selectedPet.id && v.status === 'pending');
        const applied = vaccines.filter(v => v.petId === selectedPet.id && v.status === 'applied');
        
        replyText = `Revisando el calendario de vacunas de **${selectedPet.name}**:\n\n`;
        if (pending.length > 0) {
          replyText += `⚠️ Tiene ${pending.length} pendiente(s):\n` + 
            pending.map(v => `• **${v.name}** (Notas: ${v.notes || 'Ninguna'})`).join('\n') + '\n\n';
        } else {
          replyText += `🎉 ¡Increíble! No tiene vacunas pendientes por ahora.\n\n`;
        }
        
        replyText += `✅ Últimas dosis aplicadas:\n` + 
          applied.slice(0, 2).map(v => `• **${v.name}** el ${v.date}`).join('\n');
      } 
      else if (query.includes('peso') || query.includes('gord') || query.includes('aliment') || query.includes('comida') || query.includes('dieta')) {
        const currentWeight = selectedPet.weightHistory[selectedPet.weightHistory.length - 1]?.weight || 0;
        
        if (selectedPet.species === 'dog') {
          replyText = `**${selectedPet.name}** pesa actualmente **${currentWeight} kg**. Los Golden Retrievers adultos machos suelen estar entre 30 y 34 kg, por lo que se encuentra en un rango excelente de condición física.\n\nSu último chequeo con el Dr. Carlos Mendoza indica una condición corporal perfecta de 3/5. Te aconsejo seguir con sus paseos diarios y cuidar su ración recomendada de 350g/día.`;
        } else {
          replyText = `**${selectedPet.name}** pesa actualmente **${currentWeight} kg**.\n\nEn su última consulta veterinaria con la Dra. Laura Gómez se detectó una leve tendencia al sedentarismo con ligero aumento de grasa abdominal. Recuerda seguir estrictamente su dieta de **Royal Canin Sterilised (55 gramos diarios)** y dedicarle al menos 15 minutos diarios a juegos activos (plumeros, puntero láser o pelotas para gatos) para mantenerla ágil.`;
        }
      } 
      else if (query.includes('otitis') || query.includes('oreja') || query.includes('oido')) {
        const hasOtitisRecord = medicalRecords.some(r => r.petId === selectedPet.id && r.title.toLowerCase().includes('otitis'));
        if (hasOtitisRecord) {
          replyText = `En el historial de **${selectedPet.name}**, figura que presentó una **Otitis Externa Leve** en el oído derecho tratada por la Dra. Laura Gómez el 2 de abril. El tratamiento consistió en limpieza con Otoclean y gotas óticas Easotic por 7 días. La revisión de control posterior determinó una curación completa. ¡Monitorea siempre que no se rasque la cabeza constantemente ni haya olor fuerte!`;
        } else {
          replyText = `No tengo registros de otitis o molestias de oídos en el historial de **${selectedPet.name}**. Sin embargo, las orejas limpias deben verse de color rosa claro, sin acumulación de secreción marrón y sin mal olor. Si notas que sacude la cabeza o se rasca de forma obsesiva, avísame para recomendarte una visita.`;
        }
      } 
      else if (query.includes('sarro') || query.includes('diente') || query.includes('boca') || query.includes('limpieza dental')) {
        const hasDentalRecord = medicalRecords.some(r => r.petId === selectedPet.id && r.title.toLowerCase().includes('dental'));
        if (hasDentalRecord) {
          replyText = `Sí, **${selectedPet.name}** tiene registrada una **Limpieza Dental por Ultrasonido (Profilaxis)** bajo anestesia general el 12 de noviembre pasado debido a enfermedad periodontal de grado I.\n\nPara mantener sus dientes limpios y encías sanas, te recomiendo cepillarle sus piezas dentales 2-3 veces por semana con pasta apta para mascotas (¡nunca pasta humana!) o brindarle snacks dentales homologados (como Dentastix).`;
        } else {
          replyText = `No encuentro intervenciones odontológicas previas para **${selectedPet.name}**. Para prevenir la placa bacteriana y el sarro, es ideal implementar cepillados dentales regulares o juguetes de caucho especiales que ayuden a pulir sus dientes de forma mecánica.`;
        }
      } 
      else {
        replyText = `Entiendo perfectamente tu inquietud, Sofía. Como asistente virtual de PetCare, analizo los datos de salud de **${selectedPet.name}**. Si tienes dudas específicas sobre un síntoma (como decaimiento, vómitos o falta de apetito), te sugiero programar una consulta formal con tu veterinario.\n\n¿Quieres que revisemos sus vacunas pendientes o prefieres ver su evolución de peso?`;
      }

      const aiMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="vetchat-container">
      {/* Bot Header */}
      <div 
        style={{ 
          padding: '12px 16px', 
          backgroundColor: 'var(--primary-light)', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <div 
          style={{ 
            backgroundColor: 'var(--primary)', 
            color: '#fff', 
            borderRadius: '50%', 
            width: '32px', 
            height: '32px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <Sparkles size={16} />
        </div>
        <div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary-dark)', display: 'block' }}>
            Asistente Vet Inteligente
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Contexto activo: {selectedPet?.name}
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div className="vetchat-messages">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`vetchat-bubble ${msg.sender}`}
            style={{ whiteSpace: 'pre-line' }}
          >
            {msg.text}
          </div>
        ))}
        {isTyping && (
          <div className="vetchat-bubble ai" style={{ display: 'flex', gap: '4px', padding: '10px 14px' }}>
            <span style={{ animation: 'fadeIn 0.6s infinite alternate', fontWeight: 'bold' }}>•</span>
            <span style={{ animation: 'fadeIn 0.6s infinite alternate 0.2s', fontWeight: 'bold' }}>•</span>
            <span style={{ animation: 'fadeIn 0.6s infinite alternate 0.4s', fontWeight: 'bold' }}>•</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="vetchat-input-bar">
        <input
          type="text"
          className="input-premium"
          style={{ padding: '10px 14px', fontSize: '13.5px' }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Pregunta sobre ${selectedPet?.name || 'tu mascota'}...`}
        />
        <button 
          type="submit" 
          className="btn-primary" 
          style={{ 
            padding: '10px', 
            width: '40px', 
            height: '40px', 
            borderRadius: 'var(--radius-sm)', 
            boxShadow: 'none' 
          }}
          disabled={!inputValue.trim() || isTyping}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
