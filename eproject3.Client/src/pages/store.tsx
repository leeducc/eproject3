import { useState, useEffect } from "react";
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
};

const Store = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedSort, setSelectedSort] = useState<string>("newest");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const itemsPerPage = 8;
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/products.json")
            .then((res) => res.json())
            .then(setProducts)
            .catch((err) => console.error("Failed to load products", err));
    }, []);

    const categories = Array.from(new Set(products.map((p) => p.category)));

    const categoryCounts: Record<string, number> = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Filter by category and search
    const filteredProducts = products
        .filter((p) => (selectedCategory ? p.category === selectedCategory : true))
        .filter((p) =>
            `${p.artist} ${p.title}`.toLowerCase().includes(searchQuery.toLowerCase())
        );

    // Sorting logic
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (selectedSort === "asc") return a.price - b.price;
        if (selectedSort === "desc") return b.price - a.price;
        if (selectedSort === "newest") return b.id - a.id;
        return 0;
    });

    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const paginatedProducts = sortedProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleCategoryClick = (category: string) => {
        if (selectedCategory === category) {
            setSelectedCategory(null);
        } else {
            setSelectedCategory(category);
        }
        setCurrentPage(1);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSort(e.target.value);
        setCurrentPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    return (
        <>
            <Header />

            <div className="flex container mx-auto px-4 py-6">
                {/* Sidebar */}
                <aside className="w-64 p-4 border-r sticky top-0 h-screen overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4">Product Categories</h2>
                    <ul className="space-y-2 text-gray-700">
                        {categories.map((category) => (
                            <li
                                key={category}
                                className={`cursor-pointer ${
                                    selectedCategory === category ? "font-bold text-red-600" : ""
                                }`}
                                onClick={() => handleCategoryClick(category)}
                            >
                                {category} ({categoryCounts[category]})
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4">
                    {/* Search + Sort */}
                    <div className="flex justify-between items-center mb-4">
                        <input
                            type="text"
                            placeholder="Search by artist or title"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="border px-3 py-2 rounded w-1/2"
                        />
                        <select
                            value={selectedSort}
                            onChange={handleSortChange}
                            className="border px-2 py-2 rounded"
                        >
                            <option value="newest">Newest</option>
                            <option value="asc">Price: Ascending</option>
                            <option value="desc">Price: Descending</option>
                        </select>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {paginatedProducts.map((product) => (
                            <div
                                key={product.id}
                                className="text-center cursor-pointer hover:shadow-lg transition"
                                onClick={() => navigate(`/productdetail?productId=${product.id}`)}
                            >
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-64 object-cover mb-2"
                                />
                                <h3 className="text-sm font-semibold">
                                    {product.artist} - {product.title}
                                </h3>
                                <p className="text-red-600 font-bold">
                                    {product.price.toLocaleString()}₫
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center mt-6 space-x-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                            className={`px-3 py-1 border rounded ${
                                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 border rounded ${
                                    currentPage === i + 1
                                        ? "bg-red-600 text-white"
                                        : "hover:bg-gray-200"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            className={`px-3 py-1 border rounded ${
                                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                            }`}
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
