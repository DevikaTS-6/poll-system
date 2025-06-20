// src/pages/Home.js
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Optional if you're styling

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="card">
        <h1>Welcome to the Poll System</h1>
        <button onClick={() => navigate("/Student")}>Join as Student</button>
        <button onClick={() => navigate("/Teacher")}>Go to Teacher Panel</button>
      </div>
    </div>
  );
}

