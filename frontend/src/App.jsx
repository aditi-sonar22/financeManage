import { useState } from "react";

function App() {
  const [form, setForm] = useState({
    name: "",
    targetAmount: "",
    savedAmount: "",
    dueDate: ""
  });

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
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Financial Goal Tracker</h1>

      <input name="name" placeholder="Goal Name" onChange={handleChange} /><br /><br />
      <input name="targetAmount" placeholder="Target Amount" onChange={handleChange} /><br /><br />
      <input name="savedAmount" placeholder="Saved Amount" onChange={handleChange} /><br /><br />
      <input name="dueDate" type="date" onChange={handleChange} /><br /><br />

      <button onClick={handleSubmit}>Add Goal</button>
    </div>
  );
}

export default App;