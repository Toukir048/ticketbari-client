import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

const MainLayout = () => {
  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;