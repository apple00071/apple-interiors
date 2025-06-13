import Portfolio from "../components/Portfolio";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Our Portfolio | Apple Interiors",
  description: "View our portfolio of completed interior design projects including residential, commercial, and renovation work.",
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <Portfolio />
      </main>
      <Footer />
    </div>
  );
} 