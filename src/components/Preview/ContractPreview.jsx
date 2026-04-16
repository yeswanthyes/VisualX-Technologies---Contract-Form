import { useState } from 'react';
import { useContract } from '../../context/ContractContext';
import { Button } from '../UI/index.jsx';
import { formatCurrency, numberToWords, calcCompletionDate, formatDate } from '../../utils/formatCurrency';
import { exportToPdf } from '../../utils/exportPdf';
import './ContractPreview.css';

const blank = (val, fallback = '________________') => (val && String(val).trim()) ? val : fallback;
const blankNum = (val, fallback = '__') => (val !== undefined && val !== '') ? val : fallback;

export default function ContractPreview({ onClose }) {
  const { state } = useContract();
  const [exporting, setExporting] = useState(false);
  const { company, client, scope, techStack, payment, timeline, revisions, clientResp, legal, support, dispute, optional, signatures, meta } = state;

  const handleExport = async () => {
    setExporting(true);
    await exportToPdf('contract-document', client.name || 'Client');
    setExporting(false);
  };

  const completionDate = calcCompletionDate(timeline.startDate, timeline.phases);
  const totalDays = timeline.phases.reduce((s, p) => s + (parseInt(p.days) || 0), 0);
  const enabledStack = techStack.filter(r => r.enabled);

  const paymentMethods = [];
  if (payment.methods.bankTransfer) paymentMethods.push('Bank Transfer (NEFT/RTGS/IMPS)');
  if (payment.methods.upi) paymentMethods.push('UPI (Unified Payments Interface)');
  if (payment.methods.razorpayLink) paymentMethods.push('Razorpay Payment Link');
  if (payment.methods.cheque) paymentMethods.push(`Cheque (payable to "${company.name || 'VisualX Technologies'}")`);
  if (payment.methods.cash) paymentMethods.push('Cash (for amounts under ₹2,000 only)');

  return (
    <div className="contract-preview-overlay no-print-overlay">
      {/* Toolbar */}
      <div className="contract-preview-toolbar no-print">
        <div className="contract-preview-toolbar-title">
          📄 Service Agreement Preview — {blank(client.name, 'Client')}
        </div>
        <div className="contract-preview-toolbar-actions">
          {exporting ? (
            <div className="export-loading">
              <div className="export-spinner" />
              Generating PDF...
            </div>
          ) : (
            <Button variant="success" onClick={handleExport} id="btn-export-pdf">
              ⬇ Export PDF
            </Button>
          )}
          <Button variant="secondary" onClick={onClose} id="btn-close-preview">
            ✕ Close
          </Button>
        </div>
      </div>

      {/* Legal Document */}
      <div id="contract-document" className="contract-document">
        {/* Title */}
        <div className="doc-title">Service Agreement</div>
        <div className="doc-meta">
          <span><strong>Agreement No.:</strong> {blank(meta.agreementNo, 'VXT/SA/________')}</span>
          <span><strong>Date of Execution:</strong> {meta.executionDate ? formatDate(meta.executionDate) : '____________________'}</span>
        </div>

        <div className="doc-intro">
          This <strong>Service Agreement</strong> ("Agreement") is entered into as of the date stated above ("Effective Date") by and between the parties identified below.
        </div>

        {/* ─── SECTION 1: PARTIES ─── */}
        <div className="doc-section">
          <div className="doc-section-number">1. Parties Involved</div>
          <div className="doc-subsection-title">1.1 Service Provider ("Company")</div>
          <table className="doc-table">
            <tbody>
              <tr><td><strong>Company Name</strong></td><td>{blank(company.name)}</td></tr>
              <tr><td><strong>Registered Address</strong></td><td>{blank(company.address)}{company.city ? `, ${company.city}` : ''}{company.state ? `, ${company.state}` : ''}{company.pin ? ` – ${company.pin}` : ''}</td></tr>
              <tr><td><strong>GSTIN</strong></td><td>{blank(company.gstin)}</td></tr>
              <tr><td><strong>Email</strong></td><td>{blank(company.email)}</td></tr>
              <tr><td><strong>Phone</strong></td><td>{blank(company.phone)}</td></tr>
              <tr><td><strong>Represented By</strong></td><td>{blank(company.representative)}</td></tr>
              <tr><td><strong>Designation</strong></td><td>{blank(company.designation)}</td></tr>
            </tbody>
          </table>

          <div className="doc-subsection-title">1.2 Client ("Client")</div>
          <table className="doc-table">
            <tbody>
              <tr><td><strong>Client Name / Company</strong></td><td>{blank(client.name)}</td></tr>
              <tr><td><strong>Registered Address</strong></td><td>{blank(client.address)}{client.city ? `, ${client.city}` : ''}{client.state ? `, ${client.state}` : ''}{client.pin ? ` – ${client.pin}` : ''}</td></tr>
              <tr><td><strong>GSTIN</strong></td><td>{blank(client.gstin)}</td></tr>
              <tr><td><strong>Email</strong></td><td>{blank(client.email)}</td></tr>
              <tr><td><strong>Phone</strong></td><td>{blank(client.phone)}</td></tr>
              <tr><td><strong>Represented By</strong></td><td>{blank(client.representative)}</td></tr>
              <tr><td><strong>Designation</strong></td><td>{blank(client.designation)}</td></tr>
            </tbody>
          </table>
          <div className="doc-paragraph">
            Hereinafter, <strong>{blank(company.name, 'VisualX Technologies')}</strong> shall be referred to as the <strong>"Company"</strong> and the second party as the <strong>"Client."</strong> Both parties together shall be referred to as the <strong>"Parties."</strong>
          </div>
        </div>

        {/* ─── SECTION 2: SCOPE ─── */}
        <div className="doc-section">
          <div className="doc-section-number">2. Scope of Services</div>
          <div className="doc-paragraph">The Company agrees to provide the following services:</div>

          {scope.websiteDev && (
            <>
              <div className="doc-subsection-title">2.1 Website Development</div>
              <div className="doc-paragraph">Design, development, and deployment of responsive, standards-compliant websites, including static/dynamic websites, landing pages, CMS integration, SEO-optimized structure, and cross-browser compatibility.</div>
            </>
          )}

          {scope.webAppDev && (
            <>
              <div className="doc-subsection-title">2.{scope.websiteDev ? 2 : 1} Web Application Development</div>
              <div className="doc-paragraph">End-to-end development of scalable web applications, including custom software solutions, dashboard and admin panels, user authentication, API development, and database architecture.</div>
            </>
          )}

          {scope.desktopAppDev && (
            <>
              <div className="doc-subsection-title">2.{[scope.websiteDev, scope.webAppDev].filter(Boolean).length + 1} Desktop Application Development (Electron-Based)</div>
              <div className="doc-paragraph">Development of cross-platform desktop applications using the Electron.js framework, including:</div>

              {scope.quotationModule && (
                <>
                  <div className="doc-subsection-title" style={{ marginLeft: 20 }}>Quotation Management Module</div>
                  <ul className="doc-list">
                    <li>Create, edit, preview, and manage business quotations</li>
                    <li>Generate professional PDF/print-ready quotation documents with custom branding and tax calculations</li>
                    <li>Searchable database of issued quotations with status tracking (draft, sent, accepted, rejected)</li>
                  </ul>
                </>
              )}

              {scope.paymentModule && (
                <>
                  <div className="doc-subsection-title" style={{ marginLeft: 20 }}>Payment Integration Module (Razorpay)</div>
                  <ul className="doc-list">
                    <li>Secure in-app payment collection via Razorpay, supporting UPI, credit/debit cards, net banking, and wallets</li>
                    <li>Automated payment receipt generation and transaction logging</li>
                    <li>Secure payment data handling in compliance with applicable standards</li>
                  </ul>
                </>
              )}
            </>
          )}

          {scope.uiuxDesign && (
            <>
              <div className="doc-subsection-title">2.{[scope.websiteDev, scope.webAppDev, scope.desktopAppDev].filter(Boolean).length + 1} UI/UX Design Services</div>
              <div className="doc-paragraph">Professional design including UI design, UX research, wireframing, prototyping, thumbnail design, brand identity elements, and design system documentation.</div>
            </>
          )}

          {scope.customScope && (
            <>
              <div className="doc-subsection-title">2.{[scope.websiteDev, scope.webAppDev, scope.desktopAppDev, scope.uiuxDesign].filter(Boolean).length + 1} Additional Services</div>
              <div className="doc-paragraph">{scope.customScope}</div>
            </>
          )}
        </div>

        {/* ─── SECTION 3: TECH STACK ─── */}
        <div className="doc-section">
          <div className="doc-section-number">3. Technology Stack</div>
          <table className="doc-table">
            <thead>
              <tr><th>Layer</th><th>Technologies</th></tr>
            </thead>
            <tbody>
              {enabledStack.map(row => (
                <tr key={row.id}>
                  <td><strong>{row.layer}</strong></td>
                  <td>{row.tech}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="doc-paragraph">
            The final selection of the technology stack shall be determined solely by <strong>{blank(company.name, 'VisualX Technologies')}</strong> based on project requirements, performance, and scalability considerations. Any request by the Client to change the agreed technology stack after project initiation may result in additional charges and revised timelines. The Company is not responsible for limitations, downtime, or policy changes of third-party services including payment gateways or APIs.
          </div>
        </div>

        {/* ─── SECTION 4: PAYMENT ─── */}
        <div className="doc-section">
          <div className="doc-section-number">4. Payment Terms</div>
          <div className="doc-subsection-title">4.1 Total Project Cost</div>
          <div className="doc-paragraph">
            <strong>₹ {payment.totalAmount ? Number(payment.totalAmount).toLocaleString('en-IN') : '________________________'}</strong>
            {payment.totalAmount ? ` (Rupees ${numberToWords(payment.totalAmount)})` : ' (Rupees ______________________________ Only)'}
            , exclusive of applicable taxes.
          </div>

          <div className="doc-subsection-title">4.2 Payment Schedule</div>
          <table className="doc-table">
            <thead>
              <tr><th>Milestone</th><th>%</th><th>Amount (₹)</th><th>Due On</th></tr>
            </thead>
            <tbody>
              {payment.paymentSplit.map((row, idx) => {
                const amt = payment.totalAmount ? ((row.percent / 100) * parseFloat(payment.totalAmount)).toFixed(0) : '________';
                return (
                  <tr key={idx}>
                    <td>{row.milestone}</td>
                    <td>{row.percent}%</td>
                    <td>{amt !== '________' ? Number(amt).toLocaleString('en-IN') : amt}</td>
                    <td>{blank(row.dueOn)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="doc-subsection-title">4.3 Accepted Payment Methods</div>
          <ul className="doc-list">
            {paymentMethods.length > 0
              ? paymentMethods.map((m, i) => <li key={i}>{m}</li>)
              : <li>As agreed between the Parties</li>
            }
          </ul>

          <div className="doc-subsection-title">4.4 Late Payment Penalties</div>
          <div className="doc-paragraph">
            A late fee of <strong>{blankNum(payment.lateFeePercent)}% per week</strong> shall apply if payment is not received within 7 business days of the due date. If overdue beyond <strong>{blankNum(payment.ovdueSuspendDays)} business days</strong>, the Company may suspend all work. If overdue beyond <strong>{blankNum(payment.overdueTerminateDays)} days</strong>, the Company may terminate this Agreement, and the Client shall forfeit all advance payments.
          </div>
        </div>

        {/* ─── SECTION 5: TIMELINE ─── */}
        <div className="doc-section">
          <div className="doc-section-number">5. Project Timeline</div>
          <table className="doc-table">
            <thead>
              <tr><th>Phase</th><th>Description</th><th>Duration</th></tr>
            </thead>
            <tbody>
              <tr><td colSpan={2}><strong>Project Start Date</strong></td><td>{timeline.startDate ? formatDate(timeline.startDate) : '________________'}</td></tr>
              {timeline.phases.map((phase, idx) => (
                <tr key={idx}><td>{idx + 1}</td><td>{phase.name}</td><td>{phase.days} days</td></tr>
              ))}
              <tr><td colSpan={2}><strong>Estimated Completion Date</strong></td><td><strong>{completionDate || '________________'}</strong></td></tr>
            </tbody>
          </table>
          <div className="doc-paragraph">
            The estimated timeline is contingent on the Client providing all required content, credentials, and approvals in a timely manner. Delays caused by the Client, out-of-scope revision requests, third-party dependencies, or force majeure events shall extend the timeline proportionally.
          </div>
        </div>

        {/* ─── SECTION 6: REVISIONS ─── */}
        <div className="doc-section">
          <div className="doc-section-number">6. Revisions & Changes</div>
          <div className="doc-paragraph">
            The project cost includes up to <strong>{blankNum(revisions.freeRounds)} round(s) of revisions</strong> per deliverable, limited to minor design adjustments and content updates within the agreed scope.
            {revisions.additionalRate && ` Additional revisions shall be billed at ${revisions.additionalRate}.`}
          </div>
          {revisions.changeRequestProcess && (
            <div className="doc-paragraph">
              All change requests must be submitted in writing. Work on any change request shall commence only upon the Client's written approval of revised costs and timelines.
            </div>
          )}
        </div>

        {/* ─── SECTION 7: CLIENT RESPONSIBILITIES ─── */}
        <div className="doc-section">
          <div className="doc-section-number">7. Client Responsibilities</div>
          <ul className="doc-list">
            <li>Provide all content, images, and brand assets within <strong>{blankNum(clientResp.contentDeliveryDays)} business days</strong> of the Company's written request.</li>
            <li>Review all deliverables and provide feedback within <strong>{blankNum(clientResp.feedbackDays)} business days</strong> of submission. Failure to respond shall constitute acceptance.</li>
            {clientResp.singlePOC && <li>Designate a single authorized representative as the primary point of contact.</li>}
            {clientResp.paymentGatewayAccounts && <li>Provide payment gateway credentials (Razorpay / Stripe / PayU API keys) if payment integration is required.</li>}
            {clientResp.legalCompliance && <li>Ensure all provided content and materials comply with applicable intellectual property and data protection laws.</li>}
          </ul>
        </div>

        {/* ─── SECTION 8: CONFIDENTIALITY ─── */}
        <div className="doc-section">
          <div className="doc-section-number">8. Confidentiality</div>
          <div className="doc-paragraph">
            Both Parties agree to maintain strict confidentiality of all non-public, proprietary, or sensitive information disclosed during the term of this Agreement. Confidential Information shall not be disclosed to any third party without prior written consent. This obligation shall survive termination of this Agreement for a period of <strong>{blankNum(legal.confidentialityYears)} year(s)</strong>.
          </div>
        </div>

        {/* ─── SECTION 9: IP RIGHTS ─── */}
        <div className="doc-section">
          <div className="doc-section-number">9. Intellectual Property Rights</div>
          {legal.ipTransferOnPayment && (
            <div className="doc-paragraph">
              Upon receipt of <strong>full and final payment</strong>, all intellectual property rights in the custom-developed deliverables shall be transferred to the Client. Until full payment, all IP remains with <strong>{blank(company.name, 'VisualX Technologies')}</strong>.
            </div>
          )}
          {legal.portfolioRights && (
            <div className="doc-paragraph">
              The Client grants <strong>{blank(company.name, 'VisualX Technologies')}</strong> the right to display the completed project in its portfolio and marketing materials. The Client may revoke this right with 30 days' written notice.
            </div>
          )}
          <div className="doc-paragraph">
            Pre-existing IP, frameworks, and libraries used in the project remain the property of their respective owners. The Client receives a non-exclusive, perpetual license to use such components as integrated into the delivered project.
          </div>
        </div>

        {/* ─── SECTION 10: TERMINATION ─── */}
        <div className="doc-section">
          <div className="doc-section-number">10. Termination</div>
          <div className="doc-paragraph">
            Either Party may terminate this Agreement upon written notice in the event of a material breach not cured within 15 days of notice, or by mutual written consent. Upon termination, the Client shall pay for all work completed to date.
          </div>
          <div className="doc-subsection-title">10.1 Refund Policy</div>
          <table className="doc-table">
            <thead><tr><th>Termination Stage</th><th>Refund to Client</th></tr></thead>
            <tbody>
              {legal.refundTiers.map((tier, idx) => (
                <tr key={idx}><td>{tier.stage}</td><td>{tier.refund}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ─── SECTION 11: WARRANTY ─── */}
        <div className="doc-section">
          <div className="doc-section-number">11. Warranty & Liability</div>
          <div className="doc-paragraph">
            The Company warrants that deliverables shall substantially conform to agreed specifications at time of delivery. The Company shall rectify material defects reported within <strong>{blankNum(legal.warrantyDays)} days</strong> of final delivery at no additional cost.
          </div>
          {legal.liabilityCap && (
            <div className="doc-paragraph">
              <strong>Limitation of Liability:</strong> The Company's total aggregate liability shall not exceed the total fees paid by the Client under this Agreement. In no event shall the Company be liable for indirect, incidental, consequential, or punitive damages.
            </div>
          )}
          <div className="doc-paragraph">
            The Company is not liable for issues arising from third-party services (including payment gateway failures, API downtime, hosting outages), Client-side modifications, or unauthorized use of delivered software.
          </div>
        </div>

        {/* ─── SECTION 12: SUPPORT ─── */}
        <div className="doc-section">
          <div className="doc-section-number">12. Support & Maintenance</div>
          <div className="doc-paragraph">
            The Company shall provide complimentary technical support for <strong>{blankNum(support.freeSupportDays)} days</strong> from final delivery, covering bug fixes under warranty and minor content updates.
            {support.supportEmail && ` Support contact: ${support.supportEmail}`}
            {support.supportPhone && ` | ${support.supportPhone}`}
            {support.supportHours && ` (${support.supportHours}).`}
          </div>
          <div className="doc-paragraph">
            Upon expiry of the free support period, paid maintenance plans are available as outlined in Annexure B (AMC), if applicable.
          </div>
        </div>

        {/* ─── SECTION 13: DISPUTE ─── */}
        <div className="doc-section">
          <div className="doc-section-number">13. Dispute Resolution</div>
          <div className="doc-paragraph">
            The Parties shall first attempt to resolve disagreements through good-faith negotiation within <strong>{blankNum(dispute.negotiationDays)} days</strong> of written notice.
            {dispute.arbitrationEnabled
              ? ` If unresolved, disputes shall be submitted to mediation and thereafter to binding arbitration under the Arbitration and Conciliation Act, 1996 (India).`
              : ` If unresolved, disputes shall be submitted to mediation before a mutually agreed mediator.`}
          </div>
          <div className="doc-paragraph">
            This Agreement shall be governed by the laws of <strong>India</strong>. All legal proceedings shall be subject to the exclusive jurisdiction of the courts in <strong>{blank(dispute.jurisdiction, 'Tamil Nadu, India')}</strong>.
          </div>
        </div>

        {/* ─── SECTION 14: FORCE MAJEURE ─── */}
        <div className="doc-section">
          <div className="doc-section-number">14. Force Majeure</div>
          <div className="doc-paragraph">
            Neither Party shall be liable for delays or failures resulting from events beyond reasonable control, including natural disasters, government actions, power/internet outages, third-party service disruptions (payment gateway outages, API failures), civil unrest, and cyberattacks. The affected Party shall notify the other within <strong>{blankNum(dispute.forceMajeureNoticehours)} hours</strong>. If the event persists beyond <strong>{blankNum(dispute.forceMajeureDays)} days</strong>, either Party may terminate this Agreement with 15 days' written notice.
          </div>
        </div>

        {/* ─── SECTION 15: GENERAL PROVISIONS ─── */}
        <div className="doc-section">
          <div className="doc-section-number">15. General Provisions</div>
          <div className="doc-paragraph"><strong>Entire Agreement:</strong> This Agreement constitutes the entire understanding between the Parties and supersedes all prior negotiations.</div>
          <div className="doc-paragraph"><strong>Amendments:</strong> No modification shall be valid unless made in writing and signed by both Parties.</div>
          <div className="doc-paragraph"><strong>Severability:</strong> If any provision is found unenforceable, the remaining provisions shall continue in full effect.</div>
          <div className="doc-paragraph"><strong>Independent Contractor:</strong> Nothing in this Agreement creates a partnership, joint venture, or employment relationship.</div>
        </div>

        {/* ─── SIGNATURES ─── */}
        <div className="doc-section">
          <div className="doc-section-number">16. Signatures</div>
          <div className="doc-paragraph">
            <strong>IN WITNESS WHEREOF</strong>, the Parties have executed this Service Agreement as of the date first written above.
          </div>

          <div className="doc-signature-grid">
            {/* Company */}
            <div className="doc-signature-block">
              <div className="doc-signature-block-title">For {blank(company.name, 'VisualX Technologies')}</div>
              <div className="doc-sig-blank" />
              <div className="doc-sig-field">
                <span className="doc-sig-label">Name</span>
                <span className="doc-sig-value">{blank(signatures.company.name)}</span>
              </div>
              <div className="doc-sig-field">
                <span className="doc-sig-label">Designation</span>
                <span className="doc-sig-value">{blank(signatures.company.designation)}</span>
              </div>
              <div className="doc-sig-field">
                <span className="doc-sig-label">Date</span>
                <span className="doc-sig-value">{signatures.company.date ? formatDate(signatures.company.date) : '________________'}</span>
              </div>
              <div className="doc-sig-field">
                <span className="doc-sig-label">Place</span>
                <span className="doc-sig-value">{blank(signatures.company.place)}</span>
              </div>
            </div>

            {/* Client */}
            <div className="doc-signature-block">
              <div className="doc-signature-block-title">For the Client — {blank(client.name)}</div>
              <div className="doc-sig-blank" />
              <div className="doc-sig-field">
                <span className="doc-sig-label">Name</span>
                <span className="doc-sig-value">{blank(signatures.client.name)}</span>
              </div>
              <div className="doc-sig-field">
                <span className="doc-sig-label">Designation</span>
                <span className="doc-sig-value">{blank(signatures.client.designation)}</span>
              </div>
              <div className="doc-sig-field">
                <span className="doc-sig-label">Date</span>
                <span className="doc-sig-value">{signatures.client.date ? formatDate(signatures.client.date) : '________________'}</span>
              </div>
              <div className="doc-sig-field">
                <span className="doc-sig-label">Place</span>
                <span className="doc-sig-value">{blank(signatures.client.place)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── ANNEXURE A: NDA ─── */}
        {optional.ndaEnabled && (
          <>
            <hr className="doc-annexure-divider" />
            <div className="doc-annexure-title">Annexure A</div>
            <div className="doc-annexure-sub">Non-Disclosure Agreement (NDA) — Optional Clause</div>

            <div className="doc-section">
              <div className="doc-section-number">A.1 Purpose</div>
              <div className="doc-paragraph">This NDA supplements Section 8 of the Service Agreement and establishes additional safeguards for the protection of sensitive information exchanged between the Parties.</div>
            </div>
            <div className="doc-section">
              <div className="doc-section-number">A.2 Confidential Information</div>
              <div className="doc-paragraph">Includes: source code, database schemas, system architecture, business models, customer data (PII), API keys, security credentials, and any information disclosed during project meetings or demonstrations.</div>
            </div>
            <div className="doc-section">
              <div className="doc-section-number">A.3 Obligations</div>
              <ul className="doc-list">
                <li>Restrict access to only those with a legitimate need to know.</li>
                <li>Not reverse engineer, decompile, or disassemble any software disclosed as Confidential Information.</li>
                <li>Promptly notify the other Party of any unauthorized disclosure.</li>
                <li>Return or destroy all Confidential Information within 15 days of termination.</li>
              </ul>
            </div>
            <div className="doc-section">
              <div className="doc-section-number">A.4 Duration</div>
              <div className="doc-paragraph">NDA obligations remain in effect for <strong>{optional.ndaYears} year(s)</strong> from the date of disclosure, or 2 years after termination of the Service Agreement, whichever is later.</div>
            </div>
            <div className="doc-section">
              <div className="doc-section-number">A.5 Remedies</div>
              <div className="doc-paragraph">A breach of this NDA may cause irreparable harm. The non-breaching Party is entitled to seek injunctive relief in addition to any other available remedies.</div>
            </div>

            <div className="doc-signature-grid">
              <div className="doc-signature-block">
                <div className="doc-signature-block-title">For {blank(company.name, 'VisualX Technologies')}</div>
                <div className="doc-sig-blank" />
                <div className="doc-sig-field"><span className="doc-sig-label">Name</span><span className="doc-sig-value">{blank(signatures.company.name)}</span></div>
                <div className="doc-sig-field"><span className="doc-sig-label">Date</span><span className="doc-sig-value">________________</span></div>
              </div>
              <div className="doc-signature-block">
                <div className="doc-signature-block-title">For the Client — {blank(client.name)}</div>
                <div className="doc-sig-blank" />
                <div className="doc-sig-field"><span className="doc-sig-label">Name</span><span className="doc-sig-value">{blank(signatures.client.name)}</span></div>
                <div className="doc-sig-field"><span className="doc-sig-label">Date</span><span className="doc-sig-value">________________</span></div>
              </div>
            </div>
          </>
        )}

        {/* ─── ANNEXURE B: AMC ─── */}
        {optional.amcEnabled && (
          <>
            <hr className="doc-annexure-divider" />
            <div className="doc-annexure-title">Annexure B</div>
            <div className="doc-annexure-sub">Annual Maintenance Contract (AMC) — Optional Clause</div>

            <div className="doc-section">
              <div className="doc-section-number">B.1 Purpose</div>
              <div className="doc-paragraph">This AMC provides ongoing maintenance, support, and minor enhancements for the delivered project, commencing upon expiry of the 30-day free support period under Section 12.</div>
            </div>
            <div className="doc-section">
              <div className="doc-section-number">B.2 AMC Plans & Pricing</div>
              <table className="doc-table">
                <thead><tr><th>Plan</th><th>Annual Fee (₹)</th><th>Key Inclusions</th></tr></thead>
                <tbody>
                  <tr>
                    <td><strong>Basic</strong></td>
                    <td>{optional.amcPlans[0].annualFee ? Number(optional.amcPlans[0].annualFee).toLocaleString('en-IN') : '____________'}</td>
                    <td>Bug fixes (10 hrs/month), security patches, email support (48h response)</td>
                  </tr>
                  <tr>
                    <td><strong>Standard</strong></td>
                    <td>{optional.amcPlans[1].annualFee ? Number(optional.amcPlans[1].annualFee).toLocaleString('en-IN') : '____________'}</td>
                    <td>All Basic + content updates (5/month), performance optimization, priority support (24h)</td>
                  </tr>
                  <tr>
                    <td><strong>Premium</strong></td>
                    <td>{optional.amcPlans[2].annualFee ? Number(optional.amcPlans[2].annualFee).toLocaleString('en-IN') : '____________'}</td>
                    <td>All Standard + feature enhancements (8 hrs/month), dedicated support, real-time monitoring (4h SLA)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="doc-section">
              <div className="doc-section-number">B.3 Exclusions</div>
              <div className="doc-paragraph">Major feature development, complete redesign, platform migration, and data recovery from Client negligence are not covered under AMC and shall be quoted separately.</div>
            </div>

            <div className="doc-signature-grid">
              <div className="doc-signature-block">
                <div className="doc-signature-block-title">For {blank(company.name, 'VisualX Technologies')}</div>
                <div className="doc-sig-blank" />
                <div className="doc-sig-field"><span className="doc-sig-label">Name</span><span className="doc-sig-value">{blank(signatures.company.name)}</span></div>
                <div className="doc-sig-field"><span className="doc-sig-label">Date</span><span className="doc-sig-value">________________</span></div>
              </div>
              <div className="doc-signature-block">
                <div className="doc-signature-block-title">For the Client — {blank(client.name)}</div>
                <div className="doc-sig-blank" />
                <div className="doc-sig-field"><span className="doc-sig-label">Name</span><span className="doc-sig-value">{blank(signatures.client.name)}</span></div>
                <div className="doc-sig-field"><span className="doc-sig-label">Date</span><span className="doc-sig-value">________________</span></div>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="doc-footer">
          <strong>END OF AGREEMENT</strong><br />
          This document was generated by the VisualX Technologies Service Agreement Generator. © {new Date().getFullYear()} {blank(company.name, 'VisualX Technologies')}. All rights reserved.
        </div>
      </div>
    </div>
  );
}
