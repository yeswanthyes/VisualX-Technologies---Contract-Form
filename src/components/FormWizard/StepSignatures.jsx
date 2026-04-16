import { useRef } from 'react';
import { useContract } from '../../context/ContractContext';
import { InputField } from '../UI/index.jsx';
import './FormSteps.css';

function SignatureFields({ prefix, title, badgeClass, badgeLabel }) {
  const { state, dispatch } = useContract();
  const sig = state.signatures[prefix];
  const fileInputRef = useRef(null);

  const update = (field) => (e) =>
    dispatch({ type: 'UPDATE_FIELD', path: ['signatures', prefix, field], value: e.target.value });

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      dispatch({ type: 'UPDATE_FIELD', path: ['signatures', prefix, 'signatureImage'], value: evt.target.result });
    };
    reader.readAsDataURL(file);
  };

  const clearSignature = () => {
    dispatch({ type: 'UPDATE_FIELD', path: ['signatures', prefix, 'signatureImage'], value: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="step-subsection" style={{ marginBottom: 'var(--space-5)' }}>
      <div className="step-subsection-title">
        <span className={`party-badge ${badgeClass}`}>{badgeLabel}</span>
        {title}
      </div>

      {/* Text fields */}
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

      {/* Signature Upload */}
      <div className="field-group">
        <label className="field-label">Upload Signature (Optional)</label>
        <div className="sig-upload-area" onClick={() => fileInputRef.current?.click()}>
          {sig.signatureImage ? (
            <div className="sig-upload-preview">
              <img
                src={sig.signatureImage}
                alt="Uploaded signature"
                className="sig-preview-img"
              />
              <button
                type="button"
                className="sig-clear-btn"
                onClick={(e) => { e.stopPropagation(); clearSignature(); }}
              >
                ✕ Remove
              </button>
            </div>
          ) : (
            <div className="sig-upload-placeholder">
              <div className="sig-upload-icon">✍️</div>
              <div className="sig-upload-text">Click to upload signature image</div>
              <div className="sig-upload-hint">PNG, JPG, SVG — transparent background recommended</div>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/gif"
          onChange={handleSignatureUpload}
          style={{ display: 'none' }}
          id={`sig-upload-${prefix}`}
        />
        <span className="field-hint">Signature will appear in the printed/exported agreement.</span>
      </div>
    </div>
  );
}

export default function StepSignatures() {
  return (
    <div className="step-enter">
      <div className="info-box">
        <span className="info-box-icon">✍️</span>
        <span>Enter signatory details and optionally upload a signature image. If provided, the signature will be embedded directly in the exported PDF agreement.</span>
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
          Click <strong style={{ color: 'var(--color-accent-hover)' }}>"Preview &amp; Export PDF"</strong> to review the complete agreement and download it as a professionally formatted PDF document.
        </div>
      </div>
    </div>
  );
}
