import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Product = { id: number; title: string; artist: string; image: string };
type NewsItem = { id: number; title: string; summary: string };

interface HomePageData {
    heroBanner: { title: string; subtitle: string; image: string };
    categories: string[];
    featuredProducts: Product[];
    news: NewsItem[];
}

const Home = () => {
    const [data, setData] = useState<HomePageData | null>(null);
    const [scrollPos, setScrollPos] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetch("/homepage-data.json")
            .then((res) => res.json())
            .then(setData)
            .catch((err) => console.error("Failed to load homepage data", err));
    }, []);

    // Auto-scroll for carousel
    useEffect(() => {
        if (!data) return;

        const interval = setInterval(() => {
            setScrollPos((prev) => (prev + 1) % (data.featuredProducts.length * 220));
        }, 30);

        return () => clearInterval(interval);
    }, [data?.featuredProducts.length]);

    if (!data) return <div>Loading...</div>;

    return (
        <>
            <Header />

            {/* Hero Banner */}
            <section className="relative h-64 bg-gray-300 flex items-center justify-center text-white text-center">
                <img
                    src={data.heroBanner.image}
                    alt="Banner"
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                <div className="relative">
                    <h1 className="text-3xl font-bold">{data.heroBanner.title}</h1>
                    <p className="text-xl">{data.heroBanner.subtitle}</p>
                </div>
            </section>

            {/* Categories */}
            <section className="container mx-auto px-4 my-8">
                <h2 className="text-2xl font-bold mb-4">Categories</h2>
                <div className="flex flex-wrap gap-4">
                    {data.categories.map((category) => (
                        <div key={category} className="bg-white border rounded shadow p-4 w-40 text-center">
                            {category}
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Products Carousel */}
            <section className="relative overflow-hidden bg-gray-100 py-8">
                <div
                    className="flex gap-4 transition-transform duration-300 ease-linear"
                    style={{
                        transform: `translateX(-${scrollPos}px)`,
                        width: `${data.featuredProducts.length * 220 * 2}px`,
                    }}
                >
                    {data.featuredProducts.concat(data.featuredProducts).map((product, index) => (
                        <div
                            key={index}
                            className="relative w-52 h-52 flex-shrink-0 overflow-hidden rounded shadow-lg bg-white cursor-pointer"
                            onClick={() => setSelectedProduct(product)}
                        >
                            <img
                                src={product.image}
                                alt={product.title}
                                className="object-cover w-full h-full transition duration-300"
                            />
                            <div className="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition-opacity duration-300" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                    onClick={() => setSelectedProduct(null)}
                >
                    <div
                        className="bg-white relative flex w-4/5 max-w-5xl h-3/4 rounded overflow-hidden shadow-lg"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-4 right-4 text-black text-2xl hover:text-gray-600"
                        >
                            ✕
                        </button>

                        {/* Left: Large Product Image */}
                        <div className="w-1/2 h-full flex items-center justify-center bg-gray-100">
                            <img
                                src={selectedProduct.image}
                                alt={selectedProduct.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Right: Text Info */}
                        <div className="w-1/2 p-8 text-black flex flex-col justify-center">
                            <h2 className="text-3xl font-bold mb-4">{selectedProduct.title}</h2>
                            <p className="text-xl">{selectedProduct.artist}</p>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default Home;
