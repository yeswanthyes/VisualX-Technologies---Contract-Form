import { useContract } from '../../context/ContractContext';
import { InputField, Toggle } from '../UI/index.jsx';
import './FormSteps.css';

export default function StepTechStack() {
  const { state, dispatch } = useContract();
  const stack = state.techStack;

  const toggleRow = (id) => () => {
    const idx = stack.findIndex(r => r.id === id);
    dispatch({ type: 'UPDATE_ARRAY_ITEM', section: 'techStack', field: '__root__', index: idx, payload: { enabled: !stack[idx].enabled } });
  };

  // Since techStack is a top-level array, we need a different approach
  const updateStack = (idx, field, value) => {
    const updated = stack.map((row, i) => i === idx ? { ...row, [field]: value } : row);
    dispatch({ type: 'UPDATE_SECTION', section: 'techStack', payload: updated });
  };

  // Handle array at top level
  const dispatchArray = (updated) =>
    dispatch({ type: 'UPDATE_FIELD', path: ['techStack'], value: updated });

  const handleToggle = (idx) => () => {
    const updated = stack.map((row, i) => i === idx ? { ...row, enabled: !row.enabled } : row);
    dispatchArray(updated);
  };

  const handleTech = (idx, val) => {
    const updated = stack.map((row, i) => i === idx ? { ...row, tech: val } : row);
    dispatchArray(updated);
  };

  return (
    <div className="step-enter">
      <div className="info-box">
        <span className="info-box-icon">⚙️</span>
        <span>Pre-filled with the standard VisualX tech stack. Toggle rows on/off and edit technology names as needed for this specific project.</span>
      </div>

      <div className="step-section">
        <div className="step-section-title">
          <div className="step-section-title-icon">🔧</div>
          Technology Stack
        </div>
        <div className="step-subsection">
          {stack.map((row, idx) => (
            <div key={row.id} className="tech-stack-row">
              <Toggle
                id={`tech-toggle-${row.id}`}
                checked={row.enabled}
                onChange={handleToggle(idx)}
              />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                {row.layer}
              </span>
              <InputField
                id={`tech-value-${row.id}`}
                value={row.tech}
                onChange={(e) => handleTech(idx, e.target.value)}
                placeholder="Technology..."
                style={{ opacity: row.enabled ? 1 : 0.35 }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="step-section">
        <div className="step-section-title">
          <div className="step-section-title-icon">📋</div>
          Additional Terms
        </div>
        <div className="step-subsection" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
          <p style={{ marginBottom: 'var(--space-3)' }}>
            ✅ The final selection of the technology stack will be determined by <strong>VisualX Technologies</strong> based on project requirements, performance, and scalability considerations.
          </p>
          <p style={{ marginBottom: 'var(--space-3)' }}>
            ⚠️ Any request by the Client to change the agreed technology stack after project initiation may result in <strong>additional charges and revised timelines</strong>.
          </p>
          <p>
            🔒 VisualX is not responsible for limitations, downtime, or policy changes of <strong>third-party services</strong> such as payment gateways or APIs.
          </p>
        </div>
      </div>
    </div>
  );
}
