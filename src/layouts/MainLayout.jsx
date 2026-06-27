import { Outlet } from "react-router-dom";

import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import ScrollToTop from "../components/shared/ScrollToTop";

const MainLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <main className="main-container">
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default MainLayout;