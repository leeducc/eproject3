// src/pages/music/MusicHome.tsx
import Layout                       from "@/components/Layout";
import FeatureHighlightSlider       from "@/components/QueryData/FeatureHighlightSlider";
import FeatureProductSlider         from "@/components/QueryData/FeatureProduct";
import FeatureCreator               from "@/components/QueryData/FeatureCreator";
import {MusicIcon }            from "lucide-react";

export default function MusicHome() {
    return (
        <Layout title="Music DVD Store">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-b from-purple-900 to-black text-white py-24 overflow-hidden">
                {/* Subtle musical notes pattern */}
                <div className="absolute inset-0 opacity-10">
                    <img
                        src="/images/patterns/music-notes.svg"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative container mx-auto px-6 text-center z-10">
                    <MusicIcon className="mx-auto mb-4 w-16 h-16 text-gold-400" />
                    <h1 className="text-6xl font-extrabold mb-4">Dive into Music on DVD</h1>
                    <p className="text-xl mb-8 text-gray-300">
                        Discover classic concerts, rare albums & collector editions—brought to life on disc.
                    </p>
                    <a
                        href="/music/store"
                        className="inline-block bg-gold-400 text-purple-900 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-gold-300 transition"
                    >
                        Shop the Collection
                    </a>
                </div>
            </div>

            {/* Highlights Carousel */}
            <section className="py-16 bg-purple-800">
                <div className="container mx-auto px-6">
                    <FeatureHighlightSlider />
                </div>
            </section>

            {/* Featured Discs */}
            <section className="py-20 bg-black text-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-6 border-b-2 border-gold-400 inline-block">
                        Featured Discs
                    </h2>
                    <FeatureProductSlider />
                </div>
            </section>

            {/* Featured Artists */}
            <section className="py-20 bg-gradient-to-t from-black to-purple-900 text-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-6 border-b-2 border-gold-400 inline-block">
                        Spotlight Artists
                    </h2>
                    <FeatureCreator />
                </div>
            </section>
        </Layout>
    );
}
