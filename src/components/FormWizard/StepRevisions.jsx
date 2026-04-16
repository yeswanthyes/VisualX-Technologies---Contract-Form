import { useContract } from '../../context/ContractContext';
import { InputField, Toggle } from '../UI/index.jsx';
import './FormSteps.css';

export default function StepRevisions() {
  const { state, dispatch } = useContract();
  const rev = state.revisions;
  const update = (field) => (e) =>
    dispatch({ type: 'UPDATE_FIELD', path: ['revisions', field], value: e.target.value });
  const toggleField = (field) => () =>
    dispatch({ type: 'UPDATE_FIELD', path: ['revisions', field], value: !rev[field] });

  return (
    <div className="step-enter">
      <div className="info-box">
        <span className="info-box-icon">🔄</span>
        <span>Define the revision policy. Free rounds apply per deliverable/milestone; additional requests are billed separately.</span>
      </div>
      <div className="step-section">
        <div className="step-section-title">
          <div className="step-section-title-icon">📝</div>
          Revision Policy
        </div>
        <div className="step-subsection">
          <div className="grid-2">
            <InputField
              label="Free Revision Rounds (per milestone)"
              id="rev-free"
              type="number"
              min="0"
              max="10"
              value={rev.freeRounds}
              onChange={update('freeRounds')}
              hint="Recommended: 2 rounds"
            />
            <InputField
              label="Additional Revision Rate (₹/hour or flat)"
              id="rev-rate"
              value={rev.additionalRate}
              onChange={update('additionalRate')}
              placeholder="e.g., ₹500/hour or ₹2,000/revision"
            />
          </div>
          <Toggle
            id="rev-process"
            label="Include formal Change Request Process (written approval required before work begins)"
            checked={rev.changeRequestProcess}
            onChange={toggleField('changeRequestProcess')}
          />
        </div>
      </div>
    </div>
  );
}
