import { useEffect, useState } from "react"
import { useClient } from "@/gateway"
import { GetProfile, UpdateProfile, ChangePassword } from "@/dtos"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify";
import { useAuth } from "@/useAuth";

export default function InfoPage() {
    const client = useClient()
    const [form, setForm] = useState({
        displayName: "",
        address: "",
        gender: "",
        birthDate: "",
    })

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadProfile = async () => {
            const res = await client.api(new GetProfile())
            if (res.response) {
                setForm({
                    displayName: res.response.displayName ?? "",
                    address: res.response.address ?? "",
                    gender: res.response.gender ?? "",
                    birthDate: res.response.birthDate?.substring(0, 10) ?? "",
                })
            }
            setLoading(false)
        }

        loadProfile()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const api = await client.api(new UpdateProfile(form))
        if (api.succeeded) toast.success("Profile updated!")
        else toast.error(api.error?.message || "Update failed")
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Display Name</label>
                    <input
                        name="displayName"
                        value={form.displayName}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Address</label>
                    <input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Gender</label>
                    <select name="gender" value={form.gender} onChange={handleChange} className="w-full border p-2 rounded">
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium">Birth Date</label>
                    <input
                        name="birthDate"
                        type="date"
                        value={form.birthDate}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <Button type="submit">Update Profile</Button>
            </form>

            <hr className="my-6" />

            {/* ⛔ moved outside the parent form */}
            <PasswordChangeForm />
        </div>
    )
}


function PasswordChangeForm() {
    const client = useClient()
    const { signout } = useAuth()
    const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (form.newPassword !== form.confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        const api = await client.api(new ChangePassword({
            oldPassword: form.oldPassword,
            newPassword: form.newPassword
        }))

        if (api.succeeded) {
            toast.success("Password changed successfully. Please sign in again.")
            setForm({ oldPassword: "", newPassword: "", confirmPassword: "" })

            // Sign user out after short delay to show success message
            setTimeout(() => {
                signout() // will redirect to sign-in page if your auth flow is setup that way
            }, 1500)
        } else {
            toast.error(api.error?.message || "Failed to change password")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold">Change Password</h2>

            <input
                name="oldPassword"
                type="password"
                placeholder="Current Password"
                value={form.oldPassword}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />
            <input
                name="newPassword"
                type="password"
                placeholder="New Password"
                value={form.newPassword}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />
            <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm New Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />
            <Button type="submit">Change Password</Button>
        </form>
    )
}

