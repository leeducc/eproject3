import { Link, NavLink, useLocation } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import Logo from "@/assets/img/logo.svg?react";
import { useAuth } from "@/useAuth";
// import { CartCountBadge } from "@/components/ui/CartCountBadge.tsx";
import { useState } from "react";

export default () => {
    const { auth, signout } = useAuth();
    const location = useLocation();
    const [openDropdown, setOpenDropdown] = useState(false);

    const navClass = ({ isActive }: any) =>
        [
            "p-4 flex items-center justify-start mw-full hover:text-sky-500 dark:hover:text-sky-400",
            isActive ? "text-link-dark dark:text-link-dark" : "",
        ].join(" ");

    const category = location.pathname.startsWith("/game")
        ? "game"
        : location.pathname.startsWith("/movie")
            ? "movie"
            : "music";

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 pr-3 bg-white dark:bg-black">
            <div className="flex flex-wrap items-center">
                <div className="absolute z-10 top-2 left-2 sm:static flex-shrink flex-grow-0">
                    <div className="cursor-pointer">
                        <Link to="/music" className="navbar-brand flex items-center">
                            <Logo className="w-8 h-8 sm:ml-2 sm:w-12 sm:h-12" title="eproject3 logo" />
                            <span className="hidden ml-2 sm:block text-2xl font-semibold">OnlineShopDVDs</span>
                        </Link>
                    </div>
                </div>

                <div className="flex flex-grow flex-shrink flex-nowrap justify-end items-center">
                    <nav className="relative flex flex-grow leading-6 font-semibold text-slate-700 dark:text-slate-200">
                        <ul className="flex flex-wrap items-center justify-end w-full m-0">
                            <li><NavLink to={`/${category}`} className={navClass}>Home</NavLink></li>
                            <li><NavLink to="/news" className={navClass}>News</NavLink></li>
                            <li><NavLink to="/forum" className={navClass}>Forum</NavLink></li>
                            <li><NavLink to={`/${category}/store`} className={navClass}>Store</NavLink></li>

                            {/* DROPDOWN for "Explore our other shops" */}
                            <li className="relative">
                                <button
                                    onClick={() => setOpenDropdown(!openDropdown)}
                                    className="p-4 hover:text-sky-500 dark:hover:text-sky-400"
                                >
                                    Explore our other shops ▾
                                </button>
                                {openDropdown && (
                                    <ul className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-900 shadow-md rounded z-50 w-48">
                                        {["music", "game", "movie"].filter(c => c !== category).map(c => (
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

                            {auth ? (
                                <>
                                    <li className="mx-3 relative">
                                        <Link to="/profile" className="flex items-center gap-2">
                                            <img className="h-8 w-8 rounded-full" src={auth.profileUrl} alt="" />
                                            <span className="hidden sm:block text-sm font-medium">{auth.displayName}</span>
                                        </Link>
                                    </li>

                                    {/*<li className="mr-3">*/}
                                    {/*    <Link to="/cart">*/}
                                    {/*        <CartCountBadge />*/}
                                    {/*    </Link>*/}
                                    {/*</li>*/}

                                    <li className="mr-3">
                                        <button onClick={signout} title="Sign Out" className="hover:text-red-500 transition">
                                            <FaSignOutAlt size={20} />
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li className="mr-3">
                                    <Link to="/signin" title="Sign In" className="hover:text-green-600 transition">
                                        <FaSignInAlt size={20} />
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};
