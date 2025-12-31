import Header from "./ui/common/Header";
import Footer from "./ui/common/Footer";
import MainContent from "./ui/common/MainContent";

// Force dynamic rendering to ensure fresh data on each request
// since the dashboard displays real-time activity data
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="container">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
}
