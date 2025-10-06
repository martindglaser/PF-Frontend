import { TABS } from "../utils/constants";

export default function Sidebar({ activeTab, onTabChange }) {
    return (
        <aside className="sidebar">
            <div className="brand-row">
                <div className="logo-circle">AI</div>
                <div className="brand-txt">QA Dashboard</div>
            </div>

            <nav className="nav">
                {TABS.map((t) => (
                    <button
                        key={t.key}
                        className={`nav-item ${activeTab === t.key ? "active" : ""}`}
                        onClick={() => onTabChange(t.key)}
                        title={t.label}
                    >
                        <span className="nav-ico">{t.icon}</span>
                        <span>{t.label}</span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-foot">
                <div className="muted">Proyecto colaborativo</div>
            </div>
        </aside>
    );
}