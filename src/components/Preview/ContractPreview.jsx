import { useState } from 'react';
import { useContract } from '../../context/ContractContext';
import { Button } from '../UI/index.jsx';
import { numberToWords, calcCompletionDate, formatDate } from '../../utils/formatCurrency';
import { exportToPdf } from '../../utils/exportPdf';
import './ContractPreview.css';

/* ── small helpers ─────────────────────────────────────────────────────────── */
const fill = (val, fallback = '________________') =>
  (val && String(val).trim()) ? String(val).trim() : fallback;

const fillNum = (val, fallback = '__') =>
  (val !== undefined && val !== '') ? val : fallback;

/* ── Signature block with optional image ───────────────────────────────────── */
function SigBlock({ title, sig }) {
  return (
    <div className="doc-sig-block">
      <div className="doc-sig-block-title">{title}</div>

      <div className="doc-sig-image-area">
        {sig.signatureImage
          ? <img src={sig.signatureImage} alt="Signature" className="doc-sig-image" />
          : <div className="doc-sig-image-blank" />
        }
        <div className="doc-sig-caption">Authorised Signature &amp; Seal</div>
      </div>

      <div className="doc-sig-row">
        <div className="doc-sig-field">
          <span className="doc-sig-label">Name</span>
          <span className="doc-sig-value">{fill(sig.name)}</span>
        </div>
        <div className="doc-sig-field">
          <span className="doc-sig-label">Designation</span>
          <span className="doc-sig-value">{fill(sig.designation)}</span>
        </div>
      </div>
      <div className="doc-sig-row">
        <div className="doc-sig-field">
          <span className="doc-sig-label">Date</span>
          <span className="doc-sig-value">{sig.date ? formatDate(sig.date) : '________________'}</span>
        </div>
        <div className="doc-sig-field">
          <span className="doc-sig-label">Place</span>
          <span className="doc-sig-value">{fill(sig.place)}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Main Preview Component ────────────────────────────────────────────────── */
export default function ContractPreview({ onClose }) {
  const { state } = useContract();
  const [exporting, setExporting] = useState(false);

  const {
    company, client, scope, techStack, payment,
    timeline, revisions, clientResp, legal, support,
    dispute, optional, signatures, meta,
  } = state;

  const handleExport = async () => {
    setExporting(true);
    await exportToPdf('contract-document', client.name || 'Client');
    setExporting(false);
  };

  /* derived values */
  const completionDate = calcCompletionDate(timeline.startDate, timeline.phases);
  const enabledStack   = techStack.filter(r => r.enabled);
  const totalAmt       = parseFloat(payment.totalAmount) || 0;

  const paymentMethods = [
    payment.methods.bankTransfer  && 'Bank Transfer (NEFT / RTGS / IMPS)',
    payment.methods.upi           && 'UPI (Unified Payments Interface)',
    payment.methods.razorpayLink  && 'Razorpay Payment Link',
    payment.methods.cheque        && `Cheque payable to "${fill(company.name, 'VisualX Technologies')}"`,
    payment.methods.cash          && 'Cash (for amounts under ₹2,000 only, as per applicable law)',
  ].filter(Boolean);

  /* serialised scope services count for sub-numbering */
  const svcList = [
    scope.websiteDev     && 'Website Development',
    scope.webAppDev      && 'Web Application Development',
    scope.desktopAppDev  && 'Desktop Application Development',
    scope.uiuxDesign     && 'UI/UX Design Services',
  ].filter(Boolean);

  /* ─────────────────────────────────────────────────────── */
  return (
    <div className="cpr-overlay">

      {/* ── Toolbar ── */}
      <div className="cpr-toolbar no-print">
        <span className="cpr-toolbar-title">
          Service Agreement — {fill(client.name, 'Client Preview')}
        </span>
        <div className="cpr-toolbar-actions">
          {exporting
            ? <span className="cpr-exporting"><span className="cpr-spinner" /> Generating PDF…</span>
            : <Button variant="success" onClick={handleExport} id="btn-export-pdf">Download PDF</Button>
          }
          <Button variant="secondary" onClick={onClose} id="btn-close-preview">✕ Close</Button>
        </div>
      </div>

      {/* ══════════════ LEGAL DOCUMENT ══════════════ */}
      <div id="contract-document" className="legal-doc">

        {/* ── Document Header ────────────────────── */}
        <div className="legal-doc-header">
          <img src="./logo.png" alt="VisualX Technologies" className="legal-doc-logo" />
          <div className="legal-doc-header-right">
            <div className="legal-doc-ref">Agreement No.: {fill(meta.agreementNo, 'VXT/SA/________')}</div>
            <div className="legal-doc-ref">Date: {meta.executionDate ? formatDate(meta.executionDate) : '____________________'}</div>
          </div>
        </div>

        <div className="legal-doc-title">SERVICE AGREEMENT</div>
        <div className="legal-doc-subtitle">
          This Service Agreement ("Agreement") is entered into as of the date stated above ("Effective Date") by and between the parties identified hereunder.
        </div>

        <div className="legal-rule" />

        {/* ══ 1. PARTIES ══════════════════════════ */}
        <section className="legal-section">
          <h2 className="legal-section-title">1. Parties Involved</h2>

          <h3 className="legal-sub-title">1.1 Service Provider ("Company")</h3>
          <table className="legal-table">
            <tbody>
              <tr><td className="legal-td-label">Company Name</td><td>{fill(company.name)}</td></tr>
              <tr><td className="legal-td-label">Registered Address</td>
                  <td>{[fill(company.address,''), company.city, company.state, company.pin].filter(Boolean).join(', ') || '________________'}</td></tr>
              <tr><td className="legal-td-label">GSTIN</td><td>{fill(company.gstin)}</td></tr>
              <tr><td className="legal-td-label">Email</td><td>{fill(company.email)}</td></tr>
              <tr><td className="legal-td-label">Phone</td><td>{fill(company.phone)}</td></tr>
              <tr><td className="legal-td-label">Representative</td><td>{fill(company.representative)}</td></tr>
              <tr><td className="legal-td-label">Designation</td><td>{fill(company.designation)}</td></tr>
            </tbody>
          </table>

          <h3 className="legal-sub-title">1.2 Client ("Client")</h3>
          <table className="legal-table">
            <tbody>
              <tr><td className="legal-td-label">Client / Company Name</td><td>{fill(client.name)}</td></tr>
              <tr><td className="legal-td-label">Registered Address</td>
                  <td>{[fill(client.address,''), client.city, client.state, client.pin].filter(Boolean).join(', ') || '________________'}</td></tr>
              <tr><td className="legal-td-label">GSTIN</td><td>{fill(client.gstin)}</td></tr>
              <tr><td className="legal-td-label">Email</td><td>{fill(client.email)}</td></tr>
              <tr><td className="legal-td-label">Phone</td><td>{fill(client.phone)}</td></tr>
              <tr><td className="legal-td-label">Representative</td><td>{fill(client.representative)}</td></tr>
              <tr><td className="legal-td-label">Designation</td><td>{fill(client.designation)}</td></tr>
            </tbody>
          </table>

          <p className="legal-para">
            Hereinafter, <strong>{fill(company.name, 'VisualX Technologies')}</strong> shall be referred to as the <strong>"Company"</strong> and the second party as the <strong>"Client."</strong> Both parties collectively are the <strong>"Parties."</strong>
          </p>
        </section>

        {/* ══ 2. SCOPE ════════════════════════════ */}
        <section className="legal-section">
          <h2 className="legal-section-title">2. Scope of Services</h2>
          <p className="legal-para">
            The Company agrees to provide the following services as detailed in any accompanying Statement of Work ("SOW") or Project Proposal:
          </p>

          {scope.websiteDev && <>
            <h3 className="legal-sub-title">2.1 Website Development</h3>
            <p className="legal-para">Design, development, and deployment of responsive, standards-compliant websites including static and dynamic pages, CMS integration, SEO-optimised architecture, and cross-browser compatibility.</p>
          </>}

          {scope.webAppDev && <>
            <h3 className="legal-sub-title">2.{scope.websiteDev ? 2 : 1} Web Application Development</h3>
            <p className="legal-para">End-to-end development of scalable web applications including custom software solutions, dashboard and admin panel development, user authentication, role-based access control, API development, and database architecture.</p>
          </>}

          {scope.desktopAppDev && (()=>{
            const n = [scope.websiteDev, scope.webAppDev].filter(Boolean).length + 1;
            return <>
              <h3 className="legal-sub-title">2.{n} Desktop Application Development (Electron.js)</h3>
              <p className="legal-para">Development of cross-platform desktop applications using the Electron.js framework. Specific modules include:</p>

              {scope.quotationModule && <>
                <h4 className="legal-sub-sub-title">2.{n}.1 Quotation Management Module</h4>
                <ul className="legal-list">
                  <li>Create, edit, preview, and manage business quotations with custom branding and tax calculations</li>
                  <li>Generate professional PDF/print-ready quotation documents</li>
                  <li>Searchable database of all issued quotations with status tracking (Draft, Sent, Accepted, Rejected)</li>
                </ul>
              </>}

              {scope.paymentModule && <>
                <h4 className="legal-sub-sub-title">2.{n}.2 In-App Payment Integration Module (Razorpay)</h4>
                <ul className="legal-list">
                  <li>Secure in-application payment collection via Razorpay, supporting UPI, credit/debit cards, net banking, and digital wallets</li>
                  <li>Automated payment receipt generation and transaction logging</li>
                  <li>Secure handling of payment data in accordance with applicable standards</li>
                </ul>
              </>}
            </>;
          })()}

          {scope.uiuxDesign && (()=>{
            const n = [scope.websiteDev, scope.webAppDev, scope.desktopAppDev].filter(Boolean).length + 1;
            return <>
              <h3 className="legal-sub-title">2.{n} UI/UX Design Services</h3>
              <p className="legal-para">Professional design services encompassing user interface (UI) design, user experience (UX) research, wireframing, prototyping, visual content creation (thumbnails, banners), brand identity elements, and design system documentation.</p>
            </>;
          })()}

          {scope.customScope && (()=>{
            const n = [scope.websiteDev, scope.webAppDev, scope.desktopAppDev, scope.uiuxDesign].filter(Boolean).length + 1;
            return <>
              <h3 className="legal-sub-title">2.{n} Additional Services</h3>
              <p className="legal-para">{scope.customScope}</p>
            </>;
          })()}
        </section>

        {/* ══ 3. TECHNOLOGY STACK ═════════════════ */}
        <section className="legal-section">
          <h2 className="legal-section-title">3. Technology Stack</h2>
          <table className="legal-table">
            <thead>
              <tr><th>Layer</th><th>Technologies</th></tr>
            </thead>
            <tbody>
              {enabledStack.map(r => (
                <tr key={r.id}><td className="legal-td-label">{r.layer}</td><td>{r.tech}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="legal-para">
            The final selection of the technology stack shall be determined by <strong>{fill(company.name, 'VisualX Technologies')}</strong> based on project requirements, performance, and scalability considerations. Any request by the Client to change the agreed stack after project initiation may result in additional charges and revised timelines. The Company shall not be responsible for limitations, downtime, or policy changes of any third-party service.
          </p>
        </section>

        {/* ══ 4. PAYMENT ══════════════════════════ */}
        <section className="legal-section">
          <h2 className="legal-section-title">4. Payment Terms</h2>

          <h3 className="legal-sub-title">4.1 Total Project Cost</h3>
          <p className="legal-para">
            <strong>
              ₹{totalAmt ? Number(totalAmt).toLocaleString('en-IN') : '________________________'}
              {totalAmt ? ` (Rupees ${numberToWords(payment.totalAmount)})` : ' (Rupees _______________________________ Only)'}
            </strong>, exclusive of applicable Goods and Services Tax (GST).
          </p>

          <h3 className="legal-sub-title">4.2 Payment Schedule</h3>
          <table className="legal-table">
            <thead><tr><th>Milestone</th><th>%</th><th>Amount (₹)</th><th>Due On</th></tr></thead>
            <tbody>
              {payment.paymentSplit.map((row, i) => {
                const amt = totalAmt ? ((row.percent / 100) * totalAmt).toFixed(0) : '________';
                return (
                  <tr key={i}>
                    <td>{row.milestone}</td>
                    <td style={{textAlign:'center'}}>{row.percent}%</td>
                    <td>{amt !== '________' ? Number(amt).toLocaleString('en-IN') : amt}</td>
                    <td>{fill(row.dueOn)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h3 className="legal-sub-title">4.3 Accepted Payment Methods</h3>
          <ul className="legal-list">
            {paymentMethods.length ? paymentMethods.map((m,i) => <li key={i}>{m}</li>) : <li>As mutually agreed by both Parties</li>}
          </ul>

          <h3 className="legal-sub-title">4.4 Late Payment</h3>
          <p className="legal-para">
            If any payment is not received within seven (7) business days of the due date, a late fee of <strong>{fillNum(payment.lateFeePercent)}% per week</strong> shall apply on the outstanding balance. Work may be suspended after <strong>{fillNum(payment.ovdueSuspendDays)} business days</strong> of non-payment. Failure to pay within <strong>{fillNum(payment.overdueTerminateDays)} days</strong> shall be deemed a material breach entitling the Company to terminate this Agreement and forfeit any advance payments received.
          </p>
        </section>

        {/* ══ 5. TIMELINE ═════════════════════════ */}
        <section className="legal-section">
          <h2 className="legal-section-title">5. Project Timeline</h2>
          <table className="legal-table">
            <thead><tr><th>Phase</th><th>Duration</th></tr></thead>
            <tbody>
              <tr><td><strong>Project Start Date</strong></td><td>{timeline.startDate ? formatDate(timeline.startDate) : '________________'}</td></tr>
              {timeline.phases.map((p, i) => <tr key={i}><td>{p.name}</td><td>{p.days} days</td></tr>)}
              <tr><td><strong>Estimated Completion</strong></td><td><strong>{completionDate || '________________'}</strong></td></tr>
            </tbody>
          </table>
          <p className="legal-para">
            The above timeline is contingent on the Client providing all required content, approvals, and credentials in a timely manner. Client-side delays, out-of-scope revision requests, third-party dependencies, or force majeure events shall extend the timeline proportionally without constituting a breach by the Company.
          </p>
        </section>

        {/* ══ 6. REVISIONS ════════════════════════ */}
        <section className="legal-section">
          <h2 className="legal-section-title">6. Revisions &amp; Changes</h2>
          <p className="legal-para">
            The agreed fee includes up to <strong>{fillNum(revisions.freeRounds)} round(s) of revisions</strong> per deliverable, limited to minor design adjustments and content corrections within the original scope.
            {revisions.additionalRate ? ` Additional revisions beyond the included rounds shall be billed at ${revisions.additionalRate}.` : ''}
          </p>
          {revisions.changeRequestProcess && (
            <p className="legal-para">
              All change requests must be submitted in writing. Work on any change shall commence only after the Client provides written approval of the revised cost and timeline estimate.
            </p>
          )}
        </section>

        {/* ══ 7. CLIENT RESPONSIBILITIES ══════════ */}
        <section className="legal-section">
          <h2 className="legal-section-title">7. Client Responsibilities</h2>
          <ul className="legal-list">
            <li>Provide all required content, images, brand assets, and materials within <strong>{fillNum(clientResp.contentDeliveryDays)} business days</strong> of a written request by the Company.</li>
            <li>Review and provide feedback on all submitted deliverables within <strong>{fillNum(clientResp.feedbackDays)} business days</strong>. Failure to respond within this period shall constitute acceptance of the deliverable in its submitted state.</li>
            {clientResp.singlePOC && <li>Designate a single authorised representative as the primary decision-maker and point of contact for all project communications.</li>}
            {clientResp.paymentGatewayAccounts && <li>Provide valid payment gateway merchant credentials (Razorpay / Stripe / PayU API keys) where payment integration is required.</li>}
            {clientResp.legalCompliance && <li>Ensure all content and materials submitted to the Company comply with applicable intellectual property laws, data protection regulations, and advertising standards.</li>}
          </ul>
        </section>

        {/* ══ 8. CONFIDENTIALITY ══════════════════ */}
        <section className="legal-section">
          <h2 className="legal-section-title">8. Confidentiality</h2>
          <p className="legal-para">
            Both Parties agree to hold in strict confidence all non-public, proprietary, and sensitive information disclosed during the term of this Agreement ("Confidential Information"), including but not limited to business strategies, technical specifications, source code, trade secrets, and client or customer data. Confidential Information shall not be disclosed to any third party without prior written consent of the disclosing Party. These obligations shall survive the expiry or termination of this Agreement for a period of <strong>{fillNum(legal.confidentialityYears)} year(s)</strong>.
          </p>
        </section>

        {/* ══ 9. INTELLECTUAL PROPERTY ════════════ */}
        <section className="legal-section">
          <h2 className="legal-section-title">9. Intellectual Property Rights</h2>
          {legal.ipTransferOnPayment && (
            <p className="legal-para">
              <strong>9.1 Ownership Transfer.</strong> Upon receipt of full and final payment, all intellectual property rights, title, and interest in the custom deliverables created under this Agreement shall be assigned to the Client.
            </p>
          )}
          <p className="legal-para">
            <strong>9.{legal.ipTransferOnPayment ? 2 : 1} Pre-existing IP.</strong> All pre-existing intellectual property — including frameworks, libraries, tools, templates, and methodologies owned by the Company prior to or independent of this Agreement — shall remain the exclusive property of the Company. The Client receives a non-exclusive, perpetual, non-transferable licence to use such components as integrated in the delivered project.
          </p>
          {legal.portfolioRights && (
            <p className="legal-para">
              <strong>9.{legal.ipTransferOnPayment ? 3 : 2} Portfolio Rights.</strong> The Client grants <strong>{fill(company.name, 'VisualX Technologies')}</strong> the right to reference and display the completed project in its portfolio, website, and promotional materials. The Client may revoke this right by providing thirty (30) days' written notice.
            </p>
          )}
          <p className="legal-para">
            <strong>Pre-Payment Restriction.</strong> Until full payment is received, all rights to the deliverables remain vested with the Company. The Client shall have no right to use, publish, or distribute any deliverable for which payment is outstanding.
          </p>
        </section>

        {/* ══ 10. TERMINATION ═════════════════════ */}
        <section className="legal-section">
          <h2 className="legal-section-title">10. Termination</h2>
          <p className="legal-para">
            Either Party may terminate this Agreement upon seven (7) days' written notice in the event of a material breach that remains uncured for fifteen (15) days following written notice of such breach. The Company may additionally terminate in the event of non-payment as described in Section 4.4, or upon the Client's insolvency or bankruptcy. Upon termination, the Client shall pay for all work completed to the effective date of termination.
          </p>

          <h3 className="legal-sub-title">10.1 Refund Policy upon Termination</h3>
          <table className="legal-table">
            <thead><tr><th>Stage of Termination</th><th>Refund Entitlement</th></tr></thead>
            <tbody>
              {legal.refundTiers.map((t, i) => (
                <tr key={i}><td>{t.stage}</td><td>{t.refund}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="legal-para">All refunds, if applicable, shall be processed within fifteen (15) business days of the effective termination date.</p>
        </section>

        {/* ══ 11. WARRANTY & LIABILITY ═════════════ */}
        <section className="legal-section">
          <h2 className="legal-section-title">11. Warranty &amp; Limitation of Liability</h2>
          <p className="legal-para">
            <strong>11.1 Limited Warranty.</strong> The Company warrants that all deliverables shall substantially conform to the agreed specifications at the time of delivery. The Company shall rectify any material defects reported in writing within <strong>{fillNum(legal.warrantyDays)} days</strong> of final delivery at no additional cost, provided such defects are attributable to the Company's work and have not arisen from Client-side modifications or third-party interference.
          </p>
          {legal.liabilityCap && (
            <p className="legal-para">
              <strong>11.2 Limitation of Liability.</strong> The Company's total aggregate liability under this Agreement shall not exceed the total fees actually paid by the Client. In no event shall either Party be liable for indirect, incidental, consequential, or punitive damages, including loss of profits, loss of data, or loss of business opportunity.
            </p>
          )}
          <p className="legal-para">
            <strong>11.3 Exclusions.</strong> The Company shall not be liable for any failure or damage arising from: third-party service disruptions (including payment gateway outages, API failures, or hosting provider outages); Client-initiated modifications to delivered code; browser, operating system, or hardware changes; or security incidents not attributable to the Company's negligence.
          </p>
        </section>

        {/* ══ 12. SUPPORT & MAINTENANCE ═══════════ */}
        <section className="legal-section">
          <h2 className="legal-section-title">12. Support &amp; Maintenance</h2>
          <p className="legal-para">
            <strong>12.1 Complimentary Support.</strong> The Company shall provide technical support for <strong>{fillNum(support.freeSupportDays)} calendar days</strong> from the date of final delivery, covering defect resolution under the warranty (Section 11.1) and reasonable assistance with deployment issues.
            {(support.supportEmail || support.supportPhone) && (
              <> Support is available via {[support.supportEmail, support.supportPhone].filter(Boolean).join(' / ')}{support.supportHours ? ` (${support.supportHours})` : ''}.</>
            )}
          </p>

          <h3 className="legal-sub-title">12.2 Response Time SLA</h3>
          <table className="legal-table">
            <thead><tr><th>Priority</th><th>Description</th><th>Initial Response</th></tr></thead>
            <tbody>
              {support.sla.map((r, i) => (
                <tr key={i}><td><strong>{r.priority}</strong></td><td>{r.description}</td><td>{r.responseTime}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="legal-para">
            <strong>12.3 Paid Maintenance.</strong> Upon expiry of the free support period, ongoing maintenance shall be governed by a separate Annual Maintenance Contract (AMC){optional.amcEnabled ? ', the terms of which are set out in Annexure B' : ''}. New feature development, redesign, or platform migration are expressly excluded from support and warranty.
          </p>
        </section>

        {/* ══ 13. DISPUTE RESOLUTION ══════════════ */}
        <section className="legal-section">
          <h2 className="legal-section-title">13. Dispute Resolution</h2>
          <p className="legal-para">
            In the event of any dispute, controversy, or claim arising out of or relating to this Agreement, the Parties shall first attempt resolution through good-faith negotiation within <strong>{fillNum(dispute.negotiationDays)} days</strong> of written notice. If unresolved, the matter shall be referred to mediation. {dispute.arbitrationEnabled ? `If mediation fails within ${fillNum(dispute.mediationDays)} days, the dispute shall be submitted to binding arbitration in accordance with the Arbitration and Conciliation Act, 1996 (India).` : ''}
          </p>
          <p className="legal-para">
            This Agreement shall be governed by the laws of India and shall be subject to the exclusive jurisdiction of the courts in <strong>{fill(dispute.jurisdiction, 'Tamil Nadu, India')}</strong>.
          </p>
        </section>

        {/* ══ 14. FORCE MAJEURE ═══════════════════ */}
        <section className="legal-section">
          <h2 className="legal-section-title">14. Force Majeure</h2>
          <p className="legal-para">
            Neither Party shall be liable for delays or failures in performance resulting from events beyond its reasonable control, including acts of God, natural disasters, government actions, infrastructure failures (power/internet outages, data centre failures), third-party service disruptions (including payment gateway and API outages), civil unrest, or cyberattacks. The affected Party shall notify the other within <strong>{fillNum(dispute.forceMajeureNoticehours)} hours</strong> of the event. If such event persists for more than <strong>{fillNum(dispute.forceMajeureDays)} days</strong>, either Party may terminate this Agreement upon <strong>fifteen (15) days'</strong> written notice, with the Client paying for all work completed to that date.
          </p>
        </section>

        {/* ══ 15. GENERAL PROVISIONS ══════════════ */}
        <section className="legal-section">
          <h2 className="legal-section-title">15. General Provisions</h2>
          <p className="legal-para"><strong>Entire Agreement.</strong> This Agreement, together with all Annexures and SOWs, constitutes the entire agreement between the Parties and supersedes all prior negotiations, representations, or agreements.</p>
          <p className="legal-para"><strong>Amendments.</strong> No modification shall be valid unless made in writing and signed by both Parties.</p>
          <p className="legal-para"><strong>Severability.</strong> If any provision is found invalid or unenforceable, the remaining provisions shall continue in full force and effect.</p>
          <p className="legal-para"><strong>Independent Contractor.</strong> The Company is an independent contractor. Nothing in this Agreement creates a partnership, joint venture, agency, employment, or fiduciary relationship.</p>
          <p className="legal-para"><strong>Notices.</strong> All formal notices shall be delivered in writing via email with read-receipt or registered post/courier to the addresses listed in Section 1.</p>
        </section>

        <div className="legal-rule" />

        {/* ══ SIGNATURES ══════════════════════════ */}
        <section className="legal-section">
          <h2 className="legal-section-title" style={{textAlign:'center', borderLeft:'none', paddingLeft:0}}>
            In Witness Whereof
          </h2>
          <p className="legal-para" style={{textAlign:'center'}}>
            The Parties have executed this Service Agreement as of the Effective Date specified above.
          </p>

          <div className="doc-sig-grid">
            <SigBlock
              title={`For ${fill(company.name, 'VisualX Technologies')}`}
              sig={signatures.company}
            />
            <SigBlock
              title={`For the Client — ${fill(client.name)}`}
              sig={signatures.client}
            />
          </div>
        </section>

        {/* ══ ANNEXURE A: NDA ══════════════════════ */}
        {optional.ndaEnabled && <>
          <div className="legal-annexure-break" />

          <div className="legal-annexure-header">
            <div className="legal-annexure-tag">ANNEXURE A</div>
            <h2 className="legal-annexure-title">Non-Disclosure Agreement (NDA)</h2>
            <p className="legal-annexure-caption">Optional Clause — Supplements Section 8 of the Service Agreement</p>
          </div>

          <section className="legal-section">
            <h3 className="legal-sub-title">A.1 Purpose</h3>
            <p className="legal-para">This NDA establishes enhanced safeguards for the protection of sensitive information exchanged during the project engagement, supplementing the Confidentiality obligations in Section 8.</p>

            <h3 className="legal-sub-title">A.2 Confidential Information</h3>
            <p className="legal-para">Includes, without limitation: source code, database schemas, system architecture documents, business models, customer and user data (PII), API keys, security credentials, encryption tokens, proprietary workflows, and any information disclosed during meetings or demonstrations.</p>

            <h3 className="legal-sub-title">A.3 Additional Obligations</h3>
            <ul className="legal-list">
              <li>Restrict access to need-to-know personnel bound by equivalent confidentiality obligations.</li>
              <li>Not reverse-engineer, decompile, or disassemble any software or technology disclosed as Confidential Information.</li>
              <li>Promptly notify the other Party upon discovery of any unauthorised disclosure or use.</li>
              <li>Return or securely destroy all Confidential materials within fifteen (15) days of termination or written request.</li>
            </ul>

            <h3 className="legal-sub-title">A.4 Remedies</h3>
            <p className="legal-para">The Parties acknowledge that a breach of this NDA may cause irreparable harm for which monetary damages are an inadequate remedy. The non-breaching Party shall be entitled to seek injunctive or other equitable relief in addition to any remedies available at law.</p>

            <h3 className="legal-sub-title">A.5 Duration</h3>
            <p className="legal-para">These NDA obligations shall remain in effect for <strong>{optional.ndaYears} year(s)</strong> from the date of the relevant disclosure, or two (2) years after termination of the Service Agreement, whichever is later.</p>

            <div className="doc-sig-grid" style={{marginTop:'40px'}}>
              <SigBlock title={`For ${fill(company.name, 'VisualX Technologies')}`} sig={signatures.company} />
              <SigBlock title={`For the Client — ${fill(client.name)}`} sig={signatures.client} />
            </div>
          </section>
        </>}

        {/* ══ ANNEXURE B: AMC ══════════════════════ */}
        {optional.amcEnabled && <>
          <div className="legal-annexure-break" />

          <div className="legal-annexure-header">
            <div className="legal-annexure-tag">ANNEXURE B</div>
            <h2 className="legal-annexure-title">Annual Maintenance Contract (AMC)</h2>
            <p className="legal-annexure-caption">Optional Clause — Commences upon expiry of the Free Support Period (Section 12.1)</p>
          </div>

          <section className="legal-section">
            <h3 className="legal-sub-title">B.1 Scope</h3>
            <p className="legal-para">This AMC provides for ongoing maintenance, bug resolution, security updates, and minor enhancements for the project delivered under the Service Agreement, billed annually or quarterly as agreed.</p>

            <h3 className="legal-sub-title">B.2 Plan Pricing</h3>
            <table className="legal-table">
              <thead><tr><th>Plan</th><th>Annual Fee (₹)</th><th>Key Inclusions</th></tr></thead>
              <tbody>
                <tr>
                  <td><strong>Basic</strong></td>
                  <td>{optional.amcPlans[0].annualFee ? Number(optional.amcPlans[0].annualFee).toLocaleString('en-IN') : '____________'}</td>
                  <td>Bug resolution (10 hrs/month), security patches, monthly monitoring, email support (48h SLA)</td>
                </tr>
                <tr>
                  <td><strong>Standard</strong></td>
                  <td>{optional.amcPlans[1].annualFee ? Number(optional.amcPlans[1].annualFee).toLocaleString('en-IN') : '____________'}</td>
                  <td>All Basic services + content updates (5/month), performance optimisation, priority support (24h SLA)</td>
                </tr>
                <tr>
                  <td><strong>Premium</strong></td>
                  <td>{optional.amcPlans[2].annualFee ? Number(optional.amcPlans[2].annualFee).toLocaleString('en-IN') : '____________'}</td>
                  <td>All Standard services + feature enhancements (8 hrs/month), real-time monitoring, dedicated support (4h SLA)</td>
                </tr>
              </tbody>
            </table>

            <h3 className="legal-sub-title">B.3 Exclusions</h3>
            <p className="legal-para">Major feature development, complete redesign or re-architecture, platform migration, and data recovery arising from Client negligence or unauthorised modifications are not covered under this AMC and will be quoted separately.</p>

            <h3 className="legal-sub-title">B.4 Renewal &amp; Termination</h3>
            <p className="legal-para">The AMC may be renewed annually. Either Party may terminate with thirty (30) days' written notice prior to renewal. No refund shall be issued for an unused portion of a paid AMC term unless terminated by the Company without cause.</p>

            <div className="doc-sig-grid" style={{marginTop:'40px'}}>
              <SigBlock title={`For ${fill(company.name, 'VisualX Technologies')}`} sig={signatures.company} />
              <SigBlock title={`For the Client — ${fill(client.name)}`} sig={signatures.client} />
            </div>
          </section>
        </>}

        {/* ── Footer ───────────────────────── */}
        <div className="legal-doc-footer">
          <strong>— END OF AGREEMENT —</strong><br />
          Generated by VisualX Technologies Service Agreement Generator &nbsp;|&nbsp; {new Date().getFullYear()} &copy; {fill(company.name, 'VisualX Technologies')}. All rights reserved.
        </div>

      </div>
      {/* ── end #contract-document ── */}
    </div>
  );
}
