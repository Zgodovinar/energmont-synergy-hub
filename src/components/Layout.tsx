import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 transition-all duration-300 p-8 ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;