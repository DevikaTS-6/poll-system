// src/pages/Teacher.js
import "../styles/Teacher.css";
import { useState, useEffect } from "react";
import { socket } from "../sockets/socket";

export default function Teacher() {
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState([]);
  const sendQuestion = () => {
  if (question.trim()) {
    socket.emit("new-question", question);  // send question to backend
    setQuestion("");                        // clear input after sending
  }
};
  useEffect(() => {
    socket.on("connect", () => {
    console.log("✅ [Teacher] Connected to backend. Socket ID:", socket.id);
  });
    socket.on("update-results", (res) => setResults(res));
    socket.on("poll-ended", (res) => setResults(res));

    return () => {
      socket.off("update-results");
      socket.off("poll-ended");
    };
  }, []);

return (
  <div className="teacher-container">
    <h2>Teacher Panel</h2>
    <input
      type="text"
      placeholder="Enter a question"
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
    />
    <button onClick={sendQuestion}>Send Question</button>

   <h3>Live Results:</h3>
<ul>
  {[...new Set(results.map(r => r.answer))].map((ans, i) => {
    const count = results.filter(r => r.answer === ans).length;
    const percent = ((count / results.length) * 100).toFixed(0);
    return (
      <li key={i}>
        {ans} — {percent}%
      </li>
    );
  })}
</ul>

  </div>
);

}
