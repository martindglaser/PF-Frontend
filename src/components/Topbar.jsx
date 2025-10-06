export default function Topbar() {
    return (
        <header className="topbar">
            <input
                className="search"
                placeholder="Search tests, URLs, or findings…"
            />
            <div className="user-chip">TU</div>
        </header>
    );
}