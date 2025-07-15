import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    CreateReview,
    GetProduct,
    GetReviews,
    Product,
    QueryProducts,
    ReviewDto,
    AddCartItem, 
    CartItemDto
} from "@/dtos.ts";
import { client } from "@/gateway.ts";

export default function ProductDetail() {
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<ReviewDto[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(5);
    const [showReviewError, setShowReviewError] = useState(false);
    const [reviewError, setReviewError] = useState("");
    const [recommended, setRecommended] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [cartMessage, setCartMessage] = useState<string | null>(null);

    const { id } = useParams();
    const productId = Number(id);

    // Shared checkAuth function
    const checkAuth = async () => {
        try {
            const res = await fetch("https://localhost:5001/auth", {
                credentials: "include"
            });
            const isAuth = res.ok;
            setIsAuthenticated(isAuth);
            return isAuth;
        } catch {
            setIsAuthenticated(false);
            return false;
        }
    };


    useEffect(() => {
        const loadData = async () => {
            if (!productId) return;

            try {
                const productRes = await client.get(new GetProduct({ id: productId }));
                setProduct(productRes);

                const reviewRes = await client.get(new GetReviews({
                    productId,
                    page: 1,
                    pageSize: 10
                }));
                setReviews(reviewRes.reviews ?? []);

                await checkAuth();
            } catch (err) {
                console.error("Failed to load data", err);
            }
        };

        loadData();
    }, [productId]);

    useEffect(() => {
        if (!product?.category) return;

        const loadRecommended = async () => {
            try {
                const res = await client.get(new QueryProducts());
                const sorted = (res.results ?? []).sort((a, b) => {
                    const aSame = a.category === product.category ? -1 : 1;
                    const bSame = b.category === product.category ? -1 : 1;
                    return aSame - bSame;
                });

                setRecommended(prev => page === 1 ? sorted : [...prev, ...sorted]);
                setHasMore((res.results?.length ?? 0) === 6);
            } catch (err) {
                console.error("Error loading recommended products", err);
            }
        };

        loadRecommended();
    }, [product?.category, page]);

    

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            setShowLoginPrompt(true);
            return;
        }

        const pid = Number(productId);
        if (isNaN(pid)) {
            console.error("Invalid productId:", productId);
            return;
        }

        try {
            // Create DTO instance
            const addItemDto = new AddCartItem({ productId: pid, quantity: 1 });

            // Use the ServiceStack client to send request (replace 'client' with your API client instance)
            const addedItem = await client.post<CartItemDto>(addItemDto);

            setCartMessage(`Added to cart successfully!`);
        } catch (err) {
            console.error("Cart error:", err);
            setCartMessage("Failed to add to cart. Are you logged in?");
        } finally {
            setTimeout(() => setCartMessage(null), 3000);
        }
    };




    const handleSubmitReview = async () => {
        if (!reviewText.trim()) return;

        try {
            await client.post(new CreateReview({
                productId,
                comment: reviewText,
                rating
            }));

            setReviewText("");
            setRating(5);

            const reviewRes = await client.get(new GetReviews({
                productId,
                page: 1,
                pageSize: 10
            }));

            setReviews(reviewRes.reviews ?? []);
        } catch (err: any) {
            let message = err?.responseStatus?.message || err.message || "Unknown error";
            if (message.includes("already")) {
                message = "You've already submitted a review for this product.";
            }
            setReviewError(message);
            setShowReviewError(true);
            setTimeout(() => setShowReviewError(false), 3000);
        }
    };

    if (!product) return <div className="text-center py-10">Loading...</div>;

    return (
        <>
            <Header />
            <div className="container mx-auto px-6 py-10">
                {/* Product Info */}
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/2">
                        <img src={product.image} alt={product.title} className="w-full h-auto rounded" />
                    </div>
                    <div className="md:w-1/2 space-y-4">
                        <h1 className="text-3xl font-bold">{product.title}</h1>
                        <p className="text-lg text-gray-600">By {product.artist}</p>
                        <p className="text-sm text-gray-500">Category: {product.category}</p>
                        <p className="text-xl text-red-600 font-semibold">{product.price.toLocaleString()}₫</p>
                        <p className="mt-4 text-gray-700 whitespace-pre-line">{product.description}</p>
                        <button
                            onClick={handleAddToCart}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>

                {/* Reviews */}
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                    {reviews.length === 0 ? (
                        <p className="text-gray-500">No reviews yet.</p>
                    ) : (
                        <ul className="space-y-4">
                            {reviews.map(review => (
                                <li key={review.id} className="border rounded p-4 shadow-sm">
                                    <div className="font-semibold">{review.userEmail}</div>
                                    <div className="text-yellow-500">Rating: {review.rating}/5</div>
                                    <div className="text-gray-700 mt-1">{review.comment}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Write Review */}
                <div className="mt-10">
                    <h3 className="text-xl font-semibold mb-2">Write a Review</h3>
                    {isAuthenticated ? (
                        <div className="space-y-2">
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                rows={4}
                                className="w-full border p-2 rounded"
                                placeholder="Share your thoughts..."
                            />
                            <div>
                                <label className="mr-2">Rating:</label>
                                <select
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                    className="border p-1 rounded"
                                >
                                    {[5, 4, 3, 2, 1].map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={handleSubmitReview}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                            >
                                Submit Review
                            </button>
                        </div>
                    ) : (
                        <p className="text-gray-500">You must be logged in to write a review.</p>
                    )}
                </div>

                {/* Recommended */}
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold mb-4">Recommended Products</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {recommended.map(p => (
                            <div key={p.id} className="border rounded p-2 shadow-sm">
                                <img src={p.image} alt={p.title} className="w-full h-40 object-cover rounded" />
                                <div className="mt-2 font-semibold">{p.title}</div>
                                <div className="text-red-600">{p.price.toLocaleString()}₫</div>
                            </div>
                        ))}
                    </div>
                    {hasMore && (
                        <div className="text-center mt-4">
                            <button
                                onClick={() => setPage(prev => prev + 1)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </div>

                {/* Login Prompt */}
                {showLoginPrompt && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-md text-center">
                            <p className="mb-4">Please log in to add to cart.</p>
                            <button
                                onClick={() => window.location.href = "/login"}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            >
                                Go to Login
                            </button>
                            <button
                                onClick={() => setShowLoginPrompt(false)}
                                className="ml-4 text-gray-500 hover:underline"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Toasts */}
            {showReviewError && (
                <div className="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50">
                    {reviewError}
                </div>
            )}
            {cartMessage && (
                <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-50">
                    {cartMessage}
                </div>
            )}
            <Footer />
        </>
    );
}
