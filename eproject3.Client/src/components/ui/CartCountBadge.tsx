import { useEffect, useState } from "react"
import { useClient } from "@/gateway"
import { GetCart } from "@/dtos"
import { Link } from "react-router-dom"
import { ShoppingCartIcon } from "lucide-react" // or your preferred icon lib

export function CartCountBadge() {
    const client = useClient()
    const [uniqueCount, setUniqueCount] = useState(0)

    useEffect(() => {
        const fetchCart = async () => {
            const res = await client.api(new GetCart())
            if (res.succeeded && res.response?.items) {
                const items = res.response.items
                const uniqueProductIds = new Set(items.map(item => item.product?.id).filter(Boolean))
                setUniqueCount(uniqueProductIds.size)
            }
        }

        fetchCart()
    }, [])

    return (
        <Link
            to="/cart"
            className="p-4 flex items-center hover:text-sky-500 relative"
        >
            <ShoppingCartIcon className="h-6 w-6" />
            {uniqueCount > 0 && (
                <span className="absolute top-2 left-6 bg-red-500 text-white text-xs rounded-full px-1">
                    {uniqueCount}
                </span>
            )}
        </Link>
    )
}
