import { useContract } from '../../context/ContractContext';
import { InputField, Checkbox } from '../UI/index.jsx';
import { calcCompletionDate, formatDate } from '../../utils/formatCurrency';
import './FormSteps.css';

export default function StepTimeline() {
  const { state, dispatch } = useContract();
  const timeline = state.timeline;

  const update = (field) => (e) =>
    dispatch({ type: 'UPDATE_FIELD', path: ['timeline', field], value: e.target.value });

  const toggleClause = (field) => () =>
    dispatch({ type: 'UPDATE_FIELD', path: ['timeline', field], value: !timeline[field] });

  const updatePhase = (idx, val) => {
    const updated = timeline.phases.map((p, i) => i === idx ? { ...p, days: Number(val) } : p);
    dispatch({ type: 'UPDATE_SECTION', section: 'timeline', payload: { phases: updated } });
  };

  const totalDays = timeline.phases.reduce((s, p) => s + (parseInt(p.days) || 0), 0);
  const completionDate = calcCompletionDate(timeline.startDate, timeline.phases);

  return (
    <div className="step-enter">
      <div className="step-section">
        <div className="step-section-title">
          <div className="step-section-title-icon">📅</div>
          Project Schedule
        </div>
        <div className="step-subsection">
          <div className="grid-2">
            <InputField
              label="Project Start Date"
              id="timeline-start"
              type="date"
              value={timeline.startDate}
              onChange={update('startDate')}
              required
            />
            <div className="field-group">
              <label className="field-label">Estimated Completion Date</label>
              <div style={{
                background: 'rgba(6,182,212,0.06)',
                border: '1px solid rgba(6,182,212,0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 0.9rem',
                color: completionDate ? 'var(--color-cyan)' : 'var(--color-text-placeholder)',
                fontSize: 'var(--text-sm)',
                fontWeight: completionDate ? '600' : '400',
              }}>
                {completionDate || 'Auto-calculated from phases below'}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-4)' }}>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
              Project Phases (Duration in Days)
            </div>
            {timeline.phases.map((phase, idx) => (
              <div key={idx} className="phase-row">
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', paddingBottom: '6px' }}>
                  {phase.name}
                </div>
                <InputField
                  id={`phase-${idx}`}
                  type="number"
                  min="1"
                  value={phase.days}
                  onChange={(e) => updatePhase(idx, e.target.value)}
                />
              </div>
            ))}

            <div style={{
              marginTop: 'var(--space-4)',
              padding: 'var(--space-3)',
              background: 'var(--color-accent-soft)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 'var(--text-sm)',
            }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Total Estimated Duration</span>
              <strong style={{ color: 'var(--color-accent-hover)' }}>{totalDays} working days</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="step-section">
        <div className="step-section-title">
          <div className="step-section-title-icon">⏸️</div>
          Delay Conditions (Include in Agreement)
        </div>
        <div className="step-subsection">
          <Checkbox id="delay-client" label="Client-side delays (late content, approvals, credentials)" checked={timeline.clientDelayClause} onChange={toggleClause('clientDelayClause')} />
          <Checkbox id="delay-revision" label="Revision-related delays (out-of-scope revisions)" checked={timeline.revisionDelayClause} onChange={toggleClause('revisionDelayClause')} />
          <Checkbox id="delay-thirdparty" label="Third-party dependency delays (APIs, hosting, domains)" checked={timeline.thirdPartyDelayClause} onChange={toggleClause('thirdPartyDelayClause')} />
          <Checkbox id="delay-fm" label="Force majeure event delays (extending timeline automatically)" checked={timeline.forceMajeureDelayClause} onChange={toggleClause('forceMajeureDelayClause')} />
        </div>
      </div>
    </div>
  );
}
