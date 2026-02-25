import { useState } from "react"
import { supabase } from "../../lib/supabase"
import { useNavigate } from "react-router-dom"
import "../../styling/profile.css"

interface Props {
    user: any
    onClose: () => void
}

export default function ProfileModal({ user, onClose }: Props) {
    const [editing, setEditing] = useState(false)
    const [name, setName] = useState(user.profile?.name || "")
    const navigate = useNavigate()

    const initials = name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()

    const saveChanges = async () => {
        const { error } = await supabase
            .from("profiles")
            .update({ name })
            .eq("id", user.id)

        if (!error) {
            setEditing(false)
            onClose()
        }
    }

    const logout = async () => {
        await supabase.auth.signOut()
        navigate("/")
    }

    return (
        <div className="modal-overlay">
            <div className="profile-modal">

                <h2>Profile</h2>

                <div className="avatar">
                    {initials}
                </div>

                <div className="profile-field">
                    <label>Name</label>
                    {editing ? (
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    ) : (
                        <p>{name}</p>
                    )}
                </div>

                <div className="profile-field">
                    <label>Email</label>
                    <p>{user.email}</p>
                </div>

                <div className="profile-buttons">
                    {editing ? (
                        <>
                            <button onClick={saveChanges}>Save</button>
                            <button onClick={() => setEditing(false)}>Cancel</button>
                        </>
                    ) : (
                        <button onClick={() => setEditing(true)}>
                            Edit Name
                        </button>
                    )}
                </div>

                <button className="logout-btn" onClick={logout}>
                    Logout
                </button>

                <button className="close-btn" onClick={onClose}>
                    ✕
                </button>
            </div>
        </div>
    )
}