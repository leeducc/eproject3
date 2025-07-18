// src/components/FeatureHighlightSlider.tsx
import { useEffect, useState } from "react";
import { useLocation, Link }          from "react-router-dom";
import { QueryHighlights, Highlight } from "@/dtos";
import { client }                     from "@/gateway";

export default function FeatureHighlightSlider() {
    const location = useLocation();
    // use the full pathname as your key ("/music", "/movie", "/game", or "/")
    const route = location.pathname || "/";

    const [items, setItems]         = useState<Highlight[]>([]);
    const [containerRef, setRef]    = useState<HTMLDivElement | null>(null);

    // Load highlights when route changes
    useEffect(() => {
        const load = async () => {
            try {
                const res = await client.get(new QueryHighlights({ route }));
                setItems(res.results || []);
            } catch (err) {
                console.error("Failed to load highlights:", err);
            }
        };
        load();
    }, [route]);

    // Auto‑scroll loop
    useEffect(() => {
        if (!containerRef || items.length === 0) return;
        const speed = 1;
        const iv = setInterval(() => {
            if (!containerRef) return;
            if (containerRef.scrollLeft + containerRef.clientWidth >= containerRef.scrollWidth) {
                containerRef.scrollLeft = 0;
            } else {
                containerRef.scrollLeft += speed;
            }
        }, 20);
        return () => clearInterval(iv);
    }, [containerRef, items]);

    if (items.length === 0) return null;

    return (
        <div className="relative py-12 px-4 bg-red-600">
            <h2 className="text-5xl font-bold text-center text-yellow-300 mb-8">
                highlights
            </h2>

            <div
                ref={el => setRef(el)}
                className="flex overflow-x-auto gap-4 whitespace-nowrap scroll-smooth"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                <style>{`div::-webkit-scrollbar { display: none; }`}</style>

                {items.concat(items).map((h, i) => (
                    <Link
                        key={`${h.id}-${i}`}
                        to={h.link || "#"}
                        className="flex-shrink-0 w-80 h-[28rem] rounded-lg overflow-hidden shadow-lg"
                    >
                        <img
                            src={`https://localhost:5001/${h.imageUrl}`}
                            alt={`highlight-${h.id}`}
                            className="w-full h-full object-cover"
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}
