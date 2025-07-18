import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    QueryCreators,
    QueryCreatorsResponse,
    Creator,
    CreatorType
} from "@/dtos";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { client } from "@/gateway";

export default function FeatureCreator() {
    const [creators, setCreators] = useState<Creator[]>([]);
    const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    const routeToType: Record<string, CreatorType> = {
        "/music": CreatorType.Artist,
        "/movie": CreatorType.Producer,
        "/game": CreatorType.Studio,
    };

    const currentPath =
        Object.keys(routeToType).find((p) =>
            location.pathname.startsWith(p)
        ) || "/music";

    const currentType = routeToType[currentPath];

    useEffect(() => {
        loadCreators();
    }, [currentType]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scrollSpeed = 1;
        const interval = setInterval(() => {
            if (
                container.scrollLeft + container.clientWidth >=
                container.scrollWidth
            ) {
                container.scrollLeft = 0;
            } else {
                container.scrollLeft += scrollSpeed;
            }
        }, 20);

        return () => clearInterval(interval);
    }, [creators]);

    async function loadCreators() {
        try {
            const req = new QueryCreators({ type: currentType, isHero: true });
            const res = await client.get<QueryCreatorsResponse>(req);
            // Guarantee an array
            setCreators(Array.isArray(res.results) ? res.results : []);
        } catch (err) {
            console.error("Failed to load creators:", err);
            setCreators([]); // fallback
        }
    }

    const getImageUrl = (filename: string) =>
        `https://localhost:5001/images/creators/${filename}`;

    // Always coerce to array so .concat never blows up
    const slides = (creators || []).concat(creators || []);

    return (
        <div className="relative py-12 px-4">
            

            <div
                ref={containerRef}
                className="flex overflow-x-auto gap-4 whitespace-nowrap scroll-smooth"
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                <style>{`div::-webkit-scrollbar { display: none; }`}</style>

                {slides.map((creator, idx) => (
                    <div
                        key={`${creator.id}-slide-${idx}`}
                        className="inline-block w-[300px] h-[420px] flex-shrink-0 group rounded-lg overflow-hidden shadow-lg bg-white relative cursor-pointer"
                        onClick={() => setSelectedCreator(creator)}
                    >
                        <Link
                            to={`/${currentPath.slice(1)}/artist?artist=${creator.id}`}
                            className="block w-full h-full"
                        >
                            <img
                                src={`https://localhost:5001/${creator.image}`}
                                alt={creator.name}
                                className="…"
                            />

                            <div className="absolute inset-0 backdrop-blur-md bg-blue-200/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <h3 className="text-2xl font-bold text-white text-center px-4">
                                    {creator.name}
                                </h3>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            <Dialog
                open={!!selectedCreator}
                onOpenChange={() => setSelectedCreator(null)}
            >
                <DialogContent className="max-w-2xl w-full">
                    {selectedCreator && (
                        <div className="text-center space-y-4">
                            <img
                                src={getImageUrl(selectedCreator.image)}
                                alt={selectedCreator.name}
                                className="w-full h-64 object-cover rounded"
                            />
                            <h2 className="text-3xl font-bold">
                                {selectedCreator.name}
                            </h2>
                            <p className="text-gray-500 text-lg">
                                Type: {selectedCreator.type}
                            </p>
                            <p>{selectedCreator.description}</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
