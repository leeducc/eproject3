import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import {
    GetCart,
    GetCartResponse,
    UpdateCartItem,
    DeleteCartItem,
    // CheckoutCart,
    // CartItemDto,
} from "@/dtos.ts";
import { client } from "@/gateway.ts";

export default function Cart() {
    const [cart, setCart] = useState<GetCartResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [cartMessage, setCartMessage] = useState<string | null>(null);

    // Check auth and load cart on mount
    useEffect(() => {
        const loadCart = async () => {
            try {
                const response = await client.get(new GetCart());
                setCart(response);
                setIsAuthenticated(true);
            } catch (err) {
                setIsAuthenticated(false);
                setError("Please log in to view your cart.");
            } finally {
                setLoading(false);
            }
        };

        loadCart();
    }, []);

    const handleQuantityChange = async (itemId: number, newQty: number) => {
        if (newQty <= 0) return;

        try {
            await client.put(new UpdateCartItem({ cartItemId: itemId, quantity: newQty }));

            setCart((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    items: prev.items.map((item) =>
                        item.id === itemId ? { ...item, quantity: newQty } : item
                    ),
                };
            });
            setCartMessage("Quantity updated");
        } catch {
            alert("Failed to update quantity");
        } finally {
            setTimeout(() => setCartMessage(null), 3000);
        }
    };

    const handleRemoveItem = async (itemId: number) => {
        try {
            await client.delete(new DeleteCartItem({ cartItemId: itemId }));

            setCart((prev) =>
                prev ? { ...prev, items: prev.items.filter((i) => i.id !== itemId) } : prev
            );
            setCartMessage("Item removed");
        } catch {
            alert("Failed to remove item");
        } finally {
            setTimeout(() => setCartMessage(null), 3000);
        }
    };

    

    const total =
        cart?.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) ?? 0;

    if (loading) return <div className="text-center py-10">Loading cart...</div>;
    if (!isAuthenticated) return <div className="text-center py-10">Please log in to view your cart.</div>;

    return (
        <>
            <Header />
            <div className="container mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

                {cart?.items.length === 0 ? (
                    <p className="text-gray-500">Your cart is empty.</p>
                ) : (
                    <div className="space-y-4">
                        {cart?.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 border rounded p-4 shadow-sm">
                                <img
                                    src={item.product.image}
                                    alt={item.product.title}
                                    className="w-24 h-24 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <div className="font-semibold">{item.product.title}</div>
                                    <div className="text-gray-500">{item.product.price.toLocaleString()}₫</div>
                                    <div className="flex items-center mt-2 gap-2">
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                            className="px-2 py-1 bg-gray-200 rounded"
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            className="px-2 py-1 bg-gray-200 rounded"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="text-right text-xl font-semibold mt-4">Total: {total.toLocaleString()}₫</div>

                        <div className="text-right mt-4">
                            <Link
                                to="/checkout"
                                className="inline-block px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                            >
                                Checkout
                            </Link>
                        </div>
                        
                    </div>
                )}

                {error && <p className="text-red-500 mt-4">{error}</p>}
                {cartMessage && <p className="text-green-500 mt-4">{cartMessage}</p>}
            </div>
            <Footer />
        </>
    );
}
