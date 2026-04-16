import { useContract } from '../../context/ContractContext';
import { InputField } from '../UI/index.jsx';
import './FormSteps.css';

export default function StepSupport() {
  const { state, dispatch } = useContract();
  const support = state.support;

  const update = (field) => (e) =>
    dispatch({ type: 'UPDATE_FIELD', path: ['support', field], value: e.target.value });

  const updateSla = (idx, field, val) => {
    const updated = support.sla.map((row, i) => i === idx ? { ...row, [field]: val } : row);
    dispatch({ type: 'UPDATE_SECTION', section: 'support', payload: { sla: updated } });
  };

  return (
    <div className="step-enter">
      <div className="step-section">
        <div className="step-section-title">
          <div className="step-section-title-icon">🛡️</div>
          Free Support Period
        </div>
        <div className="step-subsection">
          <div className="grid-2">
            <InputField
              label="Free Support Duration (days after final delivery)"
              id="support-days"
              type="number"
              min="1"
              value={support.freeSupportDays}
              onChange={update('freeSupportDays')}
              hint="Standard: 30 days"
            />
            <InputField
              label="Business Hours"
              id="support-hours"
              value={support.supportHours}
              onChange={update('supportHours')}
            />
          </div>
          <div className="grid-2">
            <InputField
              label="Support Email"
              id="support-email"
              type="email"
              value={support.supportEmail}
              onChange={update('supportEmail')}
              placeholder="support@visualxtechnologies.com"
            />
            <InputField
              label="Support Phone"
              id="support-phone"
              type="tel"
              value={support.supportPhone}
              onChange={update('supportPhone')}
              placeholder="+91 98765 43210"
            />
          </div>
        </div>
      </div>

      <div className="step-section">
        <div className="step-section-title">
          <div className="step-section-title-icon">📊</div>
          Service Level Agreement (SLA) Response Times
        </div>
        <div className="step-subsection">
          <table className="sla-table">
            <thead>
              <tr>
                <th>Priority</th>
                <th>Description</th>
                <th>Response Time</th>
              </tr>
            </thead>
            <tbody>
              {support.sla.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    <span style={{
                      fontWeight: 600,
                      color: ['#ef4444','#f97316','#eab308','#64748b'][idx] || 'var(--color-text-secondary)'
                    }}>
                      {row.priority}
                    </span>
                  </td>
                  <td>
                    <input
                      className="field-input"
                      value={row.description}
                      onChange={(e) => updateSla(idx, 'description', e.target.value)}
                      style={{ padding: '4px 8px' }}
                    />
                  </td>
                  <td>
                    <input
                      className="field-input"
                      value={row.responseTime}
                      onChange={(e) => updateSla(idx, 'responseTime', e.target.value)}
                      style={{ padding: '4px 8px', width: '120px' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
