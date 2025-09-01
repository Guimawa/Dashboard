import { useEffect } from "react";
import "./App.css";
import "./handshake.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import HandshakeDashboard from "./components/HandshakeDashboard";
import HandshakeClone from "./components/HandshakeClone";
import ModularDashboard from "./components/modular/HandshakeDashboard";

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
      </div>
    </div>
  );
}

function testBackend() {
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
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HandshakeClone />} />
          <Route path="/dashboard" element={<HandshakeClone />} />
          <Route path="/old-dashboard" element={<HandshakeDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
