import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Auth from "./pages/Auth";
import SignIn from "./pages/signin/SignIn";
import SignUp from "./pages/signup/SignUp";
import Dashboard from "./pages/dashboard/Dashboard";
import Products from "./pages/products/Products";
import Fav from "./pages/Fav";
import OrderList from "./pages/OrderList";
import ShowItem from "./pages/showItemInfo/ShowItem";
import AddItem from "./pages/addPage/AddItem";
import EditeItem from "./pages/editePage/EditeItem";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Loader from "./loader/Loader";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
    children: [
      { path: "", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      { path: "", element: <Products /> },
      { path: "show/:id", element: <ShowItem /> },
      { path: "add", element: <AddItem /> },
      { path: "edit/:id", element: <EditeItem /> },
      { path: "favorites", element: <Fav /> },
      { path: "order", element: <OrderList /> },
    ],
  },
]);

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return <RouterProvider router={routes} />;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
