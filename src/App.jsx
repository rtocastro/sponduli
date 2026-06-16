import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";

function App() {
  const [activeSection, setActiveSection] = useState("Dashboard");

  return (
    <div className="app-shell">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="main-content">
        {activeSection === "Dashboard" && <Dashboard />}

        {activeSection !== "Dashboard" && (
          <section className="placeholder-page">
            <p className="eyebrow">{activeSection}</p>
            <h2>{activeSection}</h2>
            <p>
              This section is ready. We’ll build this screen next.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;