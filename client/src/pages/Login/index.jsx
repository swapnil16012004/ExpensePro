import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import FlashComponent from "../../components/FlashComponent";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { flashMessage, setFlashMessage, severity, setSeverity } =
    useContext(MyContext);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setFlashMessage(res.data.message);
      setSeverity("success");
      navigate("/dashboard");
    } catch (error) {
      setFlashMessage(error.response.data.error);
      setSeverity("error");
    }
  }

  const handleclick = () => {
    navigate("/signup");
  };

  useEffect(() => {
    if (flashMessage) {
      setTimeout(() => {
        setFlashMessage(null);
        setSeverity("");
      }, 4000);
    }
  }, [flashMessage]);

  return (
    <div>
      {flashMessage && <FlashComponent severity={severity} />}
      <form className="loginForm" onSubmit={handleLogin}>
        <h2 className="text-center">Login</h2>
        <br />
        <div className="d-flex flex-column gap-3 formEle">
          <input
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <div>
            <button className="btn btn-info loginBtn">Login</button>
          </div>
          <div className="signUPDiv d-flex flex-column align-items-center">
            <p className="expensePara">New to ExpensePro?</p>
            <button className="btn btn-info signUpBtn" onClick={handleclick}>
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
