import Footer from "../components/Footer";
import Navbar from "../components/navbar";


export default function AppLayout({ children }) {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden"> 
            <div className="flex-1 overflow-y-auto"> 
                <main className="">
                    <Navbar />
                    {children}
                    <Footer />
                </main>
            </div>
        </div>
    );
}