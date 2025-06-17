// Dashboard.tsx
import { Outlet } from "react-router-dom";
import SideBar from "../../components/sideBar/SideBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { AiOutlineClose } from "react-icons/ai";
import { GoPerson } from "react-icons/go";
import { toast, ToastContainer } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("You are not logged in", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
      });
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, []);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard-container d-flex">
      <button onClick={toggleSidebar} className="toggle-btn d-flex justify-content-center align-items-center border-0 outline-0 text-white cursor-pointer">
        {isSidebarOpen ? <AiOutlineClose /> : <GoPerson />}
      </button>

      <div className="sidebar-container forMobile">
        <SideBar isOpen={isSidebarOpen} />
      </div>

      <div className="content-container h-100 flex-grow-1">
        <Outlet />
      </div>

      <ToastContainer />
    </div>
  );
};

export default Dashboard;
