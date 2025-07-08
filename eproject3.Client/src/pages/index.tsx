import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

type Product = {
    id: number;
    title: string;
    artist: string;
    image: string;
    heroSection: boolean;
};

const Index = () => {
    const [heroProducts, setHeroProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch("https://localhost:5001/api/products?HeroSection=true", {
            credentials: "include",
            headers: {
                Accept: "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                const list = Array.isArray(data.results) ? data.results : data;
                setHeroProducts(list);
            })
            .catch(err => {
                console.error("Failed to load hero products", err);
                setHeroProducts([]);
            });
    }, []);

    // const slideLayout = (product: Product, index: number) => {
    //     const isEven = index % 2 === 0;
    //
    //     const hugeBlock = (
    //         <div className="relative group w-[320px] h-[320px] overflow-hidden rounded shadow-lg">
    //             <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:blur-sm transition duration-300" />
    //             <div className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-center px-4 transition duration-300">
    //                 <h3 className="text-lg font-bold">{product.title}</h3>
    //                 <p className="text-sm">{product.artist}</p>
    //             </div>
    //         </div>
    //     );
    //
    //     const smallBlock = (
    //         <div className="relative group w-[150px] h-[150px] overflow-hidden rounded shadow-md">
    //             <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:blur-sm transition duration-300" />
    //             <div className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-center px-2 transition duration-300 text-xs">
    //                 <h3 className="font-semibold">{product.title}</h3>
    //                 <p>{product.artist}</p>
    //             </div>
    //         </div>
    //     );
    //
    //     return (
    //         <div key={product.id} className="flex-shrink-0 space-y-2 w-[320px]">
    //             {isEven ? (
    //                 <>
    //                     {hugeBlock}
    //                     <div className="flex gap-2">{[smallBlock, smallBlock]}</div>
    //                 </>
    //             ) : (
    //                 <>
    //                     <div className="flex gap-2">{[smallBlock, smallBlock]}</div>
    //                     {hugeBlock}
    //                 </>
    //             )}
    //         </div>
    //     );
    // };
    const ProductBlock = ({ product, size }: { product: Product; size: "huge" | "small" }) => {
        const blockSize = size === "huge" ? "w-[320px] h-[320px]" : "w-[150px] h-[150px]";
        return (
            <div className={`relative group ${blockSize} overflow-hidden rounded shadow-md flex-shrink-0`}>
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition duration-300 group-hover:blur-sm"
                />
                <div className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-center px-2 transition duration-300 text-sm">
                    <h3 className="font-semibold">{product.title}</h3>
                    <p>{product.artist}</p>
                </div>
            </div>
        );
    };


    return (
        <Layout title="Music DVD Store">
            {/* Hero Section */}
            <div className="relative bg-gray-900 text-white py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl font-extrabold mb-6">Explore the World of Music on DVD</h1>
                    <p className="text-xl mb-8">Classic albums, live concerts, and rare collector editions – all on disc.</p>
                    <Link to="/shop" className="bg-white text-gray-900 px-6 py-3 rounded-md font-semibold shadow hover:bg-gray-200">
                        Shop Now
                    </Link>
                </div>
                <img src="https://via.placeholder.com/1200x400/111827/FFFFFF?text=Hero+Image" alt="DVD shelf" className="absolute top-0 left-0 w-full h-full object-cover opacity-10 pointer-events-none" />
            </div>

            
            {/* Featured DVDs - Horizontal Scroll */}
            <section className="py-20 bg-white dark:bg-gray-900 overflow-hidden">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-12">featured discs</h2>
                    <div
                        className="relative w-full overflow-x-auto group no-scrollbar"
                        onMouseEnter={(e) => {
                            const el = e.currentTarget.querySelector(".animate-scroll-horizontal") as HTMLElement;
                            if (el) el.style.animationPlayState = "paused";
                        }}
                        onMouseLeave={(e) => {
                            const el = e.currentTarget.querySelector(".animate-scroll-horizontal") as HTMLElement;
                            if (el) el.style.animationPlayState = "running";
                        }}
                    >
                        <div
                            className="flex gap-6 animate-scroll-horizontal"
                            style={{ animation: 'scroll 40s linear infinite' }}
                        >
                            {heroProducts.map((product, i) => (
                                <div key={product.id} className="flex-shrink-0 w-[320px] space-y-2">
                                    {i % 2 === 0 ? (
                                        <>
                                            <ProductBlock product={product} size="huge" />
                                            <div className="flex gap-2">
                                                <ProductBlock product={product} size="small" />
                                                <ProductBlock product={product} size="small" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex gap-2">
                                                <ProductBlock product={product} size="small" />
                                                <ProductBlock product={product} size="small" />
                                            </div>
                                            <ProductBlock product={product} size="huge" />
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <style>{`
            @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
            .animate-scroll-horizontal {
                display: flex;
                animation: scroll 40s linear infinite;
            }
            .no-scrollbar::-webkit-scrollbar {
                display: none;
            }
            .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `}</style>
                </div>
            </section>


            {/* Featured Artists */}
            <section className="py-20 bg-slate-100 dark:bg-slate-800">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-12">Featured Artists</h2>
                    <div className="overflow-x-auto flex gap-6 whitespace-nowrap">
                        {[1, 2, 3, 4, 5, 6].map((artist) => (
                            <div key={artist} className="inline-block w-48 flex-shrink-0">
                                <img src={`https://via.placeholder.com/200x200/${Math.floor(Math.random()*16777215).toString(16)}/fff?text=Artist+${artist}`} className="rounded-full mx-auto mb-4 shadow-lg" alt={`Artist ${artist}`} />
                                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Artist {artist}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partner Section */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-12">Connect to Our Partners</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <img src="https://via.placeholder.com/500x300/222/fff?text=Partner+Banner" className="rounded shadow-xl" alt="Partner Banner" />
                        <div className="text-center lg:text-left">
                            <img src="https://via.placeholder.com/300x200/444/fff?text=Store+Preview" className="mx-auto lg:mx-0 rounded shadow" alt="Store Preview" />
                            <Link to="/partner-store" className="mt-6 inline-block bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-700">
                                Go to Store →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Index;
