import Services from "../components/Services";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Our Services | Apple Interiors",
  description: "Explore our comprehensive interior design services including space planning, custom furniture, and complete renovation solutions.",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <Services />
        <Footer />
      </main>
    </>
  );
} 