import { useContract } from '../../context/ContractContext';
import { InputField, Toggle } from '../UI/index.jsx';
import './FormSteps.css';

export default function StepLegal() {
  const { state, dispatch } = useContract();
  const legal = state.legal;

  const update = (field) => (e) =>
    dispatch({ type: 'UPDATE_FIELD', path: ['legal', field], value: e.target.value });
  const toggleField = (field) => () =>
    dispatch({ type: 'UPDATE_FIELD', path: ['legal', field], value: !legal[field] });

  const updateRefund = (idx, field, val) => {
    const updated = legal.refundTiers.map((r, i) => i === idx ? { ...r, [field]: val } : r);
    dispatch({ type: 'UPDATE_SECTION', section: 'legal', payload: { refundTiers: updated } });
  };

  return (
    <div className="step-enter">
      <div className="step-section">
        <div className="step-section-title">
          <div className="step-section-title-icon">🔒</div>
          Confidentiality
        </div>
        <div className="step-subsection">
          <InputField
            label="Confidentiality Obligation Duration (years after termination)"
            id="legal-conf-years"
            type="number"
            min="1"
            max="10"
            value={legal.confidentialityYears}
            onChange={update('confidentialityYears')}
            hint="Standard: 2 years"
          />
        </div>
      </div>

      <div className="step-section">
        <div className="step-section-title">
          <div className="step-section-title-icon">©️</div>
          Intellectual Property Rights
        </div>
        <div className="step-subsection">
          <Toggle
            id="legal-ip"
            label="Ownership of deliverables transfers to Client upon full payment"
            checked={legal.ipTransferOnPayment}
            onChange={toggleField('ipTransferOnPayment')}
          />
          <Toggle
            id="legal-portfolio"
            label="VisualX retains portfolio & promotional rights for the completed project"
            checked={legal.portfolioRights}
            onChange={toggleField('portfolioRights')}
          />
        </div>
      </div>

      <div className="step-section">
        <div className="step-section-title">
          <div className="step-section-title-icon">⚖️</div>
          Warranty & Liability
        </div>
        <div className="step-subsection">
          <div className="grid-2">
            <InputField
              label="Warranty Period (days from final delivery)"
              id="legal-warranty"
              type="number"
              min="1"
              value={legal.warrantyDays}
              onChange={update('warrantyDays')}
              hint="Standard: 30 days"
            />
          </div>
          <Toggle
            id="legal-liab"
            label="Liability cap: VisualX liability limited to total fees paid"
            checked={legal.liabilityCap}
            onChange={toggleField('liabilityCap')}
          />
        </div>
      </div>

      <div className="step-section">
        <div className="step-section-title">
          <div className="step-section-title-icon">💰</div>
          Termination & Refund Policy
        </div>
        <div className="step-subsection">
          {legal.refundTiers.map((tier, idx) => (
            <div key={idx} className="refund-row" style={{ marginBottom: 'var(--space-3)' }}>
              <InputField
                label={`Stage ${idx + 1}: Termination Point`}
                id={`refund-stage-${idx}`}
                value={tier.stage}
                onChange={(e) => updateRefund(idx, 'stage', e.target.value)}
              />
              <InputField
                label="Refund to Client"
                id={`refund-amt-${idx}`}
                value={tier.refund}
                onChange={(e) => updateRefund(idx, 'refund', e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
