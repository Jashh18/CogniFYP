import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

type AuthContextType = {
  user: any
  role: string | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // 1️⃣ Get session ONCE on app load
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user ?? null)
      setLoading(false)
    }

    init()
  }, [])

  // 2️⃣ Listen ONLY for auth state changes (NO DB CALLS)
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // 3️⃣ Fetch profile ONLY when user changes
  useEffect(() => {
    if (!user) {
      setRole(null)
      return
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (!error) {
        setRole(data.role)
      }
    }

    fetchProfile()
  }, [user])

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)