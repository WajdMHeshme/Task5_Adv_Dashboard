import { useEffect, useState } from "react";
import Loader from "./loader/Loader";
import { RouterProvider } from "react-router-dom";
import { routes } from "./main";

const Loading = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return <RouterProvider router={routes} />;
};

export default Loading;
