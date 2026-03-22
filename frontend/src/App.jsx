import { useState, useEffect } from "react";

function App() {
  const [form, setForm] = useState({
    name: "",
    targetAmount: "",
    savedAmount: "",
    dueDate: ""
  });

  const [goals, setGoals] = useState([]);
  const [reminders, setReminders] = useState([]);

  const fetchGoals = async () => {
    const res = await fetch("http://localhost:5000/goals");
    const data = await res.json();
    setGoals(data);
  };

  const fetchReminders = async () => {
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
  if (!form.name || !form.targetAmount || !form.savedAmount || !form.dueDate) {
    alert("Please fill all fields!");
    return;
  }

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
  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "5px 0",
    borderRadius: "5px",
    border: "1px solid #ccc"
  };

  const buttonStyle = {
    padding: "8px 12px",
    margin: "5px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    color: "white"
  };

  return (
   <div style={{
  padding: "20px",
  maxWidth: "700px",
  margin: "auto",
  fontFamily: "Segoe UI, Arial, sans-serif"
}}>
    <h1 style={{
  fontWeight: "600",
  fontSize: "34px",
  color: "#2c3e50",
  textAlign: "center",
  letterSpacing: "1px"
}}>
  💰 Financial Goal Tracker
</h1>

      {/* FORM */}
      <input name="name" placeholder="Goal Name" onChange={handleChange} style={inputStyle} />
      <input name="targetAmount" placeholder="Target Amount" onChange={handleChange} style={inputStyle} />
      <input name="savedAmount" placeholder="Saved Amount" onChange={handleChange} style={inputStyle} />
      <input name="dueDate" type="date" onChange={handleChange} style={inputStyle} />

      <div style={{ marginTop: "10px" }}>
        <button
          style={{ ...buttonStyle, backgroundColor: "#28a745" }}
          onClick={handleSubmit}
        >
          Add Goal
        </button>

        <button
          style={{ ...buttonStyle, backgroundColor: "#6c757d" }}
          onClick={fetchReminders}
        >
          <h2 style={{
  fontWeight: "600",
  fontSize: "24px",
  color: "#2c3e50",
  marginTop: "20px",
  borderBottom: "2px solid #ccc",
  paddingBottom: "5px"
}}>
  ⏰ Priority Goals
</h2>
        </button>
      </div>

      {/* ALL GOALS */}
      <h2 style={{ borderBottom: "2px solid #ccc", paddingBottom: "5px" }}>
        All Goals
      </h2>

      {goals.length === 0 && <p>No goals added yet</p>}

      {goals.map((g) => (
        <div
          key={g._id}
          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "15px",
            margin: "15px 0",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)"
          }}
        >
          <p><b>Name:</b> {g.name}</p>
          <p><b>Target:</b> ₹{Number(g.targetAmount).toLocaleString()}</p>
          <p><b>Saved:</b> ₹{Number(g.savedAmount).toLocaleString()}</p>
          <p><b>Due Date:</b> {new Date(g.dueDate).toLocaleDateString()}</p>

          {/* PROGRESS */}
          <p>
            <b>Progress:</b>{" "}
            {g.targetAmount
              ? ((g.savedAmount / g.targetAmount) * 100).toFixed(2)
              : 0}%
          </p>

          <div style={{
            height: "10px",
            backgroundColor: "#ddd",
            borderRadius: "5px"
          }}>
            <div style={{
              width: `${g.targetAmount
                ? (g.savedAmount / g.targetAmount) * 100
                : 0}%`,
              height: "100%",
              backgroundColor: "#28a745",
              borderRadius: "5px"
            }}></div>
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ marginTop: "10px" }}>
            <button
              style={{ ...buttonStyle, backgroundColor: "#007bff" }}
              onClick={async () => {
                const amount = prompt("Enter amount to add");

                await fetch(`http://localhost:5000/updateGoal/${g.name}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ amount: Number(amount) })
                });

                fetchGoals();
              }}
            >
              Update
            </button>

            <button
              style={{ ...buttonStyle, backgroundColor: "#dc3545" }}
              onClick={async () => {
                await fetch(`http://localhost:5000/deleteGoal/${g._id}`, {
                  method: "DELETE"
                });
                fetchGoals();
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* PRIORITY GOALS */}
      <h2>Priority Goals</h2>

      {reminders.length === 0 && <p>No priority goals</p>}

      {reminders.map((g, index) => (
  <div key={index} style={{
    backgroundColor: "#fff",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)"
  }}>
    <p><b>{g.name}</b></p>
    <p>📅 {new Date(g.dueDate).toLocaleDateString()}</p>
  </div>
))}
    </div>
  );
}

export default App;