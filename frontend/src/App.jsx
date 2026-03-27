import { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

/* ─── Global Styles ─────────────────────────────────────────────────────────── */
const css = document.createElement("style");
css.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #0c0c0c;
    --surface:  #141414;
    --surface2: #1c1c1c;
    --border:   #222222;
    --accent:   #f5a623;
    --accent2:  #ff6b35;
    --warn:     #ff4444;
    --danger:   #ff4444;
    --text:     #e8e0d0;
    --muted:    #5a5248;
    --font-head: 'Space Mono', monospace;
    --font-body: 'DM Sans', sans-serif;
  }

  body { background: var(--bg); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes shimmer  { 0% { background-position: -600px 0; } 100% { background-position: 600px 0; } }
  @keyframes pulseRing {
    0%,100% { box-shadow: 0 0 0 0 rgba(79,159,255,0.3); }
    50%      { box-shadow: 0 0 0 8px rgba(79,159,255,0); }
  }
  @keyframes ripple   { 0% { transform:scale(0); opacity:.5; } 100% { transform:scale(5); opacity:0; } }
  @keyframes progressIn { from { width:0%; } }
  @keyframes arcDraw  { from { stroke-dashoffset: 440; } }
  @keyframes countUp  { from { opacity:0; transform:scale(.6) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }

  .bg-grid {
    position: fixed; inset:0;
    background-image: linear-gradient(rgba(79,159,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,159,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none; z-index:0;
  }

  .navbar {
    position: sticky; top:0; z-index:200;
    display: flex; align-items:center; justify-content:space-between;
    padding: 0 36px; height:64px;
    background: rgba(8,11,20,0.85); backdrop-filter:blur(16px);
    border-bottom: 1px solid var(--border);
    animation: fadeIn .5s ease;
  }
  .navbar-logo { font-family:var(--font-head); font-size:15px; color:var(--accent); letter-spacing:2px; display:flex; align-items:center; gap:10px; }
  .navbar-logo .dot { width:8px; height:8px; border-radius:50%; background:var(--accent2); animation:pulseRing 2s infinite; }
  .navbar-tag  { font-family:var(--font-head); font-size:11px; color:var(--muted); letter-spacing:3px; text-transform:uppercase; }

  .hero-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--border); border-bottom:1px solid var(--border); animation:fadeUp .6s ease both; }
  .hero-stat {
    background:var(--surface); padding:28px 36px; position:relative; overflow:hidden;
    transition:background .3s; cursor:default;
  }
  .hero-stat::after { content:''; position:absolute; bottom:0; left:0; height:2px; width:0; background:linear-gradient(90deg,var(--accent),var(--accent2)); transition:width .4s ease; }
  .hero-stat:hover { background:var(--surface2); }
  .hero-stat:hover::after { width:100%; }
  .hero-stat-label { font-family:var(--font-head); font-size:10px; letter-spacing:3px; color:var(--muted); text-transform:uppercase; margin-bottom:10px; }
  .hero-stat-value { font-family:var(--font-head); font-size:32px; color:white; animation:countUp .8s cubic-bezier(.22,1,.36,1) both; }
  .hero-stat-sub   { font-size:13px; color:var(--muted); margin-top:6px; font-family:var(--font-body); }

  .main-grid { display:grid; grid-template-columns:300px 1fr 280px; min-height:calc(100vh - 130px); position:relative; z-index:1; }

  .sidebar {
    border-right:1px solid var(--border); padding:28px 24px;
    position:sticky; top:64px; height:calc(100vh - 64px); overflow-y:auto;
    animation:fadeUp .5s .1s ease both; background:var(--surface);
  }
  .sidebar-title { font-family:var(--font-head); font-size:11px; letter-spacing:3px; color:var(--muted); text-transform:uppercase; margin-bottom:24px; padding-bottom:16px; border-bottom:1px solid var(--border); }

  .field { margin-bottom:14px; }
  .field label { display:block; font-size:11px; letter-spacing:2px; color:var(--muted); text-transform:uppercase; font-family:var(--font-head); margin-bottom:6px; }
  .field input { width:100%; padding:10px 14px; background:var(--bg); border:1px solid var(--border); border-radius:6px; color:var(--text); font-family:var(--font-body); font-size:14px; outline:none; transition:border-color .2s, box-shadow .2s, background .2s; }
  .field input:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(79,159,255,.12); background:var(--surface2); }
  .field input::placeholder { color:var(--muted); }
  .field input[type="date"]::-webkit-calendar-picker-indicator { filter:invert(.4); }

  .btn-primary, .btn-ghost {
    position:relative; overflow:hidden; width:100%; padding:12px;
    border:none; border-radius:6px; font-family:var(--font-head); font-size:12px; letter-spacing:2px; text-transform:uppercase; cursor:pointer;
    transition:transform .18s ease, filter .18s ease;
  }
  .btn-primary { background:linear-gradient(135deg,var(--accent),#2d7fff); color:white; margin-bottom:10px; }
  .btn-ghost   { background:transparent; border:1px solid var(--border); color:var(--muted); }
  .btn-primary:hover { transform:translateY(-2px); filter:brightness(1.15); }
  .btn-ghost:hover   { border-color:var(--accent); color:var(--accent); }
  .btn-primary:active, .btn-ghost:active { transform:scale(.97); }
  .ripple-dot { position:absolute; border-radius:50%; width:60px; height:60px; background:rgba(255,255,255,.25); pointer-events:none; animation:ripple .6s linear forwards; }

  .btn-sm {
    position:relative; overflow:hidden; padding:6px 14px; border:none; border-radius:5px;
    font-family:var(--font-head); font-size:10px; letter-spacing:1.5px; text-transform:uppercase;
    cursor:pointer; color:white; transition:transform .15s, filter .15s;
  }
  .btn-sm:hover  { transform:translateY(-1px); filter:brightness(1.2); }
  .btn-sm:active { transform:scale(.95); }

  .center-col { padding:28px; border-right:1px solid var(--border); overflow-y:auto; }
  .col-title {
    font-family:var(--font-head); font-size:11px; letter-spacing:3px; color:var(--muted); text-transform:uppercase;
    margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid var(--border);
    display:flex; align-items:center; justify-content:space-between;
  }
  .col-title-badge { background:var(--surface2); border:1px solid var(--border); border-radius:20px; padding:3px 10px; font-size:11px; color:var(--accent); }

  .goal-card {
    background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:18px 20px; margin-bottom:14px;
    position:relative; overflow:hidden; animation:fadeUp .5s ease both;
    transition:transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s ease, border-color .25s ease;
  }
  .goal-card::before { content:''; position:absolute; inset:0; background:linear-gradient(105deg,transparent 30%,rgba(79,159,255,.05) 50%,transparent 70%); background-size:600px 100%; opacity:0; transition:opacity .3s; }
  .goal-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,0,0,.5), 0 0 0 1px rgba(79,159,255,.2); border-color:rgba(79,159,255,.3); }
  .goal-card:hover::before { opacity:1; animation:shimmer 1.5s linear infinite; }
  .goal-card-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:14px; }
  .goal-name     { font-size:16px; font-weight:600; color:white; font-family:var(--font-body); }
  .goal-pct      { font-family:var(--font-head); font-size:13px; }
  .goal-amounts  { font-size:13px; color:var(--muted); margin-bottom:10px; }
  .goal-amounts span { color:var(--text); }

  .prog-track { height:4px; background:var(--bg); border-radius:2px; overflow:hidden; margin-bottom:14px; }
  .prog-fill  { height:100%; border-radius:2px; animation:progressIn .9s cubic-bezier(.22,1,.36,1) both; position:relative; }
  .prog-fill::after { content:''; position:absolute; right:0; top:-2px; width:8px; height:8px; border-radius:50%; background:white; box-shadow:0 0 6px currentColor; }
  .goal-actions { display:flex; gap:8px; }

  .ring-svg  { transform:rotate(-90deg); }
  .ring-bg   { fill:none; stroke:var(--border); stroke-width:8; }
  .ring-fill { fill:none; stroke-width:8; stroke-linecap:round; stroke-dasharray:440; animation:arcDraw 1.2s cubic-bezier(.22,1,.36,1) both; transition:stroke-dashoffset .6s ease; }
  .ring-text { position:absolute; text-align:center; pointer-events:none; }
  .ring-text-pct   { font-family:var(--font-head); font-size:22px; color:white; display:block; }
  .ring-text-label { font-size:10px; letter-spacing:2px; color:var(--muted); text-transform:uppercase; }

  .right-panel { padding:28px 20px; overflow-y:auto; animation:fadeUp .5s .2s ease both; background:var(--surface); }
  .right-panel .col-title { margin-bottom:20px; }

  .priority-item {
    display:flex; align-items:center; gap:12px; padding:12px 14px; border:1px solid var(--border); border-radius:8px; margin-bottom:10px;
    background:var(--bg); transition:transform .2s ease, border-color .2s, background .2s; animation:fadeUp .4s ease both;
  }
  .priority-item:hover { transform:translateX(4px); border-color:var(--warn); background:rgba(255,159,67,.04); }
  .priority-dot  { width:8px; height:8px; flex-shrink:0; border-radius:50%; background:var(--warn); }
  .priority-name { font-size:14px; color:var(--text); font-weight:500; }
  .priority-date { font-size:11px; color:var(--muted); margin-top:2px; font-family:var(--font-head); }

  /* ── Chart panel: fixed height so Recharts has a defined container ── */
  .chart-panel {
    margin-top:8px; background:var(--bg); border:1px solid var(--border); border-radius:10px;
    padding:12px 8px; transition:box-shadow .3s;
    display:flex; flex-direction:column; align-items:center;
    overflow:hidden;
  }
  .chart-panel:hover { box-shadow:0 0 24px rgba(79,159,255,.08); }
  .chart-wrapper { width:100%; height:200px; }

  .empty { text-align:center; padding:40px 20px; color:var(--muted); font-size:13px; font-family:var(--font-head); letter-spacing:1px; border:1px dashed var(--border); border-radius:10px; }
  .empty-icon { font-size:28px; display:block; margin-bottom:10px; opacity:.4; }

  .due-pill { display:inline-block; padding:2px 10px; border-radius:20px; font-size:11px; font-family:var(--font-head); letter-spacing:1px; border:1px solid; margin-bottom:10px; }
