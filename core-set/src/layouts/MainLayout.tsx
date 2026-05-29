import { Outlet } from "react-router-dom";
import MainHeader from "../components/MainHeader";

function MainLayout() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <MainHeader />
      <Outlet />
    </div>
  );
}

export default MainLayout;
