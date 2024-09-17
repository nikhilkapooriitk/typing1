import "./Header.css";
// components/Header.tsx
function Header() {
  return (
    <header className="header">
      <div className="header-actions">
        <button className="help-btn">?</button>
        <button className="notifications-btn">🔔</button>
        <button className="profile-btn">👤</button>
      </div>
    </header>
  );
}

export default Header;
