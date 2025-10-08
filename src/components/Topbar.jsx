import { t } from "../i18n";

export default function Topbar() {
    return (
        <header className="topbar">
            <input
                className="search"
                placeholder={t('topbar.searchPlaceholder')}
            />
            <div className="user-chip">{t('topbar.user')}</div>
        </header>
    );
}