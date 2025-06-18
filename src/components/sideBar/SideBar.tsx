import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import sideLogo from "../../assets/sideBar-logo.png";
import productIcon from "../../assets/products-icon.svg";
import bookMark from "../../assets/bookmark 1.svg";
import logoutIcon from "../../assets/logout_icon.svg";
import { ClipLoader } from "react-spinners";
import "./SideBar.css";
import type { SideBarProps } from "../../types/Types";
import axios from "axios";


const SideBar: React.FC<SideBarProps> = ({ isOpen }) => {
  const rawImage = localStorage.getItem("user_image");
  const rawName = localStorage.getItem("user_name");
  const userImage = rawImage || "";
  const userName = rawName || "ضيف";
  const [activeItem, setActiveItem] = useState<string>("products");
  const [loading, setLoading] = useState<boolean>(false); 
  const navigate = useNavigate();

  const logout = () => {
    setLoading(true); 

    axios
      .post(
        "https://web-production-3ca4c.up.railway.app/api/logout",
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        localStorage.removeItem("token");
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <div className={`sidebar position-relative h-auto d-flex flex-column ${isOpen ? "open" : "closed" } align-items-center pt-35px`}>
      {loading && (
        <div className="loading-overlay-sidebar">
          <div className="loading-text"> <div className="d-flex align-items-center"><ClipLoader color="#FEAF00" size={60}/> <span>Logging out...</span></div></div>
        </div>
      )}

      <img src={sideLogo} alt="logo" className="logo-side" />

      <Nav className="flex-column align-items-center">
        <Nav.Item>
          <div className="mx-100 profile mt-5 mb-3">
            <img className="profile_image rounded-circle" src={userImage} alt="User" />
          </div>
        </Nav.Item>

        <Nav.Item>
          <h2 className="text-center user_name">{userName}</h2>
        </Nav.Item>

        <div className="d-flex flex-column align-items-center m-90px">
          <Nav.Item
            className={`item  ${activeItem === "products" ? "activeBtn" : ""}`}
            onClick={() => setActiveItem("products")}
          >
            <img src={productIcon} alt="icon" />
            <Link to="/dashboard/" className="ms-2 text-decoration-none fontStyle">
              Products
            </Link>
          </Nav.Item>

          <Nav.Item
            className={`my-4 item d-flex align-items-center position-relative w-100 ${activeItem === "favorites" ? "activeBtn" : ""}`}
            onClick={() => setActiveItem("favorites")}
          >
            <img src={bookMark} alt="icon" />
            <Link to="/dashboard/favorites" className="ms-2 text-decoration-none fontStyle">
              Favorites
            </Link>
          </Nav.Item>

          <Nav.Item
            className={`item ${activeItem === "order" ? "activeBtn" : ""}`}
            onClick={() => setActiveItem("order")}
          >
            <img src={bookMark} alt="icon" />
            <Link to="/dashboard/order" className="ms-2 text-decoration-none fontStyle">
              Order List
            </Link>
          </Nav.Item>

          <Nav.Item className="logout mt-auto d-flex align-items-center gap-3">
            <a
              className="fw-5 fs-14px text-black text-decoration-none cursor-pointer logout-btn"
              onClick={logout}
              style={{ pointerEvents: loading ? "none" : "auto" }}
            >
              Logout
            </a>
            <img src={logoutIcon} alt="logoutIcon" className="logout-img" />
          </Nav.Item>
        </div>
      </Nav>
    </div>
  );
};

export default SideBar;
