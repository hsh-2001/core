import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import IndexPage from "./pages/admin/IndexPage";
import GeographyPage from "./pages/admin/GeographyPage";
import MainLayout from "./layouts/MainLayout";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <IndexPage />,
      },
       {
        path: "geography",
        element: <GeographyPage />,
      },
    ],
  },
]);

export default routes;
