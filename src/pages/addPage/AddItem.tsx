import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Col, Form, Row, Container, Button } from "react-bootstrap";
import { IoCloudUploadOutline } from "react-icons/io5";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import "./AddItem.css";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const AddItem = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const name = useRef<HTMLInputElement>(null);
  const price = useRef<HTMLInputElement>(null);
  const image = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const AddItem = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name.current?.value || "");
    formData.append("price", price.current?.value || "");
    if (image.current?.files?.[0]) {
      formData.append("image", image.current.files[0]);
    }

    axios
      .post(
        "https://web-production-3ca4c.up.railway.app/api/items",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        console.log(res),
          toast.success("Product added successfully!", {
            position: "top-center",
            autoClose: 2000,
            onClose: () => navigate("/dashboard"),
          });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong while adding the product.", {
          position: "top-center",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

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

  return (
    <div>
      <Container>
        <button
          onClick={() => navigate("/dashboard")}
          className="fs-4 border-2 outline-0 rounded-circle d-flex justify-content-center align-items-center bg-white mrg circle-btn mt-2 mx-5 mx-sm-0"
        >
          <TiArrowBack />
        </button>
        <h1 className="my-5">ADD NEW ITEM</h1>

        <Form onSubmit={AddItem}>
          <Row className="align-items-start mt-76px">
            <Col md={6}>
              <Form.Group className="mb-5">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the product name"
                  className="h-input"
                  ref={name}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the product price"
                  className="h-input"
                  ref={price}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <label
                  htmlFor="image-upload-input"
                  className={`upload-square-add w-100 d-flex justify-content-center align-items-center cursor-pointer p-relative ${previewUrl ? "has-image" : ""}`}
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
                  <ClipLoader size={20} color="#fff"/>
                  <span className="fs-5">Adding...</span>
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

export default AddItem;
