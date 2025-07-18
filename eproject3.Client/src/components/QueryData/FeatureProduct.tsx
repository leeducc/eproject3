import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { QueryProducts, ProductView } from "@/dtos";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { client } from "@/gateway";

export default function FeatureProductSlider() {
    const location = useLocation();
    const categorySlug = location.pathname.split("/")[1];
    const [products, setProducts] = useState<ProductView[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductView | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const categoryMap: Record<string, number> = {
        music: 1,
        movie: 2,
        game: 3,
    };
    const categoryId = categoryMap[categorySlug.toLowerCase()] ?? 1;

    // Load products on mount or when category changes
    useEffect(() => {
        loadProducts();
    }, [categorySlug]);

    // Auto scroll effect
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scrollSpeed = 1;
        const interval = setInterval(() => {
            if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
                container.scrollLeft = 0; // reset scroll for looping
            } else {
                container.scrollLeft += scrollSpeed;
            }
        }, 20);

        return () => clearInterval(interval);
    }, [products]);

    async function loadProducts() {
        try {
            const res = await client.get(new QueryProducts({
                heroSection: true,
                categoryId,
                skip: 0,
                take: 20,
                meta: undefined as any
            }));

            if (res.results?.length) {
                setProducts(res.results);
            }
        } catch (err) {
            console.error("Failed to load products:", err);
        }
    }

    return (
        <div className="relative py-12 px-4">
            
            <div
                ref={containerRef}
                className="flex overflow-x-auto gap-4 whitespace-nowrap scroll-smooth"
                style={{
                    scrollbarWidth: 'none',       // Firefox
                    msOverflowStyle: 'none'       // IE
                }}
            >
                <style>
                    {`
      div::-webkit-scrollbar {
        display: none;
      }
    `}
                </style>

                {products.concat(products).map((product, index) => (
                    <div
                        key={`${product.id}-slide-${index}`}
                        className="inline-block w-[300px] h-[420px] flex-shrink-0 group rounded-lg overflow-hidden shadow-lg bg-white relative cursor-pointer"
                        onClick={() => setSelectedProduct(product)}
                    >
                        <img
                            src={`https://localhost:5001/${product.image}`} // product.image = "images/products/product1.jpg"
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />

                        {/* Hover overlay with blur and centered title */}
                        <div className="absolute inset-0 backdrop-blur-md bg-blue-200/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <h3 className="text-2xl font-bold text-white text-center px-4">{product.title}</h3>
                        </div>
                    </div>
                ))}


            </div>

            <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
                <DialogContent className="max-w-6xl w-full">
                    {selectedProduct && (
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="md:w-1/2 w-full">
                                <iframe
                                    className="w-full aspect-video rounded shadow"
                                    src={`https://www.youtube.com/embed/${getYoutubeId(selectedProduct.youtubeTrailerLink)}?autoplay=1&mute=1`}
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="md:w-1/2 w-full space-y-4">
                                <h2 className="text-3xl font-bold">{selectedProduct.title}</h2>
                                <p className="text-gray-600">{selectedProduct.description}</p>
                                <p className="text-xl font-semibold text-slate-900">${selectedProduct.price.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">Stock: {selectedProduct.stock}</p>
                                {selectedProduct.creatorId && (
                                    <p className="text-sm text-gray-600">Artist: {selectedProduct.creatorId.name}</p>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

function getYoutubeId(url: string | undefined): string | null {
    const match = url?.match(/[?&]v=([^&#]+)/) || url?.match(/youtu\.be\/([^&#]+)/);
    return match ? match[1] : null;
}
