import { useContract } from '../../context/ContractContext';
import { InputField, Toggle } from '../UI/index.jsx';
import './FormSteps.css';

export default function StepOptional() {
  const { state, dispatch } = useContract();
  const opt = state.optional;

  const toggleField = (field) => () =>
    dispatch({ type: 'UPDATE_FIELD', path: ['optional', field], value: !opt[field] });

  const update = (field) => (e) =>
    dispatch({ type: 'UPDATE_FIELD', path: ['optional', field], value: e.target.value });

  const updatePlan = (idx, field, val) => {
    const updated = opt.amcPlans.map((p, i) => i === idx ? { ...p, [field]: val } : p);
    dispatch({ type: 'UPDATE_SECTION', section: 'optional', payload: { amcPlans: updated } });
  };

  return (
    <div className="step-enter">
      <div className="info-box">
        <span className="info-box-icon">⭐</span>
        <span>These optional clauses are appended as Annexures to the agreement. Enable only what's required for this engagement.</span>
      </div>

      {/* NDA */}
      <div className={`optional-card ${opt.ndaEnabled ? 'enabled' : ''}`}>
        <div className="optional-card-header">
          <div>
            <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>
              Annexure A — Non-Disclosure Agreement (NDA)
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Extended confidentiality with injunctive relief rights
            </div>
          </div>
          <Toggle
            id="opt-nda"
            checked={opt.ndaEnabled}
            onChange={toggleField('ndaEnabled')}
          />
        </div>
        {opt.ndaEnabled && (
          <div className="optional-card-body">
            <InputField
              label="NDA Duration (years from date of disclosure)"
              id="nda-years"
              type="number"
              min="1"
              max="10"
              value={opt.ndaYears}
              onChange={update('ndaYears')}
              hint="Standard: 3 years"
            />
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--color-text-secondary)' }}>NDA covers:</strong> Source code, database schemas, business models, PII, API keys, credentials, proprietary workflows, and anything disclosed during meetings or demonstrations.
            </div>
          </div>
        )}
      </div>

      {/* AMC */}
      <div className={`optional-card ${opt.amcEnabled ? 'enabled' : ''}`}>
        <div className="optional-card-header">
          <div>
            <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>
              Annexure B — Annual Maintenance Contract (AMC)
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Post-delivery paid maintenance with SLA tiers
            </div>
          </div>
          <Toggle
            id="opt-amc"
            checked={opt.amcEnabled}
            onChange={toggleField('amcEnabled')}
          />
        </div>
        {opt.amcEnabled && (
          <div className="optional-card-body">
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
              AMC Plan Pricing (₹)
            </div>
            {opt.amcPlans.map((plan, idx) => (
              <div key={idx} className="grid-2" style={{ marginBottom: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span style={{
                    padding: '2px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 11,
                    fontWeight: 700,
                    background: ['var(--color-bg-glass)','var(--color-accent-soft)','var(--color-cyan-soft)'][idx],
                    color: ['var(--color-text-secondary)','var(--color-accent-hover)','var(--color-cyan)'][idx],
                  }}>
                    {plan.name}
                  </span>
                </div>
                <InputField
                  label={`${plan.name} Plan — Annual Fee (₹)`}
                  id={`amc-plan-${idx}`}
                  type="number"
                  min="0"
                  value={plan.annualFee}
                  onChange={(e) => updatePlan(idx, 'annualFee', e.target.value)}
                  placeholder="e.g., 12000"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
