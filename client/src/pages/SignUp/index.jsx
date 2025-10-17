import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import FlashComponent from "../../components/FlashComponent";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const { flashMessage, setFlashMessage, severity, setSeverity } =
    useContext(MyContext);
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    if (password !== confirm) {
      setFlashMessage("Passwords do not match");
      setSeverity("error");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setFlashMessage(res.data.message);
      setSeverity("success");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      console.log(err);
    }
  }

  useEffect(() => {
    if (flashMessage) {
      setTimeout(() => {
        setFlashMessage(null);
        setSeverity("");
      }, 4000);
    }
  }, [flashMessage]);

  return (
    <div className="signUPCover">
      {flashMessage && <FlashComponent severity={severity} />}
      <form className="signUpForm gap-4" onSubmit={handleSignup}>
        <h2 className="createAcc">Create Account</h2>
        <input
          className="form-control"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="form-control"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          className="form-control"
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-info signUpBtn">
          Sign Up
        </button>
        <p className="text-center expensePara">
          Already have an account?{"  "}
          <Link to="/login">
            <button className="btn btn-info loginBtn">Login</button>
          </Link>
        </p>
      </form>
    </div>
  );
}
