import { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { client } from "@/gateway";
import { GetCart, CheckoutCart } from "@/dtos";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CheckoutPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadCart = async () => {
            try {
                const response = await client.get(new GetCart());
                if (!response.items.length) {
                    navigate("/cart"); // Redirect if cart is empty
                } else {
                    setCart(response);
                }
            } catch (err) {
                setError("Failed to load cart.");
            } finally {
                setLoading(false);
            }
        };
        loadCart();
    }, [navigate]);

    const total =
        cart?.items.reduce((sum: number, item: { product: { price: number; }; quantity: number; }) => sum + item.product.price * item.quantity, 0) ?? 0;

    const handleCheckout = async () => {
        setSubmitting(true);
        try {
            const res = await client.post(new CheckoutCart({ paymentMethod: "CASH" }));
            alert(`Order placed successfully! Order ID: ${res.orderId}`);
            navigate("/orders"); // Or a success page
        } catch {
            alert("Failed to complete checkout.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <>
            <Header />
            <div className="container mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold mb-6">Checkout</h1>
                <div className="space-y-4">
                    {cart?.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center border-b py-2">
                            <div>
                                <div className="font-semibold">{item.product.title}</div>
                                <div className="text-sm text-gray-600">
                                    {item.quantity} × {item.product.price.toLocaleString()}₫
                                </div>
                            </div>
                            <div className="text-right font-medium">
                                {(item.quantity * item.product.price).toLocaleString()}₫
                            </div>
                        </div>
                    ))}

                    <div className="text-right text-xl font-bold mt-4">
                        Total: {total.toLocaleString()}₫
                    </div>
                    <div className="text-right mt-6">
                        <Link to="/cart" className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
                            Back to Cart
                            </Link>
                        </div>
                    <div className="text-right mt-6">
                        <button
                            onClick={handleCheckout}
                            disabled={submitting}
                            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                            {submitting ? "Processing..." : "Confirm & Place Order"}
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
