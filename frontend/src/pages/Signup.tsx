import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"
import "../styling/signup.css"

export default function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const navigate = useNavigate()

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: "student",
          },
        },
      })

      if (error) {
        alert(error.message)
        return
      }

      alert("Signup successful! Please login.")
      navigate("/") // back to login
    } catch (err) {
      console.error(err)
      alert("Unexpected error occurred")
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Create Student Account</h1>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button onClick={handleSignup}>Sign Up</button>
      </div>
    </div>
  )
}