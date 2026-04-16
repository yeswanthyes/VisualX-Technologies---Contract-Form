import { useContract } from '../../context/ContractContext';
import { InputField } from '../UI/index.jsx';
import './FormSteps.css';

function PartyFields({ prefix, badge, badgeClass }) {
  const { state, dispatch } = useContract();
  const data = state[prefix];

  const update = (field) => (e) =>
    dispatch({ type: 'UPDATE_FIELD', path: [prefix, field], value: e.target.value });

  return (
    <div className="step-subsection">
      <div className="step-subsection-title">
        <span className={`party-badge ${badgeClass}`}>{badge}</span>
        {prefix === 'company' ? 'VisualX Technologies (Service Provider)' : 'Client Details'}
      </div>
      <div className="grid-2">
        <InputField
          label={prefix === 'company' ? 'Company Name' : 'Client / Company Name'}
          id={`${prefix}-name`}
          value={data.name}
          onChange={update('name')}
          placeholder={prefix === 'company' ? 'VisualX Technologies' : 'Client Name or Company'}
          required
        />
        <InputField
          label="Email Address"
          id={`${prefix}-email`}
          type="email"
          value={data.email}
          onChange={update('email')}
          placeholder="contact@example.com"
        />
      </div>
      <InputField
        label="Registered Address"
        id={`${prefix}-address`}
        value={data.address}
        onChange={update('address')}
        placeholder="Street address, Building, Area"
      />
      <div className="grid-3">
        <InputField
          label="City"
          id={`${prefix}-city`}
          value={data.city}
          onChange={update('city')}
          placeholder="City"
        />
        <InputField
          label="State"
          id={`${prefix}-state`}
          value={data.state}
          onChange={update('state')}
          placeholder="State"
        />
        <InputField
          label="PIN Code"
          id={`${prefix}-pin`}
          value={data.pin}
          onChange={update('pin')}
          placeholder="600001"
          maxLength={6}
        />
      </div>
      <div className="grid-2">
        <InputField
          label="Phone Number"
          id={`${prefix}-phone`}
          type="tel"
          value={data.phone}
          onChange={update('phone')}
          placeholder="+91 98765 43210"
        />
        <InputField
          label="GSTIN (if applicable)"
          id={`${prefix}-gstin`}
          value={data.gstin}
          onChange={update('gstin')}
          placeholder="22AAAAA0000A1Z5"
        />
      </div>
      <div className="grid-2">
        <InputField
          label="Representative Name"
          id={`${prefix}-rep`}
          value={data.representative}
          onChange={update('representative')}
          placeholder="Full name of signatory"
        />
        <InputField
          label="Designation"
          id={`${prefix}-designation`}
          value={data.designation}
          onChange={update('designation')}
          placeholder="e.g., CEO, Director, Manager"
        />
      </div>
    </div>
  );
}

export default function StepParties() {
  const { state, dispatch } = useContract();
  const meta = state.meta;

  const updateMeta = (field) => (e) =>
    dispatch({ type: 'UPDATE_FIELD', path: ['meta', field], value: e.target.value });

  return (
    <div className="step-enter">
      <div className="info-box">
        <span className="info-box-icon">ℹ️</span>
        <span>Fill in both party details. The company information is pre-filled with VisualX Technologies defaults — update as needed for each engagement.</span>
      </div>

      <div className="step-section">
        <div className="step-section-title">
          <div className="step-section-title-icon">📋</div>
          Agreement Reference
        </div>
        <div className="grid-2">
          <InputField
            label="Agreement Number"
            id="meta-agreementNo"
            value={meta.agreementNo}
            onChange={updateMeta('agreementNo')}
            placeholder="VXT/SA/2024-001"
          />
          <InputField
            label="Date of Execution"
            id="meta-executionDate"
            type="date"
            value={meta.executionDate}
            onChange={updateMeta('executionDate')}
          />
        </div>
      </div>

      <PartyFields prefix="company" badge="Company" badgeClass="party-badge-company" />
      <PartyFields prefix="client" badge="Client" badgeClass="party-badge-client" />
    </div>
  );
}
