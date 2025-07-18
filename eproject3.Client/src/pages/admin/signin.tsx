// src/pages/admin/users.tsx
import { useState, useEffect, ChangeEvent, SyntheticEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useClient } from "@/gateway"
import {
    QueryCustomUsers,
    CreateCustomUser,
    UpdateCustomUser,
    SaveUserAuthRole
} from "@/dtos"
import Page from "@/components/LayoutPage"
import { Loading } from "@/components/Form"
import { Button } from "@/components/ui/button"
import { TextInput } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Modal } from "@/components/ui/modal"


// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------
export default function AdminUsersPage() {
    const client = useClient()
    const navigate = useNavigate()

    // State
    const [users, setUsers]           = useState<CustomUser[]|null>(null)
    const [loading, setLoading]       = useState(true)
    const [error, setError]           = useState<string|null>(null)

    // Create‑User modal
    const [showCreate, setShowCreate] = useState(false)
    const [newName, setNewName]       = useState("")
    const [newEmail, setNewEmail]     = useState("")
    const [newDisplay, setNewDisplay] = useState("")
    const [newRole, setNewRole]       = useState<"Manager"|"Employee"|"" | null>("")

    // Fetch on mount & when showCreate closes
    useEffect(() => {
        loadUsers()
    }, [showCreate])

    async function loadUsers() {
        setLoading(true)
        try {
            const res = await client.get(new QueryCustomUsers())
            // QueryCustomUsers should return { results: CustomUser[] }
            setUsers(res.results)
        } catch (e:any) {
            setError(e.message || "Failed to load users")
        } finally {
            setLoading(false)
        }
    }

    // ---------------------------------------------------------------------------
    // Handlers
    // ---------------------------------------------------------------------------
    const openCreate = () => {
        setNewName(""); setNewEmail(""); setNewDisplay(""); setNewRole("")
        setShowCreate(true)
    }

    const handleCreate = async (e: SyntheticEvent) => {
        e.preventDefault()
        try {
            // 1) create the CustomUser
            const createRes = await client.post(new CreateCustomUser({
                UserName: newName,
                Email: newEmail,
                DisplayName: newDisplay
            }))
            const id = createRes.Id
            // 2) assign them a role if chosen
            if (newRole) {
                await client.post(new SaveUserAuthRole({
                    UserAuthId: id,
                    Role: newRole
                }))
            }
            setShowCreate(false)
        } catch (e:any) {
            alert("Error creating user: " + e.message)
        }
    }

    const handleBanToggle = async (u: CustomUser) => {
        try {
            await client.put(new UpdateCustomUser({
                Id: u.Id,
                BanStatus: !u.BanStatus
            }))
            loadUsers()
        } catch (e:any) {
            alert("Failed to toggle ban: " + e.message)
        }
    }

    const handleEdit = (u: CustomUser) => {
        // if user only has role "User" (or no roles), don't allow
        if (u.Roles.length === 0 || (u.Roles.length === 1 && u.Roles[0] === "User")) {
            alert("❌ You cannot edit a plain-User account.")
            return
        }
        navigate(`/admin/users/${u.Id}/edit`)
    }

    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------
    return (
        <Page title="Manage Users" className="px-8 py-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Users</h1>
                <Button onClick={openCreate}>+ New User</Button>
            </div>

            {loading && <Loading text="Loading users…" />}
            {error && <p className="text-red-600">{error}</p>}

            {users && (
                <table className="w-full table-auto border">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2">Username</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Roles</th>
                        <th className="px-4 py-2">Banned?</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(u => {
                        const isPlainUser =
                            u.Roles.length === 0 || (u.Roles.length === 1 && u.Roles[0] === "User")
                        return (
                            <tr key={u.Id} className="border-t">
                                <td className="px-4 py-2">{u.UserName}</td>
                                <td className="px-4 py-2">{u.Email}</td>
                                <td className="px-4 py-2">{u.Roles.join(", ") || "User"}</td>
                                <td className="px-4 py-2">{u.BanStatus ? "✔️" : "—"}</td>
                                <td className="px-4 py-2 space-x-2">
                                    <Button
                                        size="sm"
                                        onClick={() => handleBanToggle(u)}
                                    >
                                        {u.BanStatus ? "Unban" : "Ban"}
                                    </Button>

                                    <Button
                                        size="sm"
                                        onClick={() => handleEdit(u)}
                                        disabled={isPlainUser}
                                    >
                                        Edit
                                    </Button>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            )}

            {/* -------------------------------------------------------------------------
         Create User Modal
      ------------------------------------------------------------------------- */}
            <Modal isOpen={showCreate} onClose={() => setShowCreate(false)}>
                <form
                    onSubmit={handleCreate}
                    className="space-y-4 p-6 bg-white rounded"
                >
                    <h2 className="text-xl font-semibold">New User</h2>

                    <TextInput
                        label="Username"
                        value={newName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
                        required
                    />

                    <TextInput
                        label="Email"
                        type="email"
                        value={newEmail}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewEmail(e.target.value)}
                        required
                    />

                    <TextInput
                        label="Display Name"
                        value={newDisplay}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewDisplay(e.target.value)}
                    />

                    <Select
                        label="Role"
                        value={newRole || ""}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                            const v = e.target.value as ""|"Manager"|"Employee"
                            setNewRole(v === "" ? null : v)
                        }}
                    >
                        <option value="">(User)</option>
                        <option value="Manager">Manager</option>
                        <option value="Employee">Employee</option>
                    </Select>

                    <div className="flex justify-end space-x-2">
                        <Button variant="secondary" onClick={() => setShowCreate(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Create</Button>
                    </div>
                </form>
            </Modal>
        </Page>
    )
}
