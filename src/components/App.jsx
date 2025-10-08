import { useEffect, useState } from "react";
import "../styles/App.css";

// Componentes
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import History from "./History";
import Reports from "./Reports";
import Analysis from "./Analysis";

export default function App() {
    // Nav + configuración
    const [tab, setTab] = useState("dashboard");
    const [Url, setUrl] = useState("");
    const [Tolerance, setTolerance] = useState("medium");
    const [Language, setLanguage] = useState("es");

    // Estado ejecución
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    // Historial (persistencia local)
    const [history, setHistory] = useState(() => {
        const raw = localStorage.getItem("qaHistoryV1");
        return raw ? JSON.parse(raw) : [];
    });

    useEffect(() => {
        localStorage.setItem("qaHistoryV1", JSON.stringify(history));
    }, [history]);

    function renderContent() {
        switch (tab) {
            case "dashboard":
                return (
                    <Dashboard
                        history={history}
                        onTabChange={setTab}
                        Url={Url}
                        setUrl={setUrl}
                        Tolerance={Tolerance}
                        setTolerance={setTolerance}
                        Language={Language}
                        setLanguage={setLanguage}
                        loading={loading}
                        setLoading={setLoading}
                        error={error}
                        setError={setError}
                        setResult={setResult}
                        setHistory={setHistory}
                    />
                );
            case "history":
                return (
                    <History
                        history={history}
                        onViewResult={setResult}
                        onTabChange={setTab}
                    />
                );
            case "reports":
                return <Reports history={history} />;
            case "analysis":
                return <Analysis result={result} />;
            default:
                return <Dashboard />;
        }
    }

    return (
        <div className="shell">
            <Sidebar activeTab={tab} onTabChange={setTab} />
            
            <main className="content">
                {renderContent()}
            </main>
        </div>
    );
}
