import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import type { ReactNode } from "react"

interface Props {
  children: ReactNode
  allowedRole: string
}

interface Props {
  children: ReactNode
  allowedRole: string
}

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const { user, role, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  if (!user) return <Navigate to="/" />

  if (role && role !== allowedRole) return <Navigate to="/" />

  return children
}