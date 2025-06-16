import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import { TiArrowBack } from "react-icons/ti";
import { useState, useEffect } from "react";
import { type ProductType } from "../../types/Types";
import axios from "axios";
import defaultImage from "../../assets/default_img.png";
import ClipLoader from "react-spinners/ClipLoader";
import "./ShowItem.css";

const ShowItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState<ProductType | null>(null);
  const [, setImgSrc] = useState<string>(defaultImage);

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB");
  };

  useEffect(() => {
    const showData = (id: number) => {
      axios
        .get(`https://web-production-3ca4c.up.railway.app/api/items/${id}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          setShowInfo(res.data);

          const url = res.data.image_url;
          if (
            url &&
            (url.endsWith(".jpg") ||
              url.endsWith(".jpeg") ||
              url.endsWith(".png"))
          ) {
            setImgSrc(url);
          } else {
            setImgSrc(defaultImage);
          }
        })
        .catch((err) => {
          console.log(err);
          setImgSrc(defaultImage); 
        });
    };

    if (id) showData(Number(id));
  }, [id]);

  return (
    <div>
      <Container>
        {showInfo ? (
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="fs-4 border-2 outline-0 rounded-circle d-flex justify-content-center align-items-center bg-white circle-btn mt-2 mx-5 mx-sm-0"
            >
              <TiArrowBack />
            </button>

            <p className="fs-60px fw-1 mt-5">{showInfo?.name}</p>
            <div className="d-flex justify-content-center img-wh w-100">
              <img
                className="mx-100"
                src={showInfo?.image_url}
                alt={showInfo?.name}
                onError={() => setImgSrc(defaultImage)}
              />
            </div>
            <Row>
              <Col className="d-flex justify-content-between flex-column  mt-md-3 flex-lg-row">
                <h1>
                  Price:{" "}
                  <span className="fs-3 text-black-50">{showInfo?.price}$</span>
                </h1>
                <h1>
                  Added At:
                  <span className="fs-3 text-black-50">
                    {formatDate(showInfo?.created_at)}
                  </span>
                </h1>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-center justify-content-md-start justify-content-lg-center ">
                <h1>
                  Updated At:{" "}
                  <span className="fs-3 text-black-50">
                    {formatDate(showInfo?.updated_at)}
                  </span>
                </h1>
              </Col>
            </Row>
          </div>
        ) : (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100px" }}
          >
            <ClipLoader color="#FEAF00" size={60} />
          </div>
        )}
      </Container>
    </div>
  );
};

export default ShowItem;
