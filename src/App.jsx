import { useState } from 'react';
import { ContractProvider } from './context/ContractContext';
import Header from './components/Layout/Header.jsx';
import Sidebar from './components/Layout/Sidebar.jsx';
import FormWizard from './components/FormWizard/FormWizard.jsx';
import ContractPreview from './components/Preview/ContractPreview.jsx';
import './App.css';

function AppShell() {
  const [showPreview, setShowPreview] = useState(false);

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
