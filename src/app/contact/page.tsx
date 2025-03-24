import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Contact Us | Apple Interiors",
  description: "Get in touch with Apple Interiors for your interior design needs. We're here to help transform your space.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <Contact />
        <Footer />
      </main>
    </>
  );
} 