import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="fixed inset-y-0 left-0 w-64">
        <Sidebar />
      </div>
      <main className="flex-1 pl-64 transition-all duration-300 px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;