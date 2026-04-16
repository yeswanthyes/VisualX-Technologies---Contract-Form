import { useContract } from '../../context/ContractContext';
import { Button } from '../UI/index.jsx';
import '../UI/UI.css';
import './FormSteps.css';

// Step components
import StepParties from './StepParties.jsx';
import StepScope from './StepScope.jsx';
import StepTechStack from './StepTechStack.jsx';
import StepPayment from './StepPayment.jsx';
import StepTimeline from './StepTimeline.jsx';
import StepRevisions from './StepRevisions.jsx';
import StepClient from './StepClient.jsx';
import StepLegal from './StepLegal.jsx';
import StepSupport from './StepSupport.jsx';
import StepDispute from './StepDispute.jsx';
import StepOptional from './StepOptional.jsx';
import StepSignatures from './StepSignatures.jsx';

const STEPS = [
  { title: 'Parties Involved', description: 'Company and Client contact details', component: StepParties },
  { title: 'Scope of Services', description: 'Define what services are included', component: StepScope },
  { title: 'Technology Stack', description: 'Technologies used in development', component: StepTechStack },
  { title: 'Payment Terms', description: 'Cost, milestones, and penalties', component: StepPayment },
  { title: 'Project Timeline', description: 'Phases, dates, and delay conditions', component: StepTimeline },
  { title: 'Revisions & Changes', description: 'Revision rounds and change policy', component: StepRevisions },
  { title: 'Client Responsibilities', description: 'Client obligations and deadlines', component: StepClient },
  { title: 'Legal Provisions', description: 'IP, confidentiality, warranty & liability', component: StepLegal },
  { title: 'Support & Maintenance', description: 'Post-delivery support terms', component: StepSupport },
  { title: 'Dispute Resolution', description: 'Jurisdiction and force majeure', component: StepDispute },
  { title: 'Optional Clauses', description: 'NDA and Annual Maintenance Contract', component: StepOptional },
  { title: 'Signatures', description: 'Finalize and prepare for export', component: StepSignatures },
];

export default function FormWizard({ onPreview }) {
  const { state, dispatch } = useContract();
  const currentStep = state._step || 0;

  const goNext = () => {
    if (currentStep < STEPS.length - 1) {
      dispatch({ type: 'SET_STEP', step: currentStep + 1 });
      // Scroll the wizard body to top
      document.querySelector('.form-wizard-body')?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      dispatch({ type: 'SET_STEP', step: currentStep - 1 });
      document.querySelector('.form-wizard-body')?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const resetForm = () => {
    if (window.confirm('Reset the entire form? All data will be cleared.')) {
      dispatch({ type: 'RESET_FORM' });
    }
  };

  const step = STEPS[currentStep];
  const StepComponent = step.component;
  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;

  return (
    <div className="form-wizard">
      {/* Header */}
      <div className="form-wizard-header">
        <div className="form-wizard-step-label">Step {currentStep + 1} of {STEPS.length}</div>
        <h2 className="form-wizard-title">{step.title}</h2>
        <p className="form-wizard-description">{step.description}</p>
      </div>

      {/* Body */}
      <div className="form-wizard-body">
        <StepComponent key={currentStep} />
      </div>

      {/* Footer */}
      <div className="form-wizard-footer">
        <div className="form-wizard-footer-left">
          <Button
            variant="secondary"
            onClick={goPrev}
            disabled={isFirst}
            id="btn-prev-step"
          >
            ← Previous
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={resetForm}
            id="btn-reset-form"
          >
            Reset
          </Button>
        </div>
        <div className="form-wizard-footer-right">
          <Button
            variant="secondary"
            onClick={onPreview}
            id="btn-preview-contract"
          >
            👁 Preview
          </Button>
          {!isLast ? (
            <Button variant="primary" onClick={goNext} id="btn-next-step">
              Next →
            </Button>
          ) : (
            <Button variant="success" onClick={onPreview} size="lg" id="btn-export-contract">
              📄 Preview & Export PDF
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
