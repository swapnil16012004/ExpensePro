import { useContext, useEffect, useState } from "react";
import "../../App.css";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FcMoneyTransfer } from "react-icons/fc";
import { FaPencil } from "react-icons/fa6";
import { ImBin2 } from "react-icons/im";
import { MyContext } from "../../App";
import FlashComponent from "../../components/FlashComponent";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [comments, setComments] = useState("");
  const [editing, setEditing] = useState(null);

  const token = localStorage.getItem("token");
  const { flashMessage, setFlashMessage, severity, setSeverity } =
    useContext(MyContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function fetchExpenses() {
    try {
      const res = await axios.get("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch expenses. Please log in again.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const data = { category, amount, comments };
    try {
      if (editing) {
        await axios.put(`http://localhost:5000/api/expenses/${editing}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditing(null);
      } else {
        await axios.post("http://localhost:5000/api/expenses", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setCategory("");
      setAmount("");
      setComments("");
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this expense?")) return;
    await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchExpenses();
  }

  function handleEdit(exp) {
    setEditing(exp._id);
    setCategory(exp.category);
    setAmount(exp.amount);
    setComments(exp.comments || "");
  }

  const chartData = Object.values(
    expenses.reduce((acc, exp) => {
      if (!acc[exp.category])
        acc[exp.category] = { category: exp.category, amount: 0 };
      acc[exp.category].amount += exp.amount;
      return acc;
    }, {})
  );

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A020F0",
    "#DC143C",
  ];

  useEffect(() => {
    if (flashMessage) {
      setTimeout(() => {
        setFlashMessage(null);
        setSeverity("");
      }, 4000);
    }
  }, [flashMessage]);

  return (
    <div className="dashBoardCover">
      {flashMessage && <FlashComponent severity={severity} />}
      <button
        className="btn btn-danger logoutBtn"
        onClick={() => {
          localStorage.removeItem("token");
          setFlashMessage("You are logged out!");
          setSeverity("success");
          navigate("/login");
        }}
      >
        Logout
      </button>

      <h2>
        <FcMoneyTransfer /> Expense Tracker Dashboard
      </h2>

      <form className="expenseForm" onSubmit={handleSubmit}>
        <div className="d-flex flex-column gap-4">
          <input
            type="text"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (e.g. Food, Travel)"
            required
          />
          <input
            type="number"
            value={amount}
            className="form-control"
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            required
          />
          <input
            type="text"
            value={comments}
            className="form-control"
            onChange={(e) => setComments(e.target.value)}
            placeholder="Comments (optional)"
          />
          <button type="submit" className="btn btn-primary ExpenseButton">
            {editing ? "Update Expense" : "Add Expense"}
          </button>
        </div>
      </form>

      <h3 className="expensesHead">Your Expenses</h3>
      {expenses.length === 0 ? (
        <p>No expenses added yet.</p>
      ) : (
        <table className="expenseTable w-100 border">
          <thead className="tableHead">
            <tr>
              <th className="category">Category</th>
              <th>Amount</th>
              <th>Comments</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr className="tableRow" key={exp._id}>
                <td>{exp.category}</td>
                <td>₹{exp.amount}</td>
                <td>{exp.comments}</td>
                <td>{new Date(exp.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className="btn"
                    onClick={() => handleEdit(exp)}
                    style={{ marginRight: "6px" }}
                  >
                    <FaPencil />
                  </button>
                  <button className="btn" onClick={() => handleDelete(exp._id)}>
                    <ImBin2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {chartData.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h3>Category-wise Expense Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="amount"
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={(entry) => entry.category}
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
