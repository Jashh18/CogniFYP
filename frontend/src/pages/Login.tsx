import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import "../styling/login.css"

export default function Login() {
  const [activeTab, setActiveTab] = useState<"student" | "admin">("student")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
  if (!email || !password) {
    alert("Please fill in all fields")
    return
  }

  // 1️⃣ Sign in
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    alert(error.message)
    return
  }

  if (!data.user) {
    alert("Login failed")
    return
  }

  // 2️⃣ Get role from profiles table
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single()

  if (profileError) {
    alert("Could not fetch user role")
    return
  }

  const userRole = profile?.role

  // 3️⃣ Check if selected tab matches actual role
  if (userRole !== activeTab) {
    alert("You are not authorized to login as this role.")
    await supabase.auth.signOut()
    return
  }

  alert("Login successful!")

  // 4️⃣ Redirect based on role
  if (userRole === "student") {
    navigate("/student")
  } else if (userRole === "admin") {
    navigate("/admin")
  }
}


  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="logo">Cogni</h1>

        <div className="tabs">
          <button
            className={activeTab === "student" ? "active" : ""}
            onClick={() => setActiveTab("student")}
          >
            Student
          </button>
          <button
            className={activeTab === "admin" ? "active" : ""}
            onClick={() => setActiveTab("admin")}
          >
            Admin
          </button>
        </div>

        <div className="form">
          <input
            type="email"
            placeholder={activeTab === "admin" ? "Admin ID" : "Email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="login-btn" onClick={handleLogin}>
            Login
          </button>

          {activeTab === "student" && (
            <p className="signup-link">
              Don’t have an account?{" "}
              <span onClick={() => navigate("/signup")}>Sign up</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}