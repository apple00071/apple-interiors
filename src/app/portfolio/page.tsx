import Portfolio from "../components/Portfolio";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Our Portfolio | Apple Interiors",
  description: "View our portfolio of completed interior design projects including residential, commercial, and renovation work.",
};

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <Portfolio />
        <Footer />
      </main>
    </>
  );
} 