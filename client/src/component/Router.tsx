import {
  Outlet,
  createBrowserRouter,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./Navbar";
import { useAppSelector } from "../hooks";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import Footer from "./Footer";
import ErrorAndRedirect from "../pages/ErrorAndRedirect";
import ReportLink from "../pages/ReportLink";
import { toast } from "react-toastify";

const Layout = () => {
  const location = useLocation();
  const hideNavbarRoutes = [
    // "/signin",
    // "/signup",
    // "/",
    "/verify",
    "/forgot-password",
  ];
  const dontHideFooter = ["/signin", "/signup", "/"];
  const notHideFooter = dontHideFooter.includes(location.pathname);
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  return (
    // <div className={`${shouldHideNavbar ? "min-h-screen" : "min-h-section"} `}>
    <div>
      {!shouldHideNavbar && <Navbar />}
      <div
        className={`${shouldHideNavbar ? "min-h-screen" : notHideFooter ? "min-h-section-with-footer" : "min-h-section"} w-full flex justify-center bg-white dark:bg-gray-900 dark:text-white`}
      >
        <Outlet />
      </div>
      {notHideFooter && <Footer />}
    </div>
  );
};

const ProtectedRoute = () => {
  const { token } = useAppSelector((state) => state.user);

  if (!token) {
    toast.error("You need to be logged in to access this page");
    return <Navigate to="/signin" />;
  }
  return <Outlet />;
};

const AntiProtectedRoute = () => {
  const { token } = useAppSelector((state) => state.user);
  console.log(token);

  if (token) return <Navigate to="/dashboard" />;
  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "report",
            element: <ReportLink />,
          },
        ],
      },
      {
        path: "/",
        element: <AntiProtectedRoute />,
        children: [
          {
            path: "signin",
            element: <Signin />,
          },
          {
            path: "signup",
            element: <Signup />,
          },
        ],
      },
      {
        path: "/*",
        element: <ErrorAndRedirect />,
      },
    ],
  },
]);

export default router;
