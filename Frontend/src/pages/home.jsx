import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "./Home.css"; // ✅ new css file
import { AuthContext } from '../contexts/AuthContext'
import HomeLogo from '../assets/logo3.png'

function HomeComponent() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const { addToUserHistory } = useContext(AuthContext);

  const handleJoinVideoCall = async () => {
    if (!meetingCode.trim()) return;
    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };

  return (
    <div className="home-wrapper">
      {/* Navbar */}
      <nav className="home-navbar">
        <h2 className="logo">Apna Video Call</h2>
        <div className="nav-links">
          <button className="link-btn" onClick={() => navigate("/history")}>
            🕒 History
          </button>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth");
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Section */}
      <div className="home-content">
        <div className="left-panel">
          <h1>
            Providing <span>Quality Video Calls</span> <br /> Just Like Quality Education
          </h1>
          <p>
            Start or join a secure meeting instantly. Just enter a meeting code
            to connect.
          </p>

          <div className="join-form">
            <input
              type="text"
              placeholder="Enter Meeting Code"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
            />
            <button className="join-btn" onClick={handleJoinVideoCall}>
              Join
            </button>
          </div>
        </div>

        <div className="right-panel">
          <img src={HomeLogo} alt="Video Call Illustration" />
        </div>
      </div>
    </div>
  );
}

export default withAuth(HomeComponent);
