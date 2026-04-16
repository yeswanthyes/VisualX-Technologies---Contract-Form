import './UI.css';

export function Button({ children, variant = 'primary', size = '', className = '', ...props }) {
  return (
    <button
      className={`btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function InputField({ label, required, hint, id, ...props }) {
  return (
    <div className="field-group">
      {label && (
        <label className="field-label" htmlFor={id}>
          {label}{required && <span className="required"> *</span>}
        </label>
      )}
      <input id={id} className="field-input" {...props} />
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}

export function SelectField({ label, required, hint, id, children, ...props }) {
  return (
    <div className="field-group">
      {label && (
        <label className="field-label" htmlFor={id}>
          {label}{required && <span className="required"> *</span>}
        </label>
      )}
      <select id={id} className="field-select" {...props}>
        {children}
      </select>
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}

export function TextArea({ label, required, hint, id, ...props }) {
  return (
    <div className="field-group">
      {label && (
        <label className="field-label" htmlFor={id}>
          {label}{required && <span className="required"> *</span>}
        </label>
      )}
      <textarea id={id} className="field-textarea" {...props} />
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}

export function Toggle({ label, checked, onChange, id }) {
  return (
    <label className="toggle-wrapper" htmlFor={id}>
      <div className={`toggle-track ${checked ? 'active' : ''}`} onClick={onChange} id={id}>
        <div className="toggle-thumb" />
      </div>
      <span className="toggle-label">{label}</span>
    </label>
  );
}

export function Checkbox({ label, checked, onChange, id }) {
  return (
    <label className="checkbox-wrapper" htmlFor={id} onClick={onChange}>
      <div className={`checkbox-box ${checked ? 'checked' : ''}`} id={id}>
        {checked && <span className="check-icon">✓</span>}
      </div>
      <span className="checkbox-label">{label}</span>
    </label>
  );
}

export function ProgressBar({ percent }) {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
    </div>
  );
}
