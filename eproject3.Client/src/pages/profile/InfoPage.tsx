// src/pages/profile/InfoPage.tsx
import { useEffect, useState, useRef } from "react";
import { useClient } from "@/gateway";
import {
    GetProfile,
    UpdateProfile,
    UploadProfileImage,
    UserProfileResponse
} from "@/dtos";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useAuth } from "@/useAuth";
import { useNavigate } from "react-router-dom";

// Parse .NET dates or ISO
function formatDate(input?: string): string | undefined {
    if (!input) return undefined;
    const m = /\/Date\((\d+)\)\//.exec(input);
    const d = m ? new Date(+m[1]) : new Date(input);
    return isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

// Only these fields get client‐side validation:
type ValidField =
    | "displayName"
    | "email"
    | "phoneNumber"
    | "address"
    | "gender"
    | "birthDate";

const validateField: Record<ValidField, (v?: string) => string | undefined> = {
    displayName: (_v) => undefined,

    email: (v) =>
        !v
            ? undefined
            : !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)
                ? "Invalid email address"
                : undefined,

    phoneNumber: (v) =>
        !v
            ? undefined
            : !/^\d{10,13}$/.test(v)
                ? "Phone must be 10–13 digits"
                : undefined,

    address: (_v) => undefined,

    gender: (v) =>
        !v
            ? undefined
            : !["Male", "Female", "Other"].includes(v)
                ? "Must be Male, Female, or Other"
                : undefined,

    birthDate: (v) => {
        if (!v) return undefined;
        const d = new Date(v);
        if (isNaN(d.getTime())) return "Invalid date";
        const cutoff = new Date();
        cutoff.setFullYear(cutoff.getFullYear() - 15);
        return d > cutoff ? "You must be at least 15" : undefined;
    },
};

export default function InfoPage() {
    const client = useClient();
    const { auth } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Redirect if not logged in
    useEffect(() => {
        if (!auth?.userId) navigate("/signin");
    }, [auth, navigate]);

    // The full form, including the avatar URL
    const [form, setForm] = useState<{
        displayName?: string;
        email?: string;
        phoneNumber?: string;
        address?: string;
        gender?: string;
        birthDate?: string;
        profileImageUrl?: string;
    }>({});

    // Per‐field errors
    const [errors, setErrors] = useState<Partial<Record<ValidField, string>>>({});

    const [loading, setLoading] = useState(true);

    // Load once
    useEffect(() => {
        (async () => {
            try {
                const res = await client.api(new GetProfile());
                const u = res.response as UserProfileResponse;
                setForm({
                    displayName:     u.displayName,
                    email:           u.email,
                    phoneNumber:     u.phoneNumber,
                    address:         u.address,
                    gender:          u.gender,
                    birthDate:       formatDate(u.birthDate as any),
                    profileImageUrl: u.profileImageUrl,
                });
            } catch {
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Single‐field change + validation
    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const name = e.target.name as ValidField;
        const value = e.target.value;
        setForm(f => ({ ...f, [name]: value }));
        setErrors(errs => ({
            ...errs,
            [name]: validateField[name](value),
        }));
    }

    // Upload avatar
    async function handleFileChange() {
        const files = fileInputRef.current?.files;
        if (!files?.length) return;
        const fd = new FormData();
        fd.append("file", files[0]);
        toast.info("Uploading…");
        try {
            const res = await client.api(new UploadProfileImage(), fd);
            const u = res.response as UserProfileResponse;
            setForm(f => ({ ...f, profileImageUrl: u.profileImageUrl }));
            toast.success("Uploaded!");
        } catch {
            toast.error("Upload failed");
        }
    }

    // Validate & submit
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Validate all
        const newErrs: typeof errors = {};
        (Object.keys(validateField) as ValidField[]).forEach(key => {
            const err = validateField[key](form[key]);
            if (err) newErrs[key] = err;
        });

        // At least one field non‐empty
        const hasAny = (Object.keys(form) as Array<keyof typeof form>)
            .some(k => k !== "profileImageUrl" && !!form[k]);
        if (!hasAny) {
            newErrs.displayName = "Update at least one field";
        }

        setErrors(newErrs);
        if (Object.keys(newErrs).length) {
            toast.error("Please fix validation errors");
            return;
        }

        // Build DTO
        const dto: Partial<UpdateProfile> = {};
        (Object.keys(form) as Array<keyof typeof form>).forEach(k => {
            if (k === "profileImageUrl") return;
            const v = form[k];
            if (v) (dto as any)[k] = v;
        });

        try {
            const res = await client.api(new UpdateProfile(dto as UpdateProfile));
            const u = res.response as UserProfileResponse;
            setForm(f => ({ ...f, profileImageUrl: u.profileImageUrl }));
            toast.success("Profile saved");
        } catch {
            toast.error("Save failed");
        }
    }

    if (loading) return <div className="py-10 text-center">Loading…</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-6">My Profile</h1>

                {/* Avatar */}
                <div className="flex items-center mb-8">
                    {form.profileImageUrl ? (
                        <img
                            src={form.profileImageUrl}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full object-cover border"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 border" />
                    )}
                    <label className="ml-4 px-3 py-1 bg-gray-200 rounded cursor-pointer hover:bg-gray-300">
                        Change
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </label>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                    {(
                        [
                            ["displayName", "Display Name"],
                            ["email",       "Email"],
                            ["phoneNumber","Phone Number"],
                            ["address",    "Address"],
                        ] as [ValidField, string][]
                    ).map(([key, label]) => (
                        <div key={key}>
                            <label className="block mb-1 font-medium">{label}</label>
                            <input
                                name={key}
                                value={(form as any)[key] || ""}
                                onChange={handleChange}
                                className={`w-full border rounded px-2 py-1 ${
                                    errors[key] ? "border-red-500" : ""
                                }`}
                            />
                            {errors[key] && (
                                <div className="text-red-600 text-sm mt-1">
                                    {errors[key]}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Gender */}
                    <div>
                        <label className="block mb-1 font-medium">Gender</label>
                        <select
                            name="gender"
                            value={form.gender || ""}
                            onChange={handleChange}
                            className={`w-full border rounded px-2 py-1 ${
                                errors.gender ? "border-red-500" : ""
                            }`}
                        >
                            <option value="">Select…</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                        {errors.gender && (
                            <div className="text-red-600 text-sm mt-1">{errors.gender}</div>
                        )}
                    </div>

                    {/* Birth Date */}
                    <div>
                        <label className="block mb-1 font-medium">Birth Date</label>
                        <input
                            name="birthDate"
                            type="date"
                            value={form.birthDate || ""}
                            onChange={handleChange}
                            className={`w-full border rounded px-2 py-1 ${
                                errors.birthDate ? "border-red-500" : ""
                            }`}
                        />
                        {errors.birthDate && (
                            <div className="text-red-600 text-sm mt-1">
                                {errors.birthDate}
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="md:col-span-2 text-right">
                        <Button type="submit" className="px-6 py-2">
                            Save Profile
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
