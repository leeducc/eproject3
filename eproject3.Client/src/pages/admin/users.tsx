// src/pages/admin/users.tsx
import  {
    useState,
    useEffect,
    ChangeEvent,
    SyntheticEvent,
    useMemo,
} from "react"
import { useNavigate } from "react-router-dom"
import { client } from "@/gateway"
import {
    QueryCustomUsers,
    CreateCustomUser,
    UpdateCustomUser,
    SaveUserAuthRole,
} from "@/dtos"
import Page from "@/components/LayoutPage"
import { Loading, TextInput } from "@/components/Form"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/DataTable"
import type { ColumnDef, RowModel, Table} from "@tanstack/react-table"

//
// Local interface for the shape of each user row:
//
interface CustomUser {
    id: number
    userName: string
    email: string
    displayName?: string
    roles: string[]
    banStatus: boolean
    createdDate: string
}

export default function AdminUsersPage() {
    const navigate = useNavigate()

    // ─── State ────────────────────────────────────────────────────────────
    const [users, setUsers] = useState<CustomUser[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [searchTerm, setSearchTerm] = useState("")
    const [filterRole, setFilterRole] = useState<"" | "User" | "Manager" | "Employee">("")
    const [filterBan, setFilterBan] = useState<"All" | "Active" | "Banned">("All")

    const [showCreate, setShowCreate] = useState(false)
    const [newName, setNewName] = useState("")
    const [newEmail, setNewEmail] = useState("")
    const [newDisplay, setNewDisplay] = useState("")
    const [newRole, setNewRole] = useState<"Manager" | "Employee" | "" | null>("")

    // ─── Load users ────────────────────────────────────────────────────────
    useEffect(() => {
        loadUsers()
    }, [showCreate])

    async function loadUsers() {
        setLoading(true)
        try {
            const {results} = await client.get(new QueryCustomUsers())
            setUsers(results)
            setError(null)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    // ─── Actions ──────────────────────────────────────────────────────────
    async function handleBanToggle(u: CustomUser) {
        await client.put(new UpdateCustomUser({id: u.id, banStatus: !u.banStatus}))
        loadUsers()
    }

    function handleEdit(u: CustomUser) {
        const isPlain =
            u.roles.length === 0 ||
            (u.roles.length === 1 && u.roles[0] === "User")
        if (isPlain) {
            alert("❌ You cannot edit a plain‑User account.")
            return
        }
        navigate(`/admin/users/${u.id}/edit`)
    }

    async function handleCreate(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            const {id} = await client.post(
                new CreateCustomUser({
                    userName: newName,
                    email: newEmail,
                    displayName: newDisplay,
                })
            )
            if (newRole) {
                await client.post(
                    new SaveUserAuthRole({userAuthId: id, role: newRole})
                )
            }
            setShowCreate(false)
        } catch (e: any) {
            alert("Failed to create user: " + e.message)
        }
    }

    // ─── Filtered data for the table ───────────────────────────────────────
    const data = users.filter(u => {
        const t = searchTerm.toLowerCase()
        if (t && !u.userName.toLowerCase().includes(t) && !u.email.toLowerCase().includes(t))
            return false

        if (filterRole) {
            const isUserOnly = u.roles.length === 0 || (u.roles.length === 1 && u.roles[0] === "User")
            if (filterRole === "User" ? !isUserOnly : !u.roles.includes(filterRole))
                return false
        }

        if (filterBan === "Active" && u.banStatus) return false
        if (filterBan === "Banned" && !u.banStatus) return false

        return true
    })

    // ─── Columns for DataTable ─────────────────────────────────────────────
    const columns = useMemo<ColumnDef<CustomUser, any>[]>(() => [
        {accessorKey: "userName", header: "Username"},
        {accessorKey: "email", header: "Email"},
        {
            id: "roles",
            header: "Roles",
            cell: ({row}) => row.original.roles.join(", ") || "User",
        },
        {
            id: "ban",
            header: "Banned?",
            cell: ({row}) => (row.original.banStatus ? "✔️" : "—"),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({row}) => (
                <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleBanToggle(row.original)}>
                        {row.original.banStatus ? "Unban" : "Ban"}
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => handleEdit(row.original)}
                        disabled={
                            row.original.roles.length === 0 ||
                            (row.original.roles.length === 1 && row.original.roles[0] === "User")
                        }
                    >
                        Edit
                    </Button>
                </div>
            ),
        },
    ], [])

    // ─── Render ─────────────────────────────────────────────────────────────
    return (
        <Page title="Manage Users" className="px-8 py-6">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Users</h1>
                <Button onClick={() => setShowCreate(true)}>+ New User</Button>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <TextInput
                    placeholder="Search username or email…"
                    value={searchTerm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="flex-1 min-w-[200px]"
                />

                <select
                    value={filterRole}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterRole(e.target.value as any)}
                    className="border rounded px-2 py-1"
                >
                    <option value="">All Roles</option>
                    <option value="User">User</option>
                    <option value="Manager">Manager</option>
                    <option value="Employee">Employee</option>
                </select>

                <select
                    value={filterBan}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterBan(e.target.value as any)}
                    className="border rounded px-2 py-1"
                >
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Banned">Banned</option>
                </select>
            </div>

            {/* DataTable or Loading/Error */}
            {loading ? (
                <Loading text="Loading users…"/>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : (
                <DataTable data={data} columns={columns} stripedRows
                           getCoreRowModel={function (table: Table<any>): () => RowModel<any> {
                               throw new Error("Function not implemented.")
                           }} />
            )}

            {/* Create User Modal */}
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">New User</h2>
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
                            <select
                                value={newRole || ""}
                                onChange={(e) => {
                                    const v = e.target.value as "" | "Manager" | "Employee"
                                    setNewRole(v || null)
                                }}
                                className="border rounded px-2 py-1 w-full"
                            >
                                <option value="">(User)</option>
                                <option value="Manager">Manager</option>
                                <option value="Employee">Employee</option>
                            </select>
                            <div className="flex justify-end gap-2">
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
