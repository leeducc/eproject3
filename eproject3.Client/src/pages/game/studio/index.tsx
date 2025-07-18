import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Creator, ProductView, QueryProducts } from "@/dtos";
import { client } from "@/gateway";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ArtistDetail() {
    const [searchParams] = useSearchParams();
    const artistId = Number(searchParams.get("artist"));
    const [artist, setArtist] = useState<Creator | null>(null);
    const [products, setProducts] = useState<ProductView[]>([]);

    useEffect(() => {
        if (artistId) {
            loadArtist();
            loadProducts();
        }
    }, [artistId]);

    async function loadArtist() {
        const res = await client.get<Creator>(`/api/creators/${artistId}`);
        setArtist(res);
    }

    async function loadProducts() {
        const res = await client.get(new QueryProducts({
            creatorId: artistId
        }));
        setProducts(res.results || []);
    }

    if (!artist) return <div className="p-8 text-center">Loading...</div>;

    return (
        <>
            <Header />

            <div className="p-6 max-w-6xl mx-auto">
                {/* Artist Profile Section */}
                <div className="flex flex-col md:flex-row items-center gap-6 bg-white shadow rounded-lg p-6">
                    <img
                        src={`https://localhost:5001/${artist.image}`}
                        alt={artist.name}
                        className="w-48 h-48 object-cover rounded-full border-4 border-blue-300"
                    />
                    <div className="flex-1 space-y-3">
                        <h1 className="text-4xl font-bold">{artist.name}</h1>
                        <div className="prose max-w-full" dangerouslySetInnerHTML={{ __html: artist.description }} />
                    </div>
                </div>

                {/* Product Grid */}
                <h2 className="text-2xl font-semibold mt-12 mb-4">Products by {artist.name}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <Link
                            to={`/store/product/${product.id}`} // ✅ absolute link
                            key={product.id}
                            className="bg-white rounded shadow p-3 hover:shadow-lg transition duration-200"
                        >
                            <img
                                src={`https://localhost:5001/${product.image}`}
                                alt={product.title}
                                className="w-full h-40 object-cover rounded"
                            />
                            <div className="mt-2 text-center space-y-1">
                                <h3 className="text-md font-semibold truncate">{product.title}</h3>
                                <p className="text-sm text-gray-600">
                                    {product.price.toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    })}
                                </p>
                                {product.averageRating != null && (
                                    <p className="text-sm text-yellow-500">
                                        ⭐ {product.averageRating.toFixed(1)} / 5
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <Footer />
        </>
    );
}
