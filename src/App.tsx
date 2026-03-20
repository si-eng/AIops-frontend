import { useEffect, useState } from "react";

function App() {
  const [logs, setLogs] = useState<any[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<any>(null);

  // -----------------------------
  // Fetch Logs
  // -----------------------------
  const fetchLogs = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/logs");
      const data = await res.json();

      console.log("LOGS:", data); // 🔥 DEBUG

      setLogs(data);
    } catch (err) {
      console.error("Logs error:", err);
    }
  };

  // -----------------------------
  // Fetch Status
  // -----------------------------
  const fetchStatus = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/status");
      const data = await res.json();

      console.log("STATUS:", data); // 🔥 DEBUG

      setStatus(data);
    } catch (err) {
      console.error("Status error:", err);
    }
  };

  // -----------------------------
  // Chat
  // -----------------------------
  const sendQuery = async () => {
    if (!query.trim()) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      console.log("CHAT:", data); // 🔥 DEBUG

      setResponse(data);
      setQuery("");
    } catch (err) {
      console.error("Chat error:", err);
    }
  };

  // -----------------------------
  // Load data
  // -----------------------------
  useEffect(() => {
    fetchLogs();
    fetchStatus();

    const interval = setInterval(() => {
      fetchLogs();
      fetchStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>🚀 AIOps Dashboard</h1>

      {/* STATUS */}
      <h2>Status</h2>
      {status ? (
        <div>
          <p><b>Status:</b> {status.status}</p>
          <p><b>Message:</b> {status.message}</p>
        </div>
      ) : (
        <p>Loading status...</p>
      )}

      {/* CHAT */}
      <h2>Ask AIOps</h2>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Why is system slow?"
        style={{ padding: "8px", width: "300px" }}
      />
      <button onClick={sendQuery} style={{ marginLeft: "10px" }}>
        Ask
      </button>

      {/* RESPONSE */}
      {response && (
        <div style={{ marginTop: "15px", background: "#222", padding: "10px" }}>
          <h3>AI Response</h3>
          <p><b>Answer:</b> {response.answer}</p>
          <p><b>Suggestion:</b> {response.suggestion}</p>

          <h4>Incidents:</h4>
          {response.incidents?.length === 0 && <p>No incidents</p>}

          {response.incidents?.map((inc: any, i: number) => (
            <div key={i}>
              <p>{inc.type} - {inc.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* LOGS */}
      <h2>Logs</h2>

      {logs.length === 0 ? (
        <p>Loading logs...</p>
      ) : (
        <table border={1} cellPadding={5}>
          <thead>
            <tr>
              <th>Time</th>
              <th>Level</th>
              <th>Message</th>
              <th>Latency</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log: any, i: number) => (
              <tr key={i}>
                <td>{log.timestamp}</td>
                <td>{log.level}</td>
                <td>{log.message}</td>
                <td>{log.latency_ms} ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;