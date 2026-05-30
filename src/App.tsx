import React, { useState } from 'react';
import { PetProvider, usePet } from './context/PetContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { PetSelector } from './components/PetSelector';

// Screens
import { Dashboard } from './screens/Dashboard';
import { Vaccines } from './screens/Vaccines';
import { History } from './screens/History';
import { Gallery } from './screens/Gallery';
import { Settings } from './screens/Settings';
import { Auth } from './screens/Auth';

const AppContent: React.FC = () => {
  const { currentUser } = usePet();
  const [currentScreen, setCurrentScreen] = useState<string>('dashboard');
  const [isPetSelectorOpen, setIsPetSelectorOpen] = useState<boolean>(false);

  if (!currentUser) {
    return <Auth />;
  }

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'vaccines':
        return <Vaccines />;
      case 'history':
        return <History />;
      case 'gallery':
        return <Gallery />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <Header onOpenPetSelector={() => setIsPetSelectorOpen(true)} />

      {/* Main Screen Content */}
      {renderActiveScreen()}

      {/* Bottom Nav */}
      <BottomNav currentScreen={currentScreen} setScreen={setCurrentScreen} />

      {/* Pet Selector Bottom Sheet */}
      <PetSelector 
        isOpen={isPetSelectorOpen} 
        onClose={() => setIsPetSelectorOpen(false)} 
      />
    </div>
  );
};

function App() {
  return (
    <PetProvider>
      <AppContent />
    </PetProvider>
  );
}

export default App;
