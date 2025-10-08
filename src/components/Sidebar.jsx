import { TABS } from "../utils/constants";
import { t } from "../i18n";

export default function Sidebar({ activeTab, onTabChange }) {
    return (
        <aside className="sidebar">
            <div className="brand-row">
                <div className="logo-circle">AI</div>
                <div className="brand-txt">{t('brand.title')}</div>
            </div>

            <nav className="nav">
                {TABS.map((tabItem) => {
                    const label = t(`nav.${tabItem.key}`);
                    return (
                        <button
                            key={tabItem.key}
                            className={`nav-item ${activeTab === tabItem.key ? "active" : ""}`}
                            onClick={() => onTabChange(tabItem.key)}
                            title={label}
                        >
                            <span className="nav-ico">{tabItem.icon}</span>
                            <span>{label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="sidebar-foot">
                <div className="muted">{t('brand.footer')}</div>
            </div>
        </aside>
    );
}