import { useState, useEffect } from 'react';
import { useContract, ContractProvider } from './context/ContractContext';
import Header from './components/Layout/Header.jsx';
import Sidebar from './components/Layout/Sidebar.jsx';
import FormWizard from './components/FormWizard/FormWizard.jsx';
import ContractPreview from './components/Preview/ContractPreview.jsx';
import './App.css';

function AppShell() {
  const [showPreview, setShowPreview] = useState(false);
  const { dispatch } = useContract();

  // Expose global for Electron menu
  useEffect(() => {
    window.__resetForm = () => {
      if (window.confirm('Start a new agreement? All data will be cleared.')) {
        dispatch({ type: 'RESET_FORM' });
      }
    };
    return () => delete window.__resetForm;
  }, [dispatch]);

  return (
    <div className="app-shell">
      <Header />
      <Sidebar />
      <main className="app-main">
        <FormWizard onPreview={() => setShowPreview(true)} />
      </main>
      {showPreview && (
        <ContractPreview onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ContractProvider>
      <AppShell />
    </ContractProvider>
  );
}
