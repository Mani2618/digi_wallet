import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Pages.css";

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const upiId = localStorage.getItem("upiId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`http://localhost:5000/api/user/${upiId}`);
        setUserInfo(userResponse.data);

        const transactionsResponse = await axios.get(`http://localhost:5000/api/transactions/${upiId}`);
        setTransactions(transactionsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setLoading(false);
      }
    };

    if (upiId) {
      fetchUserData();
    }
  }, [upiId]);
  
  if (!userInfo) {
    return <div>No user found. Please log in.</div>;
  }

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      <div className="profile-details">
        <p><strong>Name:</strong> {userInfo.name}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
        <p><strong>UPI ID:</strong> {userInfo.upiId}</p>
        <p><strong>Balance:</strong> ₹{userInfo.balance}</p>
      </div>

      <div className="transactions-overview">
        <h2>Recent Transactions</h2>
        {transactions.length > 0 ? (
          <ul>
            {transactions.map((txn) => (
              <li key={txn._id}>
                <p>
                  {txn.sender_upi_id === upiId ? "Sent to" : "Received from"} 
                  {txn.sender_upi_id === upiId ? txn.receiver_upi_id : txn.sender_upi_id} 
                  - ₹{txn.amount}
                </p>
                <small>{new Date(txn.timestamp).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No transactions available.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
