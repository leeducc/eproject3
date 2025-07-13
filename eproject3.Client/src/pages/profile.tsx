import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/useAuth";
import { Button } from "@/components/ui/button";

const AVATAR_OPTIONS = [
    "/img/profiles/user1.svg",
    "/img/profiles/user2.svg",
    "/img/profiles/user3.svg"
];

export default function Profile() {
    const { auth, signout } = useAuth();
    const navigate = useNavigate();

    const [gender, setGender] = useState<"Male" | "Female" | "Not Set">("Not Set");
    const [savedGender, setSavedGender] = useState<"Male" | "Female" | "Not Set">("Not Set");

    const [avatar, setAvatar] = useState("");
    const [savedAvatar, setSavedAvatar] = useState("");

    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [tempAvatar, setTempAvatar] = useState("");

    useEffect(() => {
        if (!auth) navigate("/signin");
    }, [auth, navigate]);

    useEffect(() => {
        if (auth?.gender) {
            setGender(auth.gender);
            setSavedGender(auth.gender);
        }
        if (auth?.profileUrl) {
            setAvatar(auth.profileUrl);
            setSavedAvatar(auth.profileUrl);
        }
    }, [auth]);

    const handleSaveChanges = () => {
        setSavedGender(gender);
        setSavedAvatar(avatar);
        alert("Changes saved locally.");
    };

    const openAvatarModal = () => {
        setTempAvatar(avatar);
        setIsAvatarModalOpen(true);
    };

    const confirmAvatar = () => {
        setAvatar(tempAvatar);
        setIsAvatarModalOpen(false);
    };

    const cancelAvatar = () => {
        setIsAvatarModalOpen(false);
    };

    if (!auth) return null;

    return (
        <Layout title="Your Profile">
            <div className="max-w-2xl mx-auto px-6 py-10 bg-white dark:bg-black rounded-xl shadow">
                <div className="flex items-center space-x-6">
                    <img
                        src={avatar}
                        alt="User avatar"
                        className="w-20 h-20 rounded-full border border-gray-300 cursor-pointer"
                        onClick={openAvatarModal}
                        title="Click to change avatar"
                    />
                    <div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                {auth.displayName}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400">{auth.userName}</p>
                        </div>
                    </div>
                </div>

                {/* Gender */}
                <div className="mt-8 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Gender</h3>
                        <div className="flex space-x-4 text-gray-700 dark:text-gray-200">
                            {["Male", "Female", "Not Set"].map((g) => (
                                <label key={g} className="flex items-center space-x-1">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={g}
                                        checked={gender === g}
                                        onChange={() => setGender(g as any)}
                                    />
                                    <span>{g}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <Button
                        variant="default"
                        onClick={handleSaveChanges}
                        disabled={gender === savedGender && avatar === savedAvatar}
                    >
                        Save
                    </Button>

                    <div className="flex flex-wrap gap-4 mt-6">
                        <Button variant="secondary" asChild>
                            <Link to="/forgetpassword">Forgot Password</Link>
                        </Button>
                        <Button variant="destructive" onClick={signout}>
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>

            {/* Avatar Modal */}
            {isAvatarModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Choose an Avatar</h3>
                        <div className="flex justify-center space-x-4 mb-6">
                            {AVATAR_OPTIONS.map((url) => (
                                <img
                                    key={url}
                                    src={url}
                                    alt="avatar"
                                    className={`w-14 h-14 rounded-full border-2 cursor-pointer ${
                                        tempAvatar === url
                                            ? "border-blue-500 ring-2 ring-blue-300"
                                            : "border-gray-300 hover:border-gray-500"
                                    }`}
                                    onClick={() => setTempAvatar(url)}
                                />
                            ))}
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={cancelAvatar}>Cancel</Button>
                            <Button onClick={confirmAvatar}>Save</Button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
