import { useContract } from '../../context/ContractContext';
import { InputField, Toggle } from '../UI/index.jsx';
import './FormSteps.css';

export default function StepDispute() {
  const { state, dispatch } = useContract();
  const dispute = state.dispute;

  const update = (field) => (e) =>
    dispatch({ type: 'UPDATE_FIELD', path: ['dispute', field], value: e.target.value });
  const toggleField = (field) => () =>
    dispatch({ type: 'UPDATE_FIELD', path: ['dispute', field], value: !dispute[field] });

  return (
    <div className="step-enter">
      <div className="step-section">
        <div className="step-section-title">
          <div className="step-section-title-icon">⚖️</div>
          Dispute Resolution
        </div>
        <div className="step-subsection">
          <div className="grid-2">
            <InputField
              label="Legal Jurisdiction"
              id="dispute-jurisdiction"
              value={dispute.jurisdiction}
              onChange={update('jurisdiction')}
              hint="Default: Tamil Nadu, India"
              required
            />
            <InputField
              label="Good-faith Negotiation Period (days)"
              id="dispute-negotiation"
              type="number"
              min="1"
              value={dispute.negotiationDays}
              onChange={update('negotiationDays')}
            />
          </div>
          <InputField
            label="Mediation Window (days, if negotiation fails)"
            id="dispute-mediation"
            type="number"
            min="1"
            value={dispute.mediationDays}
            onChange={update('mediationDays')}
          />
          <Toggle
            id="dispute-arbitration"
            label="Include Binding Arbitration clause (Arbitration & Conciliation Act, 1996)"
            checked={dispute.arbitrationEnabled}
            onChange={toggleField('arbitrationEnabled')}
          />
        </div>
      </div>

      <div className="step-section">
        <div className="step-section-title">
          <div className="step-section-title-icon">🌪️</div>
          Force Majeure
        </div>
        <div className="step-subsection">
          <div className="grid-2">
            <InputField
              label="Force Majeure Termination Threshold (days)"
              id="fm-days"
              type="number"
              min="1"
              value={dispute.forceMajeureDays}
              onChange={update('forceMajeureDays')}
              hint="If event lasts beyond this, either party may terminate"
            />
            <InputField
              label="Notification Obligation (hours after event)"
              id="fm-notice"
              type="number"
              min="1"
              value={dispute.forceMajeureNoticehours}
              onChange={update('forceMajeureNoticehours')}
              hint="Standard: 48 hours"
            />
          </div>
          <div className="info-box" style={{ marginTop: 'var(--space-3)' }}>
            <span className="info-box-icon">📋</span>
            <span>
              Force majeure covers: Acts of God, government actions, infrastructure failures, third-party service disruptions (Razorpay outages, API failures), civil unrest, and cyberattacks.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
