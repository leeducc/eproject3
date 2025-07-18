// src/pages/movie/MovieHome.tsx
import Layout                       from "@/components/Layout";
import FeatureHighlightSlider       from "@/components/QueryData/FeatureHighlightSlider";
import FeatureProductSlider         from "@/components/QueryData/FeatureProduct";
import FeatureCreator               from "@/components/QueryData/FeatureCreator";
import { FilmIcon }                 from "lucide-react";

export default function MovieHome() {
    return (
        <Layout title="Movie DVD Store">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-b from-gray-900 to-black text-white py-24 overflow-hidden">
                {/* Subtle film‑reel pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                    <img
                        src="/images/patterns/film-reel.svg"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative container mx-auto px-6 text-center z-10">
                    <FilmIcon className="mx-auto mb-4 w-16 h-16 text-red-500" />
                    <h1 className="text-6xl font-extrabold mb-4">Experience Movies on DVD</h1>
                    <p className="text-xl mb-8 text-gray-300">
                        From timeless classics to blockbuster hits—collect them all on disc.
                    </p>
                    <a
                        href="/movie/store"
                        className="inline-block bg-red-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-red-400 transition"
                    >
                        Browse Movies
                    </a>
                </div>
            </div>

            {/* Highlights Carousel */}
            <section className="py-16 bg-gray-800">
                <div className="container mx-auto px-6">
                    <FeatureHighlightSlider />
                </div>
            </section>

            {/* Featured Discs */}
            <section className="py-20 bg-black text-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-6 border-b-2 border-red-500 inline-block">
                        Featured Movies
                    </h2>
                    <FeatureProductSlider />
                </div>
            </section>

            {/* Spotlight Studios/Directors */}
            <section className="py-20 bg-gradient-to-t from-black to-gray-900 text-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-6 border-b-2 border-red-500 inline-block">
                        Spotlight Creators
                    </h2>
                    <FeatureCreator />
                </div>
            </section>
        </Layout>
    );
}
