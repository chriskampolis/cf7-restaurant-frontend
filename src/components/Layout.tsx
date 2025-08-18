import { Outlet } from "react-router";
import Footer from "./Footer";
import Header2 from "./Header2.tsx";

const Layout = () => {
  return (
    <>
      <Header2 />
      <div className="container mx-auto min-h-[95vh] pt-24">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;