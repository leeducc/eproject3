import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-8 mt-16">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* About */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">About Us</h3>
                    <p>Your trusted source for vinyl records and music discs since 2025.</p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><Link to="/" className="hover:text-white">Home</Link></li>
                        <li><Link to="/store" className="hover:text-white">Store</Link></li>
                        <li><Link to="/news" className="hover:text-white">News</Link></li>
                        <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Contact</h3>
                    <p>Email: support@onlineshopdvds.com</p>
                    <p>Phone: +84 123 456 789</p>
                    <p>Location: Hanoi, Vietnam</p>
                </div>

            </div>

            <div className="text-center text-sm mt-8 text-gray-500">
                © 2025 OnlineShopDVDs. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;