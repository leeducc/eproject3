import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "@/gateway";
import {
    GetCart,
    CartItemDto,
    RemoveCartItem,
    AddToCart
} from "@/dtos";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "react-toastify";

export default function CartPage() {
    const [items, setItems] = useState<CartItemDto[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadCart = async () => {
        try {
            const res = await client.get(new GetCart());
            setItems(res.items);
        } catch {
            toast.error("Failed to load cart");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const changeQty = async (item: CartItemDto, delta: number) => {
        if (item.quantity + delta < 1) return;
        await client.post(new AddToCart({ productId: item.productId, quantity: delta }));
        loadCart();
    };

    const removeItem = async (id: number) => {
        await client.delete(new RemoveCartItem({ id }));
        loadCart();
    };

    const subTotal      = items.reduce((sum, i) => sum + i.productPrice * i.quantity, 0);
    const totalDelivery = items.reduce((sum, i) => sum + i.deliveryCharge * i.quantity, 0);
    const grandTotal    = subTotal + totalDelivery;

    if (loading) {
        return <div className="text-center py-10">Loading cart…</div>;
    }

    return (
        <>
            <Header />
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

                {/* Table Header on md+ */}
                <div className="hidden md:grid grid-cols-4 gap-4 text-gray-600 border-b pb-2 mb-4">
                    <div>Product</div>
                    <div className="text-center">Delivery Charge</div>
                    <div className="text-center">Quantity</div>
                    <div className="text-right">Total</div>
                </div>

                {/* Cart Items */}
                <div className="space-y-4">
                    {items.map(item => (
                        <div
                            key={item.id}
                            className="grid grid-cols-1 gap-4 p-4 bg-white shadow rounded md:grid-cols-4 md:items-center"
                        >
                            {/* Product Info */}
                            <div className="flex items-center space-x-4">
                                <img
                                    src={`https://localhost:5001/${item.productImage}`}
                                    alt={item.productTitle}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div>
                                    <div className="font-semibold">{item.productTitle}</div>
                                    <div className="text-blue-600">
                                        ₫{item.productPrice.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Charge */}
                            <div className="text-center font-medium">
                                ₫{item.deliveryCharge.toLocaleString()}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-center space-x-2">
                                <button
                                    onClick={() => changeQty(item, -1)}
                                    className="px-2 py-1 border rounded"
                                >
                                    −
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() => changeQty(item, +1)}
                                    className="px-2 py-1 border rounded"
                                >
                                    +
                                </button>
                            </div>

                            {/* Line Total & Remove */}
                            <div className="flex flex-col items-end space-y-1">
                                <div className="font-semibold">
                                    ₫{((item.productPrice + item.deliveryCharge) * item.quantity).toLocaleString()}
                                </div>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-red-600 hover:underline text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="mt-6 bg-gray-50 p-4 rounded shadow-inner">
                    <div className="flex justify-between py-1">
                        <span>Sub Total</span>
                        <span>₫{subTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1">
                        <span>Delivery Charge</span>
                        <span>₫{totalDelivery.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold text-lg border-t mt-2">
                        <span>Total</span>
                        <span>₫{grandTotal.toLocaleString()}</span>
                    </div>
                </div>

                {/* Continue to Payment */}
                <div className="mt-6 text-right">
                    <button
                        onClick={() => navigate("/checkout")}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                        Continue to Payment →
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
}
