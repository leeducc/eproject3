import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Product = {
    id: number;
    title: string;
    artist: string;
    image: string;
    price: number;
    category: string;
    description: string;
};

type Review = {
    id: number;
    productId: number;
    userId: string;
    userEmail: string;
    comment: string;
    rating: number;
    createdAt: string;
};

export default function ProductDetail() {
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(5);
    const [showReviewError, setShowReviewError] = useState(false);
    const [reviewError, setReviewError] = useState("");

    const { id } = useParams();
    const productId = id;

    useEffect(() => {
        if (!productId) return;

        fetch(`https://localhost:5001/api/products/${productId}`, {
            headers: { "Accept": "application/json" },
            credentials: "include"
        })
            .then(res => res.json())
            .then(setProduct)
            .catch(err => console.error("Failed to load product", err));

        fetch(`https://localhost:5001/api/reviews?productId=${productId}&page=1&pageSize=10`, {
            headers: { "Accept": "application/json" },
            credentials: "include"
        })
            .then(async res => {
                if (!res.ok) throw new Error(`Failed: ${res.status}`);
                const data = await res.json();
                setReviews(data.reviews || []);
            })
            .catch(err => console.error("Failed to load reviews", err));

        // Check login status
        fetch("https://localhost:5001/auth", {
            credentials: "include"
        })
            .then(res => setIsAuthenticated(res.ok))
            .catch(() => setIsAuthenticated(false));
    }, [productId]);

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            setShowLoginPrompt(true);
            return;
        }

        fetch("https://localhost:5001/api/cart", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ productId })
        })
            .then(res => {
                if (res.ok) alert("Added to cart!");
                else throw new Error("Add to cart failed");
            })
            .catch(() => alert("You must be logged in to add to cart."));
    };

    const handleSubmitReview = () => {
        setReviewError(""); 

        if (!reviewText.trim()) return;

        fetch("https://localhost:5001/api/reviews", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                productId: Number(productId),
                comment: reviewText,
                rating
            })
        })
            .then(async res => {
                if (!res.ok) {
                    const errText = await res.text();

                    try {
                        const errJson = JSON.parse(errText);
                        throw new Error(errJson?.responseStatus?.message || "Unknown error");
                    } catch {
                        throw new Error(errText || "You already sumnmit reviewed!");
                    }
                }
                return res.json();
            })
            .then(() => {
                setReviewText("");
                setRating(5);

                // Reload reviews
                return fetch(`https://localhost:5001/api/reviews?productId=${productId}&page=1&pageSize=10`, {
                    credentials: "include"
                });
            })
            .then(res => res.json())
            .then(data => setReviews(data.reviews || []))
            .catch(err => {
                console.error("Error posting review", err);
                let message = err.message;

                if (message.includes("You have already reviewed this product")) {
                    message = "You've already submitted a review for this product.";
                }

                setReviewError(message);
                setShowReviewError(true);
                setTimeout(() => setShowReviewError(false), 3000);
            });

    };





    if (!product) return <div className="text-center py-10">Loading...</div>;

    return (
        <>
            <Header />
            <div className="container mx-auto px-6 py-10">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Image */}
                    <div className="md:w-1/2">
                        <img src={product.image} alt={product.title} className="w-full h-auto rounded" />
                    </div>

                    {/* Info */}
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

                {/* Login Popup */}
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
            {showReviewError && (
                <div className="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300">
                    {reviewError}
                </div>
            )}

            <Footer />
        </>
    );
}
