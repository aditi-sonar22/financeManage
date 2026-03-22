import { useState, useEffect } from "react";

function App() {
  const [form, setForm] = useState({
    name: "",
    targetAmount: "",
    savedAmount: "",
    dueDate: ""
  });

  const [goals, setGoals] = useState([]);
  const [reminders, setReminders] = useState([]); // ✅ added

  const fetchGoals = async () => {
    const res = await fetch("http://localhost:5000/goals");
    const data = await res.json();
    setGoals(data);
  };

  const fetchReminders = async () => {   // ✅ added
    const res = await fetch("http://localhost:5000/reminders");
    const data = await res.json();
    setReminders(data);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await fetch("http://localhost:5000/addGoal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    alert("Goal Added!");
    fetchGoals();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Financial Goal Tracker</h1>

      <input name="name" placeholder="Goal Name" onChange={handleChange} /><br /><br />
      <input name="targetAmount" placeholder="Target Amount" onChange={handleChange} /><br /><br />
      <input name="savedAmount" placeholder="Saved Amount" onChange={handleChange} /><br /><br />
      <input name="dueDate" type="date" onChange={handleChange} /><br /><br />

      <button onClick={handleSubmit}>Add Goal</button>

      <button onClick={fetchReminders} style={{ marginLeft: "10px" }}>
        Show Priority Goals
      </button>

      <h2>All Goals</h2>

      {goals.map((g, index) => (
        <div key={index} style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "15px",
          margin: "10px",
          boxShadow: "2px 2px 10px rgba(0,0,0,0.1)"
        }}>
          <p><b>Name:</b> {g.name}</p>
          <p><b>Target:</b> ₹{g.targetAmount}</p>
          <p><b>Saved:</b> ₹{g.savedAmount}</p>
          <p><b>Due Date:</b> {new Date(g.dueDate).toLocaleDateString()}</p>

          <p>
            <b>Progress:</b>{" "}
            {((g.savedAmount / g.targetAmount) * 100).toFixed(2)}%
          </p>

          <button onClick={async () => {
            await fetch(`http://localhost:5000/deleteGoal/${g._id}`, {
              method: "DELETE"
            });
            fetchGoals();
          }}>
            Delete
          </button>

          <button onClick={async () => {
            const amount = prompt("Enter amount to add");

            await fetch(`http://localhost:5000/updateGoal/${g.name}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ amount: Number(amount) })
            });

            fetchGoals();
          }} style={{ marginLeft: "10px" }}>
            Update
          </button>
        </div>
      ))}

      <h2>Priority Goals</h2>

      {reminders.map((g, index) => (
        <div key={index}>
          <p>{g.name} - {new Date(g.dueDate).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

export default App;