import { useEffect } from "react";
import "./App.css";
import "./handshake.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import HandshakeDashboard from "./components/HandshakeDashboard";
import HandshakeClone from "./components/HandshakeClone";
import ModularDashboard from "./components/modular/HandshakeDashboard";
import PWAManager from "./components/PWAManager";
import NotificationManager from "./components/NotificationManager";
import OfflineManager from "./components/OfflineManager";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard Options</h1>
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <Link to="/dashboard" style={{ padding: 10, background: '#007acc', color: 'white', textDecoration: 'none', borderRadius: 5 }}>
          Modular Dashboard (Recommandé)
        </Link>
        <Link to="/clone" style={{ padding: 10, background: '#28a745', color: 'white', textDecoration: 'none', borderRadius: 5 }}>
          Force Graph Clone
        </Link>
        <Link to="/original" style={{ padding: 10, background: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: 5 }}>
          Original Dashboard
        </Link>
        <Link to="/pwa-manager" style={{ padding: 10, background: '#10b981', color: 'white', textDecoration: 'none', borderRadius: 5 }}>
          Gestionnaire PWA
        </Link>
        <Link to="/notifications" style={{ padding: 10, background: '#8b5cf6', color: 'white', textDecoration: 'none', borderRadius: 5 }}>
          Notifications
        </Link>
        <Link to="/offline" style={{ padding: 10, background: '#f59e0b', color: 'white', textDecoration: 'none', borderRadius: 5 }}>
          Mode Hors Ligne
        </Link>
      </div>
    </div>
  );
}

function testBackend() {
  // Désactivé temporairement pour éviter les erreurs 404
  console.log("🔧 Backend test désactivé - Mode développement");
  console.log("Backend URL:", BACKEND_URL);
  console.log("API URL:", API);
  
  // Uncomment when backend is ready:
  /*
  axios
    .get(`${API}/health`)
    .then((response) => {
      console.log("✅ Backend Connected");
      console.log("Response:", response.data);
    })
    .catch((error) => {
      console.log("❌ Backend Connection Failed");
      if (error.response) {
        console.log("Response status:", error.response.status);
        console.log("Response data:", error.response.data);
      } else if (error.request) {
        console.log("No response received:", error.request);
      } else {
        console.log("Request setup error:", error.message);
      }
    });
  */
}

function App() {
  useEffect(() => {
    console.log("🚀 App Started");
    console.log("Backend URL:", BACKEND_URL);
    console.log("API URL:", API);
    testBackend();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ModularDashboard />} />
          <Route path="/dashboard" element={<ModularDashboard />} />
          <Route path="/clone" element={<HandshakeClone />} />
          <Route path="/original" element={<HandshakeDashboard />} />
          <Route path="/pwa-manager" element={<PWAManager />} />
          <Route path="/notifications" element={<NotificationManager />} />
          <Route path="/offline" element={<OfflineManager />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
      
      {/* Prompt d'installation PWA */}
      <PWAInstallPrompt />
    </div>
  );
}

export default App;
