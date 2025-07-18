import { useQuery } from "@tanstack/react-query";
import { useClient } from "@/gateway";
import { GetCart, CartItemDto } from "@/dtos";
import { Link } from "react-router-dom";
import { ShoppingCartIcon } from "lucide-react";

export function CartCountBadge() {
    const client = useClient();

    // v4 uses a single-object signature
    const { data: items = [] } = useQuery<CartItemDto[], Error>({
        queryKey: ["cart", "items"],
        queryFn: async (): Promise<CartItemDto[]> => {
            const res = await client.api(new GetCart());
            return res.succeeded && res.response?.items
                ? res.response.items
                : [];
        },
        refetchInterval: 5_000,
        staleTime:       5_000,
    });

    // now `items` is typed CartItemDto[], so map + filter work
    const uniqueCount = new Set<number>(
        items
            .map((item: CartItemDto) => item.productId!)
            .filter((id: number) => id != null)
    ).size;

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
    );
}
