import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Testimonials from "./components/Testimonials";
import Brands from "./components/Brands";

export const dynamic = 'force-static';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Testimonials />
      <Brands />
      <Contact />
      <Footer />
    </main>
  );
}
