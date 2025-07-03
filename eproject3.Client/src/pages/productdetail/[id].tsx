import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

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
    name: string;
    comment: string;
    rating: number;
};

export default function ProductDetail() {
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [searchParams] = useSearchParams();

    const productId = searchParams.get("productId");

    useEffect(() => {
        if (!productId) return;

        fetch(`https://localhost:5001/api/products/${productId}`)
            .then((res) => res.json())
            .then(setProduct)
            .catch((err) => console.error("Failed to load product", err));

        fetch("/reviews.json")
            .then((res) => res.json())
            .then(setReviews)
            .catch((err) => console.error("Failed to load reviews", err));
    }, [productId]);

    if (!product) return <div className="text-center py-10">Loading...</div>;

    return (
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
                </div>
            </div>

            {/* Reviews */}
            <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                {reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews available.</p>
                ) : (
                    <ul className="space-y-4">
                        {reviews.map((review) => (
                            <li key={review.id} className="border rounded p-4 shadow-sm">
                                <div className="font-semibold">{review.name}</div>
                                <div className="text-yellow-500">Rating: {review.rating}/5</div>
                                <div className="text-gray-700 mt-1">{review.comment}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
