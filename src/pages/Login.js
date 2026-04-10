import { useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      nav("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  const google = async () => {
    try {
      await signInWithPopup(auth, provider);
      nav("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <div className="form-group">
        <input onChange={e => setEmail(e.target.value)} placeholder="Email" />
      </div>
      <div className="form-group">
        <input type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
      </div>
      <button onClick={login}>Login</button>
      <button onClick={google}>Login with Google</button>
    </div>
  );
}

export default Login;