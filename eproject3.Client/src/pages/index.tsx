import {useEffect, useState} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer"

type Product = { id: number; title: string; price: number; image: string };
type NewsItem = { id: number; title: string; summary: string };

interface HomePageData {
    heroBanner: { title: string; subtitle: string; image: string };
    categories: string[];
    featuredProducts: Product[];
    news: NewsItem[];
}

const Home = () => {
    const [data, setData] = useState<HomePageData | null>(null);

    useEffect(() => {
        fetch("/homepage-data.json")
            .then((res) => res.json())
            .then(setData)
            .catch((err) => console.error("Failed to load homepage data", err));
    }, []);

    if (!data) return <div>Loading...</div>;

    return (
        <>
            <Header/>
            <div className="space-y-12">

                {/* Hero Banner */}
                <section className="relative h-64 bg-gray-300 flex items-center justify-center text-white text-center">
                    <img src={data.heroBanner.image} alt="Banner"
                         className="absolute inset-0 w-full h-full object-cover opacity-50"/>
                    <div className="relative">
                        <h1 className="text-3xl font-bold">{data.heroBanner.title}</h1>
                        <p className="text-xl">{data.heroBanner.subtitle}</p>
                    </div>
                </section>

                {/* Categories */}
                <section className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4">Categories</h2>
                    <div className="flex flex-wrap gap-4">
                        {data.categories.map((category) => (
                            <div key={category} className="bg-white border rounded shadow p-4 w-40 text-center">
                                {category}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Featured Products */}
                <section className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4">Featured Albums</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {data.featuredProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded shadow p-4">
                                <img src={product.image} alt={product.title} className="h-40 w-full object-cover mb-2"/>
                                <h3 className="font-semibold">{product.title}</h3>
                                <p className="text-red-500 font-bold">${product.price.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* News / Blog */}
                <section className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4">Latest News</h2>
                    <div className="space-y-4">
                        {data.news.map((item) => (
                            <div key={item.id} className="border rounded p-4">
                                <h3 className="font-semibold">{item.title}</h3>
                                <p>{item.summary}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            <Footer/>
        </>
    );
};

export default Home;
