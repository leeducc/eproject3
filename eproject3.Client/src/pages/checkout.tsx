import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";           // ← new
import { client } from "@/gateway";
import {
    GetCart, CartItemDto,
    CreateOrder, OrderResponse, PaymentMethod ,ClearCart
} from "@/dtos";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "react-toastify";

export default function CheckoutPage() {
    const [cart, setCart] = useState<CartItemDto[]>([]);
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [payment, setPayment] = useState<PaymentMethod>(PaymentMethod.CASH);
    const navigate = useNavigate();                          // ← new

    // Load cart items
    useEffect(() => {
        client.get(new GetCart())
            .then(res => setCart(res.items))
            .catch(() => toast.error("Failed to load cart"))
            .finally(() => setLoading(false));
    }, []);

    const total = cart.reduce((sum, i) => sum + i.productPrice * i.quantity, 0);

    const handleSubmit = async () => {
        if (!address.trim()) return toast.warning("Enter shipping address");
        setSubmitting(true);
        try {
            const req = new CreateOrder({
                shippingAddress: address,
                paymentMethod: payment,
                items: cart.map(i => ({
                    productId: i.productId,
                    quantity: i.quantity
                }))
            });
            const res: OrderResponse = await client.post(req);
            toast.success(`Order #${res.orderId} placed!`);
            await client.post(new ClearCart());
            // optionally clear cart in UI
            setCart([]);

            // Redirect to Profile → Orders tab
            navigate("/profile?tab=orders");
        } catch {
            toast.error("Checkout failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-10">Loading…</div>;

    return (
        <>
            <Header />
            <div className="max-w-3xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Checkout</h1>

                {/* Order Summary */}
                <div className="bg-white shadow rounded mb-6 p-4">
                    <h2 className="font-semibold mb-3">Order Summary</h2>
                    <ul className="divide-y">
                        {cart.map(item => (
                            <li key={item.id} className="flex py-2">
                                <img
                                    src={`https://localhost:5001/${item.productImage}`}
                                    alt={item.productTitle}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1 ml-4">
                                    <div className="font-medium">{item.productTitle}</div>
                                    <div className="text-gray-600">
                                        {item.quantity} × ₫{item.productPrice.toLocaleString()}
                                    </div>
                                </div>
                                <div className="font-semibold">
                                    ₫{(item.productPrice * item.quantity).toLocaleString()}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="text-right mt-4 text-lg font-semibold">
                        Total: ₫{total.toLocaleString()}
                    </div>
                </div>

                {/* Shipping & Payment */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="font-medium">Shipping Address</label>
                        <textarea
                            rows={4}
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            className="w-full border rounded p-2"
                            placeholder="123 Main St, City, Country"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="font-medium">Payment Method</label>
                        <select
                            value={payment}
                            onChange={e => setPayment(e.target.value as PaymentMethod)}
                            className="w-full border rounded p-2"
                        >
                            <option value={PaymentMethod.QRCode}>QR Code</option>
                            <option value={PaymentMethod.CASH}>Cash on Delivery</option>
                        </select>
                    </div>
                </div>

                {/* Place Order Button */}
                <button
                    onClick={handleSubmit}
                    disabled={submitting || cart.length === 0}
                    className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {submitting ? "Placing Order…" : "Place Order"}
                </button>
            </div>
            <Footer />
        </>
    );
}
