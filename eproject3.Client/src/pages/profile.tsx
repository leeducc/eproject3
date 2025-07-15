import { useState } from "react"
import InfoPage from "./profile/InfoPage"
import CollectionPage from "./profile/CollectionPage"
import OrderPage from "./profile/OrderPage"
import Layout from "@/components/Layout";

const tabs = [
    { name: "Info", key: "info" },
    // { name: "Collection", key: "collection" },
    { name: "Orders", key: "orders" },
]

export default function Profile() {
    const [activeTab, setActiveTab] = useState("info")

    return (
        <Layout >
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">My Profile</h1>
            <div className="flex space-x-4 border-b mb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`pb-2 border-b-2 ${
                            activeTab === tab.key ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"
                        }`}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

            <div>
                {activeTab === "info" && <InfoPage />}
                {activeTab === "collection" && <CollectionPage />}
                {activeTab === "orders" && <OrderPage />}
            </div>
        </div>
        </Layout>
    )
}
