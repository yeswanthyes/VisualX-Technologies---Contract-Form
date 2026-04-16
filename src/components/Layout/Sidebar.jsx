import { useState } from 'react';
import { useContract } from '../../context/ContractContext';
import { ProgressBar } from '../UI/index.jsx';
import './Sidebar.css';

const STEPS = [
  { name: 'Parties Involved', sub: 'Company & Client details' },
  { name: 'Scope of Services', sub: 'What we deliver' },
  { name: 'Technology Stack', sub: 'Tools & frameworks' },
  { name: 'Payment Terms', sub: 'Cost & milestones' },
  { name: 'Project Timeline', sub: 'Start, phases & delivery' },
  { name: 'Revisions & Changes', sub: 'Revision policy' },
  { name: 'Client Responsibilities', sub: 'Client obligations' },
  { name: 'Legal Provisions', sub: 'IP, confidentiality & liability' },
  { name: 'Support & Maintenance', sub: 'Post-delivery support' },
  { name: 'Dispute Resolution', sub: 'Jurisdiction & force majeure' },
  { name: 'Optional Clauses', sub: 'NDA & AMC' },
  { name: 'Signatures', sub: 'Sign & finalize' },
];

export default function Sidebar() {
  const { state, dispatch } = useContract();
  const currentStep = state._step || 0;
  const [mobileOpen, setMobileOpen] = useState(false);

  const percent = Math.round((currentStep / (STEPS.length - 1)) * 100);

  const goToStep = (idx) => {
    if (idx <= currentStep) {
      dispatch({ type: 'SET_STEP', step: idx });
      setMobileOpen(false);
    }
  };

  return (
    <>
      <nav className={`sidebar no-print ${mobileOpen ? 'open' : ''}`} aria-label="Form navigation">
        <div className="sidebar-progress-wrapper">
          <div className="sidebar-progress-label">
            <span className="sidebar-progress-title">Progress</span>
            <span className="sidebar-progress-pct">{percent}%</span>
          </div>
          <ProgressBar percent={percent} />
        </div>

        <ol className="sidebar-steps">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;
            const isDisabled = idx > currentStep;

            return (
              <li
                key={idx}
                className={`sidebar-step-item ${isCompleted ? 'completed' : ''}`}
              >
                <button
                  className={`sidebar-step-btn ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => goToStep(idx)}
                  disabled={isDisabled}
                  aria-current={isActive ? 'step' : undefined}
                  id={`sidebar-step-${idx}`}
                >
                  <div className="sidebar-step-number">
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <div className="sidebar-step-text">
                    <span className="sidebar-step-name">{step.name}</span>
                    <span className="sidebar-step-sub">{step.sub}</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 140 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <button
        className="sidebar-mobile-toggle no-print"
        onClick={() => setMobileOpen(v => !v)}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? '✕' : '☰'}
      </button>
    </>
  );
}
