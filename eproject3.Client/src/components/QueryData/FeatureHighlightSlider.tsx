// src/components/FeatureHighlightSlider.tsx
import { useEffect, useState, useRef } from "react";
import { useLocation, Link }            from "react-router-dom";
import { QueryHighlights, Highlight }   from "@/dtos";
import { client }                       from "@/gateway";

export default function FeatureHighlightSlider() {
    const { pathname } = useLocation();
    // derive the category slug from path (e.g. "/music/..." → "music")
    const slug = pathname.split("/")[1]?.toLowerCase() || "";

    // map slugs to your category IDs in the DB
    const categoryMap: Record<string, number> = {
        music: 1,
        movie: 2,
        game:  3,
    };
    const categoryId = categoryMap[slug] ?? 0;

    const [items, setItems]      = useState<Highlight[]>([]);
    const containerRef           = useRef<HTMLDivElement>(null);

    // load highlights whenever the categoryId changes
    useEffect(() => {
        if (!categoryId) return;

        (async () => {
            try {
                const res = await client.get(
                    new QueryHighlights({ categoryId })
                );
                setItems(res.results || []);
            } catch (err) {
                console.error("Failed to load highlights:", err);
            }
        })();
    }, [categoryId]);

    // infinite auto-scroll
    useEffect(() => {
        const el = containerRef.current;
        if (!el || items.length === 0) return;

        const speed = 1;
        const iv = setInterval(() => {
            if (el.scrollLeft + el.clientWidth >= el.scrollWidth) {
                el.scrollLeft = 0;
            } else {
                el.scrollLeft += speed;
            }
        }, 20);
        return () => clearInterval(iv);
    }, [items]);

    if (items.length === 0) return null;

    return (
        <div className="relative py-12 px-4 bg-red-600">
            <h2 className="text-5xl font-bold text-center text-yellow-300 mb-8">
                highlights
            </h2>

            <div
                ref={containerRef}
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
