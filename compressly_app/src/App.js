import './App.css';
import Navbar from './components/Navbar';
import Main from './components/Main';
import { useState } from 'react';

function App() {
  const [showAboutModal, setShowAboutModal] = useState(false);
  return (
    <div className="app">
      <Navbar onAboutClick={() => setShowAboutModal(true)} />
      <Main showAboutModal={showAboutModal} onCloseModal={() => setShowAboutModal(false)} />
    </div>
  );
}

export default App;
