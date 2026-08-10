import Header from "./ui/common/Header";
import Footer from "./ui/common/Footer";
import MainContent from "./ui/common/MainContent";
import SkipLink from "./ui/common/SkipLink";

// Force dynamic rendering to ensure fresh data on each request
// since the dashboard displays real-time activity data
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="container">
      <SkipLink />
      <Header />
      <main id="main-content" aria-label="Dashboard content">
        <MainContent />
      </main>
      <Footer />
    </div>
  );
}
