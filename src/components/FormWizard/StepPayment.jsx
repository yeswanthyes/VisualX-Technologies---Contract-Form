import { useContract } from '../../context/ContractContext';
import { InputField, Checkbox } from '../UI/index.jsx';
import { numberToWords } from '../../utils/formatCurrency';
import './FormSteps.css';

export default function StepPayment() {
  const { state, dispatch } = useContract();
  const payment = state.payment;

  const update = (field) => (e) =>
    dispatch({ type: 'UPDATE_FIELD', path: ['payment', field], value: e.target.value });

  const toggleMethod = (method) => () => {
    dispatch({
      type: 'UPDATE_FIELD',
      path: ['payment', 'methods'],
      value: { ...payment.methods, [method]: !payment.methods[method] },
    });
    // Workaround: need nested update
  };

  // Use dedicated nested update approach
  const updateMethods = (method) => {
    dispatch({
      type: 'UPDATE_SECTION',
      section: 'payment',
      payload: { methods: { ...payment.methods, [method]: !payment.methods[method] } },
    });
  };

  const updateSplit = (idx, field, val) => {
    const updated = payment.paymentSplit.map((row, i) =>
      i === idx ? { ...row, [field]: val } : row
    );
    dispatch({ type: 'UPDATE_SECTION', section: 'payment', payload: { paymentSplit: updated } });
  };

  const amountWords = numberToWords(payment.totalAmount);
  const totalAmt = parseFloat(payment.totalAmount) || 0;

  return (
    <div className="step-enter">
      <div className="step-section">
        <div className="step-section-title">
          <div className="step-section-title-icon">₹</div>
          Total Project Cost
        </div>
        <div className="step-subsection">
          <div className="grid-2">
            <InputField
              label="Total Amount (₹)"
              id="payment-total"
              type="number"
              min="0"
              value={payment.totalAmount}
              onChange={update('totalAmount')}
              placeholder="e.g., 50000"
              required
            />
            <div className="field-group">
              <label className="field-label">Amount in Words</label>
              <div style={{
                background: 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 0.9rem',
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--text-sm)',
                minHeight: '38px',
              }}>
                {amountWords || <span style={{ color: 'var(--color-text-placeholder)' }}>Auto-generated</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="step-section">
        <div className="step-section-title">
          <div className="step-section-title-icon">📊</div>
          Payment Milestones
        </div>
        <div className="step-subsection">
          {payment.paymentSplit.map((row, idx) => {
            const rowAmt = totalAmt ? ((row.percent / 100) * totalAmt).toFixed(0) : '—';
            return (
              <div key={idx} style={{ marginBottom: 'var(--space-4)' }}>
                <div className="payment-split-row">
                  <InputField
                    label="Milestone Description"
                    id={`milestone-name-${idx}`}
                    value={row.milestone}
                    onChange={(e) => updateSplit(idx, 'milestone', e.target.value)}
                  />
                  <div className="field-group">
                    <label className="field-label">%</label>
                    <input
                      type="number"
                      className="field-input"
                      min="0"
                      max="100"
                      value={row.percent}
                      onChange={(e) => updateSplit(idx, 'percent', Number(e.target.value))}
                    />
                  </div>
                  <InputField
                    label="Due On / Trigger"
                    id={`milestone-due-${idx}`}
                    value={row.dueOn}
                    onChange={(e) => updateSplit(idx, 'dueOn', e.target.value)}
                    placeholder="e.g., Upon signing"
                  />
                </div>
                {totalAmt > 0 && (
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '-8px', paddingLeft: '4px' }}>
                    ≈ ₹{Number(rowAmt).toLocaleString('en-IN')} ({row.percent}%)
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="step-section">
        <div className="step-section-title">
          <div className="step-section-title-icon">💳</div>
          Accepted Payment Methods
        </div>
        <div className="step-subsection">
          <Checkbox id="pm-bank" label="Bank Transfer (NEFT / RTGS / IMPS)" checked={payment.methods.bankTransfer} onChange={() => updateMethods('bankTransfer')} />
          <Checkbox id="pm-upi" label="UPI (Unified Payments Interface)" checked={payment.methods.upi} onChange={() => updateMethods('upi')} />
          <Checkbox id="pm-rp" label="Razorpay Payment Link" checked={payment.methods.razorpayLink} onChange={() => updateMethods('razorpayLink')} />
          <Checkbox id="pm-cheque" label="Cheque (payable to VisualX Technologies)" checked={payment.methods.cheque} onChange={() => updateMethods('cheque')} />
          <Checkbox id="pm-cash" label="Cash (amounts under ₹2,000 only)" checked={payment.methods.cash} onChange={() => updateMethods('cash')} />
        </div>
      </div>

      <div className="step-section">
        <div className="step-section-title">
          <div className="step-section-title-icon">⚠️</div>
          Late Payment Penalties
        </div>
        <div className="step-subsection">
          <div className="grid-3">
            <InputField
              label="Late Fee Rate (%/week)"
              id="late-fee-pct"
              type="number"
              min="0"
              max="10"
              step="0.5"
              value={payment.lateFeePercent}
              onChange={update('lateFeePercent')}
            />
            <InputField
              label="Suspend Work (days overdue)"
              id="late-suspend"
              type="number"
              min="1"
              value={payment.ovdueSuspendDays}
              onChange={update('ovdueSuspendDays')}
            />
            <InputField
              label="Termination Threshold (days)"
              id="late-terminate"
              type="number"
              min="1"
              value={payment.overdueTerminateDays}
              onChange={update('overdueTerminateDays')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
