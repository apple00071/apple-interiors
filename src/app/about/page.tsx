import About from "../components/About";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "About Us | Apple Interiors",
  description: "Learn about Apple Interiors - Hyderabad's leading interior design company with over 10 years of experience in creating beautiful spaces.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <About />
        <Footer />
      </main>
    </>
  );
} 