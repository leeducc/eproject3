// src/pages/game/GameHome.tsx
import Layout                     from "@/components/Layout";
import FeatureHighlightSlider     from "@/components/QueryData/FeatureHighlightSlider";
import FeatureProductSlider       from "@/components/QueryData/FeatureProduct";
import FeatureCreator             from "@/components/QueryData/FeatureCreator";
import { Gamepad }                from "lucide-react";

export default function GameHome() {
    return (
        <Layout title="Game DVD Store">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-b from-gray-800 to-black text-white py-24 overflow-hidden">
                {/* Circuit‑board pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                    <img
                        src="/images/patterns/circuit-board.svg"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative container mx-auto px-6 text-center z-10">
                    <Gamepad className="mx-auto mb-4 w-16 h-16 text-green-400" />
                    <h1 className="text-6xl font-extrabold mb-4">Level Up Your Game Collection</h1>
                    <p className="text-xl mb-8 text-gray-300">
                        From epic RPGs to classic arcade hits—experience the best games on DVD.
                    </p>
                    <a
                        href="/game/store"
                        className="inline-block bg-green-400 text-gray-900 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-green-300 transition"
                    >
                        Browse Games
                    </a>
                </div>
            </div>

            {/* Highlights Carousel */}
            <section className="py-16 bg-gray-900">
                <div className="container mx-auto px-6">
                    <FeatureHighlightSlider />
                </div>
            </section>

            {/* Featured Games */}
            <section className="py-20 bg-black text-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-6 border-b-2 border-green-400 inline-block">
                        Featured Games
                    </h2>
                    <FeatureProductSlider />
                </div>
            </section>

            {/* Spotlight Developers */}
            <section className="py-20 bg-gradient-to-t from-black to-gray-800 text-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-6 border-b-2 border-green-400 inline-block">
                        Spotlight Creators
                    </h2>
                    <FeatureCreator />
                </div>
            </section>
        </Layout>
    );
}
