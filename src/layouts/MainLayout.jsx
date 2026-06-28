import { Outlet } from "react-router-dom";

import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import { MetaProvider } from "../components/shared/MetaProvider";
import ScrollToTop from "../components/shared/ScrollToTop";

const MainLayout = () => {
  return (
    <MetaProvider>
      <ScrollToTop />
      <Navbar />

      <main className="main-container">
        <Outlet />
      </main>

      <Footer />
    </MetaProvider>
  );
};

export default MainLayout;
