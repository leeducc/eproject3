import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
    Creator,
    ProductView,
    GetCreator,
    QueryProducts
} from "@/dtos";
import { client } from "@/gateway";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ArtistDetail() {
    const [searchParams] = useSearchParams();
    const artistId = Number(searchParams.get("artist"));
    const [artist, setArtist] = useState<Creator | null>(null);
    const [products, setProducts] = useState<ProductView[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!artistId) return;

        // load both in parallel
        Promise.all([loadArtist(), loadProducts()]).finally(() => {
            setLoading(false);
        });
    }, [artistId]);

    // ✅ Use the GetCreator DTO so ServiceStack sees a proper GET
    async function loadArtist() {
        try {
            const res = await client.get(new GetCreator({ id: artistId }));
            setArtist(res);
        } catch (e) {
            console.error("Failed to load artist", e);
        }
    }

    async function loadProducts() {
        try {
            // QueryProducts expects a creatorId filter
            const res = await client.get(new QueryProducts({ creatorId: artistId }));
            setProducts(res.results || []);
        } catch (e) {
            console.error("Failed to load products for artist", e);
        }
    }

    if (loading) {
        return <div className="p-8 text-center">Loading…</div>;
    }

    if (!artist) {
        return <div className="p-8 text-center text-red-500">Artist not found</div>;
    }

    return (
        <>
            <Header />

            <div className="p-6 max-w-6xl mx-auto space-y-12">
                {/* Artist Profile */}
                <div className="flex flex-col md:flex-row items-center gap-6 bg-white shadow rounded-lg p-6">
                    {/* Note the `/images/creators/` prefix—make sure this matches how you serve static files */}
                    <img
                        src={`https://localhost:5001/${artist.image}`}
                        alt={artist.name}
                        className="w-48 h-48 object-cover rounded-full border-4 border-blue-300"
                    />
                    <div className="flex-1 space-y-3">
                        <h1 className="text-4xl font-bold">{artist.name}</h1>
                        <div
                            className="prose max-w-full"
                            dangerouslySetInnerHTML={{ __html: artist.description }}
                        />
                    </div>
                </div>

                {/* Product Grid */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">
                        Products by {artist.name}
                    </h2>
                    {products.length === 0 ? (
                        <p className="text-center text-gray-500">No products found.</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {products.map((p) => (
                                <Link
                                    to={`/store/product/${p.id}`}
                                    key={p.id}
                                    className="bg-white rounded shadow p-3 hover:shadow-lg transition duration-200"
                                >
                                    <img
                                        src={`https://localhost:5001//${p.image}`}
                                        alt={p.title}
                                        className="w-full h-40 object-cover rounded"
                                    />
                                    <div className="mt-2 text-center space-y-1">
                                        <h3 className="text-md font-semibold truncate">
                                            {p.title}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {p.price.toLocaleString("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            })}
                                        </p>
                                        {p.averageRating != null && (
                                            <p className="text-sm text-yellow-500">
                                                ⭐ {p.averageRating.toFixed(1)} / 5
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <Footer />
        </>
    );
}
