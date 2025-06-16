import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type { ProductType } from "../../types/Types";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { IoCloudUploadOutline } from "react-icons/io5";
import { TiArrowBack } from "react-icons/ti";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const EditeItem = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [, setSelectedFile] = useState<File | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const name = useRef<HTMLInputElement>(null);
  const price = useRef<HTMLInputElement>(null);
  const image = useRef<HTMLInputElement>(null);
  const [oldData, setOldData] = useState<ProductType>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`https://web-production-3ca4c.up.railway.app/api/items/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setOldData(res.data);
        setPreviewUrl(res.data.image_url);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Choose an image please!");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const sendEditData = async (event: FormEvent) => {
    event.preventDefault();
    if (!id) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name.current?.value || "");
    formData.append("price", price.current?.value || "");
    if (image.current?.files?.[0]) {
      formData.append("image", image.current.files[0]);
    }
    formData.append("_method", "PUT");

    try {
      await axios.post(
        `https://web-production-3ca4c.up.railway.app/api/items/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Product updated successfully!", {
        position: "top-center",
        autoClose: 2000,
        onClose: () => navigate("/dashboard"),
      });
    } catch (error) {
      console.error("Error updating item:", error);
            toast.error("some thing wrong when updating the product!", {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Container>
        <button
          onClick={() => navigate("/dashboard")}
          className="fs-4 border-2 outline-0 rounded-circle d-flex justify-content-center align-items-center bg-white circle-btn mt-2 mx-5 mx-sm-0"
        >
          <TiArrowBack />
        </button>
        <h1 className="my-5">EDIT ITEM</h1>

        <Form onSubmit={sendEditData}>
          <Row className="align-items-start mt-76px">
            <Col md={6}>
              <Form.Group className="mb-5">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the product name"
                  className="h-input"
                  defaultValue={oldData?.name}
                  ref={name}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the product price"
                  className="h-input"
                  defaultValue={oldData?.price}
                  ref={price}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <label
                  htmlFor="image-upload-input"
                  className={`upload-square-add d-flex justify-content-center align-items-center ${
                    previewUrl ? "has-image" : ""
                  }`}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" />
                  ) : (
                    <IoCloudUploadOutline className="upload-icon" />
                  )}

                  <Form.Control
                    type="file"
                    id="image-upload-input"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    ref={image}
                    className="h-input"
                  />
                </label>
              </Form.Group>
            </Col>
          </Row>

          <div className="text-center d-flex justify-content-center">
            <Button
              className="my-btn text-white my-2 save-btn fs-2 d-flex justify-content-center align-items-center mt-5"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <ClipLoader size={20} color="#fff" />
                  <span className="fs-5">Updating...</span>
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default EditeItem;
