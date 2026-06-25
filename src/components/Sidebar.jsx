import { NavLink } from "react-router-dom";

const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Holdings", path: "/holdings" },
    { label: "Opportunities", path: "/watchlist" },
    { label: "Ethics", path: "/ethics" },
    { label: "Insights", path: "/insights" },
    { label: "History", path: "/history" },
    { label: "Settings", path: "/settings" },
    { label: "Timeline", path: "/timeline", },
];

function Sidebar() {
    return (
        <aside className="sidebar">
            <div>
                <h1>Sponduli</h1>
                <p>Build wealth. Fund dreams. Help others.</p>

                <nav>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => (isActive ? "active" : "")}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </aside>
    );
}

export default Sidebar;