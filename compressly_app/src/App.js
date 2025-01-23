import './App.css';
import Main from './components/Main';
import { useState } from 'react';

function App() {
  const [showAboutModal, setShowAboutModal] = useState(false);
  return (
    <div className="app">
      <Main showAboutModal={showAboutModal} onCloseModal={() => setShowAboutModal(false)} />
    </div>
  );
}

export default App;
