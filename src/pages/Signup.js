import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup Success ✅");
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Signup</h2>
      <div className="form-group">
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      </div>
      <button onClick={signup}>Signup</button>
    </div>
  );
}

export default Signup;