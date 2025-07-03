import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const Store = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [selectedSort, setSelectedSort] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://localhost:5001/api/products", {
            credentials: "include",
            headers: {
                "Accept": "application/json"
            }
        })
            .then(res => res.json())
            .then((data: { results: Product[] }) => {
                setProducts(data.results);
                setCategories([...new Set(data.results.map(p => p.category))]);
            });

    }, []);

    useEffect(() => {
        let filtered = [...products];

        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // Filter by search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                `${p.title} ${p.artist}`.toLowerCase().includes(q)
            );
        }

        // Filter by price range
        if (minPrice !== null) {
            filtered = filtered.filter(p => p.price >= minPrice);
        }
        if (maxPrice !== null) {
            filtered = filtered.filter(p => p.price <= maxPrice);
        }

        // Sort
        if (selectedSort === "asc") filtered.sort((a, b) => a.price - b.price);
        else if (selectedSort === "desc") filtered.sort((a, b) => b.price - a.price);
        else if (selectedSort === "newest") filtered.sort((a, b) => b.id - a.id);

        setFilteredProducts(filtered);
        setCurrentPage(1); // reset to page 1 on filter
    }, [products, selectedCategory, searchQuery, minPrice, maxPrice, selectedSort]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <>
            <Header />

            <div className="container mx-auto px-4 py-6 flex">
                {/* Sidebar filters */}
                <aside className="w-72 mr-6 border-r pr-4 space-y-6">
                    <div>
                        <h2 className="font-bold text-lg mb-2">Categories</h2>
                        <ul>
                            {categories.map(cat => (
                                <li
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                                    className={`cursor-pointer ${
                                        selectedCategory === cat ? "font-bold text-red-600" : ""
                                    }`}
                                >
                                    {cat}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-bold text-lg mb-2">Price Range</h2>
                        <div className="flex space-x-2">
                            <input
                                type="number"
                                placeholder="Min"
                                value={minPrice ?? ""}
                                onChange={e => setMinPrice(e.target.value ? parseInt(e.target.value) : null)}
                                className="border px-2 py-1 w-1/2 rounded"
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxPrice ?? ""}
                                onChange={e => setMaxPrice(e.target.value ? parseInt(e.target.value) : null)}
                                className="border px-2 py-1 w-1/2 rounded"
                            />
                        </div>
                    </div>
                </aside>

                {/* Main product list */}
                <main className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <input
                            type="text"
                            placeholder="Search title or artist"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="border px-3 py-2 rounded w-1/2"
                        />
                        <select
                            value={selectedSort}
                            onChange={e => setSelectedSort(e.target.value)}
                            className="border px-3 py-2 rounded"
                        >
                            <option value="newest">Newest</option>
                            <option value="asc">Price Low → High</option>
                            <option value="desc">Price High → Low</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {paginatedProducts.map(product => (
                            <div
                                key={product.id}
                                className="cursor-pointer hover:shadow transition p-2 rounded"
                                onClick={() => navigate(`/productdetail/${product.id}`)}
                            >
                                <img src={product.image} alt={product.title} className="w-full h-64 object-cover mb-2" />
                                <h3 className="font-semibold text-sm">{product.artist} - {product.title}</h3>
                                <p className="text-red-600 font-bold">{product.price.toLocaleString()}₫</p>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-6 gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 border rounded ${
                                    currentPage === i + 1 ? "bg-red-500 text-white" : ""
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </main>
            </div>

            <Footer />
        </>
    );
};

export default Store;
