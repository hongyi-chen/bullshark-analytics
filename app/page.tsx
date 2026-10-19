import Header from "./ui/common/Header";
import Footer from "./ui/common/Footer";
import MainContent from "./ui/common/MainContent";
import SkipLink from "./ui/common/SkipLink";
import ErrorBoundary from "./ui/common/ErrorBoundary";

// Force dynamic rendering to ensure fresh data on each request
// since the dashboard displays real-time activity data
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <SkipLink />
      <div className="container">
        <Header />
        <ErrorBoundary>
          <MainContent />
        </ErrorBoundary>
        <Footer />
      </div>
    </>
  );
}
