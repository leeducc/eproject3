import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ProductCardGrid from "@/components/QueryData/ProductCard"

export default function MusicStore() {
    return (
        <>
            <Header />
            <img
                src="/img/banners/storeherosection.jpg"
                alt="Store Hero Banner"
                className="w-full h-64 object-cover mb-6"
            />
            <div className="container mx-auto px-4 pb-10">
                <ProductCardGrid />
            </div>
            <Footer />
        </>
    )
}
