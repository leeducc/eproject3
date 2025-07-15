import Layout from "@/components/Layout";
import FeatureProductSlider from "@/components/QueryData/FeatureProduct";

export default function MusicHome() {
    return (
        <Layout title="Music DVD Store">
            {/* Hero Section */}
            <div className="relative bg-gray-900 text-white py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl font-extrabold mb-6">Explore the World of Music on DVD</h1>
                    <p className="text-xl mb-8">
                        Classic albums, live concerts, and rare collector editions – all on disc.
                    </p>
                    <a
                        href="/store/music"
                        className="bg-white text-gray-900 px-6 py-3 rounded-md font-semibold shadow hover:bg-gray-200"
                    >
                        Shop Now
                    </a>
                </div>
                <img
                    src="/img/banners/herosection.jpg"
                    alt="DVD shelf"
                    className="absolute top-0 left-0 w-full h-full object-cover opacity-10 pointer-events-none"
                />
            </div>

            {/* Featured Products Slider */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <FeatureProductSlider  />
                </div>
            </section>
        </Layout>
    );
}
