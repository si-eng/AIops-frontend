import { useEffect, useState } from "react";

const BASE_URL = "https://a-iops-backend.vercel.app";

function App() {
  const [logs, setLogs] = useState<any[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<any>(null);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${BASE_URL}/logs`);
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${BASE_URL}/status`);
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendQuery = async () => {
    if (!query.trim()) return;

    try {
      const res = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setResponse(data.analysis);
      setQuery("");
    } catch (err) {
      console.error(err);
    }
  };

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

      <h2>Status</h2>
      {status ? (
        <div>
          <p><b>Status:</b> {status.status}</p>
          <p><b>Message:</b> {status.message}</p>
        </div>
      ) : (
        <p>Loading status...</p>
      )}

      <h2>Ask AIOps</h2>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Why is system slow?"
      />
      <button onClick={sendQuery}>Ask</button>

      {response && (
        <div>
          <h3>AI Analysis</h3>
          <p><b>Issue:</b> {response.issue}</p>
          <p><b>Root Cause:</b> {response.root_cause}</p>
          <p><b>Suggestion:</b> {response.suggestion}</p>
        </div>
      )}

      <h2>Logs</h2>
      {logs.length === 0 ? (
        <p>Loading logs...</p>
      ) : (
        <table border={1}>
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
                <td>{log.latency_ms}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
