// src/pages/admin/users.tsx
import { useState, useEffect, ChangeEvent, SyntheticEvent } from "react"
import { useNavigate } from "react-router-dom"
import { client } from "@/gateway"
import {
    QueryCustomUsers,
    CreateCustomUser,
    UpdateCustomUser,
    SaveUserAuthRole
} from "@/dtos"
import Page from "@/components/LayoutPage"
import {
    Loading,
    TextInput,
    Checkbox
} from "@/components/Form"
import { Button } from "@/components/ui/button"

// -----------------------------------------------------------------------------
// Mirror of your CustomUser shape (returned by QueryCustomUsers.results)
// -----------------------------------------------------------------------------
type CustomUser = {
    Id: number
    UserName: string
    Email: string
    DisplayName?: string
    Roles: string[]
    BanStatus: boolean
    CreatedDate: string
}

// -----------------------------------------------------------------------------
// Admin Users Page
// -----------------------------------------------------------------------------
export default function AdminUsersPage() {
    const navigate = useNavigate()

    // --- State ---
    const [users, setUsers]           = useState<CustomUser[] | null>(null)
    const [loading, setLoading]       = useState(true)
    const [error, setError]           = useState<string | null>(null)

    // Search & Filter
    const [searchTerm, setSearchTerm] = useState("")
    const [filterRole, setFilterRole] = useState<"" | "User" | "Manager" | "Employee">("")
    const [filterBan, setFilterBan]   = useState<"All" | "Active" | "Banned">("All")

    // Create‑User modal
    const [showCreate, setShowCreate] = useState(false)
    const [newName, setNewName]       = useState("")
    const [newEmail, setNewEmail]     = useState("")
    const [newDisplay, setNewDisplay] = useState("")
    const [newRole, setNewRole]       = useState<"Manager"|"Employee"|""|null>("")

    // Load users on mount & after modal closes
    useEffect(() => {
        loadUsers()
    }, [showCreate])

    async function loadUsers() {
        setLoading(true)
        try {
            const res = await client.get(new QueryCustomUsers())
            setUsers(res.results)
        } catch (e: any) {
            setError(e.message || "Failed to load users")
        } finally {
            setLoading(false)
        }
    }

    // Derived filtered list
    const displayedUsers = (users || []).filter(u => {
        const term = searchTerm.trim().toLowerCase()
        const matchesSearch =
            !term ||
            u.UserName.toLowerCase().includes(term) ||
            u.Email.toLowerCase().includes(term)

        const matchesRole =
            !filterRole ||
            (filterRole === "User"
                ? u.Roles.length === 0 || (u.Roles.length === 1 && u.Roles[0] === "User")
                : u.Roles.includes(filterRole))

        const matchesBan =
            filterBan === "All" ||
            (filterBan === "Banned" && u.BanStatus) ||
            (filterBan === "Active" && !u.BanStatus)

        return matchesSearch && matchesRole && matchesBan
    })

    // --- Handlers ---
    const openCreate = () => {
        setNewName("")
        setNewEmail("")
        setNewDisplay("")
        setNewRole("")
        setShowCreate(true)
    }

    const handleCreate = async (e: SyntheticEvent) => {
        e.preventDefault()
        try {
            const createRes = await client.post(new CreateCustomUser({
                UserName: newName,
                Email: newEmail,
                DisplayName: newDisplay,
            }))
            if (newRole) {
                await client.post(new SaveUserAuthRole({
                    UserAuthId: createRes.Id,
                    Role: newRole
                }))
            }
            setShowCreate(false)
        } catch (e: any) {
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
        } catch (e: any) {
            alert("Failed to toggle ban: " + e.message)
        }
    }

    const handleEdit = (u: CustomUser) => {
        const isPlainUser =
            u.Roles.length === 0 ||
            (u.Roles.length === 1 && u.Roles[0] === "User")
        if (isPlainUser) {
            alert("❌ You cannot edit a plain-User account.")
            return
        }
        navigate(`/admin/users/${u.Id}/edit`)
    }

    // --- Render ---
    return (
        <Page title="Manage Users" className="px-8 py-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Users</h1>
                <Button onClick={openCreate}>+ New User</Button>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <TextInput
                    placeholder="Search username or email…"
                    value={searchTerm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="flex-1 min-w-[200px]"
                />

                <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value as any)}
                        className="border rounded px-2 py-1"
                    >
                        <option value="">All Roles</option>
                        <option value="User">User</option>
                        <option value="Manager">Manager</option>
                        <option value="Employee">Employee</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                        value={filterBan}
                        onChange={(e) => setFilterBan(e.target.value as any)}
                        className="border rounded px-2 py-1"
                    >
                        <option value="All">All</option>
                        <option value="Active">Active</option>
                        <option value="Banned">Banned</option>
                    </select>
                </div>
            </div>

            {loading && <Loading text="Loading users…" />}
            {error && <p className="text-red-600">{error}</p>}

            {/* Users Table */}
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
                {displayedUsers.map(u => {
                    const isPlainUser =
                        u.Roles.length === 0 ||
                        (u.Roles.length === 1 && u.Roles[0] === "User")
                    return (
                        <tr key={u.Id} className="border-t">
                            <td className="px-4 py-2">{u.UserName}</td>
                            <td className="px-4 py-2">{u.Email}</td>
                            <td className="px-4 py-2">{u.Roles.join(", ") || "User"}</td>
                            <td className="px-4 py-2">{u.BanStatus ? "✔️" : "—"}</td>
                            <td className="px-4 py-2 space-x-2">
                                <Button size="sm" onClick={() => handleBanToggle(u)}>
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

            {/* Create User “Modal” */}
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded shadow-lg w-full max-w-md p-6 space-y-4">
                        <h2 className="text-xl font-semibold">New User</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <TextInput
                                label="Username"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                required
                            />

                            <TextInput
                                label="Email"
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                required
                            />

                            <TextInput
                                label="Display Name"
                                value={newDisplay}
                                onChange={(e) => setNewDisplay(e.target.value)}
                            />

                            <div>
                                <label className="block text-sm font-medium mb-1">Role</label>
                                <select
                                    value={newRole || ""}
                                    onChange={(e) => {
                                        const v = e.target.value as ""|"Manager"|"Employee"
                                        setNewRole(v === "" ? null : v)
                                    }}
                                    className="border rounded px-2 py-1 w-full"
                                >
                                    <option value="">(User)</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Employee">Employee</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button variant="secondary" onClick={() => setShowCreate(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Create</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Page>
    )
}
