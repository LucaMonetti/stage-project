import { Outlet } from "react-router";
import TopBar from "../components/TopBar/TopBar";

const BaseLayout = () => {
  return (
    <div className="bg-gray-900 h-screen max-w-screen overflow-x-hidden text-white">
      <div className="max-w-8xl mx-auto">
        <TopBar />
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BaseLayout;
