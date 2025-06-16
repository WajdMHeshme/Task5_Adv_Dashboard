import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { IoCloudUploadOutline } from "react-icons/io5";
import logo from "../../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

const SignUp = () => {
  const navigate = useNavigate();
  const [, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const first_name = useRef<HTMLInputElement>(null);
  const last_name = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const password_confirmation = useRef<HTMLInputElement>(null);
  const profile_image = useRef<HTMLInputElement>(null);

  const sendData = (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const formData: FormData = new FormData();
    const user_name =
      `${first_name.current?.value} ${last_name.current?.value}`.toLowerCase();

    if (
      first_name.current?.value &&
      last_name.current?.value &&
      email.current?.value &&
      password.current?.value &&
      password_confirmation.current?.value &&
      profile_image.current?.files?.[0]
    ) {
      formData.append("first_name", first_name.current?.value);
      formData.append("last_name", last_name.current?.value);
      formData.append("email", email.current?.value);
      formData.append("user_name", user_name);
      formData.append("password", password.current?.value);
      formData.append(
        "password_confirmation",
        password_confirmation.current?.value
      );
      formData.append("profile_image", profile_image.current.files[0]);
    }

    axios
      .post(
        "https://web-production-3ca4c.up.railway.app/api/register",
        formData
      )
      .then((res) => {
        localStorage.clear();
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem(
          "user_image",
          res.data.data.user.profile_image_url
        );
        localStorage.setItem("user_name", res.data.data.user.user_name);

        toast.success("Registration successful !", {
          position: "top-center",
          onClose: () => navigate("/dashboard"),
          autoClose: 2000,
        });
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        toast.error("Registration failed ❌", {
          position: "top-center",
          autoClose: 2000,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("choose image pls !");
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
    <div className="backg h-100vh mw-100 bg-primary-color d-flex justify-content-center align-items-center flex-column p-relative">
      <div className="signing-width my-3">
        <Form
          className="bg-white log-shadow px-5 py-4 rounded-20 d-flex flex-column"
          onSubmit={sendData}
        >
          <div>
            <div className="d-flex justify-content-center">
              <img src={logo} alt="focal-x" />
            </div>
            <div className="content text-center my-3">
              <h3 className="fs-3">SIGN UP</h3>
              <p>Fill in the following fields to create an account.</p>
            </div>
          </div>

          <Form.Label>Name</Form.Label>
          <Row className="d-flex align-items-center  flex-column flex-sm-row">
            <Col>
              <Form.Group className="mb-3" id="firstName">
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  ref={first_name}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" id="lastName">
                <Form.Control
                  type="text"
                  placeholder="Last Name"
                  ref={last_name}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" id="emailAddress">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Your Email"
              ref={email}
              required
            />
          </Form.Group>

          <Form.Label>Password</Form.Label>
          <Row className="d-flex align-items-center flex-column flex-sm-row">
            <Col>
              <Form.Group className="mb-3" id="password">
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  ref={password}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" id="confirmPassword">
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  ref={password_confirmation}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group id="formFile" className="mb-4">
            <Form.Label>Profile Image</Form.Label>
            <label
              htmlFor="image-upload-input"
              className={`upload-square d-flex justify-content-center align-items-center cursor-pointer p-relative ${
                previewUrl ? "has-image" : ""
              }`}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="profile image" />
              ) : (
                <IoCloudUploadOutline className="upload-icon" />
              )}

              <Form.Control
                type="file"
                id="image-upload-input"
                accept="image/*"
                onChange={handleFileChange}
                ref={profile_image}
                style={{ display: "none" }}
                required
              />
            </label>
          </Form.Group>

          <Button
            className="my-btn text-white d-flex align-items-center justify-content-center gap-2"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ClipLoader size={20} color="#fff" />
                <span>Creating account...</span>
              </>
            ) : (
              "SIGN UP"
            )}
          </Button>

          <div className="text-center pt-2">
            <span className="text-black-50">
              Do you have an account?{" "}
              <Link to="/" className="text-main">
                Sign in
              </Link>
            </span>
          </div>
        </Form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default SignUp;
