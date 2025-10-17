import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import { createContext, useEffect, useState } from "react";

const MyContext = createContext();
export default function App() {
  const token = localStorage.getItem("token");

  const [flashMessage, setFlashMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const values = {
    flashMessage,
    setFlashMessage,
    severity,
    setSeverity,
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("flashMessage", flashMessage);
      localStorage.setItem("severity", severity);
    } else {
      localStorage.removeItem("flashMessage");
      localStorage.removeItem("severity");
    }
  }, [flashMessage, severity]);

  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        <Routes>
          <Route
            path="/"
            element={
              token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/login"
            element={token ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/signup"
            element={token ? <Navigate to="/dashboard" /> : <Signup />}
          />
          <Route
            path="/dashboard"
            element={token ? <Dashboard /> : <Navigate to="/login" />}
          />
        </Routes>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export { MyContext };
