import Sidebar from "@/components/global/sidebar";
import { Outlet } from "react-router-dom";

export default function SidebarLayout() {
  return (
    <div className="flex overflow-hidden">
      <Sidebar />
      <main className="flex flex-col flex-1 bg-background w-full   ">
        {/* <Header /> */}
        <div className="max-h-[calc(100vh-0px)] flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
