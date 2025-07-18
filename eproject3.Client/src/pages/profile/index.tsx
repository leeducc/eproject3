// src/pages/profile.tsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import InfoPage from "./InfoPage";
import ChangePasswordPage from "./ChangePasswordPage";
import CollectionPage from "./CollectionPage";
import OrderPage from "./OrderPage";
import Layout from "@/components/Layout";

const tabs = [
    { name: "Info", key: "info" },
    { name: "Change Password", key: "changePassword" },
    { name: "Collection", key: "collection" },
    { name: "Orders", key: "orders" },
];

export default function Profile() {
    const [activeTab, setActiveTab] = useState("info");
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab && tabs.some(t => t.key === tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">My Profile</h1>
                <div className="flex">
                    {/* Sidebar */}
                    <nav className="w-1/4 border-r">
                        <ul className="space-y-2">
                            {tabs.map(tab => (
                                <li key={tab.key}>
                                    <button
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`
                      w-full text-left px-4 py-2 rounded-l-lg
                      ${
                                            activeTab === tab.key
                                                ? "bg-blue-100 text-blue-700 font-semibold"
                                                : "text-gray-600 hover:bg-gray-100"
                                        }
                    `}
                                    >
                                        {tab.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    {/* Content */}
                    <main className="w-3/4 pl-6">
                        {activeTab === "info" && <InfoPage />}
                        {activeTab === "changePassword" && <ChangePasswordPage />}
                        {activeTab === "collection" && <CollectionPage />}
                        {activeTab === "orders" && <OrderPage />}
                    </main>
                </div>
            </div>
        </Layout>
    );
}
