import { useEffect, useRef, useState } from "react";
import { useParams }                from "react-router-dom";
import Header                        from "@/components/Header";
import Footer                        from "@/components/Footer";
import { toast }                     from "react-toastify";
import { client }                    from "@/gateway";

// Product + related
import { GetProduct, ProductResponse } from "@/dtos";

// Reviews
import {
    GetReviews, ReviewDto,
    CreateReview, UpdateReview, DeleteReview
} from "@/dtos";

// Collections
import {
    GetCollections, CollectionDto,
    CreateCollection, AddToCollection
} from "@/dtos";
// Cart
import { AddToCart } from "@/dtos";

export default function ProductDetail() {
    const { id }         = useParams<{ id: string }>();
    const productId      = Number(id);

    // server responses
    const [productResp, setProductResp] = useState<ProductResponse | null>(null);
    const [reviews,       setReviews]    = useState<ReviewDto[]>([]);
    const [collections,   setCollections] = useState<CollectionDto[]>([]);

    // auth
    const [isAuth,       setIsAuth]       = useState(false);
    const [userId,       setUserId]       = useState<number | null>(null);
    const [displayName,  setDisplayName]  = useState<string>("");

    // review form
    const [reviewText,       setReviewText]       = useState("");
    const [rating,           setRating]           = useState(5);
    const [isSubmitting,     setIsSubmitting]     = useState(false);
    const [editingReviewId,  setEditingReviewId]  = useState<number | null>(null);

    // collections dropdown
    const [isOpen,      setIsOpen]      = useState(false);
    const [newCollName, setNewCollName] = useState("");
    const dropdownRef   = useRef<HTMLDivElement>(null);

    const renderStars = (count: number) =>
        "★".repeat(count) + "☆".repeat(5 - count);

    // — auth
    const loadAuth = async () => {
        try {
            const res  = await fetch("https://localhost:5001/auth", {
                credentials: "include",
                headers:     { Accept: "application/json" },
            });
            const data = await res.json();
            if (res.ok) {
                setIsAuth(true);
                setUserId(data.userId);
                setDisplayName(data.displayName || data.userName || "You");
            }
        } catch {
            setIsAuth(false);
        }
    };

    // — product
    const loadProduct = async () => {
        try {
            const res = await client.get(new GetProduct({ id: productId }));
            setProductResp(res);
        } catch {
            toast.error("Failed to load product");
        }
    };

    // — reviews
    const loadReviews = async () => {
        try {
            const res = await client.get(new GetReviews({ productId }));
            setReviews(res.reviews ?? []);
            const mine = res.reviews?.find((r) => r.userId === userId);
            if (mine) {
                setEditingReviewId(mine.id);
                setReviewText(mine.reviewText);
                setRating(mine.rating);
            }
        } catch {
            toast.error("Failed to load reviews");
        }
    };

    // — collections
    const loadCollections = async () => {
        try {
            const res = await client.get(new GetCollections({}));
            setCollections(res.collections ?? []);
        } catch {
            toast.error("Failed to load your collections");
        }
    };

    // — create or update review
    const handleSaveReview = async () => {
        if (!isAuth) {
            toast.warning("Please log in to submit a review");
            return;
        }
        setIsSubmitting(true);
        try {
            if (editingReviewId) {
                await client.put(new UpdateReview({
                    id:          editingReviewId,
                    rating,
                    reviewText,
                }));
            } else {
                await client.post(new CreateReview({
                    productId,
                    rating,
                    reviewText,
                }));
            }
            toast.success("Review saved");
            setReviewText("");
            setRating(5);
            setEditingReviewId(null);
            await loadReviews();
        } catch {
            toast.error("Failed to save review");
        } finally {
            setIsSubmitting(false);
        }
    };

    // — delete review
    const handleDeleteReview = async () => {
        if (!editingReviewId) return;
        try {
            await client.delete(new DeleteReview({ id: editingReviewId }));
            toast.success("Review deleted");
            setEditingReviewId(null);
            setReviewText("");
            setRating(5);
            await loadReviews();
        } catch {
            toast.error("Failed to delete review");
        }
    };

    // — initial load
    useEffect(() => {
        const init = async () => {
            await loadAuth();         // <-- now userId is set
            await loadProduct();
            await loadCollections();
            await loadReviews();      // <-- reviews now know your userId
        };
        void init();
    }, [productId]);

    // — click‑outside to close dropdown
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        window.addEventListener("mousedown", onClick);
        return () => window.removeEventListener("mousedown", onClick);
    }, []);

    if (!productResp) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                Loading…
            </div>
        );
    }

    const { product, genres, creator, reviewCount, averageRating } = productResp;

    return (
        <>
            <Header />
            <main className="max-w-5xl mx-auto px-4 py-8 space-y-12">

                {/* Product Info */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="rounded-lg overflow-hidden shadow-lg">
                        <img
                            src={`https://localhost:5001/${product.image}`}
                            alt={product.title}
                            className="w-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col justify-between space-y-4">
                        <div>
                            <h1 className="text-4xl font-extrabold">{product.title}</h1>
                            <p className="text-gray-600">
                                By <span className="font-medium">{creator.name}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                                Gernres:{" "}
                                <span className="font-medium">
                  {genres.map((g) => g.name).join(", ")}
                </span>
                            </p>
                            {reviewCount > 0 && (
                                <div className="flex items-center space-x-2">
                                    <div className="text-yellow-500 text-lg">
                                        {renderStars(Math.round(averageRating))}
                                    </div>
                                    <span className="text-gray-600">
                    {averageRating.toFixed(1)} ({reviewCount} reviews)
                  </span>
                                </div>
                            )}
                            <p className="text-gray-700 whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4">
                            <button
                                onClick={async () => {
                                    try {
                                        await client.post(new AddToCart({ productId, quantity: 1 }));
                                        toast.success("Added to cart");
                                    } catch {
                                        toast.error("Failed to add to cart");
                                    }
                                }}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                            >
                                Add to Cart
                            </button>

                            {/* Collection dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsOpen((o) => !o)}
                                    className="w-full flex justify-between items-center py-3 px-4 border rounded-lg hover:shadow transition"
                                >
                                    <span>Add to Collection</span>
                                    <span className={`transform ${isOpen ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                                </button>
                                {isOpen && (
                                    <div className="absolute right-0 mt-2 w-full bg-white border rounded-lg shadow-lg z-20">
                                        <ul className="divide-y">
                                            {collections.map((c) => (
                                                <li key={c.id}>
                                                    <button
                                                        onClick={async () => {
                                                            await client.post(new AddToCollection({
                                                                name:      c.name,
                                                                productId,
                                                            }));
                                                            toast.success(`Added to “${c.name}”`);
                                                            setIsOpen(false);
                                                        }}
                                                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                                    >
                                                        {c.name}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="p-4">
                                            <input
                                                type="text"
                                                placeholder="New collection"
                                                value={newCollName}
                                                onChange={(e) => setNewCollName(e.target.value)}
                                                className="w-full border rounded-lg px-3 py-2 mb-2 focus:ring"
                                            />
                                            <button
                                                onClick={async () => {
                                                    if (!newCollName.trim()) return;
                                                    const newColl = await client.post(
                                                        new CreateCollection({ name: newCollName })
                                                    );
                                                    setCollections([newColl, ...collections]);
                                                    toast.success(`Collection “${newCollName}” created`);
                                                    setNewCollName("");
                                                }}
                                                className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                            >
                                                + Create
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Reviews */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold border-b pb-2">Reviews</h2>

                    {/* List */}
                    {reviews.length === 0 ? (
                        <p className="text-gray-500">No reviews yet. Be the first!</p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((r) => (
                                <div key={r.id} className="p-4 bg-white rounded-lg shadow">
                                    <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">
                      {r.userId === userId ? displayName : r.userEmail}
                    </span>
                                        <span className="text-yellow-500">
                      {renderStars(r.rating)}
                    </span>
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-line">
                                        {r.reviewText}
                                    </p>
                                    {r.userId === userId && (
                                        <div className="mt-2 flex space-x-4 text-sm">
                                            <button
                                                onClick={() => {
                                                    setEditingReviewId(r.id);
                                                    setReviewText(r.reviewText);
                                                    setRating(r.rating);
                                                }}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={handleDeleteReview}
                                                className="text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Write/Edit Form */}
                    <div className="p-6 bg-gray-50 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">
                            {editingReviewId ? "Update Your Review" : "Write a Review"}
                        </h3>
                        <textarea
                            rows={4}
                            className="w-full border rounded-lg p-3 mb-4 focus:ring"
                            placeholder="Share your thoughts…"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        />
                        <div className="flex items-center mb-4">
                            <label className="mr-4 font-medium">Rating:</label>
                            <select
                                value={rating}
                                onChange={(e) => setRating(+e.target.value)}
                                className="border rounded-lg p-2"
                            >
                                {[5, 4, 3, 2, 1].map((n) => (
                                    <option key={n} value={n}>
                                        {renderStars(n)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleSaveReview}
                            disabled={isSubmitting}
                            className={`px-6 py-3 rounded-lg font-semibold transition
                ${
                                isSubmitting
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    : "bg-green-600 text-white hover:bg-green-700"
                            }
              `}
                        >
                            {isSubmitting
                                ? "Saving…"
                                : editingReviewId
                                    ? "Update Review"
                                    : "Submit Review"}
                        </button>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
