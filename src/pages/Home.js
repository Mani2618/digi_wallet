import React, { useEffect, useState } from "react";
import "./Pages.css";

const Home = () => {
  const [upiId, setUpiId] = useState("");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    const storedUpiId = localStorage.getItem("upiId");
    const storedBalance = localStorage.getItem("balance");

    setUpiId(storedUpiId || "Unknown");
    setBalance(parseFloat(storedBalance) || 0);

    const fetchTransactions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/transactions/${storedUpiId}`);
        const data = await response.json();
        if (response.ok) setTransactions(data);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };

    fetchTransactions();
  }, []);

  const handleSendMoney = async (receiverUpiId, amount) => {
    try {
      const response = await fetch("http://localhost:5000/api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_upi_id: upiId,
          receiver_upi_id: receiverUpiId,
          amount,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Money sent successfully!");
        setBalance((prev) => {
          const updatedBalance = prev - amount;
          localStorage.setItem("balance", updatedBalance);
          return updatedBalance;
        });        
        setShowSendModal(false);
      } else {
        alert(data.message || "Transaction failed");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  const handleRequestMoney = async (receiverUpiId, amount) => {
    alert(`Money request of ₹${amount} sent to ${receiverUpiId}`);
    setShowRequestModal(false);
  };

  return (
    <div className="home-container">
      <h2>Welcome to PayTM Wallet</h2>
      <div className="balance-section">
        <h3>Balance: ₹{balance}</h3>
        <p>UPI ID: {upiId}</p>
      </div>
      <div className="actions">
        <button onClick={() => setShowSendModal(true)}>Send Money</button>
        <button onClick={() => setShowRequestModal(true)}>Receive Money</button>
      </div>

      <div className="transactions">
        <h3>Recent Transactions</h3>
        {transactions.length > 0 ? (
          <ul>
            {transactions.map((txn) => (
              <li key={txn._id}>
                {txn.sender_upi_id === upiId ? "Sent to" : "Received from"}{" "}
                {txn.sender_upi_id === upiId ? txn.receiver_upi_id : txn.sender_upi_id} - ₹
                {txn.amount}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent transactions</p>
        )}
      </div>

      {showSendModal && (
        <Modal
          title="Send Money"
          onClose={() => setShowSendModal(false)}
          onSubmit={handleSendMoney}
          upiId={upiId}
        />
      )}
      {showRequestModal && (
        <Modal
          title="Request Money"
          onClose={() => setShowRequestModal(false)}
          onSubmit={handleRequestMoney}
          upiId={upiId}
        />
      )}
    </div>
  );
};

const Modal = ({ title, onClose, onSubmit, upiId }) => {
  const [receiverUpiId, setReceiverUpiId] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    if (!receiverUpiId || !amount || isNaN(amount)) {
      alert("Please enter valid UPI ID and amount");
      return;
    }
    if (parseFloat(amount) <= 0) { // Add this condition
      alert("Amount must be greater than zero");
      return;
    }
    if (receiverUpiId === upiId) {   // <-- Add this line to check if the user is sending money to themselves
      alert("You cannot send money to yourself.");
      return;
    }
    onSubmit(receiverUpiId, parseFloat(amount));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{title}</h3>
        <input
          type="text"
          placeholder="Enter UPI ID"
          value={receiverUpiId}
          onChange={(e) => setReceiverUpiId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
