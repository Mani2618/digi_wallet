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
      {transactions.length > 0 ? (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Transaction Type</th>
              <th>UPI ID</th>
              <th>Amount (₹)</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn._id}>
                <td>{txn.sender_upi_id === upiId ? "Sent" : "Received"}</td>
                <td>
                  {txn.sender_upi_id === upiId
                    ? txn.receiver_upi_id
                    : txn.sender_upi_id}
                </td>
                <td>{txn.amount}</td>
                <td>{new Date(txn.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
};

export default Transactions;
