import Footer from "../components/Footer";
import Navbar from "../components/navbar";

export default function AppLayout({ children }) {
    return (
        <div className="bg-gray-50">
            <main>
                <Navbar />
                {children}
                <Footer />
            </main>
        </div>
    );
}