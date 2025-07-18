// src/components/NavHeader.tsx
import { Link, NavLink, useLocation } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt }   from "react-icons/fa";
import { MusicIcon, Film, Gamepad }    from "lucide-react";
import { useAuth }                      from "@/useAuth";
import { CartCountBadge }               from "@/components/ui/CartCountBadge";
import {JSX, useState} from "react";

export default function NavHeader() {
    const { auth, signout } = useAuth();
    const location          = useLocation();
    const [openDropdown, setOpenDropdown] = useState(false);

    // Determine which section we're in
    const category = location.pathname.startsWith("/game")
        ? "game"
        : location.pathname.startsWith("/movie")
            ? "movie"
            : "music";

    // Map each category to its icon
    const iconMap: Record<string, JSX.Element> = {
        music: <MusicIcon className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500" />,
        movie: <Film      className="w-8 h-8 sm:w-12 sm:h-12 text-red-500"  />,
        game:  <Gamepad   className="w-8 h-8 sm:w-12 sm:h-12 text-green-500"/>,
    };

    // Shared nav link styling
    const navClass = ({ isActive }: any) =>
        [
            "p-4 flex items-center hover:text-sky-500 dark:hover:text-sky-400",
            isActive ? "text-link-dark dark:text-link-dark" : "",
        ].join(" ");

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <div className="flex items-center justify-between px-3">
                {/* Logo / Home Link */}
                <Link to={`/${category}`} className="flex items-center py-2">
                    {iconMap[category]}
                    <span className="hidden sm:inline ml-2 text-2xl font-semibold">
            OnlineShopDVDs
          </span>
                </Link>

                {/* Navigation */}
                <nav className="flex-1">
                    <ul className="flex items-center justify-center space-x-2">
                        <li>
                            <NavLink to={`/${category}`} className={navClass}>
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/news" className={navClass}>
                                News
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/forum" className={navClass}>
                                Forum
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={`/${category}/store`} className={navClass}>
                                Store
                            </NavLink>
                        </li>
                        <li className="relative">
                            <button
                                onClick={() => setOpenDropdown(!openDropdown)}
                                className="p-4 hover:text-sky-500 dark:hover:text-sky-400"
                            >
                                Explore Shops ▾
                            </button>
                            {openDropdown && (
                                <ul className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-900 shadow-md rounded z-50 w-44">
                                    {["music", "movie", "game"]
                                        .filter(c => c !== category)
                                        .map(c => (
                                            <li key={c}>
                                                <Link
                                                    to={`/${c}`}
                                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                    onClick={() => setOpenDropdown(false)}
                                                >
                                                    {c.charAt(0).toUpperCase() + c.slice(1)} Shop
                                                </Link>
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </li>
                    </ul>
                </nav>

                {/* Auth & Cart */}
                <div className="flex items-center space-x-4">
                    {auth ? (
                        <>
                            <Link to="/profile" className="flex items-center gap-2">
                                <img
                                    src={auth.profileUrl}
                                    alt=""
                                    className="h-8 w-8 rounded-full"
                                />
                                <span className="hidden sm:block text-sm font-medium">
                  {auth.displayName}
                </span>
                            </Link>

                            <CartCountBadge />

                            <button
                                onClick={() => signout("/signin")}
                                title="Sign Out"
                                className="hover:text-red-500 transition"
                            >
                                <FaSignOutAlt size={20} />
                            </button>
                        </>
                    ) : (
                        <Link to="/signin" title="Sign In" className="hover:text-green-600">
                            <FaSignInAlt size={20} />
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
