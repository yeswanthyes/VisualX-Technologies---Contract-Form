import { useContract } from '../../context/ContractContext';
import { InputField, Toggle, Checkbox } from '../UI/index.jsx';
import './FormSteps.css';

export default function StepClient() {
  const { state, dispatch } = useContract();
  const cr = state.clientResp;

  const update = (field) => (e) =>
    dispatch({ type: 'UPDATE_FIELD', path: ['clientResp', field], value: e.target.value });
  const toggleField = (field) => () =>
    dispatch({ type: 'UPDATE_FIELD', path: ['clientResp', field], value: !cr[field] });

  return (
    <div className="step-enter">
      <div className="info-box">
        <span className="info-box-icon">🤝</span>
        <span>These obligations will be listed under the Client Responsibilities section to protect VisualX against delays caused by the client.</span>
      </div>

      <div className="step-section">
        <div className="step-section-title">
          <div className="step-section-title-icon">📁</div>
          Content & Asset Delivery
        </div>
        <div className="step-subsection">
          <InputField
            label="Content & Assets Delivery Window (business days after request)"
            id="cr-content-days"
            type="number"
            min="1"
            value={cr.contentDeliveryDays}
            onChange={update('contentDeliveryDays')}
            hint="Standard: 5 business days"
          />
        </div>
      </div>

      <div className="step-section">
        <div className="step-section-title">
          <div className="step-section-title-icon">💬</div>
          Feedback & Approvals
        </div>
        <div className="step-subsection">
          <InputField
            label="Feedback / Approval Response Window (business days)"
            id="cr-feedback-days"
            type="number"
            min="1"
            value={cr.feedbackDays}
            onChange={update('feedbackDays')}
            hint="Standard: 3 business days. Missed deadline = implied acceptance."
          />
          <Toggle
            id="cr-poc"
            label="Require Client to designate a Single Point of Contact (POC) for all communications"
            checked={cr.singlePOC}
            onChange={toggleField('singlePOC')}
          />
        </div>
      </div>

      <div className="step-section">
        <div className="step-section-title">
          <div className="step-section-title-icon">🔑</div>
          Credentials & Access
        </div>
        <div className="step-subsection">
          <Checkbox
            id="cr-pg"
            label="Client must provide payment gateway credentials (Razorpay / Stripe / PayU API keys) if required"
            checked={cr.paymentGatewayAccounts}
            onChange={toggleField('paymentGatewayAccounts')}
          />
          <Checkbox
            id="cr-legal"
            label="Client ensures all provided content complies with applicable IP laws and regulations"
            checked={cr.legalCompliance}
            onChange={toggleField('legalCompliance')}
          />
        </div>
      </div>
    </div>
  );
}
