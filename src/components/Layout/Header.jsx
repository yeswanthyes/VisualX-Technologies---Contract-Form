import './Header.css';

export default function Header() {
  return (
    <header className="header no-print">
      <div className="header-brand">
        <div className="header-logo-mark">VX</div>
        <div className="header-brand-text">
          <span className="header-company-name">VisualX Technologies</span>
          <span className="header-tagline">Service Agreement Generator</span>
        </div>
      </div>
      <div className="header-divider" />
      <div className="header-doc-badge">
        <div className="header-doc-badge-dot" />
        <span>Live Document</span>
      </div>
    </header>
  );
}
