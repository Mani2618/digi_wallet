import React, { useEffect, useState } from "react";
import "./Pages.css";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    const storedUpiId = localStorage.getItem("upiId");
    setUpiId(storedUpiId);

    const fetchTransactions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/transactions/${storedUpiId}`);
        const data = await response.json();
        if (response.ok) {
          setTransactions(data);
        } else {
          alert(data.message || "Failed to fetch transactions");
        }
      } catch (err) {
        alert("Error fetching transactions");
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="transactions-container">
      <h2>Your Transactions</h2>
      <div className="transactions-list">
        {transactions.length > 0 ? (
          <ul>
            {transactions.map((txn) => (
              <li key={txn._id}>
                {txn.sender_upi_id === upiId
                  ? `Sent to ${txn.receiver_upi_id}`
                  : `Received from ${txn.sender_upi_id}`} 
                - ₹{txn.amount} 
                <span>({new Date(txn.timestamp).toLocaleString()})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default Transactions;
