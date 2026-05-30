import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WeightRecord {
  date: string;
  weight: number;
}

export interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat';
  breed: string;
  gender: 'male' | 'female';
  birthdate: string;
  weightHistory: WeightRecord[];
  ownerName: string;
  microchip: string;
  photo: string;
  bio: string;
}

export interface Vaccine {
  id: string;
  petId: string;
  name: string;
  date: string;
  status: 'applied' | 'pending' | 'overdue';
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  petId: string;
  date: string;
  type: 'Consultation' | 'Surgery' | 'Emergency' | 'Checkup';
  title: string;
  vetName: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
}

export interface CheckupPhoto {
  id: string;
  petId: string;
  date: string;
  url: string;
  title: string;
  description: string;
}

export interface Appointment {
  id: string;
  petId: string;
  date: string;
  time: string;
  reason: string;
  vetName: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface User {
  name: string;
  email: string;
}

interface PetContextType {
  pets: Pet[];
  selectedPetId: string;
  selectedPet: Pet | undefined;
  vaccines: Vaccine[];
  medicalRecords: MedicalRecord[];
  photos: CheckupPhoto[];
  appointments: Appointment[];
  theme: 'light' | 'dark';
  currentUser: User | null;
  setSelectedPetId: (id: string) => void;
  addPet: (pet: Omit<Pet, 'id'>) => void;
  addVaccine: (vaccine: Omit<Vaccine, 'id'>) => void;
  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => void;
  addCheckupPhoto: (photo: Omit<CheckupPhoto, 'id'>) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  addWeight: (petId: string, record: WeightRecord) => void;
  toggleTheme: () => void;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updatePet: (petId: string, updatedFields: Partial<Pet>) => void;
  deletePet: (petId: string) => void;
  deleteVaccine: (vaccineId: string) => void;
  deleteMedicalRecord: (recordId: string) => void;
  deleteCheckupPhoto: (photoId: string) => void;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

// Initial Demo Data for Sofia Daniele
const initialPets: Pet[] = [
  {
    id: 'pet-1',
    name: 'Toby',
    species: 'dog',
    breed: 'Golden Retriever',
    gender: 'male',
    birthdate: '2022-03-15',
    weightHistory: [
      { date: 'Dic 2025', weight: 31.2 },
      { date: 'Ene 2026', weight: 32.0 },
      { date: 'Feb 2026', weight: 32.5 },
      { date: 'Mar 2026', weight: 33.1 },
      { date: 'Abr 2026', weight: 32.8 },
      { date: 'May 2026', weight: 33.4 }
    ],
    ownerName: 'Sofía Daniele',
    microchip: '981022300481234',
    photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600',
    bio: 'Un compañero alegre, juguetón y sumamente cariñoso. Le encanta nadar, jugar a la pelota y es el protector consentido del hogar.'
  },
  {
    id: 'pet-2',
    name: 'Luna',
    species: 'cat',
    breed: 'Siamés',
    gender: 'female',
    birthdate: '2023-07-20',
    weightHistory: [
      { date: 'Dic 2025', weight: 3.8 },
      { date: 'Ene 2026', weight: 3.9 },
      { date: 'Feb 2026', weight: 4.1 },
      { date: 'Mar 2026', weight: 4.0 },
      { date: 'Abr 2026', weight: 4.2 },
      { date: 'May 2026', weight: 4.3 }
    ],
    ownerName: 'Sofía Daniele',
    microchip: '981022300495678',
    photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600',
    bio: 'Elegante, curiosa y sumamente mimosa cuando quiere. Adora dormir en lugares templados y observar las aves desde la ventana.'
  }
];

const initialVaccines: Vaccine[] = [
  { id: 'v-1', petId: 'pet-1', name: 'Antirrábica', date: '2026-03-10', status: 'applied', notes: 'Dosis anual obligatoria, colocada sin incidencias.' },
  { id: 'v-2', petId: 'pet-1', name: 'Polivalente Canina (Sextuple)', date: '2026-04-15', status: 'applied', notes: 'Inmunización contra moquillo, parvovirus, hepatitis y leptospirosis.' },
  { id: 'v-3', petId: 'pet-1', name: 'Traqueobronquitis (Tos de las perreras)', date: '2026-05-20', status: 'applied', notes: 'Refuerzo intranasal pre-temporada de invierno.' },
  { id: 'v-4', petId: 'pet-1', name: 'Leptospirosis Refuerzo', date: '2026-08-15', status: 'pending', notes: 'Refuerzo preventivo recomendado para exteriores.' },
  { id: 'v-5', petId: 'pet-1', name: 'Desparasitación Interna', date: '2026-05-01', status: 'applied', notes: 'Pastilla trimestral Drontal Plus.' },
  { id: 'v-6', petId: 'pet-1', name: 'Desparasitación Externa', date: '2026-05-28', status: 'applied', notes: 'Pipeta mensual antipulgas y garrapatas.' },
  
  { id: 'v-7', petId: 'pet-2', name: 'Triple Viral Felina', date: '2026-01-22', status: 'applied', notes: 'Protección contra rinotraqueitis, calicivirus y panleucopenia felina.' },
  { id: 'v-8', petId: 'pet-2', name: 'Leucemia Felina', date: '2026-02-18', status: 'applied', notes: 'Primera dosis. Se requiere control previo negativo.' },
  { id: 'v-9', petId: 'pet-2', name: 'Antirrábica Anual', date: '2026-06-15', status: 'pending', notes: 'Dosis obligatoria programada para el mes próximo.' },
  { id: 'v-10', petId: 'pet-2', name: 'Desparasitación Interna', date: '2026-04-10', status: 'applied', notes: 'Suspensión oral específica para felinos.' }
];

const initialMedicalRecords: MedicalRecord[] = [
  {
    id: 'mr-1',
    petId: 'pet-1',
    date: '2026-05-20',
    type: 'Checkup',
    title: 'Chequeo Semestral General',
    vetName: 'Dr. Carlos Mendoza',
    symptoms: 'Ninguno. Acude a su revisión preventiva de rutina.',
    diagnosis: 'Paciente saludable con excelente condición corporal (3/5). Latidos cardíacos y respiración normal. Mucosas rosadas.',
    treatment: 'Continuar con alimentación actual (350g/día) y ejercicio diario moderado. Aplicar refuerzo de vacuna traqueobronquitis.',
    notes: 'Toby se comportó de manera sumamente amigable.'
  },
  {
    id: 'mr-2',
    petId: 'pet-1',
    date: '2026-04-02',
    type: 'Consultation',
    title: 'Otitis Externa Leve',
    vetName: 'Dra. Laura Gómez',
    symptoms: 'Sacude la cabeza constantemente y se rasca la oreja derecha. Enrojecimiento y olor fuerte en canal auditivo.',
    diagnosis: 'Otitis externa eritemato-ceruminosa bacteriana leve en oído derecho.',
    treatment: 'Limpieza del canal auditivo externo con Otoclean. Gotas óticas (Easotic) - 5 gotas cada 24hs por 7 días.',
    notes: 'Revisión realizada a los 7 días mostrando curación total.'
  },
  {
    id: 'mr-3',
    petId: 'pet-1',
    date: '2025-11-12',
    type: 'Surgery',
    title: 'Limpieza Dental por Ultrasonido',
    vetName: 'Dr. Carlos Mendoza',
    symptoms: 'Mal aliento (halitosis) y acumulación visible de sarro en premolares y molares superiores.',
    diagnosis: 'Enfermedad periodontal grado I.',
    treatment: 'Profilaxis dental ultrasónica + pulido bajo anestesia general inhalatoria. Antibiótico preventivo (Clavulánico/Amoxicilina) por 5 días.',
    notes: 'Recuperación anestésica excelente. Dientes limpios y encías desinflamadas.'
  },
  
  {
    id: 'mr-4',
    petId: 'pet-2',
    date: '2026-04-18',
    type: 'Checkup',
    title: 'Control de Peso y Nutrición',
    vetName: 'Dra. Laura Gómez',
    symptoms: 'Ninguno. Consulta para optimizar su alimentación y evitar sobrepeso.',
    diagnosis: 'Tendencia al sedentarismo con ligero aumento de grasa abdominal. Peso actual 4.3kg.',
    treatment: 'Cambiar a comida especial para gatos castrados (Royal Canin Sterilised). Ración diaria estricta de 55 gramos. Fomentar juegos interactivos.',
    notes: 'Control en 2 meses para evaluar curva de peso.'
  },
  {
    id: 'mr-5',
    petId: 'pet-2',
    date: '2026-02-18',
    type: 'Consultation',
    title: 'Revisión por Estornudos',
    vetName: 'Dr. Carlos Mendoza',
    symptoms: 'Estornudos frecuentes desde hace 2 días. Sin secreción ocular ni nasal, mantiene buen apetito.',
    diagnosis: 'Irritación nasal leve por posible alérgeno ambiental (polvo o sahumerio).',
    treatment: 'Mantener ambientes bien ventilados. Nebulizaciones con solución fisiológica 10 min al día por 3 días.',
    notes: 'Estornudos desaparecieron al cabo de 24 horas.'
  }
];

const initialPhotos: CheckupPhoto[] = [
  {
    id: 'p-1',
    petId: 'pet-1',
    date: '2026-05-20',
    url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
    title: 'Revisión Odontológica',
    description: 'Control de encías y limpieza dental durante el chequeo general semestral.'
  },
  {
    id: 'p-2',
    petId: 'pet-1',
    date: '2026-05-20',
    url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800',
    title: 'Control de Oído Limpio',
    description: 'Chequeo del canal auditivo derecho tras recuperarse por completo de la otitis.'
  },
  {
    id: 'p-3',
    petId: 'pet-1',
    date: '2026-04-02',
    url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
    title: 'Examen Físico de Rutina',
    description: 'Palpación abdominal e inspección general en la mesa de consulta con la Dra. Gómez.'
  },
  
  {
    id: 'p-4',
    petId: 'pet-2',
    date: '2026-04-18',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    title: 'Evaluación Estructural',
    description: 'Control de articulaciones e inspección corporal general.'
  },
  {
    id: 'p-5',
    petId: 'pet-2',
    date: '2026-02-18',
    url: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&q=80&w=800',
    title: 'Control de Temperatura',
    description: 'Examen de vías respiratorias y temperatura corporal durante su cuadro de estornudos.'
  }
];

const initialAppointments: Appointment[] = [
  {
    id: 'a-1',
    petId: 'pet-1',
    date: '2026-06-12',
    time: '10:30',
    reason: 'Control de Vacuna Leptospirosis y Peso',
    vetName: 'Dr. Carlos Mendoza',
    status: 'scheduled'
  },
  {
    id: 'a-2',
    petId: 'pet-2',
    date: '2026-06-15',
    time: '16:00',
    reason: 'Vacuna Antirrábica Anual Felina',
    vetName: 'Dra. Laura Gómez',
    status: 'scheduled'
  }
];

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth states
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('petcare_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [accounts, setAccounts] = useState<any[]>(() => {
    const saved = localStorage.getItem('petcare_accounts');
    if (saved) return JSON.parse(saved);
    // Prefill with default demo account
    const defaultAccounts = [{ name: 'Sofía Daniele', email: 'sofia@example.com', password: '123' }];
    localStorage.setItem('petcare_accounts', JSON.stringify(defaultAccounts));
    return defaultAccounts;
  });

