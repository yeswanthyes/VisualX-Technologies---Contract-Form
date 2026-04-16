import { useContract } from '../../context/ContractContext';
import { InputField } from '../UI/index.jsx';
import './FormSteps.css';

function SignatureFields({ prefix, title, badgeClass, badgeLabel }) {
  const { state, dispatch } = useContract();
  const sig = state.signatures[prefix];

  const update = (field) => (e) =>
    dispatch({ type: 'UPDATE_FIELD', path: ['signatures', prefix, field], value: e.target.value });

  return (
    <div className="step-subsection">
      <div className="step-subsection-title">
        <span className={`party-badge ${badgeClass}`}>{badgeLabel}</span>
        {title}
      </div>
      <div className="grid-2">
        <InputField
          label="Full Name"
          id={`sig-${prefix}-name`}
          value={sig.name}
          onChange={update('name')}
          placeholder="Authorized signatory name"
        />
        <InputField
          label="Designation"
          id={`sig-${prefix}-designation`}
          value={sig.designation}
          onChange={update('designation')}
          placeholder="e.g., CEO, Director"
        />
      </div>
      <div className="grid-2">
        <InputField
          label="Date of Signing"
          id={`sig-${prefix}-date`}
          type="date"
          value={sig.date}
          onChange={update('date')}
        />
        <InputField
          label="Place of Signing"
          id={`sig-${prefix}-place`}
          value={sig.place}
          onChange={update('place')}
          placeholder="e.g., Chennai, Tamil Nadu"
        />
      </div>
    </div>
  );
}

export default function StepSignatures() {
  return (
    <div className="step-enter">
      <div className="info-box">
        <span className="info-box-icon">✍️</span>
        <span>Enter signatory details for both parties. The signature lines and seal placeholders will appear in the generated PDF agreement.</span>
      </div>

      <div className="step-section">
        <div className="step-section-title">
          <div className="step-section-title-icon">📝</div>
          Signature Details
        </div>
        <SignatureFields
          prefix="company"
          title="VisualX Technologies Representative"
          badgeClass="party-badge-company"
          badgeLabel="Company"
        />
        <SignatureFields
          prefix="client"
          title="Client Representative"
          badgeClass="party-badge-client"
          badgeLabel="Client"
        />
      </div>

      <div style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(6,182,212,0.05))',
        border: '1px solid rgba(59,130,246,0.2)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>🎉</div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
          Agreement Ready!
        </div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          Click <strong style={{ color: 'var(--color-accent-hover)' }}>"Preview & Export"</strong> to review the complete agreement and download it as a PDF.
        </div>
      </div>
    </div>
  );
}
