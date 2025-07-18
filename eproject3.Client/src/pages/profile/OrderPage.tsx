import {Fragment, useEffect, useState} from "react";
import { client } from "@/gateway";
import { GetOrders, OrderDto, CancelOrder } from "@/dtos";
import { toast } from "react-toastify";
import { ChevronRightIcon, ChevronDownIcon } from "lucide-react";

export default function OrderPage() {
    const [orders, setOrders]           = useState<OrderDto[]>([]);
    const [loading, setLoading]         = useState(true);
    const [expanded, setExpanded]       = useState<Set<number>>(new Set());
    const [cancelling, setCancelling]   = useState<Set<number>>(new Set());

    const loadOrders = async () => {
        setLoading(true);
        try {
            const res = await client.get(new GetOrders());
            setOrders(res.orders);
        } catch {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const toggle = (id: number) => {
        setExpanded(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleCancel = async (orderId: number) => {
        if (!confirm("Cancel this order?")) return;
        setCancelling(s => new Set(s).add(orderId));
        try {
            await client.post(new CancelOrder({ orderId }));
            toast.success(`Order #${orderId} canceled`);
            await loadOrders();
        } catch {
            toast.error("Could not cancel order");
        } finally {
            setCancelling(s => {
                const next = new Set(s);
                next.delete(orderId);
                return next;
            });
        }
    };

    useEffect(() => { loadOrders(); }, []);

    if (loading) return <div className="py-10 text-center">Loading orders…</div>;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded mb-4">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2"></th>
                    <th className="px-4 py-2 text-left">Order #</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Total</th>
                    <th className="px-4 py-2 text-left">Payment</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">#Items</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                </tr>
                </thead>
                <tbody>
                {orders.map(o => {
                    const isOpen    = expanded.has(o.orderId);
                    const canCancel = ["Pending","Ongoing"].includes(o.status);
                    const isCanc    = cancelling.has(o.orderId);

                    return (
                        <Fragment key={o.orderId}>
                            {/* summary row */}
                            <tr className="border-t">
                                <td className="px-4 py-2">
                                    <button onClick={() => toggle(o.orderId)}>
                                        {isOpen
                                            ? <ChevronDownIcon size={16}/>
                                            : <ChevronRightIcon size={16}/>}
                                    </button>
                                </td>
                                <td className="px-4 py-2">{o.orderId}</td>
                                <td className="px-4 py-2">
                                    {new Date(o.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2 font-semibold">
                                    ₫{o.total.toLocaleString()}
                                </td>
                                <td className="px-4 py-2">{o.paymentMethod}</td>
                                <td className="px-4 py-2 capitalize">{o.status}</td>
                                <td className="px-4 py-2">{o.items.length}</td>
                                <td className="px-4 py-2">
                                    {canCancel
                                        ? <button
                                            onClick={() => handleCancel(o.orderId)}
                                            disabled={isCanc}
                                            className={`px-2 py-1 text-sm rounded ${
                                                isCanc
                                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                    : "bg-red-500 text-white hover:bg-red-600"
                                            }`}
                                        >
                                            {isCanc ? "Canceling…" : "Cancel"}
                                        </button>
                                        : <span className="text-gray-500 text-sm">—</span>
                                    }
                                </td>
                            </tr>

                            {/* detail rows */}
                            {isOpen && o.items.map(item => (
                                <tr key={item.id} className="bg-gray-50">
                                    <td></td>
                                    <td colSpan={2} className="px-4 py-2">{item.productTitle}</td>
                                    <td className="px-4 py-2">₫{item.unitPrice.toLocaleString()}</td>
                                    <td className="px-4 py-2">Qty: {item.quantity}</td>
                                    <td colSpan={3}></td>
                                </tr>
                            ))}
                        </Fragment>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}
