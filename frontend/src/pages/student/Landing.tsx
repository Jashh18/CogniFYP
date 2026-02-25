import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import ProfileModal from "../student/Profile"
import "../../styling/landing.css"

interface Chat {
  id: string
  title: string
  created_at: string
}

export default function StudentLayout() {
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chats, setChats] = useState<Chat[]>([])
  const [showProfile, setShowProfile] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchUser()
    fetchChats()
  }, [])

  const fetchUser = async () => {
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) return

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single()

    setUser({
      ...authData.user,
      profile: profileData
    })
  }

  const fetchChats = async () => {
    const { data } = await supabase
      .from("chats")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) setChats(data)
  }

  const createNewChat = async () => {
    if (!user) return

    const { data } = await supabase
      .from("chats")
      .insert([{ user_id: user.id, title: "New Chat" }])
      .select()

    if (data) setChats([data[0], ...chats])
  }

  return (
    <div className="student-container">

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>

        <div className="sidebar-header">
          {sidebarOpen && (
            <div
              className="profile-icon"
              onClick={() => setShowProfile(true)}
            >
              👤
            </div>
          )}

          <button
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
        </div>

        {sidebarOpen && (
          <>
            <button className="new-chat-btn" onClick={createNewChat}>
              + New Chat
            </button>

            <div className="chat-history">
              {chats.map((chat) => (
                <div key={chat.id} className="chat-item">
                  {chat.title}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Main */}
      <div className="main-content">
        <h1>
          Hola, {user?.profile?.name || "Student"}
        </h1>

        <Outlet />

        <button className="floating-btn">+</button>
      </div>

      {/* Profile Popup */}
      {showProfile && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  )
}