  // User-scoped data states
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [photos, setPhotos] = useState<CheckupPhoto[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Application Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('petcare_theme');
    if (saved) return saved as 'light' | 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Load user data dynamically whenever the user logs in or switches account
  useEffect(() => {
    if (!currentUser) {
      setPets([]);
      setSelectedPetId('');
      setVaccines([]);
      setMedicalRecords([]);
      setPhotos([]);
      setAppointments([]);
      return;
    }

    const email = currentUser.email;

    // Load Pets
    const savedPets = localStorage.getItem(`petcare_pets_${email}`);
    if (savedPets) {
      const parsedPets = JSON.parse(savedPets);
      setPets(parsedPets);
      // Synchronize active pet selection
      const savedSelectedId = localStorage.getItem(`petcare_selected_id_${email}`);
      if (savedSelectedId && parsedPets.some((p: Pet) => p.id === JSON.parse(savedSelectedId))) {
        setSelectedPetId(JSON.parse(savedSelectedId));
      } else {
        setSelectedPetId(parsedPets[0]?.id || '');
      }
    } else {
      // Default data trigger for Sofia Daniele
      if (email === 'sofia@example.com') {
        setPets(initialPets);
        setSelectedPetId('pet-1');
        localStorage.setItem(`petcare_pets_${email}`, JSON.stringify(initialPets));
        localStorage.setItem(`petcare_selected_id_${email}`, JSON.stringify('pet-1'));
      } else {
        setPets([]);
        setSelectedPetId('');
      }
    }

    // Load Vaccines
    const savedVaccines = localStorage.getItem(`petcare_vaccines_${email}`);
    if (savedVaccines) {
      setVaccines(JSON.parse(savedVaccines));
    } else {
      if (email === 'sofia@example.com') {
        setVaccines(initialVaccines);
        localStorage.setItem(`petcare_vaccines_${email}`, JSON.stringify(initialVaccines));
      } else {
        setVaccines([]);
      }
    }

    // Load Medical Records
    const savedRecords = localStorage.getItem(`petcare_records_${email}`);
    if (savedRecords) {
      setMedicalRecords(JSON.parse(savedRecords));
    } else {
      if (email === 'sofia@example.com') {
        setMedicalRecords(initialMedicalRecords);
        localStorage.setItem(`petcare_records_${email}`, JSON.stringify(initialMedicalRecords));
      } else {
        setMedicalRecords([]);
      }
    }

    // Load Photos
    const savedPhotos = localStorage.getItem(`petcare_photos_${email}`);
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    } else {
      if (email === 'sofia@example.com') {
        setPhotos(initialPhotos);
        localStorage.setItem(`petcare_photos_${email}`, JSON.stringify(initialPhotos));
      } else {
        setPhotos([]);
      }
    }

    // Load Appointments
    const savedAppointments = localStorage.getItem(`petcare_appointments_${email}`);
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    } else {
      if (email === 'sofia@example.com') {
        setAppointments(initialAppointments);
        localStorage.setItem(`petcare_appointments_${email}`, JSON.stringify(initialAppointments));
      } else {
        setAppointments([]);
      }
    }
  }, [currentUser]);

  // Synchronize state mutations to scoped LocalStorage keys
  useEffect(() => {
    if (!currentUser || pets.length === 0) return;
    localStorage.setItem(`petcare_pets_${currentUser.email}`, JSON.stringify(pets));
  }, [pets, currentUser]);

  useEffect(() => {
    if (!currentUser || !selectedPetId) return;
    localStorage.setItem(`petcare_selected_id_${currentUser.email}`, JSON.stringify(selectedPetId));
  }, [selectedPetId, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(`petcare_vaccines_${currentUser.email}`, JSON.stringify(vaccines));
  }, [vaccines, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(`petcare_records_${currentUser.email}`, JSON.stringify(medicalRecords));
  }, [medicalRecords, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(`petcare_photos_${currentUser.email}`, JSON.stringify(photos));
  }, [photos, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(`petcare_appointments_${currentUser.email}`, JSON.stringify(appointments));
  }, [appointments, currentUser]);

  useEffect(() => {
    localStorage.setItem('petcare_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const selectedPet = pets.find((pet) => pet.id === selectedPetId);

  // Database action methods
  const addPet = (newPet: Omit<Pet, 'id'>) => {
    if (!currentUser) return;
    const pet: Pet = {
      ...newPet,
      id: `pet-${Date.now()}`
    };
    setPets((prev) => [...prev, pet]);
    setSelectedPetId(pet.id);
  };

  const addVaccine = (newVaccine: Omit<Vaccine, 'id'>) => {
    if (!currentUser) return;
    const vaccine: Vaccine = {
      ...newVaccine,
      id: `v-${Date.now()}`
    };
    setVaccines((prev) => [vaccine, ...prev]);
  };

  const addMedicalRecord = (newRecord: Omit<MedicalRecord, 'id'>) => {
    if (!currentUser) return;
    const record: MedicalRecord = {
      ...newRecord,
      id: `mr-${Date.now()}`
    };
    setMedicalRecords((prev) => [record, ...prev]);
  };

  const addCheckupPhoto = (newPhoto: Omit<CheckupPhoto, 'id'>) => {
    if (!currentUser) return;
    const photo: CheckupPhoto = {
      ...newPhoto,
      id: `p-${Date.now()}`
    };
    setPhotos((prev) => [photo, ...prev]);
  };

  const addAppointment = (newAppointment: Omit<Appointment, 'id'>) => {
    if (!currentUser) return;
    const appointment: Appointment = {
      ...newAppointment,
      id: `a-${Date.now()}`
    };
    setAppointments((prev) => [appointment, ...prev]);
  };

  const addWeight = (petId: string, record: WeightRecord) => {
    if (!currentUser) return;
    setPets((prev) =>
      prev.map((p) =>
        p.id === petId
          ? { ...p, weightHistory: [...p.weightHistory, record] }
          : p
      )
    );
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const updatePet = (petId: string, updatedFields: Partial<Pet>) => {
    setPets((prev) =>
      prev.map((p) => (p.id === petId ? { ...p, ...updatedFields } : p))
    );
  };

  const deletePet = (petId: string) => {
    const updatedPets = pets.filter((p) => p.id !== petId);
    
    // Clear list
    setPets(updatedPets);
    
    // Scoped items clean up
    setVaccines((prev) => prev.filter((v) => v.petId !== petId));
    setMedicalRecords((prev) => prev.filter((r) => r.petId !== petId));
    setPhotos((prev) => prev.filter((p) => p.petId !== petId));
    setAppointments((prev) => prev.filter((a) => a.petId !== petId));

    // Reset selected ID
    if (selectedPetId === petId) {
      setSelectedPetId(updatedPets[0]?.id || '');
    }
  };

  const deleteVaccine = (vaccineId: string) => {
    setVaccines((prev) => prev.filter((v) => v.id !== vaccineId));
  };

  const deleteMedicalRecord = (recordId: string) => {
    setMedicalRecords((prev) => prev.filter((r) => r.id !== recordId));
  };

  const deleteCheckupPhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  // Auth Action Methods
  const login = (email: string, password: string): boolean => {
    const matchedAccount = accounts.find(
      (acc) => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
    );
    if (matchedAccount) {
      const loggedUser: User = { name: matchedAccount.name, email: matchedAccount.email };
      setCurrentUser(loggedUser);
      localStorage.setItem('petcare_current_user', JSON.stringify(loggedUser));
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, password: string): boolean => {
    const exists = accounts.some((acc) => acc.email.toLowerCase() === email.toLowerCase());
    if (exists) return false;

    const newAccount = { name, email: email.toLowerCase(), password };
    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);
    localStorage.setItem('petcare_accounts', JSON.stringify(updatedAccounts));

    const loggedUser: User = { name, email: email.toLowerCase() };
    setCurrentUser(loggedUser);
    localStorage.setItem('petcare_current_user', JSON.stringify(loggedUser));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('petcare_current_user');
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        selectedPet,
        vaccines,
        medicalRecords,
        photos,
        appointments,
        theme,
        currentUser,
        setSelectedPetId,
        addPet,
        addVaccine,
        addMedicalRecord,
        addCheckupPhoto,
        addAppointment,
        addWeight,
        toggleTheme,
        login,
        register,
        logout,
        updatePet,
        deletePet,
        deleteVaccine,
        deleteMedicalRecord,
        deleteCheckupPhoto
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

export const usePet = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePet must be used within a PetProvider');
  }
  return context;
};
