import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { client } from "@/gateway"
import {
    QueryProducts,
    QueryGenres,
    QueryCreators,
    ProductView,
    Genre,
    Creator,
    CreatorType,
} from "@/dtos"
export default function ProductCardGrid() {
    const location = useLocation()
    const [products, setProducts] = useState<ProductView[]>([])
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [search, setSearch] = useState("")
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(999)
    const [rating, setRating] = useState(0)
    const [creatorId, setCreatorId] = useState<number | null>(null)
    const [selectedGenres, setSelectedGenres] = useState<number[]>([])
    const [allGenres, setAllGenres] = useState<Genre[]>([])
    const [allCreators, setAllCreators] = useState<Creator[]>([])
    const loader = useRef<HTMLDivElement | null>(null)
    const pageSize = 12
    
    
    const routeToType = {
        "/music": CreatorType.Artist,
        "/movie": CreatorType.Producer,
        "/game": CreatorType.Studio,
    } as const

    const routeToCategoryId = {
        "/music": 1,
        "/movie": 2,
        "/game": 3,
    } as const

    const currentPath = Object.keys(routeToCategoryId).find(p =>
        location.pathname.startsWith(p)
    ) as keyof typeof routeToCategoryId

    const currentType = routeToType[currentPath] ?? CreatorType.Artist
    const currentCategoryId = routeToCategoryId[currentPath] ?? 1

    useEffect(() => {
        ;(async () => {
            const genres = await client.get(new QueryGenres({ categoryId: currentCategoryId }))
            setAllGenres(genres.results || [])

            const creators = await client.get(new QueryCreators({ type: currentType }))
            setAllCreators(creators.results || [])
        })()
    }, [location.pathname])

    useEffect(() => {
        setProducts([])
        setPage(0)
        setHasMore(true)
        loadMore(true)
    }, [search, minPrice, maxPrice, rating, creatorId, selectedGenres, location.pathname])

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && hasMore) {
                loadMore()
            }
        })
        const node = loader.current
        if (node) observer.observe(node)
        return () => observer.disconnect()
    }, [loader.current, hasMore])

    async function loadMore(reset = false) {
        const res = await client.get(
            new QueryProducts({
                available: true,
                skip: reset ? 0 : page * pageSize,
                take: pageSize,
                titleContains: search,
                priceMin: minPrice,
                priceMax: maxPrice,
                creatorId: creatorId || undefined,
                genreIds: selectedGenres.length ? selectedGenres : undefined,
                ratingMin: rating,
                categoryId: currentCategoryId,
                meta: undefined as any
            })
        )
        if (res?.results?.length) {
            setProducts(prev => (reset ? res.results : [...prev, ...res.results]))
            setPage(p => p + 1)
            if (res.results.length < pageSize) setHasMore(false)
        } else {
            setHasMore(false)
        }
    }

    function toggleGenre(id: number) {
        setSelectedGenres(prev =>
            prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
        )
    }

    function getYoutubeId(url: string | undefined): string | null {
        const match = url?.match(/[?&]v=([^&#]+)/) || url?.match(/youtu\.be\/([^&#]+)/)
        return match ? match[1] : null
    }

    return (
        <div className="flex flex-col lg:flex-row">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-72 p-4 space-y-4 bg-white shadow-md">
                <input
                    type="text"
                    placeholder="Search title..."
                    className="w-full p-2 border rounded"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <div>
                    <label className="block mb-1">Price Range</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            className="w-full p-1 border rounded"
                            value={minPrice}
                            onChange={e => setMinPrice(Number(e.target.value))}
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            className="w-full p-1 border rounded"
                            value={maxPrice}
                            onChange={e => setMaxPrice(Number(e.target.value))}
                        />
                    </div>
                </div>
                <div>
                    <label className="block mb-1">Minimum Rating</label>
                    <select
                        className="w-full p-2 border rounded"
                        value={rating}
                        onChange={e => setRating(Number(e.target.value))}
                    >
                        {[0, 1, 2, 3, 4, 5].map(r => (
                            <option key={r} value={r}>
                                {r}+
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1">{currentType} Filter</label>
                    <select
                        className="w-full p-2 border rounded"
                        value={creatorId ?? ""}
                        onChange={e => setCreatorId(Number(e.target.value) || null)}
                    >
                        <option value="">All</option>
                        {allCreators.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1">Genres</label>
                    <div className="flex flex-wrap gap-2">
                        {allGenres.map(g => (
                            <button
                                key={g.id}
                                className={`px-3 py-1 text-sm border rounded-full ${
                                    selectedGenres.includes(g.id)
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100"
                                }`}
                                onClick={() => toggleGenre(g.id)}
                            >
                                {g.name}
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-4 flex-1">
                {products.map(product => {
                    const basePath = location.pathname.replace(/\/product\/?.*$/, "").replace(/\/$/, "")
                    const detailPath = `${basePath}/product/${product.id}`

                    return (
                        <Link
                            key={product.id}
                            to={detailPath}
                            className="relative group w-full max-w-full sm:max-w-xs mx-auto overflow-hidden rounded-lg bg-white shadow-md"
                        >
                            <div className="relative h-60 overflow-hidden">
                                <img
                                    src={`https://localhost:5001/${product.image}`}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                                {product.youtubeTrailerLink && (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <iframe
                                            className="rounded-lg shadow-lg w-full h-full"
                                            src={`https://www.youtube.com/embed/${getYoutubeId(product.youtubeTrailerLink)}?autoplay=1&mute=1`}
                                            title="Trailer"
                                            frameBorder="0"
                                            allow="autoplay; encrypted-media"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )}
                                {product.promotionName && (
                                    <span className="absolute top-0 left-0 w-28 -translate-x-6 translate-y-4 -rotate-45 bg-red-600 text-center text-sm text-white">
                                Sale
                            </span>
                                )}
                                {product.stock === 0 && (
                                    <span className="absolute top-0 right-0 m-2 px-2 py-1 text-xs bg-gray-700 text-white rounded">
                                Sold Out
                            </span>
                                )}
                            </div>
                            <div className="mt-4 px-5 pb-5">
                                <h5 className="text-xl font-semibold tracking-tight text-slate-900">
                                    {product.title}
                                </h5>
                                <div className="mt-2.5 mb-5 flex items-center">
                            <span className="mr-2 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">
                                {(product.averageRating ?? 0).toFixed(1)}

                            </span>
                                    {Array.from({ length: 5 }, (_, i) => {
                                        const r = Math.round(product.averageRating || 0);
                                        return (
                                            <svg
                                                key={i}
                                                className={`h-5 w-5 ${
                                                    i < r ? "text-yellow-300" : "text-gray-300"
                                                }`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        );
                                    })}
                                </div>
                                <div className="flex items-center justify-between">
                                    <p>
                                <span className="text-2xl font-bold text-slate-900">
                                    ${product.price.toFixed(2)}
                                </span>
                                    </p>
                                    <button className="flex items-center rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700">
                                        Add to cart
                                    </button>
                                </div>
                            </div>
                        </Link>
                    )
                })}
                {hasMore && <div ref={loader} className="h-12"></div>}
            </div>
        </div>
    );

}
