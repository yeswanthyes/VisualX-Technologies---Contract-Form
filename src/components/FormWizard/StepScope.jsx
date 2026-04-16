import { useContract } from '../../context/ContractContext';
import { Checkbox, Toggle, TextArea } from '../UI/index.jsx';
import './FormSteps.css';

export default function StepScope() {
  const { state, dispatch } = useContract();
  const scope = state.scope;

  const toggle = (field) => () =>
    dispatch({ type: 'UPDATE_FIELD', path: ['scope', field], value: !scope[field] });

  const updateText = (e) =>
    dispatch({ type: 'UPDATE_FIELD', path: ['scope', 'customScope'], value: e.target.value });

  return (
    <div className="step-enter">
      <div className="info-box">
        <span className="info-box-icon">📦</span>
        <span>Select the services included in this engagement. These will populate the Scope of Services section in the final agreement.</span>
      </div>

      <div className="step-section">
        <div className="step-section-title">
          <div className="step-section-title-icon">🌐</div>
          Core Services
        </div>
        <div className="step-subsection">
          <Checkbox
            id="scope-website"
            label="Website Development — Responsive, standards-compliant websites"
            checked={scope.websiteDev}
            onChange={toggle('websiteDev')}
          />
          <Checkbox
            id="scope-webapp"
            label="Web Application Development — Scalable, full-stack web apps"
            checked={scope.webAppDev}
            onChange={toggle('webAppDev')}
          />
          <Checkbox
            id="scope-desktop"
            label="Desktop Application Development (Electron.js) — Cross-platform desktop apps"
            checked={scope.desktopAppDev}
            onChange={toggle('desktopAppDev')}
          />
          <Checkbox
            id="scope-uiux"
            label="UI/UX Design — Wireframes, prototypes, thumbnail & brand design"
            checked={scope.uiuxDesign}
            onChange={toggle('uiuxDesign')}
          />
        </div>
      </div>

      {scope.desktopAppDev && (
        <div className="step-section">
          <div className="step-section-title">
            <div className="step-section-title-icon">🖥️</div>
            Electron Desktop App — Sub-Modules
          </div>
          <div className="step-subsection">
            <Toggle
              id="scope-quotation"
              label="Quotation Management Module — Create, manage & export quotations as PDF"
              checked={scope.quotationModule}
              onChange={toggle('quotationModule')}
            />
            <Toggle
              id="scope-payment"
              label="Payment Integration Module — Razorpay integration for in-app payments"
              checked={scope.paymentModule}
              onChange={toggle('paymentModule')}
            />
          </div>
        </div>
      )}

      <div className="step-section">
        <div className="step-section-title">
          <div className="step-section-title-icon">✏️</div>
          Additional Scope (Optional)
        </div>
        <TextArea
          id="scope-custom"
          label="Custom scope notes"
          value={scope.customScope}
          onChange={updateText}
          placeholder="Describe any additional services or specific requirements not covered above..."
          hint="This will appear as an 'Additional Services' sub-section in the agreement."
        />
      </div>
    </div>
  );
}
