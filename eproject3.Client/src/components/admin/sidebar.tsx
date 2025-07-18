// src/components/admin/Sidebar.tsx
import { Link, useLocation } from "react-router-dom"

const navItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Users",     href: "/admin/users" },
    { label: "Products",  href: "/admin/products" },
    { label: "Orders",    href: "/admin/orders" },
]

export default function Sidebar() {
    const { pathname } = useLocation()

    return (
        <aside className="w-64 min-h-screen bg-gray-800 text-gray-100 flex flex-col p-6">
            <h2 className="text-2xl font-bold mb-8">Admin</h2>

            <nav className="flex-1 space-y-2">
                {navItems.map(({ label, href }) => {
                    const active = pathname === href
                    return (
                        <Link
                            key={href}
                            to={href}
                            className={
                                `block px-4 py-2 rounded-md transition-colors ` +
                                (active
                                    ? "bg-gray-700 text-white"
                                    : "hover:bg-gray-700 hover:text-white")
                            }
                        >
                            {label}
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto">
                <button
                    onClick={() => {/* your sign‑out logic here */}}
                    className="w-full text-left px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
