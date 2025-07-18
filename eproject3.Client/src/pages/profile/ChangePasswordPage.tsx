// src/pages/profile/ChangePasswordPage.tsx
import { useState } from "react";
import { ChangePassword } from "@/dtos";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useAuth } from "@/useAuth";
import { useNavigate } from "react-router-dom";
import { useClient } from "@/gateway";

export default function ChangePasswordPage() {
    const client = useClient();
    const { signout } = useAuth();
    const navigate = useNavigate();
    const [f, setF] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handle = (e: React.ChangeEvent<HTMLInputElement>) =>
        setF(p => ({ ...p, [e.target.name]: e.target.value }));

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (f.newPassword !== f.confirmPassword) {
            toast.error("Passwords must match");
            return;
        }
        try {
            const res = await client.api(
                new ChangePassword({ oldPassword: f.oldPassword, newPassword: f.newPassword })
            );
            if (res.succeeded) {
                toast.success("Changed – redirecting to sign‑in…");
                setTimeout(() => {
                    signout();
                    navigate("/signin");
                }, 1000);
            } else {
                toast.error(res.error?.message || "Change failed");
            }
        } catch {
            toast.error("Change failed");
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <form onSubmit={submit} className="space-y-4">
                <input
                    name="oldPassword"
                    type="password"
                    placeholder="Current Password"
                    value={f.oldPassword}
                    onChange={handle}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    name="newPassword"
                    type="password"
                    placeholder="New Password"
                    value={f.newPassword}
                    onChange={handle}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm New"
                    value={f.confirmPassword}
                    onChange={handle}
                    className="w-full border p-2 rounded"
                    required
                />
                <div className="text-right">
                    <Button type="submit" className="px-6 py-2">
                        Change Password
                    </Button>
                </div>
            </form>
        </div>
    );
}
