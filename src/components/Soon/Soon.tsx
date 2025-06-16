import image from "../../assets/underDev.png";
import "./Soon.css";
const Soon = () => {
  return (
    <div>
      <div className="container">
        <div className="imageSoonDev m-auto">
          <img src={image} className="mw-100" alt="img" />
        </div>
        <div className="mytxt  fs-1 fw-bold text-center">
          Under Development !
        </div>
        <div className="info fs-5 text-center mt-3">
          Sorry, Developer  is busy, but I’ll be sure to check back for updates! ;)
        </div>
      </div>
    </div>
  );
};

export default Soon;
