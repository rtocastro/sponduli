const navItems = ["Dashboard", "Holdings", "Watchlist", "Ethics", "Insights"];

function Sidebar({ activeSection, setActiveSection }) {
  return (
    <aside className="sidebar">
      <div>
        <h1>Sponduli</h1>
        <p>Build wealth. Fund dreams. Help others.</p>

        <nav>
          {navItems.map((item) => (
            <button
              key={item}
              className={activeSection === item ? "active" : ""}
              onClick={() => setActiveSection(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;