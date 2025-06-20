// src/pages/Student.js
import "../styles/Student.css";
import { useEffect, useState } from "react";
import { socket } from "../sockets/socket";
export default function Student() {
  const [name, setName] = useState(localStorage.getItem("studentName") || "");
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
     socket.on("connect", () => {
    console.log("✅ [Student] Connected to backend. Socket ID:", socket.id);
  });
    
    if (name) {
      localStorage.setItem("studentName", name);
      socket.emit("student-join", name);
    }

 socket.on("question", (q) => {
  setQuestion(q);
  setSubmitted(false);
  setAnswer("");
  setTimeLeft(60);
  setTimerRunning(true);

  const timerInterval = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(timerInterval);
        setTimerRunning(false);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
});


    socket.on("update-results", (res) => setResults(res));
    socket.on("poll-ended", (res) => setResults(res));

    return () => {
      socket.off("question");
      socket.off("update-results");
      socket.off("poll-ended");
    };
  }, [name]);

  const handleSubmit = () => {
    if (answer.trim()) {
      socket.emit("submit-answer", answer);
      setSubmitted(true);
    }
  };

  if (!name) {
    return (
      <div>
        <h2>Enter Your Name</h2>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={() => {
          localStorage.setItem("studentName", name);
          window.location.reload();
        }}>Join</button>
      </div>
    );
  }

return (
  <div className="container">
    <h2>Hi, {name}</h2>

    {question && !submitted && (
      <>
        <h3>{question}</h3>
        {timerRunning && <p className="timer">Time left: {timeLeft} seconds</p>}
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={timeLeft === 0 || submitted}
        />
        <button
          onClick={handleSubmit}
          disabled={timeLeft === 0 || submitted}
        >
          Submit Answer
        </button>
      </>
    )}

    {submitted && (
      <>
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

      </>
    )}
  </div>
);

}
