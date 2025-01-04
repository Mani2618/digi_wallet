import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext"; // Import UserContext
import "./Pages.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setUser } = useContext(UserContext); // Get setUser from context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        name,
        email,
        password,
        confirmPassword,
      });

      alert(response.data.message);
      const newUser = { name, email }; // You can expand this based on your response
      setUser(newUser); // Set the user in context
      navigate("/login"); // Redirect to login page after successful signup
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="form-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Enter Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Enter Email ID</label>
          <input
            id="email"
            type="email"
            placeholder="Enter Your Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Enter Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Your Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account!! {" "}
        <span className="login-link" onClick={() => navigate("/login")}>
          Sign In
        </span>
      </p>
    </div>
  );
};

export default Signup;
