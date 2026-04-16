import './Header.css';

export default function Header() {
  return (
    <header className="header no-print">
      <div className="header-brand">
        <img
          src="./logo.png"
          alt="VisualX Technologies"
          className="header-logo-img"
        />
        <div className="header-brand-text">
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
