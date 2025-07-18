import {useEffect, useRef, useState} from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    GetProduct,
    GetReviews,
    Product,
    ReviewDto,
    CreateReview,
    DeleteReview,
    AddToCart,
    AddToCollection,       
    CreateCollection
} from "@/dtos";
import { client } from "@/gateway";
import { toast } from "react-toastify";

export default function ProductDetail() {
    const { id } = useParams();
    const productId = Number(id);

    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<ReviewDto[]>([]);
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userReviewId, setUserReviewId] = useState<number | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [displayName, setDisplayName] = useState<string>("");
    const [isAdding, setIsAdding] = useState(false);
    const [collections, setCollections] = useState<string[]>([
        "Favorites",
        "Look Again"
    ]);
    const [isOpen, setIsOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const renderStars = (count: number) =>
        "⭐️".repeat(count) + "☆".repeat(5 - count);

    const loadAuth = async () => {
        try {
            const res = await fetch("https://localhost:5001/auth", {
                credentials: "include",
                headers: {
                    Accept: "application/json"
                }
            });

            const data = await res.json();
            console.log("Auth session:", data); 

            if (res.ok) {
                setIsAuthenticated(true);
                setUserId(data.userId);
                setDisplayName(data.displayName || data.userName || "You");
            } else {
                setIsAuthenticated(false);
            }
        } catch (err) {
            console.error("Auth error:", err);
            setIsAuthenticated(false);
        }
    };


    const loadProduct = async () => {
        try {
            const res = await client.get(new GetProduct({ id: productId }));
            setProduct(res.product);
        } catch {
            toast.error("Failed to load product");
        }
    };

    const loadReviews = async () => {
        try {
            const res = await client.get(new GetReviews({ productId }));
            setReviews(res.reviews || []);

            const userReview = res.reviews?.find(r => r.userId === userId);
            if (userReview) {
                setUserReviewId(userReview.id);
                setReviewText(userReview.reviewText);
                setRating(userReview.rating);
            }
        } catch {
            toast.error("Failed to load reviews");
        }
    };

    const handleReviewSubmit = async () => {
        if (!isAuthenticated) return toast.warning("Please login to submit a review");
        if (!reviewText.trim()) return;

        setIsSubmitting(true);
        try {
            await client.post(new CreateReview({
                productId,
                rating,
                reviewText
            }));
            toast.success("Review submitted");
            await loadReviews();
            setReviewText("");
            setRating(5);
        } catch (err: any) {
            const msg = err?.responseStatus?.message || "Failed to submit review";
            toast.error(msg.includes("already") ? "You've already reviewed" : msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!userReviewId) return;
        try {
            await client.delete(new DeleteReview({ id: userReviewId }));
            toast.success("Review deleted");
            await loadReviews();
            setUserReviewId(null);
            setReviewText("");
            setRating(5);
        } catch {
            toast.error("Failed to delete review");
        }
    };

    useEffect(() => {
        if (productId) {
            loadAuth().then(() => {
                loadProduct();
                loadReviews();
            });
        }
    }, [productId]);
    const handleAddToCart = async () => {
        if (!product) return;
        setIsAdding(true);
        try {
            // quantity hard‑coded to 1 for now
            await client.post(new AddToCart({
                productId: product.id,
                quantity: 1
            }));
            toast.success("Added to cart!");
        } catch (err: any) {
            toast.error(err?.responseStatus?.message || "Failed to add to cart");
        } finally {
            setIsAdding(false);
        }
    };
    useEffect(() => {
        // Close menu on outside click
        const onClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        window.addEventListener("mousedown", onClick);
        return () => window.removeEventListener("mousedown", onClick);
    }, []);

    const handleAddToCollection = async (name: string) => {
        try {
            await client.post(new AddToCollection({ productId, name: name }));
            toast.success(`Added to “${name}”`);
        } catch {
            toast.error("Failed to add to collection");
        } finally {
            setIsOpen(false);
        }
    };

    const handleCreateCollection = async () => {
        if (!newName.trim()) return;
        try {
            await client.post(new CreateCollection({ name: newName }));
            setCollections(c => [newName, ...c]);
            toast.success(`Collection “${newName}” created`);
            setNewName("");
        } catch {
            toast.error("Failed to create collection");
        }
    };

    if (!product) return <div className="text-center py-10">Loading...</div>;

    const avgRating = reviews.length
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    return (
        <>
            <Header />
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Product Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <img
                        src={`https://localhost:5001/${product.image}`}
                        alt={product.title}
                        className="w-full rounded shadow"
                    />
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                        <p className="text-gray-600 mb-1">By ID: {product.creatorId}</p>
                        <p className="text-sm text-gray-500 mb-1">Category: {product.genre}</p>
                        {avgRating && <p className="text-yellow-600 mb-1">⭐ {avgRating} / 5</p>}
                        <p className="text-2xl text-red-600 font-semibold mb-4">
                            {product.price.toLocaleString()}₫
                        </p>
                        <p className="whitespace-pre-line text-gray-700">{product.description}</p>
                        <button
                            className={`mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition
                          ${isAdding ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={handleAddToCart}
                            disabled={isAdding}
                        >
                            {isAdding ? "Adding…" : "Add to Cart"}
                        </button>
                        {/* Add to Collection */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsOpen(o => !o)}
                                className="flex items-center space-x-1 border rounded px-3 py-2 hover:bg-gray-100 transition"
                            >
                                <svg
                                    className="w-5 h-5 text-gray-600"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path d="M4 6h16M4 12h8m-8 6h16"/>
                                </svg>
                                <span className="text-gray-700">Add to Collection</span>
                                <svg
                                    className={`w-4 h-4 text-gray-500 transform ${isOpen ? "rotate-180" : ""}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path d="M19 9l-7 7-7-7"/>
                                </svg>
                            </button>

                            {isOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-lg z-10">
                                    <ul className="divide-y">
                                        {collections.map(name => (
                                            <li key={name}>
                                                <button
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                                    onClick={() => handleAddToCollection(name)}
                                                >
                                                    {name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="px-4 py-2">
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={e => setNewName(e.target.value)}
                                            placeholder="New collection"
                                            className="w-full border rounded px-2 py-1 mb-2"
                                        />
                                        <button
                                            onClick={handleCreateCollection}
                                            className="w-full bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition"
                                        >
                                            + Create Collection
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    </div>
                </div>

                {/* Reviews */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                    {reviews.length === 0 ? (
                        <p className="text-gray-500">No reviews yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review, index) => (
                                <div
                                    key={review.id ?? `review-${index}`}
                                    className={`p-4 rounded shadow ${review.userId === userId
                                        ? "bg-yellow-50 border border-yellow-300"
                                        : "bg-white"
                                    }`}
                                >
                                    <div className="font-medium">
                                        {review.userId === userId ? displayName : review.userEmail}
                                    </div>

                                    <div className="text-yellow-500">{renderStars(review.rating)}</div>
                                    <div className="text-gray-700 mt-1 whitespace-pre-line">
                                        {review.reviewText}
                                    </div>
                                    {review.userId === userId && (
                                        <div className="mt-2 space-x-2">
                                            <button
                                                onClick={() => {
                                                    setReviewText(review.reviewText);
                                                    setRating(review.rating);
                                                    setUserReviewId(review.id);
                                                }}
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="text-sm text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Write Review */}
                <div className="mt-12">
                    <h3 className="text-xl font-semibold mb-2">
                        {userReviewId ? "Update Your Review" : "Write a Review"}
                    </h3>
                    {isAuthenticated ? (
                        <div className="space-y-2">
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                rows={4}
                                className="w-full border p-2 rounded"
                                placeholder="Write your honest opinion..."
                            />
                            <div>
                                <label className="mr-2 font-medium">Rating:</label>
                                <select
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                    className="border p-1 rounded"
                                >
                                    {[5, 4, 3, 2, 1].map(r => (
                                        <option key={r} value={r}>{renderStars(r)}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={handleReviewSubmit}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                            >
                                {userReviewId ? "Update Review" : "Submit Review"}
                            </button>
                        </div>
                    ) : (
                        <p className="text-gray-500">Please login to submit a review.</p>
                    )}
                </div>
         
            <Footer />
        </>
    );
}
