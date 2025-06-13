import Portfolio from "../components/Portfolio";

export const metadata = {
  title: "Our Portfolio | Apple Interiors",
  description: "View our portfolio of completed interior design projects including residential, commercial, and renovation work.",
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-20">
        <Portfolio />
      </main>
    </div>
  );
} 