`;
document.head.appendChild(css);

/* ─── Ripple Button ─────────────────────────────────────────────────────────── */
function RippleBtn({ children, className, style: s, onClick }) {
  const ref = useRef(null);
  function click(e) {
    const el = ref.current;
    const r  = el.getBoundingClientRect();
    const sp = document.createElement("span");
    sp.className = "ripple-dot";
    sp.style.left = `${e.clientX - r.left - 30}px`;
    sp.style.top  = `${e.clientY - r.top  - 30}px`;
    el.appendChild(sp);
    sp.addEventListener("animationend", () => sp.remove());
    onClick?.(e);
  }
  return <button ref={ref} className={className} style={s} onClick={click}>{children}</button>;
}

/* ─── Circular Arc ──────────────────────────────────────────────────────────── */
function CircleArc({ pct, color }) {
  const r = 70, cx = 80, cy = 80;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div style={{ position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
      <svg className="ring-svg" width={160} height={160}>
        <circle className="ring-bg"   cx={cx} cy={cy} r={r} />
        <circle className="ring-fill" cx={cx} cy={cy} r={r} stroke={color} strokeDashoffset={offset} style={{ strokeDasharray:circ, strokeDashoffset:offset }} />
      </svg>
      <div className="ring-text" style={{ position:"absolute" }}>
        <span className="ring-text-pct">{pct}%</span>
        <span className="ring-text-label">saved</span>
      </div>
    </div>
  );
}

const COLORS   = ["#4f9fff","#00ffb3","#ff9f43","#ff5e57","#a29bfe","#fd79a8"];
const getColor = (i) => COLORS[i % COLORS.length];
const pctColor = (p) => p >= 100 ? "#00ffb3" : p >= 60 ? "#4f9fff" : p >= 30 ? "#ff9f43" : "#ff5e57";

/* ─── App ───────────────────────────────────────────────────────────────────── */
export default function App() {
  const [form, setForm]           = useState({ name:"", targetAmount:"", savedAmount:"", dueDate:"" });
  const [goals, setGoals]         = useState([]);
  const [reminders, setReminders] = useState([]);

  const fetchGoals     = async () => { const d = await (await fetch("http://localhost:5000/goals")).json();     setGoals(d); };
  const fetchReminders = async () => { const d = await (await fetch("http://localhost:5000/reminders")).json(); setReminders(d); };
  useEffect(() => { fetchGoals(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async () => {
    if (!form.name || !form.targetAmount || !form.savedAmount || !form.dueDate) { alert("Fill all fields"); return; }
    await fetch("http://localhost:5000/addGoal", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
    fetchGoals();
    setForm({ name:"", targetAmount:"", savedAmount:"", dueDate:"" });
  };

  const totalSaved  = goals.reduce((s,g) => s + Number(g.savedAmount),  0);
  const totalTarget = goals.reduce((s,g) => s + Number(g.targetAmount), 0);
  const overallPct  = totalTarget ? +((totalSaved / totalTarget) * 100).toFixed(1) : 0;
  const chartData   = goals.map((g) => ({ name:g.name, value:Number(g.savedAmount) }));

  return (
    <div style={{ background:"var(--bg)", minHeight:"100vh", fontFamily:"var(--font-body)", color:"var(--text)" }}>
      {/* bg-grid only — scan-line removed */}
      <div className="bg-grid" />

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-logo"><div className="dot" />FINTRACK</div>
        <div className="navbar-tag">Goal Dashboard</div>
      </nav>

      {/* HERO STATS */}
      <div className="hero-stats">
        <div className="hero-stat" style={{ animationDelay:".05s" }}>
          <div className="hero-stat-label">Total Saved</div>
          <div className="hero-stat-value">₹{totalSaved.toLocaleString()}</div>
          <div className="hero-stat-sub">of ₹{totalTarget.toLocaleString()} targeted</div>
        </div>
        <div className="hero-stat" style={{ animationDelay:".12s", borderLeft:"1px solid var(--border)", borderRight:"1px solid var(--border)" }}>
          <div className="hero-stat-label">Active Goals</div>
          <div className="hero-stat-value" style={{ color:"var(--accent2)" }}>{goals.length}</div>
          <div className="hero-stat-sub">{goals.filter(g => Number(g.savedAmount) >= Number(g.targetAmount)).length} completed</div>
        </div>
        <div className="hero-stat" style={{ animationDelay:".2s" }}>
          <div className="hero-stat-label">Overall Progress</div>
          <div className="hero-stat-value" style={{ color:pctColor(overallPct) }}>{overallPct}%</div>
          <div className="hero-stat-sub" style={{ marginTop:8 }}>
            <div style={{ height:3, background:"var(--border)", borderRadius:2, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${overallPct}%`, background:"linear-gradient(90deg,var(--accent),var(--accent2))", borderRadius:2, animation:"progressIn 1.2s ease both", animationDelay:".3s" }} />
            </div>
          </div>
        </div>
      </div>

      {/* BENTO GRID */}
      <div className="main-grid">

        {/* LEFT: FORM */}
        <aside className="sidebar">
          <div className="sidebar-title">// New Goal</div>
          {[
            { name:"name",         label:"Goal Name",        placeholder:"e.g. Emergency Fund", type:"text"   },
            { name:"targetAmount", label:"Target (₹)",       placeholder:"100000",              type:"number" },
            { name:"savedAmount",  label:"Already Saved (₹)",placeholder:"25000",               type:"number" },
            { name:"dueDate",      label:"Target Date",      placeholder:"",                    type:"date"   },
          ].map((f) => (
            <div className="field" key={f.name}>
              <label>{f.label}</label>
              <input name={f.name} value={form[f.name]} placeholder={f.placeholder} type={f.type} onChange={handleChange} />
            </div>
          ))}
          <div style={{ height:16 }} />
          <RippleBtn className="btn-primary" onClick={handleSubmit}>+ Add Goal</RippleBtn>
          <RippleBtn className="btn-ghost"   onClick={fetchReminders}>⏰ Show Priority</RippleBtn>

          {goals.length > 0 && (
            <div style={{ marginTop:32, textAlign:"center" }}>
              <CircleArc pct={overallPct} color={pctColor(overallPct)} />
              <div style={{ fontSize:11, letterSpacing:2, color:"var(--muted)", fontFamily:"var(--font-head)", marginTop:6 }}>PORTFOLIO HEALTH</div>
            </div>
          )}
        </aside>

        {/* CENTER: GOALS */}
        <main className="center-col">
          <div className="col-title">
            <span>// All Goals</span>
            <span className="col-title-badge">{goals.length} active</span>
          </div>
          {goals.length === 0 ? (
            <div className="empty"><span className="empty-icon">◈</span>No goals yet. Add your first goal →</div>
          ) : goals.map((g, i) => {
            const pct     = g.targetAmount ? Math.min(+((g.savedAmount / g.targetAmount) * 100).toFixed(1), 100) : 0;
            const color   = pctColor(pct);
            const daysLeft = g.dueDate ? Math.ceil((new Date(g.dueDate) - new Date()) / 86400000) : null;
            return (
              <div className="goal-card" key={g._id} style={{ animationDelay:`${i * 0.07}s` }}>
                <div className="goal-card-top">
                  <div>
                    <div className="goal-name">{g.name}</div>
                    <div className="goal-amounts"><span>₹{Number(g.savedAmount).toLocaleString()}</span>{" / ₹"}{Number(g.targetAmount).toLocaleString()}</div>
                    {daysLeft !== null && (
                      <div className="due-pill" style={{ color:daysLeft < 30 ? "var(--warn)" : "var(--muted)", borderColor:daysLeft < 30 ? "var(--warn)" : "var(--border)" }}>
                        {daysLeft > 0 ? `${daysLeft}d left` : "Overdue"}
                      </div>
                    )}
                  </div>
                  <div className="goal-pct" style={{ color }}>{pct}%</div>
                </div>
                <div className="prog-track">
                  <div className="prog-fill" style={{ width:`${pct}%`, background:`linear-gradient(90deg, ${color}88, ${color})` }} />
                </div>
                <div className="goal-actions">
                  <RippleBtn className="btn-sm" style={{ background:"#1a3a6e" }}
                    onClick={async () => {
                      const amt = prompt("Amount to add (₹):"); if (!amt) return;
                      await fetch(`http://localhost:5000/updateGoal/${g.name}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ amount:Number(amt) }) });
                      fetchGoals();
                    }}>Update</RippleBtn>
                  <RippleBtn className="btn-sm" style={{ background:"#3a1a1a" }}
                    onClick={async () => {
                      await fetch(`http://localhost:5000/deleteGoal/${g._id}`, { method:"DELETE" });
                      fetchGoals();
                    }}>Delete</RippleBtn>
                </div>
              </div>
            );
          })}
        </main>

        {/* RIGHT: PRIORITY + CHART */}
        <aside className="right-panel">
          <div className="col-title">// Priority</div>
          {reminders.length === 0 ? (
            <div className="empty" style={{ padding:"24px 12px" }}><span className="empty-icon" style={{ fontSize:20 }}>⏰</span>Click "Show Priority"</div>
          ) : reminders.map((g, i) => (
            <div className="priority-item" key={i} style={{ animationDelay:`${i * 0.06}s` }}>
              <div className="priority-dot" />
              <div>
                <div className="priority-name">{g.name}</div>
                <div className="priority-date">{new Date(g.dueDate).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}</div>
              </div>
            </div>
          ))}

          <div style={{ height:24 }} />
          <div className="col-title">// Distribution</div>
          <div className="chart-panel">
            {chartData.length === 0 ? (
              <div style={{ color:"var(--muted)", fontSize:12, fontFamily:"var(--font-head)", textAlign:"center", padding:"20px 0", letterSpacing:1 }}>NO DATA</div>
            ) : (
              /* Fixed-height wrapper so ResponsiveContainer has a concrete parent dimension */
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={62}
                      dataKey="value"
                      paddingAngle={3}
                      isAnimationActive
                      animationBegin={0}
                      animationDuration={900}
                    >
                      {chartData.map((_, idx) => <Cell key={idx} fill={getColor(idx)} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:8, color:"white", fontFamily:"var(--font-head)", fontSize:12 }}
                      formatter={(v) => [`₹${Number(v).toLocaleString()}`, ""]}
                    />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      iconSize={7}
                      wrapperStyle={{ paddingTop:"6px", fontSize:"10px", lineHeight:"18px" }}
                      formatter={(v) => <span style={{ color:"var(--muted)", fontSize:10, fontFamily:"var(--font-head)" }}>{v.length > 8 ? v.slice(0,8)+"…" : v}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {goals.length > 0 && (
            <div style={{ marginTop:20 }}>
              {goals.map((g, i) => {
                const pct = g.targetAmount ? Math.min(+((g.savedAmount / g.targetAmount) * 100).toFixed(0), 100) : 0;
                return (
                  <div key={g._id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid var(--border)" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ width:8, height:8, borderRadius:"50%", background:getColor(i), display:"inline-block", flexShrink:0 }} />
                      <span style={{ fontSize:12, color:"var(--text)", maxWidth:130, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{g.name}</span>
                    </div>
                    <span style={{ fontSize:11, fontFamily:"var(--font-head)", color:pctColor(pct) }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}