import { Outlet } from "react-router";
import Footer from "./Footer";
import Header2 from "./Header2.tsx";

const Layout = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header2 />
        <main className="flex-grow container mx-auto pt-24">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;