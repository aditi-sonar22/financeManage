import { useState, useEffect } from "react";

function App() {
  const [form, setForm] = useState({
    name: "",
    targetAmount: "",
    savedAmount: "",
    dueDate: ""
  });

  const [goals, setGoals] = useState([]);

  // fetch goals from backend
  const fetchGoals = async () => {
    const res = await fetch("http://localhost:5000/goals");
    const data = await res.json();
    console.log(data);
    setGoals(data);
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
    fetchGoals(); // refresh list
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Financial Goal Tracker</h1>

      <input name="name" placeholder="Goal Name" onChange={handleChange} /><br /><br />
      <input name="targetAmount" placeholder="Target Amount" onChange={handleChange} /><br /><br />
      <input name="savedAmount" placeholder="Saved Amount" onChange={handleChange} /><br /><br />
      <input name="dueDate" type="date" onChange={handleChange} /><br /><br />

      <button onClick={handleSubmit}>Add Goal</button>

      <h2>All Goals</h2>

      {goals.map((g, index) => (
        <div style={{
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
        </div>
      ))}
    </div>
  );
}

export default App;