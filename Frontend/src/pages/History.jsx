import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './History.css';

const History = () => {
  const { getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(history);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };
    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="history-container">
      <button className="back-btn" onClick={() => navigate('/home')}>
        ⬅ Home
      </button>

      <h2>Your Meeting History</h2>

      <div className="cards-container">
        {meetings.length === 0 ? (
          <p>No meetings found!</p>
        ) : (
          meetings.map((meeting, index) => (
            <div key={index} className="history-card">
              <p><strong>Code:</strong> {meeting.meetingCode}</p>
              <p><strong>Date:</strong> {formatDate(meeting.date)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export { History }
