import { Link } from "react-router-dom"
import Layout from "@/components/Layout"

const Index = () => {
    const slideLayout = (index: number) => {
        const isEven = index % 2 === 0;
        return (
            <div key={index} className="flex-shrink-0 w-[320px] space-y-2">
                {isEven ? (
                    <>
                        <img
                            src={`https://via.placeholder.com/320x180/${Math.floor(Math.random()*16777215).toString(16)}/fff?text=Huge+DVD+${index + 1}`}
                            className="w-full h-[180px] object-cover rounded shadow-lg"
                            alt={`Huge DVD ${index + 1}`}
                        />
                        <div className="flex gap-2">
                            <img
                                src={`https://via.placeholder.com/150x150/${Math.floor(Math.random()*16777215).toString(16)}/fff?text=Small+DVD+1`}
                                className="w-[150px] h-[150px] object-cover rounded shadow-md"
                                alt="Small DVD"
                            />
                            <img
                                src={`https://via.placeholder.com/150x150/${Math.floor(Math.random()*16777215).toString(16)}/fff?text=Small+DVD+2`}
                                className="w-[150px] h-[150px] object-cover rounded shadow-md"
                                alt="Small DVD"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex gap-2">
                            <img
                                src={`https://via.placeholder.com/150x150/${Math.floor(Math.random()*16777215).toString(16)}/fff?text=Small+DVD+1`}
                                className="w-[150px] h-[150px] object-cover rounded shadow-md"
                                alt="Small DVD"
                            />
                            <img
                                src={`https://via.placeholder.com/150x150/${Math.floor(Math.random()*16777215).toString(16)}/fff?text=Small+DVD+2`}
                                className="w-[150px] h-[150px] object-cover rounded shadow-md"
                                alt="Small DVD"
                            />
                        </div>
                        <img
                            src={`https://via.placeholder.com/320x180/${Math.floor(Math.random()*16777215).toString(16)}/fff?text=Huge+DVD+${index + 1}`}
                            className="w-full h-[180px] object-cover rounded shadow-lg"
                            alt={`Huge DVD ${index + 1}`}
                        />
                    </>
                )}
            </div>
        );
    };

    return (
        <Layout title="Music DVD Store">
            {/* Hero Section */}
            <div className="relative bg-gray-900 text-white py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl font-extrabold mb-6">Explore the World of Music on DVD</h1>
                    <p className="text-xl mb-8">Classic albums, live concerts, and rare collector editions – all on disc.</p>
                    <Link to="/shop" className="bg-white text-gray-900 px-6 py-3 rounded-md font-semibold shadow hover:bg-gray-200">
                        Shop Now
                    </Link>
                </div>
                <img src="https://via.placeholder.com/1200x400/111827/FFFFFF?text=Hero+Image" alt="DVD shelf" className="absolute top-0 left-0 w-full h-full object-cover opacity-10 pointer-events-none" />
            </div>

            {/* Featured DVDs - Horizontal Scroll */}
            <section className="py-20 bg-white dark:bg-gray-900 overflow-hidden">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-12">Featured DVDs</h2>
                    <div className="relative w-full overflow-x-auto">
                        <div className="flex gap-6 animate-scroll-horizontal" style={{ animation: 'scroll 50s linear infinite' }}>
                            {[...Array(10)].map((_, i) => slideLayout(i))}
                        </div>
                    </div>
                    <style>{`
                        @keyframes scroll {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                        .animate-scroll-horizontal {
                            display: flex;
                            animation: scroll 40s linear infinite;
                        }
                    `}</style>
                </div>
            </section>

            {/* Featured Artists */}
            <section className="py-20 bg-slate-100 dark:bg-slate-800">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-12">Featured Artists</h2>
                    <div className="overflow-x-auto flex gap-6 whitespace-nowrap">
                        {[1, 2, 3, 4, 5, 6].map((artist) => (
                            <div key={artist} className="inline-block w-48 flex-shrink-0">
                                <img src={`https://via.placeholder.com/200x200/${Math.floor(Math.random()*16777215).toString(16)}/fff?text=Artist+${artist}`} className="rounded-full mx-auto mb-4 shadow-lg" alt={`Artist ${artist}`} />
                                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Artist {artist}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partner Section */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-12">Connect to Our Partners</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <img src="https://via.placeholder.com/500x300/222/fff?text=Partner+Banner" className="rounded shadow-xl" alt="Partner Banner" />
                        <div className="text-center lg:text-left">
                            <img src="https://via.placeholder.com/300x200/444/fff?text=Store+Preview" className="mx-auto lg:mx-0 rounded shadow" alt="Store Preview" />
                            <Link to="/partner-store" className="mt-6 inline-block bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-700">
                                Go to Store →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Index;
