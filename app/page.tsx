import Header from "./ui/common/Header";
import Footer from "./ui/common/Footer";
import MainContent from "./ui/common/MainContent";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="container">
      <Header />
      <main id="main-content">
        <MainContent />
      </main>
      <Footer />
    </div>
  );
}
